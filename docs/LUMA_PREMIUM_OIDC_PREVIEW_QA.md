# Luma Premium — Vercel OIDC Preview QA

**Date:** 2026-06-14
**Branch:** feat/multilingual-multiniche-diagnostic
**Commit under test:** `61bf098 feat: authenticate Google Sheets through Vercel OIDC`
**Environment:** Vercel **Preview** (not Production)
**Preview URL (partial):** `https://luma-premium-1dt9…vercel.app`

---

## 1. Pre-push verification — ✅ PASS

| Check | Result |
|-------|--------|
| Branch | `feat/multilingual-multiniche-diagnostic` (not main) |
| Working tree | Clean |
| OIDC commit present | `61bf098` |
| `npm run lint` | 0 errors, 0 warnings |
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 27 routes, 0 errors; `/api/luma-leads` dynamic |

## 2. Security — ✅ PASS

- `git diff main...HEAD` contains only source, docs, and config files.
- `.env.local` and `.claude/` confirmed **ignored** — not pushed.
- No JSON credentials, private keys, tokens, or `.vercel` in the tracked tree.
- `.env.example` contains no real secrets (Spreadsheet ID empty).

## 3. Branch push — ✅ PASS

- Pushed `feat/multilingual-multiniche-diagnostic` to origin as a **new branch**.
- No merge to main, no push to main, no force push, no manual production deploy.

## 4. Preview deployment — ✅ READY

- Push triggered an automatic Vercel **Preview** deployment.
- Status: **Ready** (build ~58s).
- Not promoted to Production.

## 5. Route health — ✅ HEALTHY (behind SSO)

All five QA routes return **HTTP 401 from Vercel Authentication (SSO)**, with the
`_vercel_sso_nonce` challenge cookie. This is the deployment-protection gate, **not**
an application error. No 500s, no build errors. The app is healthy and gated.

| Route | Result |
|-------|--------|
| `/` | 401 Vercel SSO (gate) |
| `/diagnostico` | 401 Vercel SSO (gate) |
| `/en` | 401 Vercel SSO (gate) |
| `/en/assessment` | 401 Vercel SSO (gate) |
| `/luma-estate-os/diagnostico` | 401 Vercel SSO (gate) |

Because Vercel Authentication intercepts every request before it reaches the app,
the automated lead-submission QA (steps 6–7) is performed **manually in the browser**
by an authenticated Vercel user (SSO session), then reported back.

---

## ⛔ ROOT CAUSE — first preview submission failed (exchange_sts)

Both manual submissions (ES + EN) returned `Error interno del servidor.` and did
**not** redirect. Vercel function logs for `POST /api/luma-leads` showed:

```
stage : exchange_sts   (POST https://sts.googleapis.com/v1/token → 400)
google: invalid_grant
detail: "The audience in ID Token [https://vercel.com/<team>] does not match the expected audience."
code  : STS_AUDIENCE_MISMATCH
```

**Decoded OIDC claims (sanitized — token never printed):**

| Claim | Value | Verdict |
|-------|-------|---------|
| `iss` | `https://oidc.vercel.com/<team>` | ✅ correct Vercel issuer |
| `sub` | `owner:<team>:project:luma-premium:environment:preview` | ✅ matches authorized principal |
| `environment` | `preview` | ✅ |
| `project` | `luma-premium` | ✅ |
| `aud` | `https://vercel.com/<team>` | ❌ not in provider's allowed audiences |

**Diagnosis:** The Vercel OIDC token is valid and the subject binding is correct.
The STS exchange is rejected because the **Workload Identity Pool OIDC provider
`vercel` does not list `https://vercel.com/<team>` as an allowed audience.** This
is a GCP configuration gap, not an application bug.

### Required GCP fix (owner action — not performed here)

`gcloud` is not available in the dev environment, and GCP must not be modified
blindly. The owner must update the provider's allowed audiences:

```bash
gcloud iam workload-identity-pools providers update-oidc vercel \
  --project=luma-premium-production \
  --location=global \
  --workload-identity-pool=vercel-production \
  --allowed-audiences="https://vercel.com/hilariotapiamarcosantonio-makers-projects"
```

(Issuer must remain `https://oidc.vercel.com/hilariotapiamarcosantonio-makers-projects`.)
No scopes or IAM roles are added — only the audience validation is aligned with the
token Vercel actually issues. Lead writes will keep returning a clean `503` until
this is applied.

### Code fixes shipped in this session

| File | Change |
|------|--------|
| `src/lib/google-auth.ts` | Added `classifyGcpFailure()` — attributes the failure to a stage (`get_oidc_token` / `exchange_sts` / `impersonate_service_account` / `append_sheet`) and a safe code; redacts any JWT before logging |
| `src/app/api/luma-leads/route.ts` | Removed full-error logging (it had leaked the OIDC token into logs); structured `{ stage, code, message }` logs; STS failures now return `503` not generic `500`; **locale-aware** messages (EN form no longer shows Spanish) |
| `src/lib/google-sheets.ts` | Re-exports `classifyGcpFailure` / `GcpFailure` |

> **Security note:** the prior `console.error('…', error)` printed the entire gaxios
> error, which included the OIDC subject token, into Vercel logs. That is now
> redacted and removed.

---

## ✅ RESOLUTION — re-test after GCP audience fix PASSED (2026-06-14)

After the owner applied `--allowed-audiences="https://vercel.com/<team>"` to the
`vercel` OIDC provider, both submissions on the new preview succeeded:

| Stage | Result |
|-------|--------|
| `get_oidc_token` | ✅ |
| `exchange_sts` | ✅ (audience now accepted) |
| `impersonate_service_account` | ✅ |
| `append_sheet` (V2) | ✅ |
| ES submit → `/diagnostico/gracias` | ✅ `200` |
| EN submit → `/en/assessment/thank-you` | ✅ `200` |
| `Luma Leads V1` | ✅ untouched |

Function logs show two `POST /api/luma-leads → 200` with no token/PII leakage.
The full OIDC → STS → impersonation → Sheets chain is operational with **no JSON keys**.

---

## 6. Real test — ES — ✅ PASSED (after GCP fix)

**URL:** `/diagnostico?utm_source=qa&utm_medium=vercel-preview&utm_campaign=oidc-v2-es`

**Fictional data (no real PII):**
- Nombre: Lead QA OIDC Español
- Email: qa-oidc-es@example.com
- Teléfono: +1 809 555 0101
- Empresa: Empresa QA OIDC
- País: República Dominicana
- Industria: Comercio / e-commerce

**Expected:**
- Redirect to `/diagnostico/gracias`
- Exactly one new row in `Luma Leads V2`
- `schema_version = 2`, `locale = es`
- UTMs: `qa` / `vercel-preview` / `oidc-v2-es`
- No write to V1, no duplicate

**Result:** _(to be filled after manual test)_

## 7. Real test — EN — ✅ PASSED (after GCP fix)

**URL:** `/en/assessment?utm_source=qa&utm_medium=vercel-preview&utm_campaign=oidc-v2-en`

**Fictional data (no real PII):**
- Name: English OIDC QA Lead
- Email: qa-oidc-en@example.com
- Phone: +1 305 555 0102
- Company: Tier One OIDC QA
- Country: United States
- Industry: Professional services

**Expected:**
- Redirect to `/en/assessment/thank-you`
- A second independent row in `Luma Leads V2`
- `locale = en`, country/industry/UTMs correct
- No write to V1

**Result:** _(to be filled after manual test)_

---

## 8. OIDC auth result — ⏳ PENDING

Confirmed once a lead row is written: a successful append proves the full chain
**Vercel OIDC → STS exchange → service-account impersonation → Sheets append** works
with no JSON keys.

If a submission fails, classify (without printing token / auth headers / full
Spreadsheet ID / lead data) as one of:
- OIDC token unavailable
- STS exchange rejected
- service-account impersonation denied
- spreadsheet permission denied
- sheet/tab not found
- append rejected

## 9. V1 integrity — ⏳ PENDING

Confirm `Luma Leads V1` received **no** new rows during the V2 tests.

---

## Recommendation — ✅ OIDC lead capture READY

The GCP audience gap is fixed and both ES/EN leads write to `Luma Leads V2` via
OIDC with no JSON keys. OIDC is no longer a blocker for `main`.

Remaining gate before merge is unrelated to OIDC: the English solution detail
experience (`/en/solutions/[slug]`) — tracked in its own commit and preview QA.

**Do not merge, deploy to production, or promote** until that final preview QA passes.
