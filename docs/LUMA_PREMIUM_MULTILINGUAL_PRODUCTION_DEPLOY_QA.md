# Luma Premium — Multilingual Production Deployment QA

**Date:** 2026-06-14
**Operation:** Controlled merge of `feat/multilingual-multiniche-diagnostic` → `main` → Production

---

## Deployment identity

| Item | Value |
|------|-------|
| Merge commit | `390f82c` — "merge: integrate multilingual diagnostic and secure OIDC leads" |
| Branch merged | `feat/multilingual-multiniche-diagnostic` (commits `61bf098`, `dafb357`, `f2e1312` + earlier) |
| Project | `luma-premium` |
| Environment | **Production** |
| Branch | `main` |
| Deployment | `https://luma-premium-evhelev79.vercel.app` |
| Status | **Ready** |
| Aliases | `https://www.lumapremium.com`, `https://lumapremium.com` → redirects to `www` |
| Merge type | `--no-ff` (no conflicts) |

---

## Pre-merge validation (on branch)

| Check | Result |
|-------|--------|
| `npm run lint` | 0 errors, 0 warnings |
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | ✓ Compiled, 32/32 static pages, 0 errors |
| Security scan | No private keys, no `ya29.` tokens, no real JWTs, no Spreadsheet ID, no `.env.local`/`.vercel`/`.claude` |

## Post-merge validation (on main)

| Check | Result |
|-------|--------|
| `npm run lint` | 0 errors |
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | ✓ Compiled, 32/32 static pages, 0 errors |
| Working tree | Clean |
| `/api/luma-leads` | `ƒ` Dynamic — Node.js runtime + Vercel OIDC |
| `/luma-estate-os` | Intact (static) |
| Private-key dependency | None (uses `getGcpSheetsAuthClient` / OIDC) |

---

## Public route QA (https://www.lumapremium.com)

**Spanish — all HTTP 200:**
`/`, `/soluciones`, `/soluciones/real-estate-os`, `/soluciones/real-estate-crm-os`,
`/soluciones/real-estate-concierge-os`, `/soluciones/commerce-os`, `/soluciones/beauty-spa-os`,
`/diagnostico`, `/metodo`, `/casos`, `/contacto`, `/luma-estate-os`

**English — all HTTP 200:**
`/en`, `/en/solutions`, `/en/solutions/real-estate-os`, `/en/solutions/real-estate-crm-os`,
`/en/solutions/real-estate-concierge-os`, `/en/solutions/commerce-os`, `/en/solutions/beauty-spa-os`,
`/en/assessment`, `/en/method`, `/en/cases`, `/en/contact`

| Check | Result |
|-------|--------|
| 404s / 500s | None |
| English solution pages — Spanish residual | None |
| English CTAs → `/en/assessment` | ✅ |
| Spanish CTAs → `/diagnostico` | ✅ |
| Accidental ES links in EN pages | None |
| `lumapremium.com` apex → `www` | ✅ redirects |
| `/luma-estate-os/diagnostico` → master diagnostic | ✅ `/diagnostico?industry=real-estate&source=luma-estate-os#assessment-form` |
| Sales Room exposure | None |

> Responsive / hydration: verified on the build (SSG 32/32) and earlier preview QA; the
> chrome components are shared with already-live pages. Final on-device visual glance is
> the owner's (HTTP/content verified here, not pixel layout).

---

## Production form QA

Two clearly-marked QA submissions (no real PII), posted to `/api/luma-leads` in Production
with the exact V2 form payload.

| Test | Campaign | API result | Outcome |
|------|----------|-----------|---------|
| ES — "Lead QA Producción Español" | `multilingual-production-es` | `200 {"success":true}` | Writes to `Luma Leads V2`, `locale=es`; form redirects to `/diagnostico/gracias` |
| EN — "English Production QA Lead" | `multilingual-production-en` | `200 {"success":true}` | Writes to `Luma Leads V2`, `locale=en`; form redirects to `/en/assessment/thank-you` |

| Check | Result |
|-------|--------|
| OIDC → STS → impersonation → Sheets append | ✅ Operational in Production |
| Duplicates | None (one POST each) |
| `Luma Leads V1` | ✅ Untouched (V2 path never calls the V1 writer) |
| Columns A:AC alignment | ✅ Deterministic via fixed `V2_COLUMNS` map |
| Production logs | Two `POST /api/luma-leads → 200` |
| Token / PII in logs | None (leak scan = 0; redaction confirmed) |

> Row-level visual confirmation in `Luma Leads V2` (two QA rows, `locale` values,
> campaigns, no duplicates) is the owner's final glance — this environment has no read
> credentials for the spreadsheet by design. The Spreadsheet ID is not printed.

---

## Security

- No JSON service-account keys exist or are used. Auth is Vercel OIDC + GCP Workload
  Identity Federation.
- No secrets entered `main` (`.env.local`, `.vercel`, `.claude`, keys, tokens, Spreadsheet
  ID all excluded/ignored).
- Production function logs carry no OIDC token, access token, auth header, full Spreadsheet
  ID, or lead PII.

## QA rows — retention

The two production QA rows are **kept** in `Luma Leads V2` for traceability. They are
clearly identifiable (`@example.com` emails, `multilingual-production-*` campaigns) and can
be deleted by the owner at any time. No real lead data was used.

## Known pending items

- Final owner visual glance: solution pages on a real device + the two QA rows in Sheets.
- CRM build is intentionally **not** started — it is the next, separate phase after
  production approval.

---

## Recommendation

**✅ PRODUCTION APPROVED.** The multilingual + multi-niche phase is live on
`https://www.lumapremium.com`: all ES/EN routes return 200, English solution detail pages
are complete with no Spanish residual, the language switcher preserves slug and query
params, OIDC lead capture writes ES/EN rows to `Luma Leads V2` with V1 intact, and no
secrets are exposed. No rollback required.
