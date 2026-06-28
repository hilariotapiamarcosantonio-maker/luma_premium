import 'server-only';
import { google } from 'googleapis';
import { unstable_noStore as noStore } from 'next/cache';
import { getGcpSheetsAuthClient } from '../google-auth';
import { CrmOperationsRepository } from './operations-repository';
import {
  CrmLeadOperation,
  CrmLeadNote,
  CrmActivityLog,
  UpdateOperationInput,
  CreateNoteInput,
  OperationsFilters,
  CrmStatus,
  CrmPriority
} from './operations-types';
import { UpdateOperationSchema, CreateNoteSchema, ActorEmailSchema } from './operations-schemas';
import { randomUUID } from 'crypto';

// Column mappings & sheet tabs
export const TABS = {
  OPERATIONS: 'LeadOperations',
  NOTES: 'LeadNotes',
  ACTIVITY: 'ActivityLog',
} as const;

export const OPERATIONS_COLUMNS = [
  'lead_id', 'crm_status', 'owner_email', 'priority', 'next_action_type',
  'next_action_at', 'last_contact_at', 'lost_reason', 'version', 'write_token',
  'created_at', 'updated_at', 'updated_by'
] as const;

export const NOTES_COLUMNS = [
  'id', 'lead_id', 'body', 'created_by', 'created_at', 'updated_at'
] as const;

export const ACTIVITY_COLUMNS = [
  'id', 'lead_id', 'action_type', 'previous_value', 'new_value',
  'metadata', 'created_by', 'created_at'
] as const;

export interface GoogleSheetsService {
  getValues(spreadsheetId: string, range: string): Promise<string[][] | null>;
  batchUpdate(
    spreadsheetId: string,
    data: { range: string; values: string[][] }[]
  ): Promise<void>;
}

export class ProductionGoogleSheetsService implements GoogleSheetsService {
  private async getSheets() {
    const auth = await getGcpSheetsAuthClient();
    return google.sheets({ version: 'v4', auth });
  }

  async getValues(spreadsheetId: string, range: string): Promise<string[][] | null> {
    const sheets = await this.getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return (response.data.values as string[][]) || null;
  }

  async batchUpdate(
    spreadsheetId: string,
    data: { range: string; values: string[][] }[]
  ): Promise<void> {
    const sheets = await this.getSheets();
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'RAW',
        data: data.map((d) => ({
          range: d.range,
          values: d.values,
        })),
      },
    });
  }
}

function validateHeaders(headers: string[] | undefined, expected: readonly string[]): boolean {
  if (!headers || headers.length !== expected.length) {
    return false;
  }
  for (let i = 0; i < expected.length; i++) {
    if (String(headers[i]).trim() !== expected[i]) {
      return false;
    }
  }
  return true;
}

export class GoogleSheetsOperationsRepository implements CrmOperationsRepository {
  private validated = false;

  constructor(
    private service: GoogleSheetsService = new ProductionGoogleSheetsService()
  ) {}

  private getSpreadsheetId(): string {
    const id = process.env.LUMA_CRM_OPS_SPREADSHEET_ID;
    if (!id) {
      throw new Error('GcpConfigError: Missing environment variable LUMA_CRM_OPS_SPREADSHEET_ID');
    }
    return id;
  }

  private async ensureValidated(): Promise<void> {
    if (this.validated) return;

    const spreadsheetId = this.getSpreadsheetId();

    try {
      const opsHeader = await this.service.getValues(spreadsheetId, `${TABS.OPERATIONS}!A1:M1`);
      if (!validateHeaders(opsHeader?.[0], OPERATIONS_COLUMNS)) {
        throw new Error('CRM_SHEETS_SCHEMA_ERROR: LeadOperations headers mismatch or tab missing');
      }

      const notesHeader = await this.service.getValues(spreadsheetId, `${TABS.NOTES}!A1:F1`);
      if (!validateHeaders(notesHeader?.[0], NOTES_COLUMNS)) {
        throw new Error('CRM_SHEETS_SCHEMA_ERROR: LeadNotes headers mismatch or tab missing');
      }

      const activityHeader = await this.service.getValues(spreadsheetId, `${TABS.ACTIVITY}!A1:H1`);
      if (!validateHeaders(activityHeader?.[0], ACTIVITY_COLUMNS)) {
        throw new Error('CRM_SHEETS_SCHEMA_ERROR: ActivityLog headers mismatch or tab missing');
      }

      this.validated = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('CRM_SHEETS_SCHEMA_ERROR')) {
        throw err;
      }
      throw new Error(`CRM_SHEETS_SCHEMA_ERROR: Failed to validate sheet structure. Details: ${msg}`);
    }
  }

  private mapRowToOperation(row: string[]): CrmLeadOperation {
    const getVal = (idx: number): string | null => {
      const val = row[idx];
      return val !== undefined && val.trim() !== '' ? val.trim() : null;
    };

    const lead_id = getVal(0);
    const crm_status = getVal(1);
    const owner_email = getVal(2);
    const priority = getVal(3);
    const next_action_type = getVal(4);
    const next_action_at = getVal(5);
    const last_contact_at = getVal(6);
    const lost_reason = getVal(7);
    const versionStr = getVal(8);
    const write_token = getVal(9);
    const created_at = getVal(10);
    const updated_at = getVal(11);
    const updated_by = getVal(12);

    if (!lead_id) {
      throw new Error('CRM_INVALID_DATA_ERROR: lead_id is missing in row');
    }
    if (!crm_status) {
      throw new Error('CRM_INVALID_DATA_ERROR: crm_status is missing in row');
    }
    if (!priority) {
      throw new Error('CRM_INVALID_DATA_ERROR: priority is missing in row');
    }
    if (!versionStr || isNaN(Number(versionStr))) {
      throw new Error(`CRM_INVALID_DATA_ERROR: version is invalid or missing in row: ${versionStr}`);
    }
    if (!created_at || isNaN(Date.parse(created_at))) {
      throw new Error(`CRM_INVALID_DATA_ERROR: created_at is invalid or missing in row: ${created_at}`);
    }
    if (!updated_at || isNaN(Date.parse(updated_at))) {
      throw new Error(`CRM_INVALID_DATA_ERROR: updated_at is invalid or missing in row: ${updated_at}`);
    }
    if (!updated_by) {
      throw new Error('CRM_INVALID_DATA_ERROR: updated_by is missing in row');
    }

    return {
      lead_id,
      crm_status: crm_status as CrmStatus,
      owner_email: owner_email ? owner_email.toLowerCase() : null,
      priority: priority as CrmPriority,
      next_action_type,
      next_action_at,
      last_contact_at,
      lost_reason,
      version: parseInt(versionStr, 10),
      write_token,
      created_at,
      updated_at,
      updated_by,
    };
  }

  private async getOperationWithRowIndex(leadId: string): Promise<{ op: CrmLeadOperation; rowIndex: number } | null> {
    const spreadsheetId = this.getSpreadsheetId();
    const rows = await this.service.getValues(spreadsheetId, `${TABS.OPERATIONS}!A:M`);
    if (!rows || rows.length <= 1) return null;

    const dataRows = rows.slice(1);
    const matches: { op: CrmLeadOperation; rowIndex: number }[] = [];

    dataRows.forEach((row, i) => {
      if (row.length === 0 || !row[0] || row[0].trim() === '') return;
      if (row[0].trim() === leadId) {
        matches.push({
          op: this.mapRowToOperation(row),
          rowIndex: i + 2, // Row index in spreadsheet (1-indexed, +1 for header)
        });
      }
    });

    if (matches.length > 1) {
      throw new Error(`DUPLICATE_OPERATIONS_RECORD: Multiple operations records found for lead_id: ${leadId}`);
    }

    return matches[0] || null;
  }

  async getOperationByLeadId(leadId: string): Promise<CrmLeadOperation | null> {
    noStore();
    await this.ensureValidated();
    const result = await this.getOperationWithRowIndex(leadId);
    return result ? result.op : null;
  }

  async listOperations(filters?: OperationsFilters): Promise<CrmLeadOperation[]> {
    noStore();
    await this.ensureValidated();
    const spreadsheetId = this.getSpreadsheetId();

    const rows = await this.service.getValues(spreadsheetId, `${TABS.OPERATIONS}!A:M`);
    if (!rows || rows.length <= 1) return [];

    const dataRows = rows.slice(1);
    let list: CrmLeadOperation[] = [];

    const leadIdsSeen = new Set<string>();

    for (const row of dataRows) {
      if (row.length === 0 || !row[0] || row[0].trim() === '') continue;
      const op = this.mapRowToOperation(row);

      if (leadIdsSeen.has(op.lead_id)) {
        throw new Error(`DUPLICATE_OPERATIONS_RECORD: Multiple operations records found for lead_id: ${op.lead_id}`);
      }
      leadIdsSeen.add(op.lead_id);
      list.push(op);
    }

    if (filters) {
      if (filters.crm_status) {
        list = list.filter((o) => o.crm_status === filters.crm_status);
      }
      if (filters.owner_email) {
        const normalizedFilter = filters.owner_email.trim().toLowerCase();
        list = list.filter((o) => {
          if (!o.owner_email) return false;
          return o.owner_email === normalizedFilter;
        });
      }
      if (filters.priority) {
        list = list.filter((o) => o.priority === filters.priority);
      }
      if (filters.next_action_due) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        list = list.filter((o) => {
          if (!o.next_action_at) return filters.next_action_due === 'none';
          const due = new Date(o.next_action_at);

          if (filters.next_action_due === 'today') {
            return due >= startOfToday && due <= endOfToday;
          }
          if (filters.next_action_due === 'overdue') {
            return due < startOfToday && o.crm_status !== 'won' && o.crm_status !== 'lost';
          }
          if (filters.next_action_due === 'future') {
            return due > endOfToday;
          }
          return true;
        });
      }
    }

    return list;
  }

  async upsertOperation(input: UpdateOperationInput, actorEmail: string): Promise<CrmLeadOperation> {
    noStore();
    await this.ensureValidated();
    const validated = UpdateOperationSchema.parse(input);
    const validatedActor = ActorEmailSchema.parse(actorEmail);
    const leadId = validated.lead_id;
    const now = new Date().toISOString();

    const spreadsheetId = this.getSpreadsheetId();

    const result = await this.getOperationWithRowIndex(leadId);
    const writeToken = randomUUID();
    const batchUpdates: { range: string; values: string[][] }[] = [];

    const activityRows = await this.service.getValues(spreadsheetId, `${TABS.ACTIVITY}!A:A`);
    let nextActivityRow = (activityRows?.length || 0) + 1;
    if (nextActivityRow <= 1) nextActivityRow = 2;

    if (result) {
      const { op: current, rowIndex } = result;

      if (current.version !== validated.expected_version) {
        throw new Error('CONCURRENCY_ERROR');
      }

      const updated = { ...current };
      const changes: { field: string; prev: string | null; next: string | null }[] = [];

      const updateField = <K extends keyof CrmLeadOperation>(
        field: K,
        nextVal: CrmLeadOperation[K]
      ) => {
        if (nextVal !== undefined && nextVal !== updated[field]) {
          changes.push({
            field: String(field),
            prev: updated[field] === null ? null : String(updated[field]),
            next: nextVal === null ? null : String(nextVal),
          });
          updated[field] = nextVal;
        }
      };

      if (validated.crm_status !== undefined) updateField('crm_status', validated.crm_status);
      if (validated.owner_email !== undefined) updateField('owner_email', validated.owner_email);
      if (validated.priority !== undefined) updateField('priority', validated.priority);
      if (validated.next_action_type !== undefined) updateField('next_action_type', validated.next_action_type);
      if (validated.next_action_at !== undefined) updateField('next_action_at', validated.next_action_at);
      if (validated.last_contact_at !== undefined) updateField('last_contact_at', validated.last_contact_at);
      if (validated.lost_reason !== undefined) updateField('lost_reason', validated.lost_reason);

      if (changes.length > 0) {
        updated.version += 1;
        updated.updated_at = now;
        updated.updated_by = validatedActor;
        updated.write_token = writeToken;

        const opRow = OPERATIONS_COLUMNS.map((col) => {
          const val = updated[col];
          return val === null || val === undefined ? '' : String(val);
        });

        batchUpdates.push({
          range: `${TABS.OPERATIONS}!A${rowIndex}:M${rowIndex}`,
          values: [opRow],
        });

        changes.forEach((change, index) => {
          const logEntryRow = [
            randomUUID(),
            leadId,
            `update_${change.field}`,
            change.prev || '',
            change.next || '',
            '',
            validatedActor,
            now
          ];
          batchUpdates.push({
            range: `${TABS.ACTIVITY}!A${nextActivityRow + index}:H${nextActivityRow + index}`,
            values: [logEntryRow],
          });
        });
      } else {
        return current;
      }
    } else {
      const newOp: CrmLeadOperation = {
        lead_id: leadId,
        crm_status: validated.crm_status || 'new',
        owner_email: validated.owner_email || null,
        priority: validated.priority || 'medium',
        next_action_type: validated.next_action_type || null,
        next_action_at: validated.next_action_at || null,
        last_contact_at: validated.last_contact_at || null,
        lost_reason: validated.lost_reason || null,
        version: 1,
        write_token: writeToken,
        created_at: now,
        updated_at: now,
        updated_by: validatedActor,
      };

      const opRows = await this.service.getValues(spreadsheetId, `${TABS.OPERATIONS}!A:A`);
      const nextOpRow = (opRows?.length || 0) + 1;
      if (nextOpRow <= 1) {
        throw new Error('CRM_SHEETS_SCHEMA_ERROR: LeadOperations sheet headers missing');
      }

      const opRow = OPERATIONS_COLUMNS.map((col) => {
        const val = newOp[col];
        return val === null || val === undefined ? '' : String(val);
      });

      batchUpdates.push({
        range: `${TABS.OPERATIONS}!A${nextOpRow}:M${nextOpRow}`,
        values: [opRow],
      });

      const logEntryRow = [
        randomUUID(),
        leadId,
        'create_operation',
        '',
        newOp.crm_status,
        '',
        validatedActor,
        now
      ];
      batchUpdates.push({
        range: `${TABS.ACTIVITY}!A${nextActivityRow}:H${nextActivityRow}`,
        values: [logEntryRow],
      });
    }

    await this.service.batchUpdate(spreadsheetId, batchUpdates);

    // Recheck with a fresh get to verify version and token write verification
    const freshOp = await this.getOperationByLeadId(leadId);
    if (!freshOp) {
      throw new Error(`CONCURRENCY_ERROR: Operation could not be retrieved after write for lead: ${leadId}`);
    }
    if (freshOp.write_token !== writeToken) {
      throw new Error(`CONCURRENCY_ERROR: Concurrent mutation detected. The write_token did not match for lead: ${leadId}`);
    }

    return freshOp;
  }

  async listNotes(leadId: string): Promise<CrmLeadNote[]> {
    noStore();
    await this.ensureValidated();
    const spreadsheetId = this.getSpreadsheetId();

    const rows = await this.service.getValues(spreadsheetId, `${TABS.NOTES}!A:F`);
    if (!rows || rows.length <= 1) return [];

    const dataRows = rows.slice(1);
    const list: CrmLeadNote[] = [];

    for (const row of dataRows) {
      if (row.length === 0 || !row[0] || row[0].trim() === '') continue;

      const getVal = (idx: number): string | null => {
        const val = row[idx];
        return val !== undefined && val.trim() !== '' ? val.trim() : null;
      };

      const id = getVal(0);
      const rowLeadId = getVal(1);
      const body = getVal(2);
      const created_by = getVal(3);
      const created_at = getVal(4);
      const updated_at = getVal(5);

      if (rowLeadId === leadId) {
        if (!id || !body || !created_by || !created_at || isNaN(Date.parse(created_at))) {
          throw new Error('CRM_INVALID_DATA_ERROR: LeadNotes row is corrupt');
        }
        list.push({
          id,
          lead_id: rowLeadId,
          body,
          created_by,
          created_at,
          updated_at,
        });
      }
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createNote(input: CreateNoteInput, actorEmail: string): Promise<CrmLeadNote> {
    noStore();
    await this.ensureValidated();
    const validated = CreateNoteSchema.parse(input);
    const validatedActor = ActorEmailSchema.parse(actorEmail);
    const leadId = validated.lead_id;
    const now = new Date().toISOString();

    const spreadsheetId = this.getSpreadsheetId();
    const noteId = randomUUID();

    const noteEntry: CrmLeadNote = {
      id: noteId,
      lead_id: leadId,
      body: validated.body,
      created_by: validatedActor,
      created_at: now,
      updated_at: null,
    };

    const noteRow = NOTES_COLUMNS.map((col) => {
      const val = noteEntry[col as keyof CrmLeadNote];
      return val === null || val === undefined ? '' : String(val);
    });

    const noteRows = await this.service.getValues(spreadsheetId, `${TABS.NOTES}!A:A`);
    const nextNoteRow = (noteRows?.length || 0) + 1;
    if (nextNoteRow <= 1) {
      throw new Error('CRM_SHEETS_SCHEMA_ERROR: LeadNotes sheet headers missing');
    }

    const activityRows = await this.service.getValues(spreadsheetId, `${TABS.ACTIVITY}!A:A`);
    const nextActivityRow = (activityRows?.length || 0) + 1;
    if (nextActivityRow <= 1) {
      throw new Error('CRM_SHEETS_SCHEMA_ERROR: ActivityLog sheet headers missing');
    }

    const logEntryRow = [
      randomUUID(),
      leadId,
      'add_note',
      '',
      'Nota agregada',
      JSON.stringify({ note_id: noteId }),
      validatedActor,
      now
    ];

    const batchUpdates = [
      {
        range: `${TABS.NOTES}!A${nextNoteRow}:F${nextNoteRow}`,
        values: [noteRow],
      },
      {
        range: `${TABS.ACTIVITY}!A${nextActivityRow}:H${nextActivityRow}`,
        values: [logEntryRow],
      }
    ];

    await this.service.batchUpdate(spreadsheetId, batchUpdates);

    return noteEntry;
  }

  async listActivity(leadId: string): Promise<CrmActivityLog[]> {
    noStore();
    await this.ensureValidated();
    const spreadsheetId = this.getSpreadsheetId();

    const rows = await this.service.getValues(spreadsheetId, `${TABS.ACTIVITY}!A:H`);
    if (!rows || rows.length <= 1) return [];

    const dataRows = rows.slice(1);
    const list: CrmActivityLog[] = [];

    for (const row of dataRows) {
      if (row.length === 0 || !row[0] || row[0].trim() === '') continue;

      const getVal = (idx: number): string | null => {
        const val = row[idx];
        return val !== undefined && val.trim() !== '' ? val.trim() : null;
      };

      const id = getVal(0);
      const rowLeadId = getVal(1);
      const action_type = getVal(2);
      const previous_value = getVal(3);
      const new_value = getVal(4);
      const metadata = getVal(5);
      const created_by = getVal(6);
      const created_at = getVal(7);

      if (rowLeadId === leadId) {
        if (!id || !action_type || !created_by || !created_at || isNaN(Date.parse(created_at))) {
          throw new Error('CRM_INVALID_DATA_ERROR: ActivityLog row is corrupt');
        }

        if (metadata) {
          try {
            JSON.parse(metadata);
          } catch {
            throw new Error(`CRM_INVALID_DATA_ERROR: ActivityLog metadata is not a valid JSON string: ${metadata}`);
          }
        }

        list.push({
          id,
          lead_id: rowLeadId,
          action_type,
          previous_value,
          new_value,
          metadata,
          created_by,
          created_at,
        });
      }
    }

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}
