# Luma Premium — Vercel OIDC + GCP Workload Identity Federation

**Date:** 2026-06-14  
**Branch:** feat/multilingual-multiniche-diagnostic  
**Status:** Implemented, pending Vercel env var configuration

---

## Previous architecture (service account JSON key)

```
API route
  └─ google.auth.GoogleAuth({ credentials: { client_email, private_key } })
       └─ Reads GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY from env
            └─ Long-lived static credentials stored in Vercel secrets
```

**Risks of the old approach:**
- A leaked `GOOGLE_PRIVATE_KEY` gives permanent access to the spreadsheet
- Key rotation required manual updates in Vercel and locally
- Keys stored in `.env.local` risk accidental commit
- Vercel recommends OIDC for all GCP integrations since 2024

---

## New architecture (Vercel OIDC + Workload Identity)

```
Vercel Function runtime
  └─ getVercelOidcToken()          ← short-lived JWT issued by Vercel
       └─ STS token exchange       ← POST https://sts.googleapis.com/v1/token
            └─ Service account impersonation
                 └─ googleapis Sheets write
```

No JSON keys. No static credentials. Every request uses a token that:
- Is issued per-request by Vercel
- Expires in minutes
- Is scoped only to this project and environment
- Cannot be extracted and reused outside Vercel

---

## GCP configuration (already completed)

| Resource | Value |
|----------|-------|
| Project | `luma-premium-production` |
| Project number | `634208517438` |
| Service account | `luma-premium-web-leads@luma-premium-production.iam.gserviceaccount.com` |
| WIF pool | `vercel-production` |
| WIF provider | `vercel` |
| Subject mapping | `google.subject = assertion.sub` |
| Audience restriction | Vercel project `luma-premium`, environment `production` |

APIs enabled:
- Google Sheets API
- IAM Service Account Credentials API
- Security Token Service API

No JSON keys exist for this service account. None should be created.

---

## Files changed

| File | Change |
|------|--------|
| `src/lib/google-auth.ts` | **New** — OIDC auth factory using `IdentityPoolClient` |
| `src/lib/google-sheets.ts` | Removed `google.auth.GoogleAuth` with key; uses `getGcpSheetsAuthClient()` |
| `src/app/api/luma-leads/route.ts` | Added `export const runtime = 'nodejs'`; structured error classifier |
| `.env.example` | Removed `GOOGLE_CLIENT_EMAIL`/`GOOGLE_PRIVATE_KEY`; added GCP WIF variables |
| `package.json` | Added `@vercel/oidc ^3.6.1` and `google-auth-library ^10.7.0` |

---

## Token flow detail

```
1. Vercel injects VERCEL_OIDC_TOKEN into the Function's environment
2. getVercelOidcToken() reads it from the request context
3. IdentityPoolClient POSTs the JWT to STS:
     POST https://sts.googleapis.com/v1/token
     body: { subject_token: <jwt>, audience: <wif_audience>, ... }
4. STS returns a short-lived federated access token
5. IdentityPoolClient POSTs to IAM Credentials:
     POST https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/<SA>:generateAccessToken
     Authorization: Bearer <federated_token>
6. IAM returns a scoped service account access token
7. googleapis uses the access token to call Sheets API
```

---

## Required Vercel environment variables

Add all of the following under **Project Settings → Environment Variables** for the **Production** environment.

| Variable | Value | Type |
|----------|-------|------|
| `LUMA_LEADS_SPREADSHEET_ID` | _(real ID from Google Sheets URL)_ | Secret |
| `LUMA_LEADS_SHEET_NAME` | `Luma Leads V1` | Plain text |
| `LUMA_LEADS_SHEET_V2_NAME` | `Luma Leads V2` | Plain text |
| `GCP_PROJECT_ID` | `luma-premium-production` | Plain text |
| `GCP_PROJECT_NUMBER` | `634208517438` | Plain text |
| `GCP_SERVICE_ACCOUNT_EMAIL` | `luma-premium-web-leads@luma-premium-production.iam.gserviceaccount.com` | Plain text |
| `GCP_WORKLOAD_IDENTITY_POOL_ID` | `vercel-production` | Plain text |
| `GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID` | `vercel` | Plain text |

**Remove from Vercel (if present):**
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

---

## Error handling

| Error | HTTP | Client message | Logged |
|-------|------|---------------|--------|
| Missing GCP vars | 503 | "Servicio no disponible. Contacte al administrador." | Variable names |
| OIDC token missing | 503 | "Servicio no disponible temporalmente. Intente de nuevo." | Error name |
| Sheet tab not found (404) | 503 | "Error de configuración. Contacte al administrador." | Partial message |
| Permission denied (403) | 503 | "Error de permisos. Contacte al administrador." | Error class |
| Other | 500 | "Error interno del servidor." | Full error |

No tokens, spreadsheet IDs, email addresses, or lead data are ever logged or returned to the browser.

---

## Local development

The OIDC token is only available inside Vercel Functions. Locally:
- `getVercelOidcToken()` throws `OidcTokenError`
- The API returns HTTP 503 with a safe message
- Form validation still works (errors before the Sheets write)
- No Sheets writes occur locally

**Do not add a JSON key fallback.** Local Sheets testing is not a requirement and introducing a fallback would weaken the security model.

---

## Verification plan (post-deploy)

1. Add all Vercel env vars listed above
2. Create `Luma Leads V2` tab: `node scripts/create-luma-leads-v2-sheet.mjs`
3. Deploy to Vercel preview: `git push && vercel --prebuilt`
4. Submit test lead via `/diagnostico` (ES) → verify row in `Luma Leads V2`
5. Submit test lead via `/en/assessment` (EN) → verify row with `locale=en`
6. Submit legacy V1 test via curl → verify row in `Luma Leads V1` (not V2)
7. Check Vercel Function logs — confirm no tokens or IDs in output
8. Promote to production

---

## Rollback procedure

If OIDC fails in production and immediate rollback is needed:

1. In Vercel, add back `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` (from secure storage)
2. Restore `src/lib/google-sheets.ts` to the version using `google.auth.GoogleAuth`
3. Redeploy
4. Investigate OIDC issue (usually: WIF pool condition, audience mismatch, or missing env var)

The old `google.auth.GoogleAuth` approach is in git history — `git show 8a6e5a9:src/lib/google-sheets.ts`.

---

## Security notes

- No JSON key was created for this service account. This is intentional and permanent.
- The `LUMA_LEADS_SPREADSHEET_ID` is the only secret that must be stored securely. Everything else is non-sensitive configuration.
- The WIF provider is restricted to Vercel project `luma-premium` + environment `production`. Preview deployments cannot write to the sheet unless the binding is extended.
- `server-only` import guard ensures auth code never enters the client bundle.
