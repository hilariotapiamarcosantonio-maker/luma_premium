import 'server-only';
import { google } from 'googleapis';
import { getGcpSheetsAuthClient, GcpConfigError, classifyGcpFailure } from '../google-auth';
import { CrmRepository } from './repository';
import { DashboardMetrics, LeadDetail, LeadFilters, PaginatedLeads } from './types';
import { generateLeadId, isValidLeadId } from './lead-identity';
import { SheetRowSchema } from './schemas';
import {
  fixUtf8Encoding,
  normalizeCountryCode,
  normalizeInvestmentRange,
  normalizeIndustry,
  normalizeAttribution,
} from './normalizers';

// Column mapping ordered exactly from A to AC (29 columns)
export const V2_COLUMNS: (keyof Omit<LeadDetail, 'id' | 'platform' | 'channel' | 'raw_investment_range' | 'raw_industry' | 'raw_country' | 'raw_source' | 'raw_utm_source' | 'raw_utm_medium' | 'raw_utm_campaign' | 'raw_page_origin'>)[] = [
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

/**
 * Validates that Google Sheets headers match the expected schema (quantity, name, and position).
 */
export function validateSheetHeaders(headers: string[]): boolean {
  if (headers.length !== V2_COLUMNS.length) {
    return false;
  }
  for (let i = 0; i < V2_COLUMNS.length; i++) {
    if (String(headers[i]).trim() !== V2_COLUMNS[i]) {
      return false;
    }
  }
  return true;
}

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
      if (!rows || rows.length === 0) {
        return [];
      }

      // Strict validation of the columns/headers (quantity, name, and position in A:AC)
      const headers = rows[0] || [];
      if (!validateSheetHeaders(headers)) {
        console.error('CRM_SHEET_SCHEMA_MISMATCH');
        throw new Error('El esquema de la hoja de cálculo es incompatible con el sistema.');
      }

      if (rows.length <= 1) {
        return [];
      }

      const dataRows = rows.slice(1); // Exclude the header row
      const leads: LeadDetail[] = [];

      for (const row of dataRows) {
        // Map row array to object fields and apply strict UTF-8 cleaning on the raw strings first
        const mappedObj: Record<string, string> = {};
        V2_COLUMNS.forEach((colName, index) => {
          const rawVal = row[index] !== undefined ? String(row[index]) : '';
          mappedObj[colName] = fixUtf8Encoding(rawVal);
        });

        // Validate structure with Zod
        const result = SheetRowSchema.safeParse(mappedObj);
        if (!result.success) {
          // Skip corrupt rows to keep the CRM dashboard operational
          continue;
        }

        const validData = result.data;

        // Extract raw fields before normalization
        const raw_investment_range = validData.investment_range;
        const raw_industry = validData.industry;
        const raw_country = validData.country;
        const raw_source = validData.source;
        const raw_utm_source = validData.utm_source;
        const raw_utm_medium = validData.utm_medium;
        const raw_utm_campaign = validData.utm_campaign;
        const raw_page_origin = validData.page_origin;

        // Perform normalizations
        const normalizedCountry = normalizeCountryCode(validData.country);
        const normalizedRange = normalizeInvestmentRange(validData.investment_range);
        const normalizedInd = normalizeIndustry(validData.industry);

        const { platform, channel } = normalizeAttribution({
          utm_source: validData.utm_source,
          utm_medium: validData.utm_medium,
          utm_campaign: validData.utm_campaign,
          source: validData.source,
          page_origin: validData.page_origin,
          acquisition_channels: validData.acquisition_channels,
        });

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
          country: normalizedCountry,
          investment_range: normalizedRange,
          industry: normalizedInd,
          platform,
          channel,
          raw_investment_range,
          raw_industry,
          raw_country,
          raw_source,
          raw_utm_source,
          raw_utm_medium,
          raw_utm_campaign,
          raw_page_origin,
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
    if (filters.platform) {
      all = all.filter((l) => l.platform === filters.platform);
    }
    if (filters.channel) {
      all = all.filter((l) => l.channel === filters.channel);
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
    if (!isValidLeadId(leadId)) return null;
    const all = await this.fetchAllLeads();
    return all.find((l) => l.id === leadId) || null;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const all = await this.fetchAllLeads();

    const totalLeads = all.length;
    const newLeads = all.filter((l) => l.status === 'nuevo').length;
    
    // Real metrics computed on the fly
    const leadsWithPhone = all.filter((l) => l.phone && l.phone.trim() !== '').length;
    const leadsWithBudget = all.filter((l) => l.investment_range && l.investment_range !== 'Necesito diagnóstico antes de definirlo').length;

    const localeMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const industryMap: Record<string, number> = {};
    const rangeMap: Record<string, number> = {};
    const campaignMap: Record<string, number> = {};
    const platformMap: Record<string, number> = {};
    const channelMap: Record<string, number> = {};

    all.forEach((l) => {
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

    // Recent 5 leads
    const recentLeads = [...all]
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
      recentLeads,
    };
  }
}
