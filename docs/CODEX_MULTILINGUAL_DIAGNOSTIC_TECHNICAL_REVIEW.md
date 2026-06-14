# Codex technical review - multilingual diagnostic

Fecha: 2026-06-14  
Rama auditada: `feat/multilingual-multiniche-diagnostic`

## Scope checked

Initial repository checks:

- `git branch --show-current`: `feat/multilingual-multiniche-diagnostic`
- `git status --short`: clean at audit start
- `git log --oneline -8`:
  - `c9c0cad docs: add Tier 1 commercial, legal readiness, and architecture guides`
  - `71aa7e2 feat: add Spanish and English site architecture with language switcher`
  - `13d0aa9 feat: create multi-industry executive assessment API schema`
  - `5e5e2e0 fix: remove double friction from diagnostic conversion flow`
  - `6ab8f43 feat: finalize Luma Premium commercial contact layer`
  - `7d9e81f docs: document premium impact production QA`
  - `3844ff2 merge: integrate Luma Premium premium impact pass`
  - `cfef0c6 feat: elevate Luma Premium with premium impact pass`

Diff reviewed against `main...HEAD`:

- 23 files changed
- 2411 insertions
- 156 deletions
- Main touched areas: diagnostic routes, English routes, language switcher, Luma leads API, Google Sheets writer, documentation.

## Problems found

1. `/en/assessment` embedded the Spanish diagnostic form and submitted to `/diagnostico/gracias`.
   - Impact: English assessment users would see mixed language UI and land on the Spanish thank-you page.

2. `/luma-estate-os/diagnostico` redirected with `industry=real-estate` and `source=luma-estate-os`, but discarded existing UTM params.
   - Impact: attribution was lost for Estate OS campaign traffic.

3. Language switcher did not preserve query params.
   - Impact: switching ES/EN before submitting could lose `source` and UTM attribution.

4. V2 server validation was weaker than client validation.
   - Client required phone, country, role, industry, team size, ad status, bottleneck, investment range, and contact consent.
   - Server only required name and email.

5. Phone validation was missing server-side.

6. `consentContact` was enforced client-side but not sent or validated server-side.

7. Google Sheets writes used `USER_ENTERED`.
   - Impact: user-submitted text could be interpreted by Sheets instead of stored as raw text.

8. `.env.example` did not include `LUMA_LEADS_SHEET_V2_NAME`.

9. English global chrome on `/en` pages still used Spanish header/footer/sticky CTA copy.

## Corrections made

- Added localized ES/EN copy to `DiagnosticoMaestroForm`.
- Passed `locale="es"` from `/diagnostico` and `locale="en"` from `/en/assessment`.
- English submissions now redirect to `/en/assessment/thank-you`.
- Spanish submissions continue to redirect to `/diagnostico/gracias`.
- Added a submit lock with `useRef` in addition to the disabled submit button.
- Added `consent_contact` to the V2 payload.
- Added server-side V2 validation for required fields and consent.
- Added server-side phone validation.
- Preserved incoming query params in `/luma-estate-os/diagnostico`, while forcing:
  - `industry=real-estate`
  - `source=luma-estate-os`
- Preserved query params in the ES/EN language switcher.
- Mapped `/diagnostico/gracias` to `/en/assessment/thank-you` in the language switcher.
- Added English header, footer, and mobile sticky CTA copy/routing for `/en` pages.
- Changed Google Sheets append `valueInputOption` from `USER_ENTERED` to `RAW`.
- Added `LUMA_LEADS_SHEET_V2_NAME=Luma Leads V2` to `.env.example`.
- Created `docs/LUMA_LEADS_V2_SHEET_SCHEMA_EXACT.md`.

## Route audit

Validated locally against production build served at `http://localhost:3210`.

| Route | Result |
| --- | --- |
| `/diagnostico` | Form exists on page via `#assessment-form`; no link to `/luma-estate-os/diagnostico`; ES copy visible. |
| `/diagnostico/gracias` | Spanish thank-you page shows `Solicitud recibida`. |
| `/luma-estate-os/diagnostico?utm_source=ads&utm_medium=cpc&utm_campaign=estate_launch&utm_content=button` | Redirects to `/diagnostico?...&industry=real-estate&source=luma-estate-os#assessment-form`; UTM params preserved. |
| `/en/assessment` | Form exists on page via `#assessment-form`; English copy visible; English nav route active. |
| `/en/assessment/thank-you` | English thank-you page shows `Request received`. |

Step behavior checked in browser:

- Step 1 data persisted after continuing to Step 2 and returning back.
- Estate OS redirect preselected `industry=real-estate` when reaching the industry step.
- ES/EN switcher preserved query params.
- Submit button is disabled while sending and guarded by a submit lock.

No real form success submission was sent during audit; the API was tested only with validation/honeypot cases to avoid writing test leads to Google Sheets.

## Security audit

Client:

- Required fields are validated per step.
- Email uses browser `type=email` and client regex validation.
- Phone now uses client digit-count validation.
- Text inputs and textareas enforce max lengths.
- Honeypot `_website` exists and prevents client submission.
- Submit button is disabled while sending.
- Submit lock prevents duplicate submit races.

Server:

- V2 uses `schema_version: "2"` routing.
- Server sanitizes string fields with trim, max length, and `<`/`>` stripping.
- Server validates email.
- Server validates phone.
- Server validates required V2 fields.
- Server validates `consent_contact === true`.
- Server honeypot returns success without writing.
- Errors return controlled JSON messages.
- Sheets writes now use `RAW` to avoid formula interpretation.

Residual note:

- If the V2 tab is missing, the API returns a generic `500` because Google Sheets rejects the range. This is acceptable as a deployment readiness check, but the tab must be created before production capture.

## Google Sheets V2

Exact V2 fields: 29.  
Exact write range: `A:AC`.  
Exact schema document: `docs/LUMA_LEADS_V2_SHEET_SCHEMA_EXACT.md`.

Header row:

```tsv
schema_version	created_at	locale	country	full_name	email	phone	company	role	industry	industry_detail	team_size	lead_volume	acquisition_channels	advertising_status	current_tools	main_bottleneck	desired_outcome	solution_interest	timeline	investment_range	source	page_origin	utm_source	utm_medium	utm_campaign	utm_content	utm_term	status
```

V2 env var:

- `LUMA_LEADS_SHEET_V2_NAME`
- Default: `Luma Leads V2`

V1 compatibility:

- V1 remains available when `schema_version` is missing or not `"2"`.
- V1 still writes through `appendLumaLead()` to `LUMA_LEADS_SHEET_NAME` or `Luma Estate Leads`.
- V2 does not silently fall back to V1 if the V2 tab is missing.

## Commands run

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| `npx tsc --noEmit` | Passed |

Build output confirmed:

- `/diagnostico` static
- `/diagnostico/gracias` static
- `/en/assessment` static
- `/en/assessment/thank-you` static
- `/luma-estate-os/diagnostico` dynamic, expected because it preserves query params before redirecting
- `/api/luma-leads` dynamic

## Recommendation

Ready for visual QA.

Before production lead capture, create the `Luma Leads V2` tab (or set `LUMA_LEADS_SHEET_V2_NAME` to the exact existing tab name) and paste the 29-field header row from `docs/LUMA_LEADS_V2_SHEET_SCHEMA_EXACT.md`.
