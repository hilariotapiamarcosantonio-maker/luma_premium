import 'server-only';
import { CrmOperationsRepository } from './operations-repository';

export async function getCrmOperationsRepository(): Promise<CrmOperationsRepository> {
  const mode = process.env.CRM_OPERATIONS_MODE;
  const isProd = process.env.NODE_ENV === 'production';

  if (mode === 'sheets') {
    const spreadsheetId = process.env.LUMA_CRM_OPS_SPREADSHEET_ID;
    if (!spreadsheetId || spreadsheetId.trim() === '') {
      throw new Error('GcpConfigError: Missing environment variable LUMA_CRM_OPS_SPREADSHEET_ID for sheets mode.');
    }
    const { GoogleSheetsOperationsRepository } = await import('./google-sheets-operations-repository');
    return new GoogleSheetsOperationsRepository();
  }

  if (mode === 'mock') {
    const { MockOperationsRepository } = await import('./mock-operations-repository');
    return new MockOperationsRepository();
  }

  if (!mode || mode.trim() === '') {
    if (isProd) {
      throw new Error('CRM_OPERATIONS_MODE must be explicitly configured in production.');
    }
    const { MockOperationsRepository } = await import('./mock-operations-repository');
    return new MockOperationsRepository();
  }

  throw new Error(`Invalid CRM_OPERATIONS_MODE: "${mode}". Allowed values: "mock", "sheets".`);
}
