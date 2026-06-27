import { createHash, timingSafeEqual } from 'node:crypto';
import {
  isValidEmail,
  isValidPhone,
  claimSubmissionIdentity,
  releaseSubmissionIdentity,
  type SubmissionClaimStore,
} from './luma-leads-validation';
import type { LumaLeadV2Input } from './google-sheets';
import { normalizeIndustry } from './crm/normalizers';

// ── Shared secret verification ──────────────────────────────────────────────
// Hashes both sides to a fixed-length sha256 digest before comparing so
// timingSafeEqual never throws on a length mismatch and the real secret
// length is never leaked via timing.

export function isValidIngestSecret(provided: string | null, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(providedHash, expectedHash);
}

// ── Canonical source ─────────────────────────────────────────────────────────
// This endpoint exists for exactly one purpose: marcos_portfolio leads. The
// caller's claimed `source` is never trusted or persisted as-is — whatever
// is sent (empty, the canonical value, the legacy alias, or anything else)
// always resolves to the one true value, so neither the browser nor the
// portfolio's own server can inject an arbitrary source into the CRM.
export function normalizeSource(_raw: unknown): string {
  void _raw;
  return 'marcos_portfolio';
}

// ── Country code ─────────────────────────────────────────────────────────────
// Mirrors the exact code set offered by the portfolio's <select> (see
// src/content/countries.ts in the marcos-portfolio-premium repo). The two
// repos share no package, so this list is duplicated deliberately — but it
// must stay the same SET of codes, otherwise a legitimate selection made in
// the portfolio's dropdown could be rejected here.
export const ALLOWED_COUNTRY_CODES: readonly string[] = [
  'DO', 'US', 'CA', 'MX', 'CO', 'PA', 'CR', 'GT', 'HN', 'SV', 'NI',
  'PR', 'CU', 'VE', 'EC', 'PE', 'BO', 'PY', 'UY', 'AR', 'CL', 'BR', 'ES',
];

const ALLOWED_COUNTRY_CODE_SET = new Set(ALLOWED_COUNTRY_CODES);

export function normalizeCountryCode(country: string): string {
  return country.trim().toUpperCase();
}

// Format alone (^[A-Z]{2}$) is not enough — a syntactically valid-looking
// code like "ZZ" or "XX" must still be rejected unless it is one of the
// countries the form actually offers.
export function isValidCountryCode(country: string): boolean {
  return /^[A-Z]{2}$/.test(country) && ALLOWED_COUNTRY_CODE_SET.has(country);
}

// ── Sector / role / timeline ─────────────────────────────────────────────────
// Mirrors the exact closed option sets offered by the portfolio's form (see
// src/content/site.ts in marcos-portfolio-premium: sectors/roles/timelines).
// The claimed sector/role/timeline is never trusted as free text — only one
// of these known options is accepted; anything else is rejected outright, no
// silent fallback, exactly like the country-code check above.

export const ALLOWED_SECTORS: readonly string[] = [
  'Inmobiliaria y construcción',
  'Academia y educación',
  'Estética, belleza y bienestar',
  'Comercio y tienda',
  'Servicios profesionales',
  'Otro',
];

export const ALLOWED_ROLES: readonly string[] = [
  'Propietario o fundador',
  'Director o gerente',
  'Ventas o marketing',
  'Operaciones',
  'Consultor o aliado',
  'Otro',
];

// Maps the portfolio's plazo labels to the exact canonical strings already
// used by the /diagnostico form's own `timeline` options, so the CRM's
// timeline column doesn't end up with two parallel, differently-worded
// vocabularies for the same concept.
const TIMELINE_CANONICAL_MAP: Readonly<Record<string, string>> = {
  'Lo antes posible / próximos 30 días': 'Inmediato (este mes)',
  'Dentro de 1 a 3 meses': '1-3 meses',
  'Dentro de 3 a 6 meses': '3-6 meses',
  'Estoy evaluando posibilidades': 'Todavía evaluando',
};

export const ALLOWED_TIMELINE_OPTIONS: readonly string[] = Object.keys(TIMELINE_CANONICAL_MAP);

export function isValidSector(sector: string): boolean {
  return ALLOWED_SECTORS.includes(sector);
}

export function isValidRole(role: string): boolean {
  return ALLOWED_ROLES.includes(role);
}

export function isValidTimelineOption(timeline: string): boolean {
  return Object.prototype.hasOwnProperty.call(TIMELINE_CANONICAL_MAP, timeline);
}

// Reuses the CRM's existing industry taxonomy normalizer instead of
// inventing a second one — every option offered by the portfolio's sector
// <select> already matches one of normalizeIndustry()'s known synonyms.
export function mapSectorToIndustry(sector: string): string {
  return normalizeIndustry(sector);
}

export function mapTimelineToCanonical(timeline: string): string {
  return TIMELINE_CANONICAL_MAP[timeline] ?? '';
}

// ── Referrer minimization ────────────────────────────────────────────────────
// Only the hostname is kept — never the full URL (path/query may carry
// unrelated, unnecessary detail). page_origin (the capture page itself,
// including its own UTM) is kept in full elsewhere and is not affected.

export function sanitizeReferrerHost(referrer: string): string {
  if (!referrer) return '';
  try {
    const hostname = new URL(referrer).hostname;
    return hostname ? `referrer:${hostname}` : '';
  } catch {
    return '';
  }
}

// ── Payload validation + mapping ────────────────────────────────────────────

function sanitize(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

export interface MarcosPortfolioPayload {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  sector?: unknown;
  role?: unknown;
  needType?: unknown;
  budgetRange?: unknown;
  timeline?: unknown;
  message?: unknown;
  consentContact?: unknown;
  honeypot?: unknown;
  source?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  page_origin?: unknown;
  referrer?: unknown;
}

export type MarcosPortfolioValidationResult =
  | { valid: true; fakeSuccess: false; lead: LumaLeadV2Input }
  | { valid: false; fakeSuccess: true }
  | { valid: false; fakeSuccess: false; error: string };

export function validateAndMapMarcosPortfolioPayload(body: MarcosPortfolioPayload): MarcosPortfolioValidationResult {
  if (sanitize(body.honeypot, 200)) {
    return { valid: false, fakeSuccess: true };
  }

  const full_name = sanitize(body.name, 120);
  const email = sanitize(body.email, 200).toLowerCase();
  const phone = sanitize(body.phone, 30);
  const country = normalizeCountryCode(sanitize(body.country, 5));
  const sector = sanitize(body.sector, 100);
  const role = sanitize(body.role, 100);
  const needType = sanitize(body.needType, 100);
  const budgetRange = sanitize(body.budgetRange, 100);
  const timeline = sanitize(body.timeline, 100);
  const message = sanitize(body.message, 2000);
  const company = sanitize(body.company, 150);

  if (!full_name) return { valid: false, fakeSuccess: false, error: 'El nombre es obligatorio.' };
  if (!isValidEmail(email)) return { valid: false, fakeSuccess: false, error: 'Ingrese un correo válido.' };
  if (!isValidPhone(phone)) return { valid: false, fakeSuccess: false, error: 'Ingrese un teléfono válido.' };
  if (!isValidCountryCode(country)) return { valid: false, fakeSuccess: false, error: 'Ingrese un país válido.' };
  if (!isValidSector(sector)) return { valid: false, fakeSuccess: false, error: 'Seleccione un sector válido.' };
  if (!isValidRole(role)) return { valid: false, fakeSuccess: false, error: 'Seleccione una función válida.' };
  if (!needType) return { valid: false, fakeSuccess: false, error: 'Seleccione el tipo de necesidad.' };
  if (!budgetRange) return { valid: false, fakeSuccess: false, error: 'Seleccione el rango de inversión.' };
  if (!isValidTimelineOption(timeline)) return { valid: false, fakeSuccess: false, error: 'Seleccione un plazo válido.' };
  if (message.length < 20) return { valid: false, fakeSuccess: false, error: 'El mensaje es demasiado corto.' };
  if (body.consentContact !== true) return { valid: false, fakeSuccess: false, error: 'Debe aceptar el consentimiento de contacto.' };

  const lead: LumaLeadV2Input = {
    locale: 'es',
    country,
    full_name,
    email,
    phone,
    company,
    role,
    industry: mapSectorToIndustry(sector),
    source: normalizeSource(body.source),
    solution_interest: needType,
    investment_range: budgetRange,
    timeline: mapTimelineToCanonical(timeline),
    main_bottleneck: message,
    page_origin: sanitize(body.page_origin, 300),
    utm_source: sanitize(body.utm_source, 100),
    utm_medium: sanitize(body.utm_medium, 100),
    utm_campaign: sanitize(body.utm_campaign, 200),
    utm_content: sanitize(body.utm_content, 200),
    utm_term: sanitize(body.utm_term, 200),
    acquisition_channels: sanitizeReferrerHost(sanitize(body.referrer, 300)),
  };

  return { valid: true, fakeSuccess: false, lead };
}

// ── Submission resolution ───────────────────────────────────────────────────
// Pure orchestration of the claim-guard + dedup-check + append decision, with
// the network-bound pieces (isDuplicate, append) fully injected — this is
// what makes "duplicate response" and "persistence error" behaviors directly
// unit-testable without a real Sheets call or a running Next.js server.

export interface ResolveMarcosPortfolioSubmissionDeps {
  claims: SubmissionClaimStore;
  now: number;
  ttlMs: number;
  isDuplicate: (email: string, phone: string) => Promise<boolean>;
  append: (lead: LumaLeadV2Input) => Promise<unknown>;
}

export type MarcosPortfolioSubmissionOutcome = 'claimed_inflight' | 'duplicate' | 'created';

export async function resolveMarcosPortfolioSubmission(
  lead: LumaLeadV2Input,
  deps: ResolveMarcosPortfolioSubmissionDeps
): Promise<{ outcome: MarcosPortfolioSubmissionOutcome }> {
  const { email, phone } = lead;

  if (!claimSubmissionIdentity(deps.claims, email, phone, deps.now, deps.ttlMs)) {
    return { outcome: 'claimed_inflight' };
  }

  try {
    if (await deps.isDuplicate(email, phone)) {
      return { outcome: 'duplicate' };
    }
    await deps.append(lead);
    return { outcome: 'created' };
  } catch (err) {
    releaseSubmissionIdentity(deps.claims, email, phone);
    throw err;
  }
}
