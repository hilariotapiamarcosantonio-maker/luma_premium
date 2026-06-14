/**
 * Google authentication via Vercel OIDC + GCP Workload Identity Federation.
 *
 * No JSON keys, no static credentials.
 * In production, Vercel injects a short-lived OIDC token that is exchanged
 * for a GCP access token through the STS endpoint, then impersonates the
 * service account to obtain a scoped Sheets token.
 *
 * This module is server-only. Never import it from client components.
 */
import 'server-only';

import { IdentityPoolClient } from 'google-auth-library';
import { getVercelOidcToken } from '@vercel/oidc';

// ── Required environment variables ────────────────────────────────────────────

const REQUIRED_VARS = [
  'GCP_PROJECT_NUMBER',
  'GCP_SERVICE_ACCOUNT_EMAIL',
  'GCP_WORKLOAD_IDENTITY_POOL_ID',
  'GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID',
  'LUMA_LEADS_SPREADSHEET_ID',
] as const;

type RequiredVar = (typeof REQUIRED_VARS)[number];

export class GcpConfigError extends Error {
  constructor(missing: string[]) {
    super(`Missing GCP environment variables: ${missing.join(', ')}`);
    this.name = 'GcpConfigError';
  }
}

export class OidcTokenError extends Error {
  constructor(cause: unknown) {
    super('Vercel OIDC token unavailable — are you running outside Vercel?');
    this.name = 'OidcTokenError';
    this.cause = cause;
  }
}

function validateGcpEnv(): void {
  const missing = REQUIRED_VARS.filter((v) => !process.env[v as RequiredVar]);
  if (missing.length > 0) throw new GcpConfigError(missing);
}

// ── Auth client factory ───────────────────────────────────────────────────────

/**
 * Returns an authenticated IdentityPoolClient using Vercel OIDC.
 * Creates a new client per call — do not cache across requests.
 */
export async function getGcpSheetsAuthClient(): Promise<IdentityPoolClient> {
  validateGcpEnv();

  const projectNumber = process.env.GCP_PROJECT_NUMBER!;
  const serviceAccount = process.env.GCP_SERVICE_ACCOUNT_EMAIL!;
  const poolId         = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID!;
  const providerId     = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID!;

  const audience =
    `//iam.googleapis.com/projects/${projectNumber}/locations/global` +
    `/workloadIdentityPools/${poolId}/providers/${providerId}`;

  const impersonationUrl =
    `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts` +
    `/${serviceAccount}:generateAccessToken`;

  const client = new IdentityPoolClient({
    audience,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: impersonationUrl,
    subject_token_supplier: {
      getSubjectToken: async () => {
        try {
          return await getVercelOidcToken();
        } catch (err) {
          throw new OidcTokenError(err);
        }
      },
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return client;
}

// ── Failure classification (safe — never leaks tokens or PII) ──────────────────

export type GcpFailureStage =
  | 'create_external_client'
  | 'get_oidc_token'
  | 'exchange_sts'
  | 'impersonate_service_account'
  | 'append_sheet'
  | 'unknown';

export type GcpFailureMessageKey =
  | 'config'
  | 'oidc'
  | 'sts'
  | 'permission'
  | 'notFound'
  | 'generic';

export interface GcpFailure {
  stage: GcpFailureStage;
  code: string;
  httpStatus: number;
  messageKey: GcpFailureMessageKey;
  safeMessage: string;
}

// Strips anything that looks like a JWT and truncates, so logs never carry
// an OIDC token, access token, or oversized payload.
const JWT_RE = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/g;
function redact(value: unknown): string {
  return String(value ?? '').replace(JWT_RE, '<redacted-jwt>').slice(0, 300);
}

function getRequestUrl(err: unknown): string {
  const e = err as { config?: { url?: unknown }; response?: { config?: { url?: unknown } } };
  const raw = e?.config?.url ?? e?.response?.config?.url ?? '';
  try {
    if (typeof raw === 'string') return raw;
    const href = (raw as { href?: string })?.href;
    return href ?? String(raw);
  } catch {
    return '';
  }
}

/**
 * Maps any failure from the OIDC → STS → impersonation → Sheets chain to a
 * structured, sanitized result. Returns a safe machine code and a client
 * message key; never returns tokens, full spreadsheet IDs, or lead data.
 */
export function classifyGcpFailure(err: unknown): GcpFailure {
  if (err instanceof GcpConfigError) {
    return {
      stage: 'create_external_client',
      code: 'GCP_CONFIG_MISSING',
      httpStatus: 503,
      messageKey: 'config',
      safeMessage: redact(err.message),
    };
  }

  if (err instanceof OidcTokenError) {
    return {
      stage: 'get_oidc_token',
      code: 'OIDC_TOKEN_UNAVAILABLE',
      httpStatus: 503,
      messageKey: 'oidc',
      safeMessage: 'Vercel OIDC token unavailable',
    };
  }

  const e = err as {
    message?: string;
    code?: number | string;
    response?: { status?: number; data?: { error?: string; error_description?: string } };
  };
  const url = getRequestUrl(err);
  const googleError = e?.response?.data?.error ?? '';
  const description = e?.response?.data?.error_description ?? '';
  const status = Number(e?.response?.status ?? e?.code ?? 0);
  const haystack = `${googleError} ${description} ${e?.message ?? ''}`.toLowerCase();

  // STS token exchange (Vercel OIDC JWT → federated token)
  if (url.includes('sts.googleapis.com') || googleError === 'invalid_grant' || haystack.includes('expected audience')) {
    let code = 'STS_EXCHANGE_REJECTED';
    if (haystack.includes('audience')) code = 'STS_AUDIENCE_MISMATCH';
    else if (haystack.includes('subject')) code = 'STS_SUBJECT_MISMATCH';
    return { stage: 'exchange_sts', code, httpStatus: 503, messageKey: 'sts', safeMessage: redact(description || googleError) };
  }

  // Service account impersonation (federated token → SA access token)
  if (url.includes('iamcredentials.googleapis.com') || haystack.includes('impersonat')) {
    return {
      stage: 'impersonate_service_account',
      code: 'IMPERSONATION_DENIED',
      httpStatus: 503,
      messageKey: 'permission',
      safeMessage: redact(description || e?.message),
    };
  }

  // Google Sheets append
  if (status === 404 || haystack.includes('unable to parse range') || haystack.includes('not found')) {
    const code = haystack.includes('unable to parse range') ? 'SHEET_TAB_NOT_FOUND' : 'SPREADSHEET_NOT_FOUND';
    return { stage: 'append_sheet', code, httpStatus: 503, messageKey: 'notFound', safeMessage: redact(e?.message) };
  }
  if (status === 403 || haystack.includes('permission_denied') || haystack.includes('insufficient')) {
    const code = haystack.includes('scope') || haystack.includes('insufficient') ? 'SHEETS_SCOPE_MISSING' : 'SHEETS_PERMISSION_DENIED';
    return { stage: 'append_sheet', code, httpStatus: 503, messageKey: 'permission', safeMessage: redact(e?.message) };
  }
  if (url.includes('sheets.googleapis.com')) {
    return { stage: 'append_sheet', code: 'APPEND_REJECTED', httpStatus: 503, messageKey: 'generic', safeMessage: redact(e?.message) };
  }

  return { stage: 'unknown', code: 'UNKNOWN_SERVER_ERROR', httpStatus: 500, messageKey: 'generic', safeMessage: redact(e?.message) };
}
