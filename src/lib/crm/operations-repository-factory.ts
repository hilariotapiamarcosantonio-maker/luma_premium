import 'server-only';
import { CrmOperationsRepository } from './operations-repository';

export async function getCrmOperationsRepository(): Promise<CrmOperationsRepository> {
  const mode = process.env.CRM_OPERATIONS_MODE;

  if (mode === 'sheets') {
    // Placeholder to prevent compile-time errors since google-sheets-operations-repository is not created yet
    throw new Error('GoogleSheetsOperationsRepository is not implemented in Subphase 2.0.');
  }

  if (mode === 'mock' || !mode) {
    const { MockOperationsRepository } = await import('./mock-operations-repository');
    return new MockOperationsRepository();
  }

  throw new Error(`Invalid CRM_OPERATIONS_MODE: "${mode}". Allowed values: "mock", "sheets".`);
}
