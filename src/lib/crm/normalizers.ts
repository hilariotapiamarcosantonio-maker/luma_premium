import { LeadPlatform, LeadChannel, LeadDetail } from './types';
import { SheetRowSchema } from './schemas';

/**
 * Strictly fixes known broken UTF-8 sequences.
 * Does not replace general letters or words.
 */
export function fixUtf8Encoding(text: string): string {
  if (!text) return '';
  return text
    .replace(/Producci\uFFFDn/g, 'Producción')
    .replace(/Produccin/g, 'Producción')
    .replace(/Espa\uFFFDol/g, 'Español')
    .replace(/Espa\uFFFDl/g, 'Español')
    .replace(/Espaol/g, 'Español')
    .replace(/S\uFFFD/g, 'Sí');
}

/**
 * Normalizes country strings to ISO stable codes.
 * Prioritizes US checks over DO to avoid partial matches, though they are distinct.
 */
export function normalizeCountryCode(country: string): string {
  if (!country) return '';
  const c = country.trim().toUpperCase();
  if (c === 'US' || c === 'USA' || c.includes('ESTADOS UNIDOS') || c.includes('UNITED STATES') || c.includes('U.S.')) return 'US';
  if (c === 'DO' || c.includes('DOMINICANA') || c.includes('DOM. REP') || c.includes('REP. DOM')) return 'DO';
  if (c === 'MX' || c.includes('MEXICO') || c.includes('MÉXICO')) return 'MX';
  if (c === 'ES' || c.includes('ESPAÑA') || c.includes('SPAIN')) return 'ES';
  if (c === 'CO' || c.includes('COLOMBIA')) return 'CO';
  return c;
}

/**
 * Returns full name labels for country codes.
 */
export function getCountryLabel(code: string): string {
  const mapping: Record<string, string> = {
    'DO': 'República Dominicana',
    'US': 'Estados Unidos',
    'MX': 'México',
    'ES': 'España',
    'CO': 'Colombia',
  };
  return mapping[code.toUpperCase()] || code;
}

/**
 * Translates platforms to Spanish.
 */
export function getPlatformLabel(platform: string): string {
  const p = (platform || '').trim().toLowerCase();
  const mapping: Record<string, string> = {
    meta: 'Meta',
    google: 'Google',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    web: 'Web',
    whatsapp: 'WhatsApp',
    referral: 'Referidos',
    outbound: 'Prospección saliente',
    manual: 'Manual',
    other: 'Otros',
  };
  return mapping[p] || platform;
}

/**
 * Translates channels to Spanish.
 */
export function getChannelLabel(channel: string): string {
  const c = (channel || '').trim().toLowerCase();
  const mapping: Record<string, string> = {
    paid_social: 'Redes sociales de pago',
    paid_search: 'Búsqueda de pago',
    organic_social: 'Redes sociales orgánicas',
    organic_search: 'Búsqueda orgánica',
    direct: 'Directo',
    referral: 'Referidos',
    partner: 'Aliados',
    outbound: 'Prospección saliente',
    unknown: 'Desconocido',
  };
  return mapping[c] || channel;
}

/**
 * Normalizes investment ranges to official ranges.
 * Ambiguous historical values like '1k-5k' or '1k–5k' map to 'legacy_review'.
 */
export function normalizeInvestmentRange(range: string): string {
  if (!range) return 'Necesito diagnóstico antes de definirlo';
  
  const clean = range.trim().replace(/\s+/g, ' ');
  const standardized = clean.replace(/–/g, '-').replace(/\s*-\s*/g, '-');

  // Rango histórico ambiguo
  if (standardized === '1k-5k' || standardized.toLowerCase() === '1k-5k') {
    return 'legacy_review';
  }

  // Mapeos a US$1,500–3,000
  if (
    standardized === 'US$1,000-3,000' ||
    standardized === 'US$1,000 - US$3,000' ||
    standardized === 'US$1,000-US$3,000' ||
    standardized === '1,000-3,000' ||
    standardized === '1000-3000' ||
    standardized.toLowerCase() === '1k-3k' ||
    standardized.toLowerCase().includes('menos de us$1,500') ||
    standardized.toLowerCase().includes('menos de 1,500') ||
    standardized.toLowerCase().includes('menos de 1500') ||
    standardized === 'US$1,500-3,000' ||
    standardized === 'US$1,500 - US$3,000'
  ) {
    return 'US$1,500–3,000';
  }

  // Otros rangos oficiales
  if (standardized === 'US$3,000-5,000' || standardized === 'US$3,000 - US$5,000' || standardized === 'US$3,000-US$5,000') {
    return 'US$3,000–5,000';
  }
  if (standardized === 'US$3,000 - US$6,500' || standardized === 'US$3,000-6,500' || standardized === 'US$3,000-US$6,500') {
    return 'US$3,000–5,000';
  }

  if (
    standardized === 'US$5,000-10,000' ||
    standardized === 'US$5,000 - US$10,000' ||
    standardized === 'US$5,000-US$10,000' ||
    standardized.toLowerCase() === '5k-10k'
  ) {
    return 'US$5,000–10,000';
  }
  if (standardized === 'US$6,500 - US$12,000' || standardized === 'US$6,500-12,000' || standardized === 'US$6,500-US$12,000') {
    return 'US$5,000–10,000';
  }

  if (
    standardized === 'US$10,000-20,000' ||
    standardized === 'US$10,000 - US$20,000' ||
    standardized === 'US$10,000-US$20,000' ||
    standardized === 'US$10,000-25,000' ||
    standardized === 'US$10,000 - US$25,000' ||
    standardized === 'US$10,000-US$25,000' ||
    standardized.toLowerCase() === '10k-20k' ||
    standardized.toLowerCase() === '10k-25k'
  ) {
    return 'US$10,000–20,000';
  }
  if (standardized === 'US$12,000+' || standardized === 'US$12,000 +' || standardized.toLowerCase() === '12k+') {
    return 'US$10,000–20,000';
  }

  if (
    standardized === 'US$25,000-50,000' ||
    standardized === 'US$25,000 - US$50,000' ||
    standardized === 'US$25,000-US$50,000' ||
    standardized === 'US$50,000+' ||
    standardized === 'US$50,000 +' ||
    standardized === 'US$20,000+' ||
    standardized === 'US$20,000 +' ||
    standardized.toLowerCase() === '25k+' ||
    standardized.toLowerCase() === '20k+'
  ) {
    return 'US$20,000+';
  }

  if (
    standardized.toLowerCase().includes('diagnóstico') ||
    standardized.toLowerCase().includes('assessment') ||
    standardized.toLowerCase().includes('definiendo') ||
    standardized.toLowerCase().includes('evaluando') ||
    standardized.toLowerCase().includes('select a range') ||
    standardized.toLowerCase().includes('seleccione')
  ) {
    return 'Necesito diagnóstico antes de definirlo';
  }

  return clean;
}

export const INDUSTRY_TAXONOMY = [
  'Inmobiliarias y construcción',
  'Comercio y e-commerce',
  'Belleza, spa y estética',
  'Cosmética y cuidado personal',
  'Peluquerías y barberías',
  'Educación, academias y cursos',
  'Finanzas, préstamos y seguros',
  'Servicios profesionales y B2B',
  'Salud, bienestar y alto rendimiento',
  'Hogar, muebles y diseño de interiores',
  'Industria, manufactura y minería',
  'Tecnología, software y SaaS',
  'Otros',
] as const;

/**
 * Groups industry values into canonical categories.
 */
export function normalizeIndustry(industry: string): string {
  if (!industry) return 'Otros';
  
  const clean = industry.trim().toLowerCase();

  const has = (terms: string[]) => terms.some(term => clean === term || clean.includes(term));

  if (has(['real estate', 'real-estate', 'real_estate', 'realtor', 'inmobiliaria', 'inmobiliario', 'construcción', 'construccion', 'broker', 'bienes raices', 'bienes raíces', 'proptech', 'constructor'])) {
    return 'Inmobiliarias y construcción';
  }
  if (has(['ecommerce', 'e-commerce', 'e commerce', 'commerce', 'retail', 'tienda', 'comercio'])) {
    return 'Comercio y e-commerce';
  }
  if (has(['spa', 'beauty', 'estética', 'estetica', 'salon de belleza', 'salón de belleza', 'centro de estética', 'cosmetología', 'cosmetologia', 'centro de masajes', 'masajes']) && !clean.includes('cosmética') && !clean.includes('cosmetica')) {
    return 'Belleza, spa y estética';
  }
  if (has(['cosmetics', 'cosmética', 'cosmetica', 'skincare', 'cuidado personal'])) {
    return 'Cosmética y cuidado personal';
  }
  if (has(['barber', 'barbershop', 'peluquería', 'peluqueria'])) {
    return 'Peluquerías y barberías';
  }
  if (has(['education', 'educación', 'educacion', 'academia', 'curso', 'colegio', 'escuela'])) {
    return 'Educación, academias y cursos';
  }
  if (has(['finance', 'finanzas', 'préstamo', 'prestamo', 'seguro', 'insurance', 'banca'])) {
    return 'Finanzas, préstamos y seguros';
  }
  if (has(['professional services', 'professional-services', 'servicios profesionales', 'consultoría', 'consultoria', 'b2b', 'legal', 'agencia'])) {
    return 'Servicios profesionales y B2B';
  }
  if (has(['health', 'salud', 'alto rendimiento', 'medicina', 'clínica', 'clinica', 'fitness', 'wellness'])) {
    return 'Salud, bienestar y alto rendimiento';
  }
  if (has(['home', 'furniture', 'interiorismo', 'diseño de interiores', 'muebles', 'decoración', 'decoracion', 'hogar'])) {
    return 'Hogar, muebles y diseño de interiores';
  }
  if (has(['industry', 'manufactura', 'minería', 'mineria', 'fábrica', 'fabrica', 'industrial', 'producción', 'produccion', 'produccin', 'production'])) {
    return 'Industria, manufactura y minería';
  }
  if (has(['technology', 'software', 'saas', 'tecnología', 'tech', 'desarrollo', 'programación', 'programacion'])) {
    return 'Tecnología, software y SaaS';
  }

  return 'Otros';
}

export interface AttributionFields {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  source?: string;
  page_origin?: string;
  acquisition_channels?: string;
}

/**
 * Analyzes UTM tags and source fields in a strict order of priority:
 * 1. utm_source / utm_medium
 * 2. source
 * 3. page_origin
 * 4. acquisition_channels
 */
export function normalizeAttribution(fields: AttributionFields): { platform: LeadPlatform; channel: LeadChannel } {
  const utm_source = (fields.utm_source || '').trim().toLowerCase();
  const utm_medium = (fields.utm_medium || '').trim().toLowerCase();
  const source = (fields.source || '').trim().toLowerCase();
  const page_origin = (fields.page_origin || '').trim().toLowerCase();
  const acquisition_channels = (fields.acquisition_channels || '').trim().toLowerCase();

  // 1. Evaluate utm_source / utm_medium
  if (utm_source) {
    let platform: LeadPlatform = 'other';
    let channel: LeadChannel = 'unknown';

    // Map platform
    if (utm_source === 'facebook' || utm_source === 'instagram' || utm_source === 'meta' || utm_source === 'fb' || utm_source === 'ig') {
      platform = 'meta';
    } else if (utm_source === 'google' || utm_source === 'google_ads' || utm_source === 'gads') {
      platform = 'google';
    } else if (utm_source === 'linkedin' || utm_source === 'linkedin_lead_gen' || utm_source === 'ln') {
      platform = 'linkedin';
    } else if (utm_source === 'tiktok' || utm_source === 'tiktok_ads') {
      platform = 'tiktok';
    } else if (utm_source === 'whatsapp' || utm_source === 'wa') {
      platform = 'whatsapp';
    } else if (utm_source === 'referral' || utm_source === 'referido') {
      platform = 'referral';
    } else if (utm_source === 'web' || utm_source === 'website' || utm_source === 'luma') {
      platform = 'web';
    }

    // Map channel
    const isPaid = ['cpc', 'ppc', 'paid', 'ads', 'ad', 'paid_social', 'paid_search'].includes(utm_medium) || utm_medium.endsWith('ads');
    const isOrganic = ['organic', 'seo', 'organic_search', 'organic_social', 'social', 'post'].includes(utm_medium);
    const isDirect = ['direct', 'none'].includes(utm_medium);
    const isReferral = ['referral', 'ref'].includes(utm_medium);

    if (isPaid) {
      if (platform === 'google') {
        channel = 'paid_search';
      } else if (['meta', 'linkedin', 'tiktok'].includes(platform)) {
        channel = 'paid_social';
      } else {
        channel = 'paid_social';
      }
    } else if (isOrganic) {
      if (platform === 'google') {
        channel = 'organic_search';
      } else if (['meta', 'linkedin', 'tiktok'].includes(platform)) {
        channel = 'organic_social';
      } else {
        channel = 'organic_search';
      }
    } else if (isDirect) {
      channel = 'direct';
    } else if (isReferral) {
      channel = 'referral';
    } else {
      channel = 'unknown';
    }

    return { platform, channel };
  }

  // 2. Evaluate source
  if (source) {
    if (source === 'facebook' || source === 'instagram' || source === 'meta' || source === 'fb') {
      return { platform: 'meta', channel: 'organic_social' };
    }
    if (source === 'google') {
      return { platform: 'google', channel: 'organic_search' };
    }
    if (source === 'linkedin') {
      return { platform: 'linkedin', channel: 'organic_social' };
    }
    if (source === 'tiktok') {
      return { platform: 'tiktok', channel: 'organic_social' };
    }
    if (source === 'whatsapp') {
      return { platform: 'whatsapp', channel: 'direct' };
    }
    if (source === 'referral' || source === 'referido') {
      return { platform: 'referral', channel: 'referral' };
    }
    if (source === 'outbound' || source === 'cold_email') {
      return { platform: 'outbound', channel: 'outbound' };
    }
    if (source === 'manual') {
      return { platform: 'manual', channel: 'direct' };
    }
    if (source.includes('diagnostico') || source.includes('assessment') || source.includes('web') || source.includes('website')) {
      return { platform: 'web', channel: 'direct' };
    }
    if (/^marcos[-_]portfolio([-_]premium)?$/.test(source)) {
      return { platform: 'web', channel: 'direct' };
    }
    if (source.includes('contacto directo') || source.includes('direct contact')) {
      return { platform: 'other', channel: 'direct' };
    }
    if (source.includes('networking') || source.includes('alianza') || source === 'partner' || source === 'socio') {
      return { platform: 'referral', channel: 'partner' };
    }
  }

  // 3. Evaluate page_origin
  if (page_origin) {
    if (page_origin.includes('/diagnostico') || page_origin.includes('/assessment') || page_origin.includes('lumapremium.com')) {
      return { platform: 'web', channel: 'direct' };
    }
  }

  // 4. Evaluate acquisition_channels
  if (acquisition_channels) {
    if (acquisition_channels.includes('facebook') || acquisition_channels.includes('instagram') || acquisition_channels.includes('meta')) {
      return { platform: 'meta', channel: 'unknown' };
    }
    if (acquisition_channels.includes('google')) {
      return { platform: 'google', channel: 'unknown' };
    }
    if (acquisition_channels.includes('linkedin')) {
      return { platform: 'linkedin', channel: 'unknown' };
    }
    if (acquisition_channels.includes('referido') || acquisition_channels.includes('referral') || acquisition_channels.includes('boca a boca')) {
      return { platform: 'referral', channel: 'referral' };
    }
    if (acquisition_channels.includes('whatsapp')) {
      return { platform: 'whatsapp', channel: 'direct' };
    }
    if (acquisition_channels.includes('contacto directo')) {
      return { platform: 'other', channel: 'direct' };
    }
    if (acquisition_channels.includes('networking') || acquisition_channels.includes('alianza') || acquisition_channels.includes('socio') || acquisition_channels.includes('partner')) {
      return { platform: 'referral', channel: 'partner' };
    }
  }

  return { platform: 'other', channel: 'unknown' };
}

/**
 * Maps a raw Sheets row array to normalized fields, preserving original raw values.
 * rawMappedObject keeps original values (no trim, no lowercase, no fixUtf8, no normalizations)
 * correctedMappedObject cleans values with fixUtf8Encoding for schema validation and subsequent normalizations.
 */
export function mapRowArrayToNormalizedFields(
  row: string[],
  columns: string[]
): Omit<LeadDetail, 'id'> | null {
  const rawMappedObject: Record<string, string> = {};
  const correctedMappedObject: Record<string, string> = {};

  columns.forEach((colName, index) => {
    const rawVal = row[index] !== undefined ? String(row[index]) : '';
    rawMappedObject[colName] = rawVal;
    correctedMappedObject[colName] = fixUtf8Encoding(rawVal);
  });

  const result = SheetRowSchema.safeParse(correctedMappedObject);
  if (!result.success) {
    return null;
  }

  const validData = result.data;

  // Extract raw fields directly from rawMappedObject (before any trim, lowercase, fixUtf8 or normalization)
  const raw_investment_range = rawMappedObject.investment_range || '';
  const raw_country = rawMappedObject.country || '';
  const raw_industry = rawMappedObject.industry || '';
  const raw_source = rawMappedObject.source || '';
  const raw_utm_source = rawMappedObject.utm_source || '';
  const raw_utm_medium = rawMappedObject.utm_medium || '';
  const raw_utm_campaign = rawMappedObject.utm_campaign || '';
  const raw_page_origin = rawMappedObject.page_origin || '';

  // Normalizations using validated corrected data
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

  return {
    ...validData, // Contiene valores corregidos
    country: normalizedCountry,
    investment_range: normalizedRange,
    industry: normalizedInd,
    platform,
    channel,
    raw_investment_range,
    raw_country,
    raw_industry,
    raw_source,
    raw_utm_source,
    raw_utm_medium,
    raw_utm_campaign,
    raw_page_origin,
  };
}

export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const clean = phone.trim();
  const startsWithPlus = clean.startsWith('+');
  const digits = clean.replace(/\D/g, '');
  return startsWithPlus ? `+${digits}` : digits;
}

export function getPhoneDigits(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

export interface ManualLeadInputForMapping {
  lead_id: string;
  full_name: string;
  phone: string;
  email: string;
  company: string;
  country: string;
  language: 'es' | 'en';
  industry: string;
  investment_range: string;
  capture_channel: string;
  campaign: string;
  source: string;
  capture_status: string;
  consent_to_contact: boolean;
  created_at: string;
  created_by: string;
  updated_at: string | null;
}

export function mapManualLeadToLeadDetail(lead: ManualLeadInputForMapping): LeadDetail {
  const normalizedCountry = normalizeCountryCode(lead.country);
  const normalizedRange = normalizeInvestmentRange(lead.investment_range);
  const normalizedInd = normalizeIndustry(lead.industry);

  const { platform, channel } = normalizeAttribution({
    utm_source: lead.source,
    utm_medium: lead.capture_channel,
    utm_campaign: lead.campaign,
    source: lead.source,
  });

  return {
    id: lead.lead_id,
    schema_version: 'v1',
    created_at: lead.created_at,
    locale: lead.language === 'en' ? 'en' : 'es',
    country: normalizedCountry,
    full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    role: '',
    industry: normalizedInd,
    industry_detail: '',
    team_size: '',
    lead_volume: '',
    acquisition_channels: lead.capture_channel,
    advertising_status: '',
    current_tools: '',
    main_bottleneck: '',
    desired_outcome: '',
    solution_interest: '',
    timeline: '',
    investment_range: normalizedRange,
    source: lead.source,
    page_origin: '',
    utm_source: lead.source,
    utm_medium: lead.capture_channel,
    utm_campaign: lead.campaign,
    utm_content: '',
    utm_term: '',
    status: lead.capture_status,
    platform,
    channel,
    raw_investment_range: lead.investment_range,
    raw_industry: lead.industry,
    raw_country: lead.country,
    raw_source: lead.source,
    raw_utm_source: lead.source,
    raw_utm_medium: lead.capture_channel,
    raw_utm_campaign: lead.campaign,
    raw_page_origin: '',
  };
}
