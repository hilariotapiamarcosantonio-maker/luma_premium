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
assert(fixUtf8Encoding('Espaol') === 'Español', 'UTF-8 Espaol');
assert(fixUtf8Encoding('S') === 'Sí', 'UTF-8 S');
assert(fixUtf8Encoding('Producción es correcta') === 'Producción es correcta', 'Valid text not modified');

// 2. Investment ranges
assert(normalizeInvestmentRange('US$1,000–3,000') === 'US$1,500–3,000', '1k-3k range mapping');
assert(normalizeInvestmentRange('Menos de US$1,500') === 'US$1,500–3,000', 'Under 1.5k mapping');
assert(normalizeInvestmentRange('1k–5k') === 'legacy_review', '1k-5k maps to legacy_review');
assert(normalizeInvestmentRange('US$5,000 - US$10,000') === 'US$5,000–10,000', '5k-10k range');

// 3. Industries
assert(normalizeIndustry('commerce') === 'Comercio y e-commerce', 'commerce industry normalization');
assert(normalizeIndustry('professional-services') === 'Servicios profesionales', 'professional-services industry normalization');

// 4. Countries
assert(normalizeCountryCode('DO') === 'DO', 'Country code DO');
assert(normalizeCountryCode('Dominicana') === 'DO', 'Country name Dominicana');
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

console.log('All tests passed successfully!');
export {};
