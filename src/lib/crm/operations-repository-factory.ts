import 'server-only';
import { CrmOperationsRepository } from './operations-repository';

export async function getCrmOperationsRepository(): Promise<CrmOperationsRepository> {
  const mode = process.env.CRM_OPERATIONS_MODE;
  const isProd = process.env.NODE_ENV === 'production';

  if (mode === 'sheets') {
    throw new Error('GoogleSheetsOperationsRepository is not implemented in Subphase 2.0.');
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
