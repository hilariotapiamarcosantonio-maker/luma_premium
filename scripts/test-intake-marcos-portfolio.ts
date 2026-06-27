import * as fs from 'fs';
import * as path from 'path';
import {
  isValidIngestSecret,
  normalizeSource,
  isValidCountryCode,
  normalizeCountryCode,
  sanitizeReferrerHost,
  validateAndMapMarcosPortfolioPayload,
  resolveMarcosPortfolioSubmission,
  ALLOWED_COUNTRY_CODES,
  ALLOWED_SECTORS,
  ALLOWED_ROLES,
  ALLOWED_TIMELINE_OPTIONS,
  isValidSector,
  isValidRole,
  isValidTimelineOption,
  mapSectorToIndustry,
  mapTimelineToCanonical,
  type MarcosPortfolioPayload,
} from '../src/lib/marcos-portfolio-intake';
import { createSubmissionClaimStore, type SubmissionClaimStore } from '../src/lib/luma-leads-validation';
import { V2_COLUMNS as GoogleSheetsV2Columns, buildLumaLeadV2Row, type LumaLeadV2Input } from '../src/lib/google-sheets';
import { normalizeAttribution } from '../src/lib/crm/normalizers';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('Running marcos-portfolio intake tests...');

function validPayload(overrides: Partial<MarcosPortfolioPayload> = {}): MarcosPortfolioPayload {
  return {
    name: 'Ana Pérez',
    company: 'Ana Realty',
    email: 'Ana@Example.com',
    phone: '+1 809 555 1234',
    country: 'do',
    sector: 'Inmobiliaria y construcción',
    role: 'Propietario o fundador',
    needType: 'CRM y seguimiento comercial',
    budgetRange: 'US$3,000 - US$5,000',
    timeline: 'Dentro de 1 a 3 meses',
    message: 'Necesito ordenar mi captación y seguimiento comercial este trimestre.',
    consentContact: true,
    honeypot: '',
    source: 'marcos_portfolio',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'audit-launch',
    utm_content: 'variant-a',
    utm_term: 'crm premium',
    page_origin: 'https://marcoshilario.com/?utm_source=google#audit',
    referrer: 'https://www.google.com/search?q=marcos+hilario',
    ...overrides,
  };
}

async function runTests() {
  // ── 6/7/8. Secret absent / incorrect / correct ──────────────────────────────

  assert(isValidIngestSecret(null, 'real-secret') === false, 'Secret absent: rejected');
  assert(isValidIngestSecret('wrong-secret', 'real-secret') === false, 'Secret incorrect: rejected');
  assert(isValidIngestSecret('real-secret', 'real-secret') === true, 'Secret correct: accepted');
  assert(isValidIngestSecret('anything', undefined) === false, 'Secret check fails closed when server has no configured secret');

  // ── 2. Canonical source is forced regardless of client input ───────────────

  assert(normalizeSource('marcos_portfolio') === 'marcos_portfolio', 'normalizeSource: canonical value passes through');
  assert(normalizeSource('marcos-portfolio-premium') === 'marcos_portfolio', 'normalizeSource: legacy alias normalized');
  assert(normalizeSource('') === 'marcos_portfolio', 'normalizeSource: empty defaults to canonical');
  assert(normalizeSource(undefined) === 'marcos_portfolio', 'normalizeSource: undefined defaults to canonical');
  assert(normalizeSource('facebook') === 'marcos_portfolio', 'normalizeSource: an unrelated claimed source is ignored, not trusted');
  assert(normalizeSource('<script>') === 'marcos_portfolio', 'normalizeSource: a hostile claimed source is ignored, not trusted');

  // ── 3. Country ISO-2 validation ─────────────────────────────────────────────

  assert(normalizeCountryCode(' do ') === 'DO', 'normalizeCountryCode: trims and uppercases');
  assert(isValidCountryCode('DO') === true, 'isValidCountryCode: DO is accepted (in the allowed-country list)');
  assert(isValidCountryCode('US') === true, 'isValidCountryCode: US is accepted (in the allowed-country list)');
  assert(isValidCountryCode(normalizeCountryCode('do')) === true, 'isValidCountryCode: lowercase "do" normalizes to "DO" and is then accepted');
  assert(isValidCountryCode('USA') === false, 'isValidCountryCode: rejects a 3-letter code (fails the format check)');
  assert(isValidCountryCode('República Dominicana') === false, 'isValidCountryCode: rejects a free-text country name');
  assert(isValidCountryCode('') === false, 'isValidCountryCode: rejects empty');
  assert(isValidCountryCode('ZZ') === false, 'isValidCountryCode: rejects "ZZ" — well-formed (2 letters) but not in the allowed list');
  assert(isValidCountryCode('XX') === false, 'isValidCountryCode: rejects "XX" — well-formed but not in the allowed list');
  assert(isValidCountryCode('D1') === false, 'isValidCountryCode: rejects "D1" — fails the ^[A-Z]{2}$ format check');
  assert(
    ['DO', 'US', 'CA', 'MX', 'ES'].every((code) => ALLOWED_COUNTRY_CODES.includes(code)),
    'Allowed-country list includes República Dominicana, Estados Unidos, Canadá, México y España'
  );
  assert(
    ['CO', 'PA', 'CR', 'GT', 'HN', 'SV', 'NI', 'PR', 'CU', 'VE', 'EC', 'PE', 'BO', 'PY', 'UY', 'AR', 'CL', 'BR'].every((code) => ALLOWED_COUNTRY_CODES.includes(code)),
    'Allowed-country list includes the main Latin American markets'
  );
  for (const code of ALLOWED_COUNTRY_CODES) {
    assert(isValidCountryCode(code) === true, `isValidCountryCode accepts every code actually in the allowed list ("${code}")`);
  }

  // ── 5. Referrer minimization ────────────────────────────────────────────────

  assert(sanitizeReferrerHost('https://www.google.com/search?q=x') === 'referrer:www.google.com', 'sanitizeReferrerHost: keeps only the hostname');
  assert(sanitizeReferrerHost('https://www.facebook.com/some/deep/path?fbclid=abc') === 'referrer:www.facebook.com', 'sanitizeReferrerHost: strips path and query');
  assert(sanitizeReferrerHost('') === '', 'sanitizeReferrerHost: empty referrer stays empty');
  assert(sanitizeReferrerHost('not-a-url') === '', 'sanitizeReferrerHost: invalid URL becomes empty string');

  // ── 1/9/10/11/12. Valid payload → exact mapping, optional fields empty, UTM preserved ──

  {
    const result = validateAndMapMarcosPortfolioPayload(validPayload());
    assert(result.valid === true && result.fakeSuccess === false, 'Valid payload: accepted');
    if (result.valid) {
      const { lead } = result;
      assert(lead.full_name === 'Ana Pérez', 'Mapping: full_name ← name');
      assert(lead.email === 'ana@example.com', 'Mapping: email ← email (trimmed + lowercased)');
      assert(lead.phone === '+1 809 555 1234', 'Mapping: phone ← phone (sanitized, not yet canonicalized)');
      assert(lead.country === 'DO', 'Mapping: country ← country (normalized ISO-2)');
      assert(lead.company === 'Ana Realty', 'Mapping: company ← company');
      assert(lead.solution_interest === 'CRM y seguimiento comercial', 'Mapping: solution_interest ← needType');
      assert(lead.investment_range === 'US$3,000 - US$5,000', 'Mapping: investment_range ← budgetRange');
      assert(lead.main_bottleneck?.includes('captación y seguimiento') === true, 'Mapping: main_bottleneck ← message');
      assert(lead.source === 'marcos_portfolio', 'Mapping: source forced to canonical value');
      assert(lead.utm_source === 'google' && lead.utm_medium === 'cpc' && lead.utm_campaign === 'audit-launch' && lead.utm_content === 'variant-a' && lead.utm_term === 'crm premium', 'Mapping: all 5 UTM fields preserved exactly');
      assert(lead.page_origin === 'https://marcoshilario.com/?utm_source=google#audit', 'Mapping: page_origin kept in full (including its own UTM)');
      assert(lead.acquisition_channels === 'referrer:www.google.com', 'Mapping: referrer minimized into acquisition_channels');
      assert(lead.locale === 'es', 'Mapping: locale defaults to es (structural, not fabricated diagnostic data)');

      // 2. Sector se escribe en industria — vía el normalizador de taxonomía YA existente, no uno nuevo.
      assert(lead.industry === 'Inmobiliarias y construcción', 'Mapping: sector → industry via the existing normalizeIndustry() taxonomy, not a new one');
      // 3. Función se escribe en cargo (role) — passthrough exacto del valor admitido.
      assert(lead.role === 'Propietario o fundador', 'Mapping: role ← sector (función), exact allowlisted value, no transformation needed');
      // 4. Plazo se escribe en timeline — canonicalizado contra el vocabulario ya usado por /diagnostico.
      assert(lead.timeline === '1-3 meses', 'Mapping: timeline ← plazo, canonicalized to the same vocabulary already used by the /diagnostico form');

      const row = buildLumaLeadV2Row(lead);
      assert(row.length === 29, 'Row built from a portfolio lead still has exactly 29 columns');

      // 5. Los demás campos (sin equivalente en el portafolio) permanecen intactos / vacíos, nunca inventados.
      const notApplicable: (keyof LumaLeadV2Input)[] = ['industry_detail', 'team_size', 'lead_volume', 'advertising_status', 'current_tools', 'desired_outcome'];
      for (const field of notApplicable) {
        const index = GoogleSheetsV2Columns.indexOf(field);
        assert(row[index] === '', `Row field "${field}" (not collected by the portfolio) stays empty, not fabricated`);
      }
      assert(row[GoogleSheetsV2Columns.indexOf('role')] === 'Propietario o fundador', 'Row field "role" is correctly populated, not empty');
      assert(row[GoogleSheetsV2Columns.indexOf('industry')] === 'Inmobiliarias y construcción', 'Row field "industry" is correctly populated, not empty');
      assert(row[GoogleSheetsV2Columns.indexOf('timeline')] === '1-3 meses', 'Row field "timeline" is correctly populated, not empty');
    }
  }

  // ── 1. Sector / role / timeline validated via allowlists (PASO 1, the new fields) ──

  assert(isValidSector('Inmobiliaria y construcción') === true, 'isValidSector accepts an offered option');
  assert(isValidSector('Sector inventado') === false, 'isValidSector rejects a value outside the allowlist');
  assert(isValidSector('') === false, 'isValidSector rejects empty');
  for (const sector of ALLOWED_SECTORS) {
    assert(isValidSector(sector) === true, `isValidSector accepts every allowed sector ("${sector}")`);
  }

  assert(isValidRole('Propietario o fundador') === true, 'isValidRole accepts an offered option');
  assert(isValidRole('Función inventada') === false, 'isValidRole rejects a value outside the allowlist');
  assert(isValidRole('') === false, 'isValidRole rejects empty');
  for (const role of ALLOWED_ROLES) {
    assert(isValidRole(role) === true, `isValidRole accepts every allowed role ("${role}")`);
  }

  assert(isValidTimelineOption('Dentro de 1 a 3 meses') === true, 'isValidTimelineOption accepts an offered option');
  assert(isValidTimelineOption('Plazo inventado') === false, 'isValidTimelineOption rejects a value outside the allowlist');
  assert(isValidTimelineOption('') === false, 'isValidTimelineOption rejects empty');
  for (const timeline of ALLOWED_TIMELINE_OPTIONS) {
    assert(isValidTimelineOption(timeline) === true, `isValidTimelineOption accepts every allowed timeline option ("${timeline}")`);
    assert(mapTimelineToCanonical(timeline) !== '', `mapTimelineToCanonical resolves every allowed option to a non-empty canonical value ("${timeline}")`);
  }

  // Every sector option offered by the portfolio's <select> maps to a real, known taxonomy category — never "Otros" by accident.
  assert(mapSectorToIndustry('Inmobiliaria y construcción') === 'Inmobiliarias y construcción', 'mapSectorToIndustry: real estate sector maps correctly');
  assert(mapSectorToIndustry('Academia y educación') === 'Educación, academias y cursos', 'mapSectorToIndustry: education sector maps correctly');
  assert(mapSectorToIndustry('Estética, belleza y bienestar') === 'Belleza, spa y estética', 'mapSectorToIndustry: beauty sector maps correctly');
  assert(mapSectorToIndustry('Comercio y tienda') === 'Comercio y e-commerce', 'mapSectorToIndustry: retail sector maps correctly');
  assert(mapSectorToIndustry('Servicios profesionales') === 'Servicios profesionales y B2B', 'mapSectorToIndustry: professional services sector maps correctly');
  assert(mapSectorToIndustry('Otro') === 'Otros', 'mapSectorToIndustry: "Otro" falls back to the existing "Otros" category, not a fabricated one');

  // Reuse the exact same canonical timeline vocabulary already written by the /diagnostico form.
  assert(mapTimelineToCanonical('Lo antes posible / próximos 30 días') === 'Inmediato (este mes)', 'mapTimelineToCanonical: immediate plazo matches the diagnostico vocabulary');
  assert(mapTimelineToCanonical('Dentro de 3 a 6 meses') === '3-6 meses', 'mapTimelineToCanonical: 3-6 month plazo matches the diagnostico vocabulary');
  assert(mapTimelineToCanonical('Estoy evaluando posibilidades') === 'Todavía evaluando', 'mapTimelineToCanonical: evaluating plazo matches the diagnostico vocabulary');

  // ── Field-level rejections (mirrors existing diagnostico validation rules) ──

  assert(validateAndMapMarcosPortfolioPayload(validPayload({ email: 'not-an-email' })).valid === false, 'Invalid email rejected');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ phone: '123' })).valid === false, 'Invalid (too short) phone rejected');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ country: 'República Dominicana' })).valid === false, 'Free-text country rejected (must be ISO-2)');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ sector: 'Sector inventado' })).valid === false, 'Disallowed sector rejected at the full-payload level');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ sector: '' })).valid === false, 'Missing sector rejected at the full-payload level');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ role: 'Función inventada' })).valid === false, 'Disallowed role rejected at the full-payload level');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ role: '' })).valid === false, 'Missing role rejected at the full-payload level');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ timeline: 'Plazo inventado' })).valid === false, 'Disallowed timeline rejected at the full-payload level');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ timeline: '' })).valid === false, 'Missing timeline rejected at the full-payload level');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ consentContact: false })).valid === false, 'Missing consent rejected');
  assert(validateAndMapMarcosPortfolioPayload(validPayload({ message: 'short' })).valid === false, 'Too-short message rejected');

  {
    const honeypotResult = validateAndMapMarcosPortfolioPayload(validPayload({ honeypot: 'i-am-a-bot' }));
    assert(honeypotResult.valid === false && honeypotResult.fakeSuccess === true, 'Honeypot filled: flagged as fake-success, no validation error message');
  }

  // ── Behavioral (not grep-based): claim guard + duplicate + persistence-error resolution ──

  function makeLead(email: string, phone: string): LumaLeadV2Input {
    const result = validateAndMapMarcosPortfolioPayload(validPayload({ email, phone }));
    if (!result.valid) throw new Error('expected a valid payload in test setup');
    return result.lead;
  }

  {
    const claims: SubmissionClaimStore = createSubmissionClaimStore();
    const lead = makeLead('claim1@example.com', '+1 305 555 1001');
    let appendCalls = 0;

    const outcome1 = await resolveMarcosPortfolioSubmission(lead, {
      claims,
      now: 1_000_000,
      ttlMs: 20_000,
      isDuplicate: async () => false,
      append: async () => { appendCalls++; },
    });
    assert(outcome1.outcome === 'created', 'First submission resolves to created');
    assert(appendCalls === 1, 'append() called exactly once for a new lead');

    const outcome2 = await resolveMarcosPortfolioSubmission(lead, {
      claims,
      now: 1_000_000,
      ttlMs: 20_000,
      isDuplicate: async () => false,
      append: async () => { appendCalls++; },
    });
    assert(outcome2.outcome === 'claimed_inflight', 'Immediate repeat resolves to claimed_inflight (in-memory guard), not created');
    assert(appendCalls === 1, 'append() NOT called again for the in-flight duplicate');
  }

  {
    const claims: SubmissionClaimStore = createSubmissionClaimStore();
    const lead = makeLead('dup@example.com', '+1 305 555 2002');
    let appendCalls = 0;

    const outcome = await resolveMarcosPortfolioSubmission(lead, {
      claims,
      now: 2_000_000,
      ttlMs: 20_000,
      isDuplicate: async () => true, // simulates an existing row in Luma Leads V2
      append: async () => { appendCalls++; },
    });
    assert(outcome.outcome === 'duplicate', 'Sheets-level duplicate resolves to duplicate outcome');
    assert(appendCalls === 0, 'append() never called when the Sheets-based check finds a duplicate');
  }

  {
    const claims: SubmissionClaimStore = createSubmissionClaimStore();
    const lead = makeLead('failure@example.com', '+1 305 555 3003');

    let threw = false;
    try {
      await resolveMarcosPortfolioSubmission(lead, {
        claims,
        now: 3_000_000,
        ttlMs: 20_000,
        isDuplicate: async () => false,
        append: async () => { throw new Error('simulated GCP/Sheets failure'); },
      });
    } catch {
      threw = true;
    }
    assert(threw === true, 'A persistence error propagates (so the route can return a safe 503)');

    const retryOutcome = await resolveMarcosPortfolioSubmission(lead, {
      claims,
      now: 3_000_001,
      ttlMs: 20_000,
      isDuplicate: async () => false,
      append: async () => {},
    });
    assert(retryOutcome.outcome === 'created', 'Claim released after the persistence error allows an immediate legitimate retry');
  }

  // ── Attribution regression: source alone (no UTM) maps to web/direct, UTM still wins ──

  assert(JSON.stringify(normalizeAttribution({ source: 'marcos_portfolio' })) === JSON.stringify({ platform: 'web', channel: 'direct' }), 'normalizeAttribution: marcos_portfolio with no UTM maps to web/direct, not other/unknown');
  assert(JSON.stringify(normalizeAttribution({ source: 'marcos-portfolio-premium' })) === JSON.stringify({ platform: 'web', channel: 'direct' }), 'normalizeAttribution: legacy alias also maps to web/direct');
  assert(
    JSON.stringify(normalizeAttribution({ source: 'marcos_portfolio', utm_source: 'google', utm_medium: 'cpc' })) === JSON.stringify({ platform: 'google', channel: 'paid_search' }),
    'normalizeAttribution: real UTM data still wins over the source-based fallback, unchanged'
  );

  // ── 15. Indistinguishable public response + no PII/secret in logs (complementary source check) ──

  const routePath = path.join(__dirname, '../src/app/api/intake/marcos-portfolio/route.ts');
  const routeContent = fs.readFileSync(routePath, 'utf-8');

  const successCount = (routeContent.match(/success: true, message: 'Solicitud recibida\.'/g) || []).length;
  assert(successCount === 1, 'route.ts returns the exact same success literal for every outcome (single return site, not duplicated per branch)');

  const jsonResponses = routeContent.match(/NextResponse\.json\(\{[^}]*\}\)/g) || [];
  assert(jsonResponses.length > 0, 'route.ts contains NextResponse.json(...) calls to inspect');
  for (const responseSnippet of jsonResponses) {
    assert(!/\bemail\s*:/.test(responseSnippet), `Public response does not echo "email": ${responseSnippet}`);
    assert(!/\bphone\s*:/.test(responseSnippet), `Public response does not echo "phone": ${responseSnippet}`);
    assert(!/\bduplicate\s*:/.test(responseSnippet), `Public response does not include a "duplicate" flag: ${responseSnippet}`);
  }

  assert(!/console\.\w+\([^)]*\b(email|phone|full_name|message|providedSecret)\b/.test(routeContent), 'No console.* call in route.ts logs email/phone/full_name/message/the raw secret variable');
  assert(!routeContent.includes('PORTFOLIO_INGEST_SECRET}`') && !/console\.\w+\([^)]*providedSecret/.test(routeContent), 'The secret value itself is never passed to console.*');

  const topLevelExports = routeContent.match(/^export .+$/gm) || [];
  assert(topLevelExports.length === 2, `route.ts exports exactly 2 top-level declarations (runtime + POST), found ${topLevelExports.length}: ${JSON.stringify(topLevelExports)}`);
  assert(topLevelExports.some((l) => l.includes("runtime = 'nodejs'")), 'route.ts exports runtime');
  assert(topLevelExports.some((l) => l.startsWith('export async function POST')), 'route.ts exports POST — no stray helper exports (isValidIngestSecret/normalizeSource/etc. all live in lib/marcos-portfolio-intake.ts)');

  // ── 17. 29 columns regression (complementary to the dedicated dedup-test assertions) ──

  assert(GoogleSheetsV2Columns.length === 29, 'V2_COLUMNS still has exactly 29 entries after the appendLumaLeadV2 type relaxation');

  console.log('🎉 All marcos-portfolio intake tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Tests failed with error:', err);
  process.exit(1);
});
