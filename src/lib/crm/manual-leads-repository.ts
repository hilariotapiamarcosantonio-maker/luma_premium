import 'server-only';
import { google } from 'googleapis';
import { getGcpSheetsAuthClient, classifyGcpFailure } from '../google-auth';
import { unstable_noStore as noStore } from 'next/cache';
import { mockOperations, mockNotes, mockLogs } from './mock-operations-repository';
import { CrmLeadOperation, CrmLeadNote, CrmActivityLog } from './operations-types';

export interface ManualLead {
  lead_id: string;
  full_name: string;
  phone: string;
  email: string;
  company: string;
  country: string;
  language: 'es' | 'en';
  industry: string;
  investment_range: string;
  capture_channel: string;
  campaign: string;
  source: string;
  capture_status: string;
  consent_to_contact: boolean;
  created_at: string;
  created_by: string;
  updated_at: string | null;
}

export interface ManualLeadsRepository {
  listManualLeads(): Promise<ManualLead[]>;
  getManualLeadById(leadId: string): Promise<ManualLead | null>;
  createManualLeadWithOperation(
    lead: ManualLead,
    op: CrmLeadOperation,
    activities: CrmActivityLog[],
    note: CrmLeadNote | null
  ): Promise<void>;
}

export const MANUAL_LEADS_COLUMNS = [
  'lead_id', 'full_name', 'phone', 'email', 'company', 'country',
  'language', 'industry', 'investment_range', 'capture_channel', 'campaign',
  'source', 'capture_status', 'consent_to_contact', 'created_at', 'created_by',
  'updated_at'
] as const;

function mapRowToRowData(row: string[]) {
  return {
    values: row.map((cell) => ({
      userEnteredValue: {
        stringValue: cell === null || cell === undefined ? '' : String(cell),
      },
    })),
  };
}

let globalValidationPromise: Promise<Record<string, number>> | null = null;

export function resetManualLeadsRepositoryValidation() {
  globalValidationPromise = null;
}

export class GoogleSheetsManualLeadsRepository implements ManualLeadsRepository {
  private sheetIds: Record<string, number> = {};

  private async getSheetsClient() {
    const auth = await getGcpSheetsAuthClient();
    return google.sheets({ version: 'v4', auth });
  }

  private getSpreadsheetId(): string {
    const id = process.env.LUMA_CRM_OPS_SPREADSHEET_ID;
    if (!id) {
      throw new Error('GcpConfigError: Missing environment variable LUMA_CRM_OPS_SPREADSHEET_ID');
    }
    return id;
  }

  private async ensureValidated(): Promise<void> {
    if (!globalValidationPromise) {
      globalValidationPromise = (async () => {
        try {
          const spreadsheetId = this.getSpreadsheetId();
          const sheets = await this.getSheetsClient();

          const requiredSheets = {
            'ManualLeads': [
              'lead_id', 'full_name', 'phone', 'email', 'company', 'country',
              'language', 'industry', 'investment_range', 'capture_channel', 'campaign',
              'source', 'capture_status', 'consent_to_contact', 'created_at', 'created_by',
              'updated_at'
            ],
            'LeadOperations': [
              'lead_id', 'crm_status', 'owner_email', 'priority', 'next_action_type',
              'next_action_at', 'last_contact_at', 'lost_reason', 'version', 'write_token',
              'created_at', 'updated_at', 'updated_by'
            ],
            'ActivityLog': [
              'id', 'lead_id', 'action_type', 'previous_value', 'new_value',
              'metadata', 'created_by', 'created_at'
            ],
            'LeadNotes': [
              'id', 'lead_id', 'body', 'created_by', 'created_at', 'updated_at'
            ]
          };

          // 1. Get spreadsheet metadata to check which tabs exist
          const metadata = await sheets.spreadsheets.get({ spreadsheetId });
          const sheetsMap: Record<string, number> = {};
          metadata.data.sheets?.forEach(s => {
            if (s.properties?.title && s.properties.sheetId !== undefined && s.properties.sheetId !== null) {
              sheetsMap[s.properties.title] = s.properties.sheetId as number;
            }
          });

          // 2. Validate or create required tabs
          for (const [title, expectedHeaders] of Object.entries(requiredSheets)) {
            let sheetId = sheetsMap[title];

            if (sheetId === undefined) {
              // Tab does not exist, create it (handles concurrent requests)
              try {
                const addRes = await sheets.spreadsheets.batchUpdate({
                  spreadsheetId,
                  requestBody: {
                    requests: [
                      {
                        addSheet: {
                          properties: { title }
                        }
                      }
                    ]
                  }
                });
                const newSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
                if (newSheetId === undefined || newSheetId === null) {
                  throw new Error(`Failed to get sheetId for newly created sheet ${title}`);
                }
                sheetId = newSheetId as number;
                sheetsMap[title] = sheetId;
              } catch (err: unknown) {
                const error = err as { message?: string; code?: number };
                // Handle concurrent creation if sheet was added by another process
                if (error?.message?.includes('already exists') || error?.code === 400) {
                  const newMeta = await sheets.spreadsheets.get({ spreadsheetId });
                  const found = newMeta.data.sheets?.find(s => s.properties?.title === title);
                  if (found && found.properties?.sheetId !== undefined && found.properties?.sheetId !== null) {
                    sheetId = found.properties.sheetId as number;
                    sheetsMap[title] = sheetId;
                  } else {
                    throw err;
                  }
                } else {
                  throw err;
                }
              }

              // Write initial headers
              await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${title}!A1:1`,
                valueInputOption: 'RAW',
                requestBody: {
                  values: [expectedHeaders]
                }
              });
            } else {
              // Read headers to check for mismatch
              const getRes = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${title}!A1:1`,
              });
              const headers = getRes.data.values?.[0];

              if (!headers || headers.length === 0) {
                // Tab exists but headers are missing/empty, write headers
                await sheets.spreadsheets.values.update({
                  spreadsheetId,
                  range: `${title}!A1:1`,
                  valueInputOption: 'RAW',
                  requestBody: {
                    values: [expectedHeaders]
                  }
                });
              } else {
                // Compare existing headers
                const cleanHeaders = headers.map(h => String(h).trim());
                let mismatch = false;
                if (cleanHeaders.length !== expectedHeaders.length) {
                  mismatch = true;
                } else {
                  for (let i = 0; i < expectedHeaders.length; i++) {
                    if (cleanHeaders[i] !== expectedHeaders[i]) {
                       mismatch = true;
                       break;
                    }
                  }
                }

                if (mismatch) {
                  throw new Error(`CRM_HEADER_MISMATCH: Encabezados incorrectos o incompatibles en la pestaña "${title}". Esperado: [${expectedHeaders.join(', ')}]. Recibido: [${cleanHeaders.join(', ')}].`);
                }
              }
            }
          }

          return sheetsMap;
        } catch (error) {
          globalValidationPromise = null;
          throw error;
        }
      })();
    }

    try {
      this.sheetIds = await globalValidationPromise;
    } catch (error) {
      globalValidationPromise = null;
      throw error;
    }
  }

  async listManualLeads(): Promise<ManualLead[]> {
    noStore();
    await this.ensureValidated();

    const spreadsheetId = this.getSpreadsheetId();
    const sheets = await this.getSheetsClient();

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'ManualLeads!A:Q',
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) return [];

      const dataRows = rows.slice(1);
      const list: ManualLead[] = [];

      for (const row of dataRows) {
        if (row.length === 0 || !row[0] || row[0].trim() === '') continue;

        const getVal = (idx: number): string | null => {
          const val = row[idx];
          return val !== undefined && val.trim() !== '' ? val.trim() : null;
        };

        const lead_id = getVal(0);
        const full_name = getVal(1);
        const phone = getVal(2);
        const email = getVal(3);
        const company = getVal(4);
        const country = getVal(5);
        const languageStr = getVal(6);
        const industry = getVal(7);
        const investment_range = getVal(8);
        const capture_channel = getVal(9);
        const campaign = getVal(10);
        const source = getVal(11);
        const capture_status = getVal(12);
        const consentStr = getVal(13);
        const created_at = getVal(14);
        const created_by = getVal(15);
        const updated_at = getVal(16);

        if (!lead_id || !full_name || (!phone && !email) || !created_at) {
          throw new Error('CRM_INVALID_DATA_ERROR: ManualLeads row is corrupt');
        }

        list.push({
          lead_id,
          full_name,
          phone: phone || '',
          email: email || '',
          company: company || '',
          country: country || '',
          language: (languageStr === 'en' ? 'en' : 'es') as 'es' | 'en',
          industry: industry || '',
          investment_range: investment_range || '',
          capture_channel: capture_channel || '',
          campaign: campaign || '',
          source: source || 'manual',
          capture_status: capture_status || 'manual',
          consent_to_contact: consentStr === 'true',
          created_at,
          created_by: created_by || '',
          updated_at: updated_at || null,
        });
      }

      return list;
    } catch (err) {
      const failure = classifyGcpFailure(err);
      throw new Error(`Google Sheets manual leads fetch failed: ${failure.code} - ${failure.safeMessage}`);
    }
  }

  async getManualLeadById(leadId: string): Promise<ManualLead | null> {
    const all = await this.listManualLeads();
    return all.find((l) => l.lead_id === leadId) || null;
  }

  async createManualLeadWithOperation(
    lead: ManualLead,
    op: CrmLeadOperation,
    activities: CrmActivityLog[],
    note: CrmLeadNote | null
  ): Promise<void> {
    noStore();
    await this.ensureValidated();

    const spreadsheetId = this.getSpreadsheetId();
    const sheets = await this.getSheetsClient();

    try {
      // 1. Prepare row values
      const leadRow = MANUAL_LEADS_COLUMNS.map((col) => {
        const val = lead[col as keyof ManualLead];
        return val === null || val === undefined ? '' : String(val);
      });

      const OPERATIONS_COLUMNS = [
        'lead_id', 'crm_status', 'owner_email', 'priority', 'next_action_type',
        'next_action_at', 'last_contact_at', 'lost_reason', 'version', 'write_token',
        'created_at', 'updated_at', 'updated_by'
      ] as const;

      const opRow = OPERATIONS_COLUMNS.map((col) => {
        const val = op[col as keyof CrmLeadOperation];
        return val === null || val === undefined ? '' : String(val);
      });

      const ACTIVITY_COLUMNS = [
        'id', 'lead_id', 'action_type', 'previous_value', 'new_value',
        'metadata', 'created_by', 'created_at'
      ] as const;

      const activityRows = activities.map((act) => {
        return ACTIVITY_COLUMNS.map((col) => {
          const val = act[col as keyof CrmActivityLog];
          return val === null || val === undefined ? '' : String(val);
        });
      });

      // 2. Build requests using appendCells to insert at the end of each sheet using sheetId
      const requests = [
        {
          appendCells: {
            sheetId: this.sheetIds['ManualLeads'],
            rows: [mapRowToRowData(leadRow)],
            fields: 'userEnteredValue',
          },
        },
        {
          appendCells: {
            sheetId: this.sheetIds['LeadOperations'],
            rows: [mapRowToRowData(opRow)],
            fields: 'userEnteredValue',
          },
        },
        {
          appendCells: {
            sheetId: this.sheetIds['ActivityLog'],
            rows: activityRows.map(mapRowToRowData),
            fields: 'userEnteredValue',
          },
        },
      ];

      if (note) {
        const NOTES_COLUMNS = [
          'id', 'lead_id', 'body', 'created_by', 'created_at', 'updated_at'
        ] as const;

        const noteRow = NOTES_COLUMNS.map((col) => {
          const val = note[col as keyof CrmLeadNote];
          return val === null || val === undefined ? '' : String(val);
        });

        requests.push({
          appendCells: {
            sheetId: this.sheetIds['LeadNotes'],
            rows: [mapRowToRowData(noteRow)],
            fields: 'userEnteredValue',
          },
        });
      }

      // 3. Execute all writes in a single batchUpdate call
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests,
        },
      });
    } catch (err) {
      const failure = classifyGcpFailure(err);
      throw new Error(`Google Sheets atomic manual lead creation failed: ${failure.code} - ${failure.safeMessage}`);
    }
  }
}

export class MockManualLeadsRepository implements ManualLeadsRepository {
  static mockLeads: ManualLead[] = [];

  static reset() {
    MockManualLeadsRepository.mockLeads = [];
  }

  async listManualLeads(): Promise<ManualLead[]> {
    return MockManualLeadsRepository.mockLeads.map((l) => ({ ...l }));
  }

  async getManualLeadById(leadId: string): Promise<ManualLead | null> {
    const found = MockManualLeadsRepository.mockLeads.find((l) => l.lead_id === leadId);
    return found ? { ...found } : null;
  }

  async createManualLeadWithOperation(
    lead: ManualLead,
    op: CrmLeadOperation,
    activities: CrmActivityLog[],
    note: CrmLeadNote | null
  ): Promise<void> {
    MockManualLeadsRepository.mockLeads.push({ ...lead });
    mockOperations.set(op.lead_id, { ...op });

    const logs = mockLogs.get(op.lead_id) || [];
    mockLogs.set(op.lead_id, [...logs, ...activities.map(a => ({ ...a }))]);

    if (note) {
      const notes = mockNotes.get(note.lead_id) || [];
      mockNotes.set(note.lead_id, [...notes, { ...note }]);
    }
  }
}

export async function getManualLeadsRepository(): Promise<ManualLeadsRepository> {
  const mode = process.env.CRM_OPERATIONS_MODE || 'mock';

  if (mode === 'sheets') {
    return new GoogleSheetsManualLeadsRepository();
  }

  return new MockManualLeadsRepository();
}
