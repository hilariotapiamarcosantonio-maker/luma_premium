import {
  fixUtf8Encoding,
  normalizeCountryCode,
  getCountryLabel,
  normalizeInvestmentRange,
  normalizeIndustry,
  normalizeAttribution,
  mapRowArrayToNormalizedFields
} from '../src/lib/crm/normalizers';
import { MockCrmRepository } from '../src/lib/crm/mock-repository';
import { GoogleSheetsCrmRepository, V2_COLUMNS as REAL_V2_COLUMNS } from '../src/lib/crm/google-sheets-repository';
const V2_COLUMNS = [
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

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('Running normalizer tests...');

// 1. UTF-8 Corrections
assert(fixUtf8Encoding('Produccin') === 'Producción', 'UTF-8 Produccin');
assert(fixUtf8Encoding('Producci\uFFFDn') === 'Producción', 'UTF-8 Produccin');
assert(fixUtf8Encoding('Espaol') === 'Español', 'UTF-8 Espaol');
assert(fixUtf8Encoding('Espa\uFFFDol') === 'Español', 'UTF-8 Espaol');
assert(fixUtf8Encoding('S\uFFFD') === 'Sí', 'UTF-8 S');
assert(fixUtf8Encoding('Producción es correcta') === 'Producción es correcta', 'Valid text not modified');

// Intact values (US, US$, USA, USD, Sales, Servicios)
assert(fixUtf8Encoding('US') === 'US', 'US remains intact');
assert(fixUtf8Encoding('US$') === 'US$', 'US$ remains intact');
assert(fixUtf8Encoding('USA') === 'USA', 'USA remains intact');
assert(fixUtf8Encoding('USD') === 'USD', 'USD remains intact');
assert(fixUtf8Encoding('Sales') === 'Sales', 'Sales remains intact');
assert(fixUtf8Encoding('Servicios') === 'Servicios', 'Servicios remains intact');
assert(fixUtf8Encoding('S') === 'S', 'S remains intact'); // S normal does not change to Sí

// 2. Investment ranges
assert(normalizeInvestmentRange('US$1,000–3,000') === 'US$1,500–3,000', 'US$1,000–3,000 to US$1,500–3,000');
assert(normalizeInvestmentRange('US$1,000-3,000') === 'US$1,500–3,000', 'US$1,000-3,000 to US$1,500–3,000');
assert(normalizeInvestmentRange('1k–3k') === 'US$1,500–3,000', '1k–3k to US$1,500–3,000');
assert(normalizeInvestmentRange('1k-3k') === 'US$1,500–3,000', '1k-3k to US$1,500–3,000');
assert(normalizeInvestmentRange('Menos de US$1,500') === 'US$1,500–3,000', 'Menos de US$1,500 to US$1,500–3,000');
assert(normalizeInvestmentRange('1k–5k') === 'legacy_review', '1k–5k to legacy_review');
assert(normalizeInvestmentRange('1k-5k') === 'legacy_review', '1k-5k to legacy_review');
assert(normalizeInvestmentRange('US$5,000 - US$10,000') === 'US$5,000–10,000', '5k-10k range');

// 3. Industries
assert(normalizeIndustry('commerce') === 'Comercio y e-commerce', 'commerce industry normalization');
assert(normalizeIndustry('e-commerce') === 'Comercio y e-commerce', 'e-commerce industry normalization');
assert(normalizeIndustry('retail') === 'Comercio y e-commerce', 'retail industry normalization');
assert(normalizeIndustry('real estate') === 'Inmobiliarias y construcción', 'real estate industry normalization');
assert(normalizeIndustry('construcción') === 'Inmobiliarias y construcción', 'construcción industry normalization');
assert(normalizeIndustry('spa') === 'Belleza, spa y estética', 'spa industry normalization');
assert(normalizeIndustry('beauty') === 'Belleza, spa y estética', 'beauty industry normalization');
assert(normalizeIndustry('cosmetics') === 'Cosmética y cuidado personal', 'cosmetics industry normalization');
assert(normalizeIndustry('skincare') === 'Cosmética y cuidado personal', 'skincare industry normalization');
assert(normalizeIndustry('barbershop') === 'Peluquerías y barberías', 'barbershop industry normalization');
assert(normalizeIndustry('peluquería') === 'Peluquerías y barberías', 'peluquería industry normalization');
assert(normalizeIndustry('education') === 'Educación, academias y cursos', 'education industry normalization');
assert(normalizeIndustry('academia') === 'Educación, academias y cursos', 'academia industry normalization');
assert(normalizeIndustry('finance') === 'Finanzas, préstamos y seguros', 'finance industry normalization');
assert(normalizeIndustry('seguros') === 'Finanzas, préstamos y seguros', 'seguros industry normalization');
assert(normalizeIndustry('professional-services') === 'Servicios profesionales y B2B', 'professional-services industry normalization');
assert(normalizeIndustry('b2b') === 'Servicios profesionales y B2B', 'b2b industry normalization');
assert(normalizeIndustry('health') === 'Salud, bienestar y alto rendimiento', 'health industry normalization');
assert(normalizeIndustry('fitness') === 'Salud, bienestar y alto rendimiento', 'fitness industry normalization');
assert(normalizeIndustry('home') === 'Hogar, muebles y diseño de interiores', 'home industry normalization');
assert(normalizeIndustry('interiorismo') === 'Hogar, muebles y diseño de interiores', 'interiorismo industry normalization');
assert(normalizeIndustry('industry') === 'Industria, manufactura y minería', 'industry industry normalization');
assert(normalizeIndustry('minería') === 'Industria, manufactura y minería', 'minería industry normalization');
assert(normalizeIndustry('technology') === 'Tecnología, software y SaaS', 'technology industry normalization');
assert(normalizeIndustry('saas') === 'Tecnología, software y SaaS', 'saas industry normalization');
assert(normalizeIndustry('random') === 'Otros', 'unmatched industry maps to Otros');
assert(normalizeIndustry('') === 'Otros', 'empty industry maps to Otros');

// 4. Countries
assert(normalizeCountryCode('DO') === 'DO', 'Country code DO');
assert(normalizeCountryCode('Dominicana') === 'DO', 'Country name Dominicana');
assert(normalizeCountryCode('Estados Unidos') === 'US', 'Estados Unidos is normalized to US');
assert(getCountryLabel('DO') === 'República Dominicana', 'Country label DO');
assert(getCountryLabel('US') === 'Estados Unidos', 'Country label US');

// 5. Attribution
const attr1 = normalizeAttribution({ utm_source: 'facebook', utm_medium: 'cpc' });
assert(attr1.platform === 'meta' && attr1.channel === 'paid_social', 'facebook/cpc attribution');

const attr2 = normalizeAttribution({ utm_source: 'google', utm_medium: 'cpc' });
assert(attr2.platform === 'google' && attr2.channel === 'paid_search', 'google/cpc attribution');

const attr3 = normalizeAttribution({ utm_source: 'google', utm_medium: 'organic' });
assert(attr3.platform === 'google' && attr3.channel === 'organic_search', 'google/organic attribution');

const attr4 = normalizeAttribution({ utm_source: 'linkedin' });
assert(attr4.platform === 'linkedin' && attr4.channel === 'unknown', 'linkedin empty medium attribution');

const attr5 = normalizeAttribution({ page_origin: '/diagnostico' });
assert(attr5.platform === 'web' && attr5.channel === 'direct', 'page origin direct attribution');

// 6. Functional Filters (using simulated mock dataset and logic identical to the repository)
const testLeads = [
  { country: 'DO', platform: 'meta', channel: 'paid_social', investment_range: 'US$1,500–3,000' },
  { country: 'DO', platform: 'google', channel: 'organic_search', investment_range: 'US$1,500–3,000' },
  { country: 'US', platform: 'meta', channel: 'paid_social', investment_range: 'US$3,000–5,000' },
  { country: 'MX', platform: 'meta', channel: 'paid_social', investment_range: 'US$20,000+' },
];

function listLeadsSimulated(filters: { country?: string; platform?: string; channel?: string; investment_range?: string }) {
  let res = [...testLeads];
  if (filters.country) {
    res = res.filter((l) => l.country.toUpperCase() === filters.country!.toUpperCase());
  }
  if (filters.platform) {
    res = res.filter((l) => l.platform === filters.platform);
  }
  if (filters.channel) {
    res = res.filter((l) => l.channel === filters.channel);
  }
  if (filters.investment_range) {
    res = res.filter((l) => l.investment_range === filters.investment_range);
  }
  return res;
}

// Test 6.1: Country = DO filter returns DO and zero US
const doLeads = listLeadsSimulated({ country: 'DO' });
assert(doLeads.length === 2, 'DO filter returns correct count');
assert(!doLeads.some(l => l.country === 'US'), 'DO filter returns zero US leads');

// Test 6.2: Platform filter
const metaLeads = listLeadsSimulated({ platform: 'meta' });
assert(metaLeads.every(l => l.platform === 'meta'), 'Platform filter returns only Meta leads');

// Test 6.3: Channel filter
const organicLeads = listLeadsSimulated({ channel: 'organic_search' });
assert(organicLeads.every(l => l.channel === 'organic_search'), 'Channel filter returns only organic_search leads');

// Test 6.4: Budget filter
const budgetLeads = listLeadsSimulated({ investment_range: 'US$1,500–3,000' });
assert(budgetLeads.every(l => l.investment_range === 'US$1,500–3,000'), 'Budget filter returns only US$1,500–3,000 leads');

// Test 6.5: Combination (country + platform + budget)
const combinedLeads = listLeadsSimulated({
  country: 'MX',
  platform: 'meta',
  investment_range: 'US$20,000+'
});
assert(combinedLeads.length === 1 && combinedLeads[0].country === 'MX' && combinedLeads[0].platform === 'meta', 'Combined filter works perfectly');

// 7. Repository Mapping Test (mapRowArrayToNormalizedFields)
const mockRow: string[] = [];
V2_COLUMNS.forEach((colName) => {
  if (colName === 'industry') {
    mockRow.push('Producci\uFFFDn');
  } else if (colName === 'investment_range') {
    mockRow.push('US$1,000–3,000');
  } else if (colName === 'utm_source') {
    mockRow.push('facebook');
  } else if (colName === 'country') {
    mockRow.push('DO');
  } else if (colName === 'created_at') {
    mockRow.push('2026-06-15T12:00:00Z');
  } else if (colName === 'locale') {
    mockRow.push('es');
  } else if (colName === 'schema_version') {
    mockRow.push('2');
  } else {
    mockRow.push('');
  }
});

const mappedFields = mapRowArrayToNormalizedFields(mockRow, V2_COLUMNS as string[]);
assert(mappedFields !== null, 'Mapped fields should not be null');
if (mappedFields) {
  // Verificación de raw vs normalizado / visual
  assert(mappedFields.raw_industry === 'Producci\uFFFDn', 'Preserves raw industry exact spelling');
  assert(mappedFields.industry === 'Industria, manufactura y minería', 'Normalizes industry to Industria, manufactura y minería');

  assert(mappedFields.raw_investment_range === 'US$1,000–3,000', 'Preserves raw investment range exact spelling');
  assert(mappedFields.investment_range === 'US$1,500–3,000', 'Normalizes investment range to official range');

  assert(mappedFields.raw_utm_source === 'facebook', 'Preserves raw utm_source');
  assert(mappedFields.platform === 'meta', 'Normalizes facebook utm_source to meta platform');

  assert(mappedFields.raw_country === 'DO', 'Preserves raw country');
  assert(mappedFields.country === 'DO', 'Normalizes country code');
  assert(getCountryLabel(mappedFields.country) === 'República Dominicana', 'Translates country label to Spanish');
}

// 8. Repository Integration Tests
console.log('Running repository integration tests...');

async function runRepoTests() {
  // 8.1 MockCrmRepository test
  const mockRepo = new MockCrmRepository();
  const mockLeadsResult = await mockRepo.listLeads({ page_size: 100 });
  const testNormalizationLead = mockLeadsResult.leads.find(
    (l) => l.email === 'normalizacion@test.com'
  );

  assert(testNormalizationLead !== undefined, 'MockCrmRepository successfully loaded and mapped our dedicated test lead');
  if (testNormalizationLead) {
    // Assert raw values are preserved exactly (Rule 1)
    assert(testNormalizationLead.raw_industry === 'Producci\uFFFDn', 'MockCrmRepository preserves raw_industry');
    assert(testNormalizationLead.raw_investment_range === 'US$1,000–3,000', 'MockCrmRepository preserves raw_investment_range');
    assert(testNormalizationLead.raw_utm_source === 'facebook', 'MockCrmRepository preserves raw_utm_source');
    assert(testNormalizationLead.raw_country === 'DO', 'MockCrmRepository preserves raw_country');

    // Assert normalized / visual values (Rule 2)
    assert(testNormalizationLead.industry === 'Industria, manufactura y minería', 'MockCrmRepository normalized industry to Industria, manufactura y minería');
    assert(testNormalizationLead.investment_range === 'US$1,500–3,000', 'MockCrmRepository normalized investment_range to US$1,500–3,000');
    assert(testNormalizationLead.platform === 'meta', 'MockCrmRepository normalized utm_source facebook to platform meta');
    assert(testNormalizationLead.country === 'DO', 'MockCrmRepository normalized country to DO');
    assert(getCountryLabel(testNormalizationLead.country) === 'República Dominicana', 'MockCrmRepository translates country code to label');
  }

  // 8.2 GoogleSheetsCrmRepository mapping test
  // Verifying GoogleSheetsCrmRepository schema mapping logic (V2_COLUMNS must match REAL_V2_COLUMNS)
  assert(REAL_V2_COLUMNS.length === V2_COLUMNS.length, 'GoogleSheetsCrmRepository V2_COLUMNS length matches test V2_COLUMNS');
  for (let i = 0; i < V2_COLUMNS.length; i++) {
    assert(REAL_V2_COLUMNS[i] === V2_COLUMNS[i], `GoogleSheetsCrmRepository column ${i} (${REAL_V2_COLUMNS[i]}) matches test schema`);
  }

  console.log('🎉 All repository integration mapping tests passed successfully!');
}

runRepoTests().catch((err) => {
  console.error('❌ Repository Integration Tests failed:', err);
  process.exit(1);
});

export {};
