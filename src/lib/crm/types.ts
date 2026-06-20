export type LeadPlatform =
  | 'meta'
  | 'google'
  | 'linkedin'
  | 'tiktok'
  | 'web'
  | 'whatsapp'
  | 'referral'
  | 'outbound'
  | 'manual'
  | 'other';

export type LeadChannel =
  | 'paid_social'
  | 'paid_search'
  | 'organic_social'
  | 'organic_search'
  | 'direct'
  | 'referral'
  | 'partner'
  | 'outbound'
  | 'unknown';

export interface LeadFilters {
  status?: string;
  industry?: string;
  country?: string;
  locale?: 'es' | 'en';
  investment_range?: string;
  utm_campaign?: string;
  platform?: string;
  channel?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface LeadDetail {
  id: string; // The lead_id (based on source_fingerprint)
  schema_version: string;
  created_at: string;
  locale: 'es' | 'en';
  country: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  industry: string;
  industry_detail: string;
  team_size: string;
  lead_volume: string;
  acquisition_channels: string;
  advertising_status: string;
  current_tools: string;
  main_bottleneck: string;
  desired_outcome: string;
  solution_interest: string;
  timeline: string;
  investment_range: string;
  source: string;
  page_origin: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  status: string;
  
  // Normalized & attribution layer (Fase 1.5)
  platform: LeadPlatform;
  channel: LeadChannel;
  raw_investment_range: string;
  raw_industry: string;
  raw_country: string;
  raw_source: string;
  raw_utm_source: string;
  raw_utm_medium: string;
  raw_utm_campaign: string;
  raw_page_origin: string;
}

export interface PaginatedLeads {
  leads: LeadDetail[];
  totalCount: number;
  page: number;
  page_size: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  leadsWithPhone: number;
  leadsWithBudget: number;
  byLocale: { locale: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byIndustry: { industry: string; count: number }[];
  byInvestmentRange: { range: string; count: number }[];
  byCampaign: { campaign: string; count: number }[];
  byPlatform: { platform: string; count: number }[];
  byChannel: { channel: string; count: number }[];
  recentLeads: LeadDetail[];
}

