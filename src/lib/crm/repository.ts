import 'server-only';
import { DashboardMetrics, LeadFilters, LeadDetail, PaginatedLeads } from './types';

export interface CrmRepository {
  listLeads(filters: LeadFilters): Promise<PaginatedLeads>;
  getLeadById(leadId: string): Promise<LeadDetail | null>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

/**
 * Factory that returns the repository implementation matching the CRM_DATA_MODE.
 */
export async function getCrmRepository(): Promise<CrmRepository> {
  const mode = process.env.CRM_DATA_MODE;

  if (mode === 'sheets') {
    const { GoogleSheetsCrmRepository } = await import('./google-sheets-repository');
    return new GoogleSheetsCrmRepository();
  }

  if (mode === 'mock' || !mode) {
    const { MockCrmRepository } = await import('./mock-repository');
    return new MockCrmRepository();
  }

  throw new Error(`Invalid CRM_DATA_MODE: "${mode}". Allowed values: "mock", "sheets".`);
}
