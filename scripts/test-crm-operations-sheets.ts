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
    } catch (err: any) {
      if (err.message.includes('CRM_SHEETS_SCHEMA_ERROR')) {
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
    } catch (err: any) {
      if (err.message.includes('CRM_SHEETS_SCHEMA_ERROR')) {
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
    } catch (err: any) {
      if (err.message.includes('DUPLICATE_OPERATIONS_RECORD')) {
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
    } catch (err: any) {
      if (err.message === 'CONCURRENCY_ERROR') {
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
    } catch (err: any) {
      if (err.message === 'CONCURRENCY_ERROR' || err.message.includes('Concurrent mutation detected')) {
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
    } catch (err: any) {
      if (err.message === 'SIMULATED_BATCH_UPDATE_ERROR') {
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
    } catch (err: any) {
      if (err.message.includes('LUMA_CRM_OPS_SPREADSHEET_ID')) {
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
    } catch (err: any) {
      if (err.message.includes('LUMA_CRM_OPS_SPREADSHEET_ID')) {
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

  console.log('🎉 All Google Sheets Operations Repository offline tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Tests failed:', err);
  process.exit(1);
});
