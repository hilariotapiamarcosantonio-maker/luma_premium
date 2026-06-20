import 'server-only';
import { CrmRepository } from './repository';
import { CrmOperationsRepository } from './operations-repository';
import { LeadDetail, LeadFilters } from './types';
import {
  CrmLeadOperation,
  OperationsFilters,
  CrmStatus,
  CrmPriority
} from './operations-types';

export interface CrmLead extends LeadDetail {
  crm_status: CrmStatus;
  owner_email: string | null;
  priority: CrmPriority;
  next_action_type: string | null;
  next_action_at: string | null;
  last_contact_at: string | null;
  lost_reason: string | null;
  version: number;
  write_token: string | null;
  operational_updated_at: string;
  operational_updated_by: string;
}

export class CrmLeadService {
  constructor(
    private captureRepo: CrmRepository,
    private operationsRepo: CrmOperationsRepository
  ) {}

  /**
   * Merges a capture LeadDetail with its CrmLeadOperation.
   */
  private mergeData(lead: LeadDetail, operation: CrmLeadOperation | null): CrmLead {
    if (!operation) {
      return {
        ...lead,
        crm_status: 'new',
        owner_email: null,
        priority: 'medium',
        next_action_type: null,
        next_action_at: null,
        last_contact_at: null,
        lost_reason: null,
        version: 1,
        write_token: null,
        operational_updated_at: lead.created_at,
        operational_updated_by: 'system',
      };
    }

    return {
      ...lead,
      crm_status: operation.crm_status,
      owner_email: operation.owner_email,
      priority: operation.priority,
      next_action_type: operation.next_action_type,
      next_action_at: operation.next_action_at,
      last_contact_at: operation.last_contact_at,
      lost_reason: operation.lost_reason,
      version: operation.version,
      write_token: operation.write_token,
      operational_updated_at: operation.updated_at,
      operational_updated_by: operation.updated_by,
    };
  }

  /**
   * Retrieves a single lead by its ID, merging capture and operational data.
   */
  async getLeadById(leadId: string): Promise<CrmLead | null> {
    const lead = await this.captureRepo.getLeadById(leadId);
    if (!lead) return null;

    const operation = await this.operationsRepo.getOperationByLeadId(leadId);
    return this.mergeData(lead, operation);
  }

  /**
   * Lists and paginates leads, applying filters from both capture and operational layers.
   */
  async listLeads(
    filters: LeadFilters & OperationsFilters
  ): Promise<{
    leads: CrmLead[];
    totalCount: number;
    page: number;
    page_size: number;
    totalPages: number;
  }> {
    // 1. Fetch all leads from the capture repository (since Sheets requires full read anyway)
    // We pass page: 1, page_size: 100000 to bypass the capture repository's built-in pagination
    const captureResult = await this.captureRepo.listLeads({
      ...filters,
      page: 1,
      page_size: 100000,
    });

    const captureLeads = captureResult.leads;

    // 2. Fetch all operational details
    const operations = await this.operationsRepo.listOperations();
    const opsMap = new Map<string, CrmLeadOperation>();
    operations.forEach((op) => {
      opsMap.set(op.lead_id, op);
    });

    // 3. Merge capture data and operational data
    let mergedLeads = captureLeads.map((lead) => {
      const op = opsMap.get(lead.id) || null;
      return this.mergeData(lead, op);
    });

    // 4. Apply operational filters in memory
    if (filters.crm_status) {
      mergedLeads = mergedLeads.filter((l) => l.crm_status === filters.crm_status);
    }
    if (filters.owner_email) {
      const filterEmail = filters.owner_email.trim().toLowerCase();
      mergedLeads = mergedLeads.filter((l) => l.owner_email === filterEmail);
    }
    if (filters.priority) {
      mergedLeads = mergedLeads.filter((l) => l.priority === filters.priority);
    }
    if (filters.next_action_due) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      mergedLeads = mergedLeads.filter((l) => {
        if (!l.next_action_at) return filters.next_action_due === 'none';
        const due = new Date(l.next_action_at);

        if (filters.next_action_due === 'today') {
          return due >= startOfToday && due <= endOfToday;
        }
        if (filters.next_action_due === 'overdue') {
          return due < startOfToday && l.crm_status !== 'won' && l.crm_status !== 'lost';
        }
        if (filters.next_action_due === 'future') {
          return due > endOfToday;
        }
        return true;
      });
    }

    // 5. In-Memory Pagination
    const page = filters.page || 1;
    const page_size = filters.page_size || 25;
    const totalCount = mergedLeads.length;
    const totalPages = Math.ceil(totalCount / page_size);
    const startIdx = (page - 1) * page_size;
    const paginatedLeads = mergedLeads.slice(startIdx, startIdx + page_size);

    return {
      leads: paginatedLeads,
      totalCount,
      page,
      page_size,
      totalPages,
    };
  }
}
