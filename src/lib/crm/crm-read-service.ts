import 'server-only';
import { getCrmRepository } from './repository';
import { getCrmOperationsRepository } from './operations-repository-factory';
import type { CrmRepository } from './repository';
import type { CrmOperationsRepository } from './operations-repository';
import type { LeadDetail, DashboardMetrics } from './types';
import type { CrmStatus, CrmPriority, CrmLeadOperation } from './operations-types';
import type { CrmLeadReadFilters } from './schemas';

export interface CrmLeadReadModel extends LeadDetail {
  crm_status: CrmStatus;
  priority: CrmPriority | null;
  owner_email: string | null;
  next_action_type: string | null;
  next_action_at: string | null;
}

export interface CrmDashboardMetrics extends DashboardMetrics {
  byCrmStatus: Record<CrmStatus, number>;
}

export class CrmReadService {
  constructor(
    private leadRepo: CrmRepository,
    private opsRepo: CrmOperationsRepository
  ) {}

  /**
   * Helper to merge a lead with its operation details.
   */
  private mergeLeadWithOperation(
    lead: LeadDetail,
    op: CrmLeadOperation | null
  ): CrmLeadReadModel {
    return {
      ...lead,
      crm_status: op ? op.crm_status : 'new',
      priority: op ? op.priority : null,
      owner_email: op ? op.owner_email : null,
      next_action_type: op ? op.next_action_type : null,
      next_action_at: op ? op.next_action_at : null,
    };
  }

  /**
   * Helper to load all source leads page by page (max page size 100).
   */
  private async listAllSourceLeads(
    filters: Partial<CrmLeadReadFilters> = {}
  ): Promise<LeadDetail[]> {
    const allLeads: LeadDetail[] = [];
    let page = 1;
    const pageSize = 100;

    // We strip status because status is operational and should not be passed to the source repository.
    // We also strip page and page_size since we are paginating internally to accumulate all leads.
    const queryFilters = {
      ...filters,
      status: undefined,
      page,
      page_size: pageSize,
    };

    while (true) {
      queryFilters.page = page;
      const res = await this.leadRepo.listLeads(queryFilters);

      if (!res.leads || res.leads.length === 0) {
        break;
      }

      allLeads.push(...res.leads);

      if (page >= res.totalPages || allLeads.length >= res.totalCount) {
        break;
      }

      page++;
    }

    return allLeads;
  }

  /**
   * Lists leads, combining them in-memory with operational details.
   * Applies status filter, computes total count, and then paginates.
   */
  async listLeads(filters: CrmLeadReadFilters): Promise<{
    leads: CrmLeadReadModel[];
    totalCount: number;
    page: number;
    page_size: number;
    totalPages: number;
  }> {
    // 1. Fetch all source leads (bypassing operational status filtering)
    const rawLeads = await this.listAllSourceLeads(filters);

    // 2. Fetch operations (exactly once per invocation)
    const operations = await this.opsRepo.listOperations({});
    const opsMap = new Map<string, CrmLeadOperation>();
    operations.forEach((op) => {
      opsMap.set(op.lead_id, op);
    });

    // 3. Merge capture data and operational data
    let mergedLeads: CrmLeadReadModel[] = rawLeads.map((lead) => {
      const op = opsMap.get(lead.id) || null;
      return this.mergeLeadWithOperation(lead, op);
    });

    // 4. Apply crm_status filter in memory
    if (filters.status) {
      mergedLeads = mergedLeads.filter((l) => l.crm_status === filters.status);
    }

    // 5. In-Memory Pagination after filtering
    const page = filters.page || 1;
    const pageSize = filters.page_size || 25;
    const totalCount = mergedLeads.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIdx = (page - 1) * pageSize;
    const paginatedLeads = mergedLeads.slice(startIdx, startIdx + pageSize);

    return {
      leads: paginatedLeads,
      totalCount,
      page,
      page_size: pageSize,
      totalPages,
    };
  }

  /**
   * Retrieves a single lead by ID, merging its operational data.
   */
  async getLeadById(leadId: string): Promise<CrmLeadReadModel | null> {
    const lead = await this.leadRepo.getLeadById(leadId);
    if (!lead) return null;

    // Fetch operation for a single lead (exactly once)
    const op = await this.opsRepo.getOperationByLeadId(leadId);
    return this.mergeLeadWithOperation(lead, op);
  }

  /**
   * Retrieves unique campaign names from the source capture repository without calling listOperations.
   */
  async getSourceCampaignOptions(): Promise<string[]> {
    const metrics = await this.leadRepo.getDashboardMetrics();
    const campaigns = metrics.byCampaign
      .map((item) => item.campaign)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');
    return Array.from(new Set(campaigns)).sort();
  }

  /**
   * Computes dashboard metrics, combining all leads and operations.
   */
  async getDashboardMetrics(): Promise<CrmDashboardMetrics> {
    // 1. Fetch all leads from the capture repository
    const rawLeads = await this.listAllSourceLeads({});

    // 2. Fetch all operations (exactly once)
    const operations = await this.opsRepo.listOperations({});
    const opsMap = new Map<string, CrmLeadOperation>();
    operations.forEach((op) => {
      opsMap.set(op.lead_id, op);
    });

    // 3. Initialize byCrmStatus record with all 9 states
    const byCrmStatus: Record<CrmStatus, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      meeting_scheduled: 0,
      proposal_sent: 0,
      negotiation: 0,
      won: 0,
      lost: 0,
      nurture: 0,
    };

    // 4. Merge and count
    const mergedLeads: CrmLeadReadModel[] = rawLeads.map((lead) => {
      const op = opsMap.get(lead.id) || null;
      const merged = this.mergeLeadWithOperation(lead, op);

      if (merged.crm_status in byCrmStatus) {
        byCrmStatus[merged.crm_status]++;
      }

      return merged;
    });

    const totalLeads = mergedLeads.length;
    const newLeads = byCrmStatus.new;

    const leadsWithPhone = mergedLeads.filter((l) => l.phone && l.phone.trim() !== '').length;
    const leadsWithBudget = mergedLeads.filter((l) => l.investment_range && l.investment_range !== 'Necesito diagnóstico antes de definirlo').length;

    const localeMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const industryMap: Record<string, number> = {};
    const rangeMap: Record<string, number> = {};
    const campaignMap: Record<string, number> = {};
    const platformMap: Record<string, number> = {};
    const channelMap: Record<string, number> = {};

    mergedLeads.forEach((l) => {
      localeMap[l.locale] = (localeMap[l.locale] || 0) + 1;
      countryMap[l.country || 'N/A'] = (countryMap[l.country || 'N/A'] || 0) + 1;
      industryMap[l.industry || 'N/A'] = (industryMap[l.industry || 'N/A'] || 0) + 1;
      rangeMap[l.investment_range || 'N/A'] = (rangeMap[l.investment_range || 'N/A'] || 0) + 1;
      platformMap[l.platform || 'other'] = (platformMap[l.platform || 'other'] || 0) + 1;
      channelMap[l.channel || 'unknown'] = (channelMap[l.channel || 'unknown'] || 0) + 1;
      if (l.utm_campaign) {
        campaignMap[l.utm_campaign] = (campaignMap[l.utm_campaign] || 0) + 1;
      }
    });

    const byLocale = Object.entries(localeMap).map(([locale, count]) => ({ locale, count }));
    const byCountry = Object.entries(countryMap).map(([country, count]) => ({ country, count }));
    const byIndustry = Object.entries(industryMap).map(([industry, count]) => ({ industry, count }));
    const byInvestmentRange = Object.entries(rangeMap).map(([range, count]) => ({ range, count }));
    const byCampaign = Object.entries(campaignMap).map(([campaign, count]) => ({ campaign, count }));
    const byPlatform = Object.entries(platformMap).map(([platform, count]) => ({ platform, count }));
    const byChannel = Object.entries(channelMap).map(([channel, count]) => ({ channel, count }));

    // Recent 5 leads sorted by created_at desc
    const recentLeads = [...mergedLeads]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalLeads,
      newLeads,
      leadsWithPhone,
      leadsWithBudget,
      byLocale,
      byCountry,
      byIndustry,
      byInvestmentRange,
      byCampaign,
      byPlatform,
      byChannel,
      recentLeads: recentLeads as LeadDetail[],
      byCrmStatus,
    };
  }
}

/**
 * Factory helper for CrmReadService.
 */
export async function getCrmReadService(): Promise<CrmReadService> {
  const leadRepo = await getCrmRepository();
  const opsRepo = await getCrmOperationsRepository();
  return new CrmReadService(leadRepo, opsRepo);
}
