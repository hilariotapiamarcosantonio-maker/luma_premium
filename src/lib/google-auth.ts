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
