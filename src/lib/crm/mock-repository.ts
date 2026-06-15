import 'server-only';
import { CrmRepository } from './repository';
import { DashboardMetrics, LeadDetail, LeadFilters, PaginatedLeads } from './types';
import { generateLeadId } from './lead-identity';

// Mock list of 35 synthetic leads to allow pagination testing (page size 25)
const MOCK_LEADS_RAW = [
  {
    schema_version: '2',
    created_at: '2026-06-01T10:00:00Z',
    locale: 'es' as const,
    country: 'ES',
    full_name: 'Alejandro Sanz',
    email: 'alejandro@proptech-es.com',
    phone: '+34 600 123 456',
    company: 'PropTech España',
    role: 'CEO',
    industry: 'Real Estate / Proptech',
    industry_detail: 'Consultoría inmobiliaria digital',
    team_size: '10-50',
    lead_volume: '50-100',
    acquisition_channels: 'LinkedIn, Google Ads',
    advertising_status: 'Investigando',
    current_tools: 'Excel',
    main_bottleneck: 'Falta de automatización y seguimiento comercial',
    desired_outcome: 'Implementar un CRM inteligente a medida',
    solution_interest: 'Luma Estate CRM OS',
    timeline: '1 mes',
    investment_range: '5k-10k',
    source: 'diagnostico',
    page_origin: 'https://www.lumapremium.com/diagnostico',
    utm_source: 'linkedin',
    utm_medium: 'cpc',
    utm_campaign: 'proptech-es-campaign',
    utm_content: 'video-ad',
    utm_term: 'real-estate-crm',
    status: 'nuevo',
  },
  {
    schema_version: '2',
    created_at: '2026-06-02T14:30:00Z',
    locale: 'en' as const,
    country: 'US',
    full_name: 'John Miller',
    email: 'john.miller@luxuryre.com',
    phone: '+1 (305) 555-0199',
    company: 'Luxury Real Estate Miami',
    role: 'Director of Sales',
    industry: 'High-Ticket Brokerage',
    industry_detail: 'Residential luxury sales',
    team_size: '1-10',
    lead_volume: '10-50',
    acquisition_channels: 'Referrals, Instagram',
    advertising_status: 'Inversión Activa',
    current_tools: 'Salesforce (Too complex)',
    main_bottleneck: 'Inefficient high-ticket qualification lead flow',
    desired_outcome: 'High-end diagnostic landing pages and automated pre-qualification',
    solution_interest: 'Luma Estate Concierge OS',
    timeline: 'Inmediato',
    investment_range: '10k-25k',
    source: 'assessment',
    page_origin: 'https://www.lumapremium.com/en/assessment',
    utm_source: 'google',
    utm_medium: 'search',
    utm_campaign: 'miami-luxury-sales',
    utm_content: 'text-ad-1',
    utm_term: 'luxury-crm',
    status: 'nuevo',
  },
  {
    schema_version: '2',
    created_at: '2026-06-03T09:15:00Z',
    locale: 'es' as const,
    country: 'MX',
    full_name: 'Laura González',
    email: 'laura@inmuebles-capital.mx',
    phone: '+52 55 1234 5678',
    company: 'Inmuebles Capital',
    role: 'Co-Founder',
    industry: 'Real Estate / Proptech',
    industry_detail: 'Desarrollo de condominios residenciales',
    team_size: '50-200',
    lead_volume: '100-500',
    acquisition_channels: 'Facebook, Google',
    advertising_status: 'Inversión Activa',
    current_tools: 'Hubspot',
    main_bottleneck: 'Silos de información entre marketing y el equipo comercial',
    desired_outcome: 'Sincronizar leads calificados directamente con WhatsApp y Sheets',
    solution_interest: 'Luma Estate OS',
    timeline: '3 meses',
    investment_range: '25k+',
    source: 'diagnostico',
    page_origin: 'https://www.lumapremium.com/diagnostico',
    utm_source: 'facebook',
    utm_medium: 'paid',
    utm_campaign: 'condo-launch-mx',
    utm_content: 'carousel-ad',
    utm_term: '',
    status: 'nuevo',
  },
  {
    schema_version: '2',
    created_at: '2026-06-04T16:45:00Z',
    locale: 'en' as const,
    country: 'UK',
    full_name: 'Sarah Jenkins',
    email: 'sarah@londonpenthouses.co.uk',
    phone: '+44 7911 123456',
    company: 'London Penthouses',
    role: 'Marketing Manager',
    industry: 'High-Ticket Brokerage',
    industry_detail: 'Prime London residential',
    team_size: '1-10',
    lead_volume: '0-10',
    acquisition_channels: 'SEO, Direct',
    advertising_status: 'Investigando',
    current_tools: 'None',
    main_bottleneck: 'Manual operations and losing track of high-net-worth buyers',
    desired_outcome: 'Build a premium interactive pre-qualification workflow',
    solution_interest: 'Luma Estate Concierge OS',
    timeline: '2 semanas',
    investment_range: '10k-25k',
    source: 'assessment',
    page_origin: 'https://www.lumapremium.com/en/assessment',
    utm_source: 'direct',
    utm_medium: 'organic',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    status: 'nuevo',
  },
  {
    schema_version: '2',
    created_at: '2026-06-05T11:20:00Z',
    locale: 'es' as const,
    country: 'CO',
    full_name: 'Carlos Vargas',
    email: 'carlos@vargasconstructora.co',
    phone: '', // Empty phone test
    company: 'Constructora Vargas',
    role: 'Gerente General',
    industry: 'Desarrolladora Inmobiliaria',
    industry_detail: 'Edificios residenciales de interés social',
    team_size: '50-200',
    lead_volume: '500+',
    acquisition_channels: 'Radio, Facebook Ads',
    advertising_status: 'Inversión Activa',
    current_tools: 'CRM propio desactualizado',
    main_bottleneck: 'Baja conversión de leads de pauta publicitaria digital',
    desired_outcome: 'Estructurar un embudo omnicanal automatizado',
    solution_interest: 'Luma Estate OS',
    timeline: '1 mes',
    investment_range: '5k-10k',
    source: 'diagnostico',
    page_origin: 'https://www.lumapremium.com/diagnostico',
    utm_source: 'facebook',
    utm_medium: 'ads',
    utm_campaign: 'viviendas-sociales-col',
    utm_content: 'banner',
    utm_term: '',
    status: 'nuevo',
  },
  // Incomplete record test
  {
    schema_version: '2',
    created_at: '2026-06-06T18:10:00Z',
    locale: 'es' as const,
    country: 'ES',
    full_name: 'María López',
    email: '', // Empty email test
    phone: '+34 611 222 333',
    company: 'López Brokers',
    role: 'Agente Independiente',
    industry: 'Broker Independiente',
    industry_detail: '',
    team_size: '1-10',
    lead_volume: '10-50',
    acquisition_channels: 'Boca a boca',
    advertising_status: 'No invertimos',
    current_tools: 'Ninguno',
    main_bottleneck: 'Demasiado tiempo administrando leads en WhatsApp manualmente',
    desired_outcome: 'Organizar mis contactos comerciales automáticamente',
    solution_interest: 'Luma Estate CRM OS',
    timeline: '3 meses',
    investment_range: '1k-5k',
    source: 'diagnostico',
    page_origin: 'https://www.lumapremium.com/diagnostico',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    status: 'nuevo',
  },
];

// Generate 30 more simple leads dynamically to enable pagination
for (let i = 1; i <= 30; i++) {
  const dayStr = String(7 + Math.floor(i / 3)).padStart(2, '0');
  const localeVal = i % 2 === 0 ? ('es' as const) : ('en' as const);
  const countryVal = i % 2 === 0 ? 'MX' : 'US';
  const nameVal = localeVal === 'es' ? `Lead de Prueba ${i}` : `Test Lead ${i}`;
  const industryVal = i % 3 === 0 ? 'Real Estate / Proptech' : 'High-Ticket Brokerage';
  const rangeVal = i % 4 === 0 ? '25k+' : i % 4 === 1 ? '10k-25k' : '5k-10k';
  const campaignVal = i % 5 === 0 ? 'general-promo' : '';

  MOCK_LEADS_RAW.push({
    schema_version: '2',
    created_at: `2026-06-${dayStr}T12:00:00Z`,
    locale: localeVal,
    country: countryVal,
    full_name: nameVal,
    email: `test${i}@example.com`,
    phone: `+1 555 010${i}`,
    company: `Company Test ${i}`,
    role: 'Manager',
    industry: industryVal,
    industry_detail: 'Dynamic testing data',
    team_size: '1-10',
    lead_volume: '10-50',
    acquisition_channels: 'Google',
    advertising_status: 'Investigando',
    current_tools: 'Google Sheets',
    main_bottleneck: 'Scale limitations',
    desired_outcome: 'Clean automation',
    solution_interest: 'Luma Estate OS',
    timeline: '1-3 meses',
    investment_range: rangeVal,
    source: 'diagnostico',
    page_origin: 'https://www.lumapremium.com/diagnostico',
    utm_source: 'google',
    utm_medium: 'organic',
    utm_campaign: campaignVal,
    utm_content: '',
    utm_term: '',
    status: 'nuevo',
  });
}

// Map them to include their deterministic fingerprint id
const MOCK_LEADS: LeadDetail[] = MOCK_LEADS_RAW.map((raw) => {
  const id = generateLeadId({
    schema_version: raw.schema_version,
    created_at: raw.created_at,
    locale: raw.locale,
    email: raw.email,
    phone: raw.phone,
    company: raw.company,
  });

  return {
    id,
    ...raw,
  };
});

export class MockCrmRepository implements CrmRepository {
  async listLeads(filters: LeadFilters): Promise<PaginatedLeads> {
    let filtered = [...MOCK_LEADS];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter((l) => l.status === filters.status);
    }
    if (filters.industry) {
      filtered = filtered.filter((l) => l.industry.toLowerCase().includes(filters.industry!.toLowerCase()));
    }
    if (filters.country) {
      filtered = filtered.filter((l) => l.country.toUpperCase() === filters.country!.toUpperCase());
    }
    if (filters.locale) {
      filtered = filtered.filter((l) => l.locale === filters.locale);
    }
    if (filters.investment_range) {
      filtered = filtered.filter((l) => l.investment_range === filters.investment_range);
    }
    if (filters.utm_campaign) {
      filtered = filtered.filter((l) => l.utm_campaign.toLowerCase() === filters.utm_campaign!.toLowerCase());
    }

    if (filters.date_from) {
      const fromTime = new Date(filters.date_from).getTime();
      filtered = filtered.filter((l) => new Date(l.created_at).getTime() >= fromTime);
    }
    if (filters.date_to) {
      const toTime = new Date(filters.date_to).getTime();
      filtered = filtered.filter((l) => new Date(l.created_at).getTime() <= toTime);
    }

    // Sort by created_at desc
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.page_size || 25;
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedLeads = filtered.slice(startIdx, endIdx);

    return {
      leads: paginatedLeads,
      totalCount,
      page,
      page_size: pageSize,
      totalPages,
    };
  }

  async getLeadById(leadId: string): Promise<LeadDetail | null> {
    const lead = MOCK_LEADS.find((l) => l.id === leadId);
    return lead || null;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const totalLeads = MOCK_LEADS.length;
    const newLeads = MOCK_LEADS.filter((l) => l.status === 'nuevo').length;

    // Locales
    const localeMap: Record<string, number> = {};
    // Countries
    const countryMap: Record<string, number> = {};
    // Industries
    const industryMap: Record<string, number> = {};
    // Ranges
    const rangeMap: Record<string, number> = {};
    // Campaigns
    const campaignMap: Record<string, number> = {};

    MOCK_LEADS.forEach((l) => {
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
    const recentLeads = [...MOCK_LEADS]
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
