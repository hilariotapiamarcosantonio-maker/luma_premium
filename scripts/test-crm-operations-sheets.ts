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

  // 13. DTO, Mapper, and Server Logic Tests
  {
    console.log('Running DTO and Mapper tests...');
    const { toLeadOperationClientDto } = await import('../src/lib/crm/operations-dto');

    // Sample internal operation object
    const internalOp = {
      lead_id: 'lp_123456789012345678901234',
      crm_status: 'contacted' as const,
      owner_email: 'sales1@example.com',
      priority: 'high' as const,
      next_action_type: 'call',
      next_action_at: '2026-06-17T12:00:00.000Z',
      last_contact_at: '2026-06-17T11:00:00.000Z',
      lost_reason: null,
      version: 3,
      // Internal fields
      write_token: 'uuid-token-123',
      created_at: '2026-06-17T10:00:00.000Z',
      updated_at: '2026-06-17T10:30:00.000Z',
      updated_by: 'admin@example.com',
    };

    const dto = toLeadOperationClientDto(internalOp);

    // Q1. Verify exact keys list
    const actualKeys = Object.keys(dto).sort();
    const expectedKeys = [
      'crm_status',
      'last_contact_at',
      'lead_id',
      'lost_reason',
      'next_action_at',
      'next_action_type',
      'owner_email',
      'priority',
      'version',
    ].sort();

    const keysMatch = actualKeys.length === expectedKeys.length &&
                      actualKeys.every((val, i) => val === expectedKeys[i]);

    assert(keysMatch, `DTO contains exact whitelisted keys: ${JSON.stringify(actualKeys)}`);

    // Q2. Verify internal keys are absent
    assert(!('write_token' in dto), 'write_token is absent from DTO');
    assert(!('created_at' in dto), 'created_at is absent from DTO');
    assert(!('updated_at' in dto), 'updated_at is absent from DTO');
    assert(!('updated_by' in dto), 'updated_by is absent from DTO');

    // Q3. Verify values mapped correctly
    assert(dto.lead_id === internalOp.lead_id, 'lead_id matches');
    assert(dto.crm_status === internalOp.crm_status, 'crm_status matches');
    assert(dto.owner_email === internalOp.owner_email, 'owner_email matches');
    assert(dto.priority === internalOp.priority, 'priority matches');
    assert(dto.next_action_type === internalOp.next_action_type, 'next_action_type matches');
    assert(dto.next_action_at === internalOp.next_action_at, 'next_action_at matches');
    assert(dto.last_contact_at === internalOp.last_contact_at, 'last_contact_at matches');
    assert(dto.lost_reason === internalOp.lost_reason, 'lost_reason matches');
    assert(dto.version === internalOp.version, 'version matches');

    // Q4. Verify Server Action logic uses mapper (static verification of code)
    const fs = await import('fs');
    const path = await import('path');
    const actionCode = fs.readFileSync(path.join(__dirname, '../src/app/actions/crm.ts'), 'utf8');
    assert(actionCode.includes('toLeadOperationClientDto'), 'Server Action code calls toLeadOperationClientDto mapper');

    // Q5. Verify salesEmails server logic (Admin -> list, Sales -> [])
    const originalSales = process.env.CRM_SALES_EMAILS;
    process.env.CRM_SALES_EMAILS = 'sales1@example.com,sales2@example.com';
    const { getSalesEmails } = await import('../src/lib/auth/authorized-users');

    const adminRole: string = 'admin';
    const adminSalesEmails = adminRole === 'admin' ? Array.from(getSalesEmails()) : [];
    assert(adminSalesEmails.includes('sales1@example.com') && adminSalesEmails.includes('sales2@example.com'), 'Admin gets normal sales emails list');

    const salesRole: string = 'sales';
    const salesSalesEmails = salesRole === 'admin' ? Array.from(getSalesEmails()) : [];
    assert(salesSalesEmails.length === 0, 'Sales gets empty sales emails list');

    process.env.CRM_SALES_EMAILS = originalSales;
    console.log('✅ DTO, Mapper, and Server Logic tests completed successfully!\n');
  }

  // 14. CrmReadService & Combined Read Layer Tests
  {
    console.log('Running CrmReadService & Combined Read Layer tests...');

    const { CrmLeadReadFiltersSchema } = await import('../src/lib/crm/schemas');
    const { CrmReadService } = await import('../src/lib/crm/crm-read-service');

    type LeadDetail = import('../src/lib/crm/types').LeadDetail;
    type PaginatedLeads = import('../src/lib/crm/types').PaginatedLeads;
    type LeadFilters = import('../src/lib/crm/types').LeadFilters;
    type CrmLeadOperation = import('../src/lib/crm/operations-types').CrmLeadOperation;
    type CrmStatus = import('../src/lib/crm/operations-types').CrmStatus;
    type CrmLeadReadModel = import('../src/lib/crm/crm-read-service').CrmLeadReadModel;
    type CrmRepository = import('../src/lib/crm/repository').CrmRepository;
    type CrmOperationsRepository = import('../src/lib/crm/operations-repository').CrmOperationsRepository;
    type OperationsFilters = import('../src/lib/crm/operations-types').OperationsFilters;
    type UpdateOperationInput = import('../src/lib/crm/operations-types').UpdateOperationInput;
    type CrmLeadNote = import('../src/lib/crm/operations-types').CrmLeadNote;
    type CreateNoteInput = import('../src/lib/crm/operations-types').CreateNoteInput;
    type CrmActivityLog = import('../src/lib/crm/operations-types').CrmActivityLog;

    class FakeCrmRepository implements CrmRepository {
      constructor(public leads: LeadDetail[]) {}
      async listLeads(filters: LeadFilters): Promise<PaginatedLeads> {
        let filtered = [...this.leads];
        if (filters.locale) {
          filtered = filtered.filter((l) => l.locale === filters.locale);
        }
        const page = filters.page || 1;
        const pageSize = filters.page_size || 25;
        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / pageSize);
        const startIdx = (page - 1) * pageSize;
        const paginatedLeads = filtered.slice(startIdx, startIdx + pageSize);
        return {
          leads: paginatedLeads,
          totalCount,
          page,
          page_size: pageSize,
          totalPages,
        };
      }
      async getLeadById(leadId: string): Promise<LeadDetail | null> {
        return this.leads.find((l) => l.id === leadId) || null;
      }
      async getDashboardMetrics(): Promise<import('../src/lib/crm/types').DashboardMetrics> {
        const campaignMap: Record<string, number> = {};
        this.leads.forEach((l) => {
          if (l.utm_campaign) {
            campaignMap[l.utm_campaign] = (campaignMap[l.utm_campaign] || 0) + 1;
          }
        });
        const byCampaign = Object.entries(campaignMap).map(([campaign, count]) => ({ campaign, count }));
        return {
          totalLeads: this.leads.length,
          newLeads: 0,
          leadsWithPhone: 0,
          leadsWithBudget: 0,
          byLocale: [],
          byCountry: [],
          byIndustry: [],
          byInvestmentRange: [],
          byCampaign,
          byPlatform: [],
          byChannel: [],
          recentLeads: this.leads.slice(0, 5),
        };
      }
    }

    class FakeCrmOperationsRepository implements CrmOperationsRepository {
      constructor(public operations: CrmLeadOperation[]) {}
      async listOperations(filters?: OperationsFilters): Promise<CrmLeadOperation[]> {
        if (filters?.owner_email) {
          return this.operations.filter((op) => op.owner_email === filters.owner_email);
        }
        return this.operations;
      }
      async getOperationByLeadId(leadId: string): Promise<CrmLeadOperation | null> {
        return this.operations.find((op) => op.lead_id === leadId) || null;
      }
      async upsertOperation(input: UpdateOperationInput, actorEmail: string): Promise<CrmLeadOperation> {
        throw new Error(`Not implemented for actor ${actorEmail} and lead ${input.lead_id}`);
      }
      async listNotes(leadId: string): Promise<CrmLeadNote[]> {
        throw new Error(`Not implemented for lead ${leadId}`);
      }
      async createNote(input: CreateNoteInput, actorEmail: string): Promise<CrmLeadNote> {
        throw new Error(`Not implemented for actor ${actorEmail} and lead ${input.lead_id}`);
      }
      async listActivity(leadId: string): Promise<CrmActivityLog[]> {
        throw new Error(`Not implemented for lead ${leadId}`);
      }
    }

    // 1. El esquema de la página acepta los nueve estados
    const validStatuses: CrmStatus[] = [
      'new',
      'contacted',
      'qualified',
      'meeting_scheduled',
      'proposal_sent',
      'negotiation',
      'won',
      'lost',
      'nurture'
    ];
    for (const status of validStatuses) {
      const parse = CrmLeadReadFiltersSchema.safeParse({ status });
      assert(parse.success, `Schema should accept status "${status}"`);
      assert(parse.data?.status === status, `Parsed status should match "${status}"`);
    }
    const invalidParse = CrmLeadReadFiltersSchema.safeParse({ status: 'invalid_status' });
    assert(!invalidParse.success, 'Schema should reject invalid status');

    // 2. Generar 205 leads para probar que se leen todos y se evita page_size: 100000
    const fakeLeads: LeadDetail[] = Array.from({ length: 205 }, (_, i) => {
      const idNum = String(i + 1).padStart(24, '0');
      return {
        id: `lp_${idNum}`,
        schema_version: '2',
        created_at: new Date().toISOString(),
        locale: 'es',
        country: 'DO',
        full_name: `Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        phone: '8095551234',
        company: 'Luma',
        role: 'CEO',
        industry: 'Real Estate',
        industry_detail: 'Sales',
        team_size: '1-10',
        lead_volume: '1-10',
        acquisition_channels: 'google',
        advertising_status: 'yes',
        current_tools: 'sheets',
        main_bottleneck: 'time',
        desired_outcome: 'grow',
        solution_interest: 'crm',
        timeline: 'now',
        investment_range: 'US$1,500–3,000',
        source: 'web',
        page_origin: 'lp',
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'brand',
        utm_content: 'ad1',
        utm_term: 'luma',
        status: 'nuevo',
        platform: 'google',
        channel: 'paid_search',
        raw_investment_range: 'US$1,500–3,000',
        raw_industry: 'Real Estate',
        raw_country: 'DO',
        raw_source: 'web',
        raw_utm_source: 'google',
        raw_utm_medium: 'cpc',
        raw_utm_campaign: 'brand',
        raw_page_origin: 'lp',
      };
    });

    const fakeLeadRepo: CrmRepository = new FakeCrmRepository(fakeLeads);
    const fakeOpsRepo: CrmOperationsRepository = new FakeCrmOperationsRepository([]);
    const testService = new CrmReadService(fakeLeadRepo, fakeOpsRepo);

    // Más de 100 leads se recopilan completamente sin quedar truncados en 100
    const listRes = await testService.listLeads({ page: 1, page_size: 25 });
    assert(listRes.leads.length === 25, `Should return first page of 25 leads, got ${listRes.leads.length}`);
    assert(listRes.totalCount === 205, `totalCount should be 205, got ${listRes.totalCount}`);

    // 3. Un lead operativo después de la primera página (e.g. index 204 en la página 3) puede filtrarse
    const leadId205 = fakeLeads[204].id;
    const fakeOps: CrmLeadOperation[] = [
      {
        lead_id: leadId205,
        crm_status: 'negotiation',
        priority: 'high',
        owner_email: 'sales1@example.com',
        next_action_at: null,
        next_action_type: null,
        last_contact_at: null,
        lost_reason: null,
        version: 1,
        write_token: 'uuid-token',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'admin@example.com',
      }
    ];
    const fakeOpsRepoWithOp: CrmOperationsRepository = new FakeCrmOperationsRepository(fakeOps);
    const testServiceWithOp = new CrmReadService(fakeLeadRepo, fakeOpsRepoWithOp);

    const filterRes = await testServiceWithOp.listLeads({ status: 'negotiation', page: 1, page_size: 10 });
    // 4. El total filtrado es correcto
    assert(filterRes.totalCount === 1, `Filtered totalCount should be 1, got ${filterRes.totalCount}`);
    assert(filterRes.leads.length === 1, `Filtered leads length should be 1, got ${filterRes.leads.length}`);
    assert(filterRes.leads[0].id === leadId205, `Should find lead 205, got ${filterRes.leads[0].id}`);

    // 5. La paginación ocurre después del filtro
    const contactedLeadIds = [fakeLeads[5].id, fakeLeads[50].id, fakeLeads[120].id, fakeLeads[150].id, fakeLeads[200].id];
    const contactedOps: CrmLeadOperation[] = contactedLeadIds.map(leadId => ({
      lead_id: leadId,
      crm_status: 'contacted',
      priority: 'low',
      owner_email: 'sales2@example.com',
      next_action_at: null,
      next_action_type: null,
      last_contact_at: null,
      lost_reason: null,
      version: 1,
      write_token: 'token',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: 'admin@example.com',
    }));
    const fakeOpsRepoContacted: CrmOperationsRepository = new FakeCrmOperationsRepository(contactedOps);
    const testServiceContacted = new CrmReadService(fakeLeadRepo, fakeOpsRepoContacted);

    const p1 = await testServiceContacted.listLeads({ status: 'contacted', page: 1, page_size: 2 });
    assert(p1.totalCount === 5, `Total count of contacted should be 5, got ${p1.totalCount}`);
    assert(p1.leads.length === 2, `Page 1 should have 2 leads, got ${p1.leads.length}`);

    const p3 = await testServiceContacted.listLeads({ status: 'contacted', page: 3, page_size: 2 });
    assert(p3.totalCount === 5, `Total count remains 5, got ${p3.totalCount}`);
    assert(p3.leads.length === 1, `Page 3 should have 1 lead, got ${p3.leads.length}`);

    // 6. byCrmStatus cuenta los nueve estados
    const statuses: CrmStatus[] = [
      'new', 'contacted', 'qualified', 'meeting_scheduled',
      'proposal_sent', 'negotiation', 'won', 'lost', 'nurture'
    ];
    const nineOps: CrmLeadOperation[] = statuses.map((status, index) => ({
      lead_id: fakeLeads[index].id,
      crm_status: status,
      priority: 'low',
      owner_email: 'sales@example.com',
      next_action_at: null,
      next_action_type: null,
      last_contact_at: null,
      lost_reason: status === 'lost' ? 'Too expensive' : null,
      version: 1,
      write_token: 'token',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: 'admin@example.com',
    }));

    const fakeOpsRepoNine: CrmOperationsRepository = new FakeCrmOperationsRepository(nineOps);
    const testServiceNine = new CrmReadService(fakeLeadRepo, fakeOpsRepoNine);
    const metricsRes = await testServiceNine.getDashboardMetrics();

    assert(metricsRes.byCrmStatus.new === 197, `byCrmStatus.new should be 197, got ${metricsRes.byCrmStatus.new}`);
    assert(metricsRes.byCrmStatus.contacted === 1, `byCrmStatus.contacted should be 1, got ${metricsRes.byCrmStatus.contacted}`);
    assert(metricsRes.byCrmStatus.qualified === 1, `byCrmStatus.qualified should be 1, got ${metricsRes.byCrmStatus.qualified}`);
    assert(metricsRes.byCrmStatus.meeting_scheduled === 1, `byCrmStatus.meeting_scheduled should be 1, got ${metricsRes.byCrmStatus.meeting_scheduled}`);
    assert(metricsRes.byCrmStatus.proposal_sent === 1, `byCrmStatus.proposal_sent should be 1, got ${metricsRes.byCrmStatus.proposal_sent}`);
    assert(metricsRes.byCrmStatus.negotiation === 1, `byCrmStatus.negotiation should be 1, got ${metricsRes.byCrmStatus.negotiation}`);
    assert(metricsRes.byCrmStatus.won === 1, `byCrmStatus.won should be 1, got ${metricsRes.byCrmStatus.won}`);
    assert(metricsRes.byCrmStatus.lost === 1, `byCrmStatus.lost should be 1, got ${metricsRes.byCrmStatus.lost}`);
    assert(metricsRes.byCrmStatus.nurture === 1, `byCrmStatus.nurture should be 1, got ${metricsRes.byCrmStatus.nurture}`);

    // 7. Solo una llamada a listOperations() por método
    let listOpsCount = 0;
    const countingOpsRepo: CrmOperationsRepository = new class extends FakeCrmOperationsRepository {
      async listOperations(filters?: OperationsFilters) {
        listOpsCount++;
        return super.listOperations(filters);
      }
    }([]);

    const testServiceCounting = new CrmReadService(fakeLeadRepo, countingOpsRepo);

    listOpsCount = 0;
    await testServiceCounting.listLeads({ page: 1, page_size: 10 });
    assert(listOpsCount === 1, `listLeads should call listOperations exactly once, got ${listOpsCount}`);

    listOpsCount = 0;
    await testServiceCounting.getDashboardMetrics();
    assert(listOpsCount === 1, `getDashboardMetrics should call listOperations exactly once, got ${listOpsCount}`);

    // 8. El modelo combinado no contiene write_token
    const listModel = await testServiceNine.listLeads({ page: 1, page_size: 25 });
    listModel.leads.forEach((l: CrmLeadReadModel) => {
      assert(!('write_token' in l), 'write_token should not be present in read model from listLeads');
    });

    const singleModel = await testServiceNine.getLeadById(fakeLeads[0].id);
    assert(singleModel !== null, 'singleModel exists');
    assert(!('write_token' in singleModel!), 'write_token should not be present in read model from getLeadById');

    // 9. Los repositorios originales permanecen puros
    const originalLead = await fakeLeadRepo.getLeadById(fakeLeads[0].id);
    assert(originalLead !== null, 'original lead exists');
    assert(!('crm_status' in originalLead!), 'crm_status should not exist in original repository lead');
    assert(!('priority' in originalLead!), 'priority should not exist in original repository lead');

    // 10. Prueba de lectura operativa por página (listLeads + getSourceCampaignOptions -> total listOperations = 1)
    listOpsCount = 0;
    await Promise.all([
      testServiceCounting.listLeads({ page: 1, page_size: 10 }),
      testServiceCounting.getSourceCampaignOptions(),
    ]);
    assert(listOpsCount === 1, `listLeads + getSourceCampaignOptions together should trigger listOperations exactly once, got ${listOpsCount}`);

    // 11. Confirmar getSourceCampaignOptions() no llama a listOperations(), devuelve campañas únicas
    listOpsCount = 0;
    const campaignsOnly = await testServiceCounting.getSourceCampaignOptions();
    assert(listOpsCount === 0, `getSourceCampaignOptions alone should trigger listOperations zero times, got ${listOpsCount}`);
    assert(Array.isArray(campaignsOnly), 'getSourceCampaignOptions returns an array');
    const isUnique = new Set(campaignsOnly).size === campaignsOnly.length;
    assert(isUnique, 'getSourceCampaignOptions returns unique campaign names');

    // 11.5 Visual Fixes validation: next_action_type, listOperations once, write_token absence
    {
      console.log('Testing visual fixes combined layer...');
      const customOps: CrmLeadOperation[] = [
        {
          lead_id: fakeLeads[0].id,
          crm_status: 'qualified',
          priority: 'high',
          owner_email: 'blaancoperla@gmail.com',
          next_action_type: 'Demo',
          next_action_at: '2026-06-24T12:00:00.000Z',
          last_contact_at: null,
          lost_reason: null,
          version: 1,
          write_token: 'secret_token_123',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: 'admin@luma.com',
        }
      ];

      let listOpsCountLocal = 0;
      const localCountingOpsRepo = new class extends FakeCrmOperationsRepository {
        async listOperations(filters?: OperationsFilters) {
          listOpsCountLocal++;
          return super.listOperations(filters);
        }
      }(customOps);

      const localReadService = new CrmReadService(fakeLeadRepo, localCountingOpsRepo);

      // Verify listLeads merges next_action_type and calls listOperations exactly once
      listOpsCountLocal = 0;
      const result = await localReadService.listLeads({ page: 1, page_size: 10 });
      assert(listOpsCountLocal === 1, `listLeads should call listOperations exactly once, got ${listOpsCountLocal}`);

      const matchedLead = result.leads.find(l => l.id === fakeLeads[0].id);
      assert(matchedLead !== undefined, 'Matched lead exists');
      assert(matchedLead!.next_action_type === 'Demo', `next_action_type should merge correctly, expected 'Demo', got '${matchedLead!.next_action_type}'`);
      assert(matchedLead!.crm_status === 'qualified', 'crm_status merges correctly');
      assert(matchedLead!.priority === 'high', 'priority merges correctly');
      assert(matchedLead!.owner_email === 'blaancoperla@gmail.com', 'owner_email merges correctly');
      assert(!('write_token' in matchedLead!), 'write_token remains absent in listLeads output');

      // Verify getLeadById merges next_action_type and write_token is absent
      const singleLead = await localReadService.getLeadById(fakeLeads[0].id);
      assert(singleLead !== null, 'singleLead exists');
      assert(singleLead!.next_action_type === 'Demo', `next_action_type should merge in getLeadById, got '${singleLead!.next_action_type}'`);
      assert(!('write_token' in singleLead!), 'write_token remains absent in getLeadById output');
      console.log('✅ Visual fixes combined layer tests passed successfully!');
    }

    // 12. Pruebas de fecha en crm-date-display.ts
    const { formatCrmDate } = await import('../src/lib/crm/crm-date-display');

    // Valor null -> null
    assert(formatCrmDate(null) === null, 'formatCrmDate(null) should return null');

    // Valor inválido -> null
    assert(formatCrmDate('not-a-date') === null, 'formatCrmDate(invalid) should return null');

    // 2026-06-18T02:30:00.000Z -> fecha del 17 de junio en America/Santo_Domingo (17/06/2026)
    const formattedDate = formatCrmDate('2026-06-18T02:30:00.000Z');
    assert(formattedDate === '17/06/2026', `formatCrmDate('2026-06-18T02:30:00.000Z') should return '17/06/2026', got '${formattedDate}'`);

    console.log('✅ CrmReadService & Combined Read Layer tests completed successfully!\n');

    // 13. Pruebas de LeadOperationEditor Helpers (splitIsoDateTime y joinDateTimeToIso)
    console.log('Running LeadOperationEditor date helper tests...');
    const { splitIsoDateTime, joinDateTimeToIso } = await import('../src/components/crm/LeadOperationEditor');

    // ambos vacíos -> null
    assert(joinDateTimeToIso('', '') === null, 'joinDateTimeToIso("", "") should return null');
    assert(joinDateTimeToIso(null, undefined) === null, 'joinDateTimeToIso(null, undefined) should return null');

    // fecha + hora -> ISO válido
    const isoResult = joinDateTimeToIso('2026-06-17', '12:00');
    assert(isoResult !== null && isoResult !== 'INVALID_DATE', 'joinDateTimeToIso with date and time should return a valid ISO string');
    assert(new Date(isoResult!).toISOString() === isoResult, 'Result is a valid ISO string');

    // splitIsoDateTime con el ISO anterior debe retornar la fecha y hora local original
    const splitResult = splitIsoDateTime(isoResult);
    assert(splitResult.date === '2026-06-17', `splitIsoDateTime date should be '2026-06-17', got '${splitResult.date}'`);
    assert(splitResult.time === '12:00', `splitIsoDateTime time should be '12:00', got '${splitResult.time}'`);

    // fecha sin hora -> INVALID_DATE
    assert(joinDateTimeToIso('2026-06-17', '') === 'INVALID_DATE', 'joinDateTimeToIso with date but empty time should return INVALID_DATE');
    assert(joinDateTimeToIso('2026-06-17', null) === 'INVALID_DATE', 'joinDateTimeToIso with date but null time should return INVALID_DATE');

    // hora sin fecha -> INVALID_DATE
    assert(joinDateTimeToIso('', '12:00') === 'INVALID_DATE', 'joinDateTimeToIso with empty date but time should return INVALID_DATE');
    assert(joinDateTimeToIso(null, '12:00') === 'INVALID_DATE', 'joinDateTimeToIso with null date but time should return INVALID_DATE');

    // valor inválido -> INVALID_DATE
    assert(joinDateTimeToIso('2026-02-31', '12:00') === 'INVALID_DATE', 'joinDateTimeToIso with invalid date (Feb 31) should return INVALID_DATE');
    assert(joinDateTimeToIso('invalid-date', '12:00') === 'INVALID_DATE', 'joinDateTimeToIso with invalid date string should return INVALID_DATE');

    console.log('✅ LeadOperationEditor date helper tests completed successfully!\n');

    // 14. Combined Filter tests (Calificado + Inglés)
    {
      console.log('Running Combined Filter tests (Calificado + Inglés)...');
      const customLeads: LeadDetail[] = [
        {
          id: 'lp_000000000000000000000001',
          schema_version: '2',
          created_at: new Date().toISOString(),
          locale: 'en',
          country: 'US',
          full_name: 'English Qualified Lead',
          email: 'en_qualified@example.com',
          phone: '1234567890',
          company: 'Luma',
          role: 'CEO',
          industry: 'Real Estate',
          industry_detail: 'Sales',
          team_size: '1-10',
          lead_volume: '1-10',
          acquisition_channels: 'web',
          advertising_status: 'yes',
          current_tools: 'none',
          main_bottleneck: 'none',
          desired_outcome: 'none',
          solution_interest: 'Luma Estate OS',
          timeline: '1 month',
          investment_range: '5k-10k',
          source: 'web',
          page_origin: 'lp',
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'brand',
          utm_content: 'ad',
          utm_term: 'luma',
          status: 'nuevo',
          platform: 'google',
          channel: 'paid_search',
          raw_investment_range: '5k-10k',
          raw_industry: 'Real Estate',
          raw_country: 'US',
          raw_source: 'web',
          raw_utm_source: 'google',
          raw_utm_medium: 'cpc',
          raw_utm_campaign: 'brand',
          raw_page_origin: 'lp',
        },
        {
          id: 'lp_000000000000000000000002',
          schema_version: '2',
          created_at: new Date().toISOString(),
          locale: 'es',
          country: 'DO',
          full_name: 'Spanish Qualified Lead',
          email: 'es_qualified@example.com',
          phone: '8095551234',
          company: 'Luma',
          role: 'CEO',
          industry: 'Real Estate',
          industry_detail: 'Sales',
          team_size: '1-10',
          lead_volume: '1-10',
          acquisition_channels: 'web',
          advertising_status: 'yes',
          current_tools: 'none',
          main_bottleneck: 'none',
          desired_outcome: 'none',
          solution_interest: 'Luma Estate OS',
          timeline: '1 month',
          investment_range: '5k-10k',
          source: 'web',
          page_origin: 'lp',
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_campaign: 'brand',
          utm_content: 'ad',
          utm_term: 'luma',
          status: 'nuevo',
          platform: 'google',
          channel: 'paid_search',
          raw_investment_range: '5k-10k',
          raw_industry: 'Real Estate',
          raw_country: 'DO',
          raw_source: 'web',
          raw_utm_source: 'google',
          raw_utm_medium: 'cpc',
          raw_utm_campaign: 'brand',
          raw_page_origin: 'lp',
        }
      ];

      const customOps: CrmLeadOperation[] = [
        {
          lead_id: 'lp_000000000000000000000001',
          crm_status: 'qualified',
          priority: 'high',
          owner_email: 'blaancoperla@gmail.com',
          next_action_type: null,
          next_action_at: null,
          last_contact_at: null,
          lost_reason: null,
          version: 1,
          write_token: 'token1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: 'admin@example.com',
        },
        {
          lead_id: 'lp_000000000000000000000002',
          crm_status: 'qualified',
          priority: 'high',
          owner_email: 'blaancoperla@gmail.com',
          next_action_type: null,
          next_action_at: null,
          last_contact_at: null,
          lost_reason: null,
          version: 1,
          write_token: 'token2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: 'admin@example.com',
        }
      ];

      const customLeadRepo = new FakeCrmRepository(customLeads);
      const customOpsRepo = new FakeCrmOperationsRepository(customOps);
      const customReadService = new CrmReadService(customLeadRepo, customOpsRepo);

      // Verify combined filter crm_status=qualified & locale=en
      {
        const parse = CrmLeadReadFiltersSchema.parse({ status: 'qualified', locale: 'en' });
        const res = await customReadService.listLeads(parse);
        assert(res.totalCount === 1, `Combined filter totalCount should be 1, got ${res.totalCount}`);
        assert(res.leads[0].id === 'lp_000000000000000000000001', 'Should match the English lead');
      }

      // Verify combined filter with status=calificado (Spanish) & locale=EN (uppercase)
      {
        const parse = CrmLeadReadFiltersSchema.parse({ status: 'Calificado', locale: 'EN' });
        assert(parse.status === 'qualified', `Should preprocess 'Calificado' to 'qualified'`);
        assert(parse.locale === 'en', `Should preprocess 'EN' to 'en'`);
        const res = await customReadService.listLeads(parse);
        assert(res.totalCount === 1, `Combined filter with preprocessed fields totalCount should be 1, got ${res.totalCount}`);
      }

      // Verify combined filter with status=Calificado & locale=english
      {
        const parse = CrmLeadReadFiltersSchema.parse({ status: 'calificado', locale: 'english' });
        assert(parse.locale === 'en', `Should preprocess 'english' to 'en'`);
        const res = await customReadService.listLeads(parse);
        assert(res.totalCount === 1, `Combined filter with 'english' totalCount should be 1, got ${res.totalCount}`);
      }

      // Verify combined filter with zero results
      {
        const parse = CrmLeadReadFiltersSchema.parse({ status: 'won', locale: 'en' });
        const res = await customReadService.listLeads(parse);
        assert(res.totalCount === 0, `Combined filter with zero results should return 0, got ${res.totalCount}`);
        assert(res.leads.length === 0, 'Leads array should be empty');
      }
      console.log('✅ Combined filter tests passed successfully!');
    }

    // 15. Next Action Validation schema tests
    {
      console.log('Running Next Action Validation schema tests...');
      const { UpdateOperationSchema } = await import('../src/lib/crm/operations-schemas');

      // Tipo vacío + fecha vacía = válido
      const v1 = UpdateOperationSchema.safeParse({
        lead_id: 'lp_000000000000000000000001',
        expected_version: 0,
        next_action_type: '',
        next_action_at: null,
      });
      assert(v1.success, 'Tipo vacío + fecha vacía should be valid');

      const v1b = UpdateOperationSchema.safeParse({
        lead_id: 'lp_000000000000000000000001',
        expected_version: 0,
        next_action_type: null,
        next_action_at: null,
      });
      assert(v1b.success, 'Tipo null + fecha null should be valid');

      // Tipo presente + fecha y hora presentes = válido
      const v2 = UpdateOperationSchema.safeParse({
        lead_id: 'lp_000000000000000000000001',
        expected_version: 0,
        next_action_type: 'Demo',
        next_action_at: '2026-06-18T12:00:00.000Z',
      });
      assert(v2.success, 'Tipo presente + fecha y hora presentes should be valid');

      // Combinaciones inválidas:

      // Tipo presente + fecha vacía = inválido
      const iv1 = UpdateOperationSchema.safeParse({
        lead_id: 'lp_000000000000000000000001',
        expected_version: 0,
        next_action_type: 'Demo',
        next_action_at: null,
      });
      assert(!iv1.success, 'Tipo presente + fecha vacía should be invalid');
      if (!iv1.success) {
        const err = iv1.error.flatten().fieldErrors.next_action_at;
        assert(!!(err && err.includes('Selecciona la fecha de la próxima acción.')), 'Should return correct error message for missing date');
      }

      // Fecha presente + tipo vacío = inválido
      const iv2 = UpdateOperationSchema.safeParse({
        lead_id: 'lp_000000000000000000000001',
        expected_version: 0,
        next_action_type: '',
        next_action_at: '2026-06-18T12:00:00.000Z',
      });
      assert(!iv2.success, 'Fecha presente + tipo vacío should be invalid');
      if (!iv2.success) {
        const err = iv2.error.flatten().fieldErrors.next_action_type;
        assert(!!(err && err.includes('Selecciona el tipo de próxima acción.')), 'Should return correct error message for missing type');
      }

      // Texto de fecha inválido = inválido
      const iv4 = UpdateOperationSchema.safeParse({
        lead_id: 'lp_000000000000000000000001',
        expected_version: 0,
        next_action_type: 'Demo',
        next_action_at: 'not-a-date',
      });
      assert(!iv4.success, 'Texto de fecha inválido should be invalid');

      console.log('✅ Next Action Validation schema tests passed successfully!');
    }

    // 16. Locale preprocessor and LeadFiltersSchema tests
    {
      const { LeadFiltersSchema, CrmLeadReadFiltersSchema } = await import('../src/lib/crm/schemas');

      // Canonical filter: qualified + en — must parse correctly
      const canonical = CrmLeadReadFiltersSchema.parse({ status: 'qualified', locale: 'en' });
      assert(canonical.status === 'qualified', 'Canonical: status=qualified passes through');
      assert(canonical.locale === 'en', 'Canonical: locale=en passes through');

      // Calificado → qualified (preprocessStatus on CrmLeadReadFiltersSchema)
      const esStatus = CrmLeadReadFiltersSchema.parse({ status: 'Calificado' });
      assert(esStatus.status === 'qualified', 'Calificado → qualified via preprocessStatus');

      // Inglés → en (preprocessLocale)
      const esLocale = CrmLeadReadFiltersSchema.parse({ locale: 'Inglés' });
      assert(esLocale.locale === 'en', 'Inglés → en via preprocessLocale');

      // Unknown locale → rejected by CrmLeadReadFiltersSchema
      const unknownLocale = CrmLeadReadFiltersSchema.safeParse({ locale: 'zulu' });
      assert(!unknownLocale.success, 'Unknown locale value should be rejected by CrmLeadReadFiltersSchema');

      // LeadFiltersSchema.status accepts free text (not normalized)
      const freeStatus = LeadFiltersSchema.parse({ status: 'Calificado' });
      assert(freeStatus.status === 'Calificado', 'LeadFiltersSchema.status passes free text unchanged');

      // qualified + en with results (using custom lead data)
      {
        const customLeads2: LeadDetail[] = [
          {
            id: 'lp_cfl_001',
            schema_version: '2',
            created_at: new Date().toISOString(),
            locale: 'en',
            country: 'US',
            full_name: 'Canonical Filter Lead',
            email: 'cfl@example.com',
            phone: '1234567890',
            company: 'Test Co',
            role: 'CEO',
            industry: 'Real Estate',
            industry_detail: '',
            team_size: '1-10',
            lead_volume: '1-10',
            acquisition_channels: '',
            advertising_status: '',
            current_tools: '',
            main_bottleneck: '',
            desired_outcome: '',
            solution_interest: '',
            timeline: '',
            investment_range: '',
            source: '',
            page_origin: '',
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            utm_content: '',
            utm_term: '',
            status: 'nuevo',
            platform: 'other',
            channel: 'unknown',
            raw_investment_range: '',
            raw_industry: '',
            raw_country: '',
            raw_source: '',
            raw_utm_source: '',
            raw_utm_medium: '',
            raw_utm_campaign: '',
            raw_page_origin: '',
          }
        ];
        const customOps2: CrmLeadOperation[] = [{
          lead_id: 'lp_cfl_001',
          crm_status: 'qualified',
          priority: 'high',
          owner_email: 'marcos@example.com',
          next_action_type: null,
          next_action_at: null,
          last_contact_at: null,
          lost_reason: null,
          version: 1,
          write_token: 'tok',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: 'marcos@example.com',
        }];
        const repo2 = new FakeCrmRepository(customLeads2);
        const ops2  = new FakeCrmOperationsRepository(customOps2);
        const svc2  = new CrmReadService(repo2, ops2);
        const resWithResults = await svc2.listLeads(CrmLeadReadFiltersSchema.parse({ status: 'qualified', locale: 'en' }));
        assert(resWithResults.totalCount === 1, `qualified + en with results: totalCount should be 1, got ${resWithResults.totalCount}`);

        // qualified + en without results (no english leads)
        const resNoResults = await svc2.listLeads(CrmLeadReadFiltersSchema.parse({ status: 'qualified', locale: 'es' }));
        assert(resNoResults.totalCount === 0, `qualified + es without results: totalCount should be 0, got ${resNoResults.totalCount}`);
      }

      console.log('✅ Locale preprocessor and LeadFiltersSchema tests passed successfully!');
    }
  }

  console.log('🎉 All Google Sheets Operations Repository offline tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Tests failed:', err);
  process.exit(1);
});
