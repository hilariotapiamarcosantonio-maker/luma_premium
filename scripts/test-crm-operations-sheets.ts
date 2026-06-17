import {
  GoogleSheetsOperationsRepository,
  GoogleSheetsService,
  TABS,
  OPERATIONS_COLUMNS,
  NOTES_COLUMNS,
  ACTIVITY_COLUMNS
} from '../src/lib/crm/google-sheets-operations-repository';
import { getCrmOperationsRepository } from '../src/lib/crm/operations-repository-factory';
import { randomUUID } from 'crypto';
import { executeUpdateLeadOperation } from '../src/lib/crm/update-lead-operation-service';
import { getCrmRepository } from '../src/lib/crm/repository';
import { MockOperationsRepository } from '../src/lib/crm/mock-operations-repository';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

class MockSheetsService implements GoogleSheetsService {
  public sheets: Record<string, string[][]> = {};
  public getValuesCalledCount = 0;
  public batchUpdateCalledCount = 0;
  public forceBatchUpdateError = false;

  constructor(initialSheets?: Record<string, string[][]>) {
    if (initialSheets) {
      this.sheets = JSON.parse(JSON.stringify(initialSheets));
    }
  }

  async getValues(spreadsheetId: string, range: string): Promise<string[][] | null> {
    this.getValuesCalledCount++;
    const parts = range.split('!');
    const tabName = parts[0];
    const rangeSpec = parts[1];

    const data = this.sheets[tabName];
    if (!data) return null;

    if (rangeSpec === 'A1:M1') {
      return [data[0] ? data[0].slice(0, 13) : []];
    }
    if (rangeSpec === 'A1:F1') {
      return [data[0] ? data[0].slice(0, 6) : []];
    }
    if (rangeSpec === 'A1:H1') {
      return [data[0] ? data[0].slice(0, 8) : []];
    }

    if (rangeSpec === 'A:A') {
      return data.map(row => [row[0] || '']);
    }

    // Return deep copy so the repository can't accidentally mutate our mock DB directly
    return JSON.parse(JSON.stringify(data));
  }

  async batchUpdate(
    spreadsheetId: string,
    data: { range: string; values: string[][] }[]
  ): Promise<void> {
    this.batchUpdateCalledCount++;
    if (this.forceBatchUpdateError) {
      throw new Error('SIMULATED_BATCH_UPDATE_ERROR');
    }

    for (const update of data) {
      const parts = update.range.split('!');
      const tabName = parts[0];
      const rangeSpec = parts[1];

      const match = rangeSpec.match(/[A-Z]+(\d+)(?::[A-Z]+(\d+))?/);
      if (!match) {
        throw new Error(`Mock doesn't support range: ${update.range}`);
      }

      const startRow = parseInt(match[1], 10);

      if (!this.sheets[tabName]) {
        this.sheets[tabName] = [];
      }

      const sheet = this.sheets[tabName];

      update.values.forEach((rowVals, idx) => {
        const rowIndex = startRow - 1 + idx;
        while (sheet.length <= rowIndex) {
          sheet.push([]);
        }
        sheet[rowIndex] = JSON.parse(JSON.stringify(rowVals));
      });
    }
  }
}

function getValidInitialState(): Record<string, string[][]> {
  return {
    [TABS.OPERATIONS]: [[...OPERATIONS_COLUMNS] as string[]],
    [TABS.NOTES]: [[...NOTES_COLUMNS] as string[]],
    [TABS.ACTIVITY]: [[...ACTIVITY_COLUMNS] as string[]],
  };
}

console.log('Running Google Sheets Operations Repository offline tests...');

// Set temporary valid env variable for testing
process.env.LUMA_CRM_OPS_SPREADSHEET_ID = 'test-spreadsheet-id-123';

async function runTests() {
  // 1. Schema Check & Validation
  {
    // 1.1 Correct schema should pass ensureValidated
    const mockService = new MockSheetsService(getValidInitialState());
    const repo = new GoogleSheetsOperationsRepository(mockService);
    // Any read method calls ensureValidated
    const op = await repo.getOperationByLeadId('lp_123456789012345678901234');
    assert(op === null, 'Valid schema validation passes and returns null for non-existing lead');
    assert(mockService.getValuesCalledCount === 4, 'Called getValues for 3 headers + 1 data read');

    // 1.2 Incorrect schema should fail validation
    const corruptState = getValidInitialState();
    corruptState[TABS.OPERATIONS][0][0] = 'wrong_column'; // corrupt header
    const mockServiceCorrupt = new MockSheetsService(corruptState);
    const repoCorrupt = new GoogleSheetsOperationsRepository(mockServiceCorrupt);

    let threwSchemaError = false;
    try {
      await repoCorrupt.getOperationByLeadId('lp_123456789012345678901234');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('CRM_SHEETS_SCHEMA_ERROR')) {
        threwSchemaError = true;
      }
    }
    assert(threwSchemaError, 'Throws CRM_SHEETS_SCHEMA_ERROR for incorrect operations headers');

    // 1.3 Missing tab should fail validation
    const missingTabState = {
      [TABS.OPERATIONS]: [[...OPERATIONS_COLUMNS]],
      // Missing NOTES tab
      [TABS.ACTIVITY]: [[...ACTIVITY_COLUMNS]],
    };
    const mockServiceMissing = new MockSheetsService(missingTabState);
    const repoMissing = new GoogleSheetsOperationsRepository(mockServiceMissing);

    let threwMissingTabError = false;
    try {
      await repoMissing.getOperationByLeadId('lp_123456789012345678901234');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('CRM_SHEETS_SCHEMA_ERROR')) {
        threwMissingTabError = true;
      }
    }
    assert(threwMissingTabError, 'Throws CRM_SHEETS_SCHEMA_ERROR when a tab is missing');
  }

  // 2. Read by lead_id & Duplicates
  {
    const state = getValidInitialState();
    const leadId = 'lp_123456789012345678901234';
    const writeToken = randomUUID();
    const createdTime = new Date().toISOString();
    
    // Add valid operation row
    state[TABS.OPERATIONS].push([
      leadId, 'contacted', 'william@example.com', 'high', 'call',
      createdTime, createdTime, '', '1', writeToken,
      createdTime, createdTime, 'admin@example.com'
    ]);

    const mockService = new MockSheetsService(state);
    const repo = new GoogleSheetsOperationsRepository(mockService);

    // 2.1 Find existing operation
    const op = await repo.getOperationByLeadId(leadId);
    assert(op !== null, 'Finds operation by lead_id');
    assert(op?.crm_status === 'contacted', 'Mappping crm_status matches');
    assert(op?.version === 1, 'Mapping version matches');
    assert(op?.write_token === writeToken, 'Mapping write_token matches');
    assert(op?.owner_email === 'william@example.com', 'owner_email parsed in lowercase');

    // 2.2 Duplicates detection
    state[TABS.OPERATIONS].push([
      leadId, 'qualified', 'william@example.com', 'high', 'call',
      createdTime, createdTime, '', '2', writeToken,
      createdTime, createdTime, 'admin@example.com'
    ]); // append duplicate row for same leadId

    const mockServiceDup = new MockSheetsService(state);
    const repoDup = new GoogleSheetsOperationsRepository(mockServiceDup);
    let threwDuplicateError = false;
    try {
      await repoDup.getOperationByLeadId(leadId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('DUPLICATE_OPERATIONS_RECORD')) {
        threwDuplicateError = true;
      }
    }
    assert(threwDuplicateError, 'Throws DUPLICATE_OPERATIONS_RECORD when duplicate lead_id rows exist');
  }

  // 3. Upsert - Create Operation
  {
    const mockService = new MockSheetsService(getValidInitialState());
    const repo = new GoogleSheetsOperationsRepository(mockService);
    const leadId = 'lp_123456789012345678901234';

    const op = await repo.upsertOperation({
      lead_id: leadId,
      crm_status: 'new',
      owner_email: 'William@Example.Com ', // should normalize
      priority: 'high',
      expected_version: 1,
    }, 'Marcos@Example.Com ');

    assert(op.version === 1, 'New operation starts at version 1');
    assert(op.owner_email === 'william@example.com', 'owner_email is normalized');
    assert(op.updated_by === 'marcos@example.com', 'actorEmail is normalized');
    assert(mockService.sheets[TABS.OPERATIONS].length === 2, 'Row appended to LeadOperations');
    assert(mockService.sheets[TABS.ACTIVITY].length === 2, 'Initial create log appended to ActivityLog');
    
    // Check that ActivityLog row contains create_operation
    const logRow = mockService.sheets[TABS.ACTIVITY][1];
    assert(logRow[1] === leadId, 'Activity log matches leadId');
    assert(logRow[2] === 'create_operation', 'Activity log matches action_type');
    assert(logRow[4] === 'new', 'Activity log new_value is new');
  }

  // 4. Upsert - Update with Correct Version
  {
    const state = getValidInitialState();
    const leadId = 'lp_123456789012345678901234';
    const writeToken = randomUUID();
    const time = new Date().toISOString();
    state[TABS.OPERATIONS].push([
      leadId, 'new', 'william@example.com', 'high', '',
      '', '', '', '1', writeToken,
      time, time, 'marcos@example.com'
    ]);

    const mockService = new MockSheetsService(state);
    const repo = new GoogleSheetsOperationsRepository(mockService);

    const updated = await repo.upsertOperation({
      lead_id: leadId,
      crm_status: 'contacted',
      expected_version: 1,
    }, 'admin@example.com');

    assert(updated.version === 2, 'Version incremented to 2');
    assert(updated.crm_status === 'contacted', 'crm_status updated to contacted');
    assert(updated.write_token !== writeToken, 'write_token updated to new UUID');
    assert(mockService.sheets[TABS.OPERATIONS].length === 2, 'Updated existing row (didn\'t append new operation row)');
    assert(mockService.sheets[TABS.ACTIVITY].length === 2, 'Update log added to ActivityLog');

    const updateLog = mockService.sheets[TABS.ACTIVITY][1];
    assert(updateLog[2] === 'update_crm_status', 'Log type is update_crm_status');
    assert(updateLog[3] === 'new', 'Log prev value is new');
    assert(updateLog[4] === 'contacted', 'Log next value is contacted');
  }

  // 5. Upsert - Version Conflict
  {
    const state = getValidInitialState();
    const leadId = 'lp_123456789012345678901234';
    const time = new Date().toISOString();
    state[TABS.OPERATIONS].push([
      leadId, 'new', 'william@example.com', 'high', '',
      '', '', '', '1', randomUUID(),
      time, time, 'marcos@example.com'
    ]);

    const mockService = new MockSheetsService(state);
    const repo = new GoogleSheetsOperationsRepository(mockService);

    let threwConcurrency = false;
    try {
      await repo.upsertOperation({
        lead_id: leadId,
        crm_status: 'contacted',
        expected_version: 2, // wrong expected version
      }, 'admin@example.com');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'CONCURRENCY_ERROR') {
        threwConcurrency = true;
      }
    }
    assert(threwConcurrency, 'Throws CONCURRENCY_ERROR when expected_version mismatches');
    // Ensure no updates were written
    const currentOpRow = mockService.sheets[TABS.OPERATIONS][1];
    assert(currentOpRow[1] === 'new', 'Sheet row crm_status remains unchanged after concurrency error');
  }

  // 6. Upsert - Write Token Verification (Concurrent Overwrite Check)
  {
    const state = getValidInitialState();
    const leadId = 'lp_123456789012345678901234';
    const time = new Date().toISOString();
    state[TABS.OPERATIONS].push([
      leadId, 'new', 'william@example.com', 'high', '',
      '', '', '', '1', randomUUID(),
      time, time, 'marcos@example.com'
    ]);

    const mockService = new MockSheetsService(state);
    const repo = new GoogleSheetsOperationsRepository(mockService);

    // Intercept batchUpdate to simulate a concurrent write mutating the write_token in the sheet
    const originalBatchUpdate = mockService.batchUpdate.bind(mockService);
    mockService.batchUpdate = async (spreadsheetId, data) => {
      // Execute original write
      await originalBatchUpdate(spreadsheetId, data);
      // Simulate concurrent transaction overwriting write_token and version
      mockService.sheets[TABS.OPERATIONS][1][9] = 'CONCURRENT_HACKER_TOKEN';
    };

    let threwConcurrencyOnRecheck = false;
    try {
      await repo.upsertOperation({
        lead_id: leadId,
        crm_status: 'contacted',
        expected_version: 1,
      }, 'admin@example.com');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'CONCURRENCY_ERROR' || msg.includes('Concurrent mutation detected')) {
        threwConcurrencyOnRecheck = true;
      }
    }
    assert(threwConcurrencyOnRecheck, 'Throws CONCURRENCY_ERROR when token recheck fails post-write');
  }

  // 7. Notes and Activity Creation and Sorting
  {
    const state = getValidInitialState();
    const leadId = 'lp_123456789012345678901234';
    const mockService = new MockSheetsService(state);
    const repo = new GoogleSheetsOperationsRepository(mockService);

    // Create Note 1
    const note1 = await repo.createNote({
      lead_id: leadId,
      body: 'Nota número uno',
    }, 'william@example.com');
    assert(note1.body === 'Nota número uno', 'Note 1 created successfully');

    // Wait slightly
    await new Promise((resolve) => setTimeout(resolve, 5));

    // Create Note 2
    const note2 = await repo.createNote({
      lead_id: leadId,
      body: 'Nota número dos',
    }, 'william@example.com');
    assert(note2.body === 'Nota número dos', 'Note 2 created successfully');

    // 7.1 Verify Notes listed and sorted newest first
    const notes = await repo.listNotes(leadId);
    assert(notes.length === 2, 'Lists both notes');
    assert(notes[0].body === 'Nota número dos', 'Notes sorted newest first');
    assert(notes[1].body === 'Nota número uno', 'Notes sorted oldest last');

    // 7.2 Verify Activity Log sorting
    const logs = await repo.listActivity(leadId);
    assert(logs.length === 2, 'Lists both activities');
    assert(logs[0].action_type === 'add_note' && logs[0].new_value === 'Nota número dos', 'Activity sorted newest first');
  }

  // 8. Owner Normalization
  {
    const state = getValidInitialState();
    const leadId1 = 'lp_123456789012345678901234';
    const leadId2 = 'lp_987654321098765432109876';
    const time = new Date().toISOString();
    
    state[TABS.OPERATIONS].push([
      leadId1, 'new', 'william@example.com', 'high', '',
      '', '', '', '1', randomUUID(),
      time, time, 'marcos@example.com'
    ]);
    state[TABS.OPERATIONS].push([
      leadId2, 'new', 'admin@example.com', 'high', '',
      '', '', '', '1', randomUUID(),
      time, time, 'marcos@example.com'
    ]);

    const mockService = new MockSheetsService(state);
    const repo = new GoogleSheetsOperationsRepository(mockService);

    // Search with messy casing and spaces
    const results = await repo.listOperations({
      owner_email: '   WILLIAM@example.com  '
    });
    assert(results.length === 1, 'listOperations filters owner correctly');
    assert(results[0].lead_id === leadId1, 'Matches correct lead_id');
  }

  // 9. Partial Write Error Handling
  {
    const mockService = new MockSheetsService(getValidInitialState());
    mockService.forceBatchUpdateError = true;
    const repo = new GoogleSheetsOperationsRepository(mockService);

    let threwBatchError = false;
    try {
      await repo.createNote({
        lead_id: 'lp_123456789012345678901234',
        body: 'Simulando error de escritura',
      }, 'admin@example.com');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'SIMULATED_BATCH_UPDATE_ERROR') {
        threwBatchError = true;
      }
    }
    assert(threwBatchError, 'Upsert catches and propagates Google Sheets write error safely');
  }

  // 10. Missing Configuration
  {
    const mockService = new MockSheetsService(getValidInitialState());
    const repo = new GoogleSheetsOperationsRepository(mockService);
    
    const originalSpreadsheetId = process.env.LUMA_CRM_OPS_SPREADSHEET_ID;
    delete process.env.LUMA_CRM_OPS_SPREADSHEET_ID;

    let threwConfigError = false;
    try {
      await repo.getOperationByLeadId('lp_123456789012345678901234');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('LUMA_CRM_OPS_SPREADSHEET_ID')) {
        threwConfigError = true;
      }
    }
    assert(threwConfigError, 'Throws GcpConfigError when LUMA_CRM_OPS_SPREADSHEET_ID is missing');

    // Restore config
    process.env.LUMA_CRM_OPS_SPREADSHEET_ID = originalSpreadsheetId;
  }

  // 11. Factory Mode Check
  {
    const originalMode = process.env.CRM_OPERATIONS_MODE;
    const originalSpreadsheetId = process.env.LUMA_CRM_OPS_SPREADSHEET_ID;

    // 11.1 When sheets mode, require LUMA_CRM_OPS_SPREADSHEET_ID
    process.env.CRM_OPERATIONS_MODE = 'sheets';
    delete process.env.LUMA_CRM_OPS_SPREADSHEET_ID;
    let threwFactoryConfigError = false;
    try {
      await getCrmOperationsRepository();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('LUMA_CRM_OPS_SPREADSHEET_ID')) {
        threwFactoryConfigError = true;
      }
    }
    assert(threwFactoryConfigError, 'Factory throws error in sheets mode if spreadsheet ID is missing');

    // 11.2 When sheets mode and spreadsheet ID exists, returns GoogleSheetsOperationsRepository
    process.env.CRM_OPERATIONS_MODE = 'sheets';
    process.env.LUMA_CRM_OPS_SPREADSHEET_ID = 'valid-id';
    const factoryRepo = await getCrmOperationsRepository();
    assert(factoryRepo instanceof GoogleSheetsOperationsRepository, 'Factory returns GoogleSheetsOperationsRepository when mode=sheets');

    // Restore env
    process.env.CRM_OPERATIONS_MODE = originalMode;
    process.env.LUMA_CRM_OPS_SPREADSHEET_ID = originalSpreadsheetId;
  }

  // 12. Server Action updateLeadOperationAction Tests (Subphase 3.1)
  {
    console.log('\nRunning Server Action updateLeadOperationAction tests...');

    // Backup and set mock environment variables
    const originalMode = process.env.CRM_OPERATIONS_MODE;
    const originalDataMode = process.env.CRM_DATA_MODE;
    const originalAdmins = process.env.CRM_ADMIN_EMAILS;
    const originalSales = process.env.CRM_SALES_EMAILS;

    process.env.CRM_OPERATIONS_MODE = 'mock';
    process.env.CRM_DATA_MODE = 'mock';
    process.env.CRM_ADMIN_EMAILS = 'admin@example.com';
    process.env.CRM_SALES_EMAILS = 'sales1@example.com,sales2@example.com';

    // Reset memory DBs
    MockOperationsRepository.reset();

    // Get a valid lead ID from the Mock Leads Repository
    const crmRepo = await getCrmRepository();
    const paginated = await crmRepo.listLeads({});
    const lead1 = paginated.leads[0];
    const leadId1 = lead1.id;
    const leadId2 = paginated.leads[1].id;

    // A. Static Check: Verify no global session bypass exists in the actual Server Action source code
    {
      const fs = await import('fs');
      const path = await import('path');
      const code = fs.readFileSync(path.join(__dirname, '../src/app/actions/crm.ts'), 'utf8');
      assert(!code.includes('testSession'), 'Production Server Action code does not contain testSession bypass');
      assert(!code.includes('globalThis'), 'Production Server Action code does not contain globalThis bypass');
      assert(!code.includes('TEST_SESSION'), 'Production Server Action code does not contain TEST_SESSION env bypass');
    }

    // B. executeUpdateLeadOperation: fails if session is null
    {
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'contacted',
        expected_version: 0
      }, null);
      assert(res.success === false && res.error === 'UNAUTHENTICATED', 'Rejected when session is null');
    }

    // C. executeUpdateLeadOperation: fails if user has no role/not in allowlist
    {
      const session = { user: { email: 'stranger@example.com' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'contacted',
        expected_version: 0
      }, session);
      assert(res.success === false && res.error === 'UNAUTHORIZED', 'Rejected when user email is not in allowlist');
    }

    // D. First write with expected_version = 0 (Admin succeeds)
    {
      const session = { user: { email: 'admin@example.com', role: 'admin' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'contacted',
        expected_version: 0
      }, session);
      assert(res.success === true && res.operation?.crm_status === 'contacted' && res.operation?.version === 1, 'First write with expected_version = 0 succeeds for Admin');
    }

    await new Promise((resolve) => setTimeout(resolve, 5));

    // E. Admin assigns owner_email to sales1@example.com
    {
      const session = { user: { email: 'admin@example.com', role: 'admin' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        owner_email: 'sales1@example.com',
        expected_version: 1
      }, session);
      assert(res.success === true && res.operation?.owner_email === 'sales1@example.com' && res.operation?.version === 2, 'Admin assigns owner_email successfully');
    }

    await new Promise((resolve) => setTimeout(resolve, 5));

    // F. Sales modifies their assigned lead
    {
      const session = { user: { email: 'sales1@example.com', role: 'sales' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        priority: 'high',
        expected_version: 2
      }, session);
      assert(res.success === true && res.operation?.priority === 'high' && res.operation?.version === 3, 'Sales modifies their assigned lead successfully');
    }

    // G. Sales attempts to change owner_email (fails with UNAUTHORIZED)
    {
      const session = { user: { email: 'sales1@example.com', role: 'sales' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        owner_email: 'sales2@example.com',
        expected_version: 3
      }, session);
      assert(res.success === false && res.error === 'UNAUTHORIZED', 'Sales cannot modify owner_email (returns UNAUTHORIZED)');
    }

    // H. Sales attempts to edit unassigned lead (fails with UNAUTHORIZED)
    {
      const session = { user: { email: 'sales1@example.com', role: 'sales' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId2,
        crm_status: 'contacted',
        expected_version: 0
      }, session);
      assert(res.success === false && res.error === 'UNAUTHORIZED', 'Sales cannot edit unassigned lead (returns UNAUTHORIZED)');
    }

    // I. Sales attempts to edit another agent's lead (fails with UNAUTHORIZED)
    {
      const session = { user: { email: 'sales2@example.com', role: 'sales' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        priority: 'low',
        expected_version: 3
      }, session);
      assert(res.success === false && res.error === 'UNAUTHORIZED', 'Sales cannot edit lead assigned to another agent (returns UNAUTHORIZED)');
    }

    // J. lost status without lost_reason (fails Zod validation)
    {
      const session = { user: { email: 'admin@example.com', role: 'admin' } };
      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'lost',
        expected_version: 3
      }, session);
      assert(res.success === false && res.error === 'VALIDATION_ERROR', 'lost status without lost_reason fails validation');
    }

    // K. Invalid status or unknown fields (fails Zod validation)
    {
      const session = { user: { email: 'admin@example.com', role: 'admin' } };
      // Invalid status
      const res1 = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'invalid_status_value' as unknown as 'new',
        expected_version: 3
      }, session);
      assert(res1.success === false && res1.error === 'VALIDATION_ERROR', 'Invalid crm_status value fails validation');

      // Unknown fields
      const res2 = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'qualified',
        expected_version: 3,
        unknown_field: 'hack'
      } as unknown as Record<string, unknown>, session);
      assert(res2.success === false && res2.error === 'VALIDATION_ERROR', 'Unknown fields are rejected');
    }

    // L. Concurrency conflict with old version (fails and does not write/generate activity)
    {
      const session = { user: { email: 'admin@example.com', role: 'admin' } };
      const opsRepo = await getCrmOperationsRepository();

      const beforeLogs = await opsRepo.listActivity(leadId1);

      const res = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'qualified',
        expected_version: 1 // current version is 3
      }, session);
      assert(res.success === false && res.error === 'CONCURRENCY_ERROR', 'Optimistic concurrency conflict rejects write');

      const afterLogs = await opsRepo.listActivity(leadId1);
      assert(beforeLogs.length === afterLogs.length, 'Concurrency conflict does not write to ActivityLog');
    }

    // M. ActivityLog verifications
    {
      const opsRepo = await getCrmOperationsRepository();
      const logs = await opsRepo.listActivity(leadId1);
      // We had:
      // 1. Initial create (crm_status contacted) -> create_operation
      // 2. Assign owner_email -> update_owner_email
      // 3. Update priority to high -> update_priority
      // Confirms only these 3 actions were recorded (no duplicates)
      assert(logs.length === 3, 'ActivityLog records exactly the 3 expected changes without duplicates');
      assert(logs[2].action_type === 'create_operation', 'Oldest log is create_operation');
      assert(logs[1].action_type === 'update_owner_email', 'Middle log is update_owner_email');
      assert(logs[0].action_type === 'update_priority', 'Newest log is update_priority');
    }

    // N. Original Leads sheet Luma Leads V2 remains completely untouched
    {
      const freshLead = await crmRepo.getLeadById(leadId1);
      assert(freshLead !== null && freshLead.status === 'nuevo', 'Original Leads sheet remains completely immutable');
    }

    // O. Static Check: Verify that src/app/actions/crm.ts only exports updateLeadOperationAction
    {
      const crmActions = await import('../src/app/actions/crm');
      const exportsList = Object.keys(crmActions);
      assert(
        exportsList.length === 1 && exportsList[0] === 'updateLeadOperationAction',
        'src/app/actions/crm.ts exports exactly updateLeadOperationAction'
      );
    }

    // P. lost_reason cleanup test when transitioning out of lost status
    {
      const session = { user: { email: 'admin@example.com', role: 'admin' } };

      // 1. Create operation with lost status and a reason
      const createRes = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'lost',
        lost_reason: 'Too expensive',
        expected_version: 3
      }, session);
      assert(
        createRes.success === true &&
        createRes.operation?.crm_status === 'lost' &&
        createRes.operation?.lost_reason === 'Too expensive' &&
        createRes.operation?.version === 4,
        'Created lost operation with reason'
      );

      // 2. Explicitly change to contacted without sending lost_reason
      const updateRes = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'contacted',
        expected_version: 4
      }, session);
      assert(
        updateRes.success === true &&
        updateRes.operation?.crm_status === 'contacted' &&
        updateRes.operation?.lost_reason === null &&
        updateRes.operation?.version === 5,
        'Transitioning out of lost cleans up lost_reason to null'
      );
    }

    // Q. New Required Tests
    {
      const adminSession = { user: { email: 'admin@example.com', role: 'admin' } };
      const sales2Session = { user: { email: 'sales2@example.com', role: 'sales' } }; // sales2 is NOT owner of lead1 (sales1 is owner, set in E/F)
      const opsRepo = await getCrmOperationsRepository();

      // Q1. Sales ajeno + versión incorrecta → UNAUTHORIZED, no actividad
      const beforeOp = await opsRepo.getOperationByLeadId(leadId1);
      const startVersion = beforeOp?.version ?? 0;
      const beforeLogs = await opsRepo.listActivity(leadId1);

      const resQ1 = await executeUpdateLeadOperation({
        lead_id: leadId1,
        priority: 'low',
        expected_version: startVersion + 10 // wrong version
      }, sales2Session);

      assert(resQ1.success === false && resQ1.error === 'UNAUTHORIZED', 'Sales non-owner with wrong version returns UNAUTHORIZED');

      const afterLogs = await opsRepo.listActivity(leadId1);
      assert(beforeLogs.length === afterLogs.length, 'No activity log generated for unauthorized edit');

      const afterOp = await opsRepo.getOperationByLeadId(leadId1);
      assert(afterOp?.version === startVersion, 'No database version change for unauthorized edit');

      // Q2. Lead ya lost + lost_reason: null sin enviar status → VALIDATION_ERROR
      // First, transition lead1 back to lost with a reason (using admin)
      const setupLostRes = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'lost',
        lost_reason: 'Client ghosted',
        expected_version: startVersion
      }, adminSession);
      assert(setupLostRes.success === true && setupLostRes.operation?.crm_status === 'lost', 'Reset lead1 to lost successfully');

      const lostVersion = setupLostRes.operation?.version ?? 0;

      const resQ2 = await executeUpdateLeadOperation({
        lead_id: leadId1,
        lost_reason: null,
        expected_version: lostVersion
      }, adminSession);
      assert(resQ2.success === false && resQ2.error === 'VALIDATION_ERROR', 'Lead lost + lost_reason: null without status returns VALIDATION_ERROR');

      // Q3. Lead lost + actualización solo de prioridad → conserva el motivo
      const resQ3 = await executeUpdateLeadOperation({
        lead_id: leadId1,
        priority: 'high',
        expected_version: lostVersion
      }, adminSession);
      assert(resQ3.success === true, 'Updating only priority on lost lead succeeds');
      assert(resQ3.operation?.priority === 'high', 'Priority updated');
      assert(resQ3.operation?.lost_reason === 'Client ghosted', 'Lost reason is preserved');

      const nextVersion = resQ3.operation?.version ?? 0;

      // Q4. Transición lost → contacted → motivo limpio
      const resQ4 = await executeUpdateLeadOperation({
        lead_id: leadId1,
        crm_status: 'contacted',
        expected_version: nextVersion
      }, adminSession);
      assert(resQ4.success === true && resQ4.operation?.crm_status === 'contacted', 'Transitioned from lost to contacted');
      assert(resQ4.operation?.lost_reason === null, 'Lost reason cleaned up to null');
    }

    // Restore env vars
    process.env.CRM_OPERATIONS_MODE = originalMode;
    process.env.CRM_DATA_MODE = originalDataMode;
    process.env.CRM_ADMIN_EMAILS = originalAdmins;
    process.env.CRM_SALES_EMAILS = originalSales;
    console.log('✅ Server Action updateLeadOperationAction tests completed successfully!\n');
  }

  console.log('🎉 All Google Sheets Operations Repository offline tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Tests failed:', err);
  process.exit(1);
});
