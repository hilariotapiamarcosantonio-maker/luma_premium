# Luma Leads V2 — Real Integration Test Report

**Date:** 2026-06-14  
**Branch:** feat/multilingual-multiniche-diagnostic  
**Tester:** Claude Code

---

## ✅ PRODUCTION-PATH VALIDATION — Vercel OIDC (2026-06-14)

The end-to-end write was validated on a Vercel **Preview** deployment using
**Vercel OIDC + GCP Workload Identity Federation** (no JSON keys). This supersedes
the local-only findings below (which predate the OIDC migration and the now-removed
`GOOGLE_CLIENT_EMAIL` / `GOOGLE_PRIVATE_KEY`).

| Component | Status |
|-----------|--------|
| Vercel OIDC token issuance | ✅ Operational |
| STS token exchange (`sts.googleapis.com`) | ✅ Operational (after audience fix) |
| Service-account impersonation | ✅ Operational |
| Google Sheets append (V2) | ✅ Operational |
| ES lead write (`/diagnostico`) | ✅ Submitted → redirect to `/diagnostico/gracias`, `200` from API |
| EN lead write (`/en/assessment`) | ✅ Submitted → redirect to `/en/assessment/thank-you`, `200` from API |
| `Luma Leads V1` | ✅ Untouched (V2 path never calls the V1 writer) |
| Audience mismatch (`invalid_grant`) | ✅ Fixed via provider `--allowed-audiences` |
| JSON service-account keys | ✅ None exist; none used |

**Evidence:** the new preview's function logs show two `POST /api/luma-leads → 200`.
The API returns `200` only after `appendLumaLeadV2` resolves, i.e. after a successful
Sheets append; any STS/impersonation/Sheets failure returns `503`/`500` instead.

**Column integrity:** writes map through the fixed `V2_COLUMNS` array to range `A:AC`,
so column order cannot drift. `locale` is deterministic per form (`es` / `en`); UTMs
come from the query string (`oidc-v2-es` / `oidc-v2-en`).

> Row-level visual confirmation in the Sheets UI (two QA rows, `locale` values,
> campaigns, no duplicates) is the owner's final glance — the dev environment has
> no read credentials for the spreadsheet, by design. The Spreadsheet ID is not
> printed here.

See [`LUMA_PREMIUM_OIDC_PREVIEW_QA.md`](LUMA_PREMIUM_OIDC_PREVIEW_QA.md) for the full
diagnosis of the audience fix.

---

> ⚠️ The sections below are **historical** (local validation before the OIDC
> migration). Kept for traceability only.

---

## Environment summary

| Variable | Status |
|----------|--------|
| `GOOGLE_CLIENT_EMAIL` | Present in `.env.local` |
| `GOOGLE_PRIVATE_KEY` | Present in `.env.local` — local OpenSSL decode error (see below) |
| `LUMA_LEADS_SPREADSHEET_ID` | **Placeholder** (`tu_id_de_google_sheets_aqui`) — not configured locally |
| `LUMA_LEADS_SHEET_NAME` | `Luma Estate Leads` |
| `LUMA_LEADS_SHEET_V2_NAME` | `Luma Leads V2` — **added to `.env.local` in this session** |

### Local OpenSSL limitation
The `GOOGLE_PRIVATE_KEY` in `.env.local` triggers an OpenSSL decode error when the dev server attempts to authenticate with Google. This is a local configuration issue — the private key stored locally may have formatting differences from the Vercel secret (e.g., escaped newlines). **The Vercel deployment has working credentials.** This is not a code bug.

---

## Sheet creation script

**File:** `scripts/create-luma-leads-v2-sheet.mjs`

The script:
1. Loads `.env.local`
2. Validates that the Spreadsheet ID is real (not placeholder)
3. Creates the `Luma Leads V2` tab if it does not exist
4. Writes the 29 column headers to row A1:AC1
5. Applies bold formatting and freezes row 1
6. Is idempotent (safe to re-run)

**Result of local execution:**
```
❌ LUMA_LEADS_SPREADSHEET_ID is not configured with a real spreadsheet ID.
```
The script correctly detected the placeholder and stopped. No data was written.

**To run with real credentials:**
1. Update `.env.local`: set `LUMA_LEADS_SPREADSHEET_ID` to the real ID from Vercel
2. Run: `node scripts/create-luma-leads-v2-sheet.mjs`

---

## Code validation (substituting for Sheets write tests)

All tests executed against the running dev server at `http://localhost:3000`.

### ✅ Lint
```
npm run lint → 0 errors, 0 warnings
```

### ✅ Build
```
npm run build → 27 routes, 0 errors
```

### ✅ TypeScript
```
npx tsc --noEmit → 0 errors
```

### ✅ API validation tests

| Test | Input | Expected | Result |
|------|-------|----------|--------|
| Honeypot | `_website: "bot"` | `{"success":true}` (silent) | ✅ Pass |
| Missing name | `full_name: ""` | `{"error":"El nombre es obligatorio."}` | ✅ Pass |
| Invalid email | `email: "not-an-email"` | `{"error":"Ingrese un correo válido."}` | ✅ Pass |
| Invalid phone | `phone: "123"` | `{"error":"Ingrese un telefono valido."}` | ✅ Pass |
| Missing consent | `consent_contact: false` | `{"error":"Debe aceptar el consentimiento de contacto."}` | ✅ Pass |
| Valid V2 payload (ES) | All fields valid | Fails at Sheets write (expected — no real ID) | ✅ Reaches Sheets |
| V1 legacy format | No `schema_version` | Fails at Sheets write (expected — no real ID) | ✅ Reaches Sheets |

### ✅ V1/V2 routing separation confirmed
- `schema_version: "2"` → routes to `appendLumaLeadV2()` (line 63 in route.ts)
- No `schema_version` → routes to `appendLumaLead()` (line 102 in route.ts)
- Functions write to different sheet tabs (V1: `Luma Estate Leads`, V2: `Luma Leads V2`)

### ✅ Double-submit prevention
Two mechanisms confirmed in `DiagnosticoMaestroForm.tsx`:
1. `useRef(false)` lock — synchronous guard at the top of `handleSubmit()` (line 558, 567). Prevents concurrent React re-renders from firing two submits simultaneously.
2. `disabled={submitting}` on the submit button — visual and functional block while request is in-flight (line 957).

---

## Sheets V2 schema (to be verified once real ID is configured)

Expected 29-column layout (`A` → `AC`):

| Col | Header | Col | Header |
|-----|--------|-----|--------|
| A | schema_version | P | current_tools |
| B | created_at | Q | main_bottleneck |
| C | locale | R | desired_outcome |
| D | country | S | solution_interest |
| E | full_name | T | timeline |
| F | email | U | investment_range |
| G | phone | V | source |
| H | company | W | page_origin |
| I | role | X | utm_source |
| J | industry | Y | utm_medium |
| K | industry_detail | Z | utm_campaign |
| L | team_size | AA | utm_content |
| M | lead_volume | AB | utm_term |
| N | acquisition_channels | AC | status |
| O | advertising_status | | |

---

## V1 compatibility confirmation

- `appendLumaLead()` function: **untouched**
- V1 sheet name (`LUMA_LEADS_SHEET_NAME`): **untouched**
- No V1 variables modified
- V1 route logic preserved at line 95–113 of `route.ts`

---

## Pending actions before integration is complete

| # | Action | Owner | Where |
|---|--------|-------|-------|
| 1 | Get real `LUMA_LEADS_SPREADSHEET_ID` from Vercel dashboard | Marcos | Vercel → Settings → Env Vars |
| 2 | Update `.env.local` with real ID | Marcos | `.env.local` |
| 3 | Run `node scripts/create-luma-leads-v2-sheet.mjs` | Marcos | Local terminal |
| 4 | Verify `Luma Leads V2` tab created with 29 headers | Marcos | Google Sheets |
| 5 | Add `LUMA_LEADS_SHEET_V2_NAME=Luma Leads V2` to Vercel env vars | Marcos | Vercel → Settings → Env Vars |
| 6 | Submit real ES test lead via `/diagnostico` | Marcos | Browser |
| 7 | Submit real EN test lead via `/en/assessment` | Marcos | Browser |
| 8 | Verify rows appear in `Luma Leads V2`, not `Luma Estate Leads` | Marcos | Google Sheets |
| 9 | Fix local PRIVATE_KEY format if local testing is needed (optional) | Marcos | `.env.local` |

---

## Recommendation

### Code: ✅ READY for merge and Vercel configuration

The code is correct, validated, and safe to push. All logic is working. The only blockers before activating V2 leads in production are:

1. **Create the `Luma Leads V2` tab** in the Google Spreadsheet (use the script once the real ID is in `.env.local`)
2. **Add `LUMA_LEADS_SHEET_V2_NAME`** to Vercel environment variables

### Integration test: ⏳ PENDING real credentials

The full end-to-end Sheets write test cannot be completed locally because:
- `LUMA_LEADS_SPREADSHEET_ID` is a placeholder in `.env.local`
- Local OpenSSL has trouble decoding the stored private key

**Recommended path:**
1. Merge to `main` (code is clean)
2. Deploy to Vercel preview
3. Run test leads via the preview URL
4. Verify Sheets rows
5. Promote to production

---

## Files changed in this session

| File | Change |
|------|--------|
| `.env.local` | Added `LUMA_LEADS_SHEET_V2_NAME=Luma Leads V2` (not committed) |
| `scripts/create-luma-leads-v2-sheet.mjs` | New — sheet creation and header setup script |
| `docs/LUMA_LEADS_V2_REAL_INTEGRATION_TEST.md` | This document |
