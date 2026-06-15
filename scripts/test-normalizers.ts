import {
  fixUtf8Encoding,
  normalizeCountryCode,
  getCountryLabel,
  normalizeInvestmentRange,
  normalizeIndustry,
  normalizeAttribution
} from '../src/lib/crm/normalizers';

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
assert(normalizeIndustry('professional-services') === 'Servicios profesionales', 'professional-services industry normalization');

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

console.log('🎉 All functional filtering tests passed successfully!');

export {};
