import 'server-only';
import { google } from 'googleapis';
import { getGcpSheetsAuthClient, GcpConfigError, classifyGcpFailure } from '../google-auth';
import { CrmRepository } from './repository';
import { DashboardMetrics, LeadDetail, LeadFilters, PaginatedLeads } from './types';
import { generateLeadId } from './lead-identity';
import { SheetRowSchema } from './schemas';

// Column mapping ordered exactly from A to AC (29 columns)
const V2_COLUMNS: (keyof Omit<LeadDetail, 'id'>)[] = [
  'schema_version', 'created_at', 'locale', 'country',
  'full_name', 'email', 'phone', 'company', 'role',
  'industry', 'industry_detail', 'team_size', 'lead_volume',
  'acquisition_channels', 'advertising_status', 'current_tools',
  'main_bottleneck', 'desired_outcome', 'solution_interest',
  'timeline', 'investment_range',
  'source', 'page_origin',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'status',
];

export class GoogleSheetsCrmRepository implements CrmRepository {
  private async getSheetsClient() {
    const auth = await getGcpSheetsAuthClient();
    return google.sheets({ version: 'v4', auth });
  }

  private getSpreadsheetId(): string {
    const id = process.env.LUMA_LEADS_SPREADSHEET_ID;
    if (!id) throw new GcpConfigError(['LUMA_LEADS_SPREADSHEET_ID']);
    return id;
  }

  private getSheetName(): string {
    return process.env.LUMA_LEADS_SHEET_V2_NAME || 'Luma Leads V2';
  }

  /**
   * Fetches all leads from Google Sheets, maps them to LeadDetail, and returns them.
   * Performs validation and filters out corrupt rows safely.
   */
  private async fetchAllLeads(): Promise<LeadDetail[]> {
    const spreadsheetId = this.getSpreadsheetId();
    const sheetName = this.getSheetName();
    const sheets = await this.getSheetsClient();

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:AC`,
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) {
        return [];
      }

      const dataRows = rows.slice(1); // Exclude the header row

      const leads: LeadDetail[] = [];

      for (const row of dataRows) {
        // Map row array to object fields
        const mappedObj: Record<string, string> = {};
        V2_COLUMNS.forEach((colName, index) => {
          mappedObj[colName] = row[index] !== undefined ? String(row[index]) : '';
        });

        // Validate structure with Zod
        const result = SheetRowSchema.safeParse(mappedObj);
        if (!result.success) {
          // Skip corrupt rows to keep the CRM dashboard operational
          continue;
        }

        const validData = result.data;

        // Generate stable deterministic lead_id
        const id = generateLeadId({
          schema_version: validData.schema_version,
          created_at: validData.created_at,
          locale: validData.locale,
          email: validData.email,
          phone: validData.phone,
          company: validData.company,
        });

        leads.push({
          id,
          ...validData,
        });
      }

      return leads;
    } catch (err) {
      const failure = classifyGcpFailure(err);
      throw new Error(`Google Sheets fetch failed: ${failure.code} - ${failure.safeMessage}`);
    }
  }

  async listLeads(filters: LeadFilters): Promise<PaginatedLeads> {
    let all = await this.fetchAllLeads();

    // Filtering in-memory (Sheets has no native relational querying or pagination)
    if (filters.status) {
      all = all.filter((l) => l.status === filters.status);
    }
    if (filters.industry) {
      all = all.filter((l) => l.industry.toLowerCase().includes(filters.industry!.toLowerCase()));
    }
    if (filters.country) {
      all = all.filter((l) => l.country.toUpperCase() === filters.country!.toUpperCase());
    }
    if (filters.locale) {
      all = all.filter((l) => l.locale === filters.locale);
    }
    if (filters.investment_range) {
      all = all.filter((l) => l.investment_range === filters.investment_range);
    }
    if (filters.utm_campaign) {
      all = all.filter((l) => l.utm_campaign.toLowerCase() === filters.utm_campaign!.toLowerCase());
    }

    if (filters.date_from) {
      const fromTime = new Date(filters.date_from).getTime();
      all = all.filter((l) => new Date(l.created_at).getTime() >= fromTime);
    }
    if (filters.date_to) {
      const toTime = new Date(filters.date_to).getTime();
      all = all.filter((l) => new Date(l.created_at).getTime() <= toTime);
    }

    // Sort by created_at desc (newest first)
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Paginating in-memory at the repository layer before returning to server/browser
    const page = filters.page || 1;
    const pageSize = filters.page_size || 25;
    const totalCount = all.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedLeads = all.slice(startIdx, endIdx);

    return {
      leads: paginatedLeads,
      totalCount,
      page,
      page_size: pageSize,
      totalPages,
    };
  }

  async getLeadById(leadId: string): Promise<LeadDetail | null> {
    const all = await this.fetchAllLeads();
    return all.find((l) => l.id === leadId) || null;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const all = await this.fetchAllLeads();

    const totalLeads = all.length;
    const newLeads = all.filter((l) => l.status === 'nuevo').length;

    const localeMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const industryMap: Record<string, number> = {};
    const rangeMap: Record<string, number> = {};
    const campaignMap: Record<string, number> = {};

    all.forEach((l) => {
      localeMap[l.locale] = (localeMap[l.locale] || 0) + 1;
      countryMap[l.country || 'N/A'] = (countryMap[l.country || 'N/A'] || 0) + 1;
      industryMap[l.industry || 'N/A'] = (industryMap[l.industry || 'N/A'] || 0) + 1;
      rangeMap[l.investment_range || 'N/A'] = (rangeMap[l.investment_range || 'N/A'] || 0) + 1;
      if (l.utm_campaign) {
        campaignMap[l.utm_campaign] = (campaignMap[l.utm_campaign] || 0) + 1;
      }
    });

    const byLocale = Object.entries(localeMap).map(([locale, count]) => ({ locale, count }));
    const byCountry = Object.entries(countryMap).map(([country, count]) => ({ country, count }));
    const byIndustry = Object.entries(industryMap).map(([industry, count]) => ({ industry, count }));
    const byInvestmentRange = Object.entries(rangeMap).map(([range, count]) => ({ range, count }));
    const byCampaign = Object.entries(campaignMap).map(([campaign, count]) => ({ campaign, count }));

    // Recent 5 leads
    const recentLeads = [...all]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalLeads,
      newLeads,
      byLocale,
      byCountry,
      byIndustry,
      byInvestmentRange,
      byCampaign,
      recentLeads,
    };
  }
}
