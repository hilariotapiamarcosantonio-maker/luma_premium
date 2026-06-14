# Luma Premium — Multilingual & Multi-Industry Architecture

**Branch:** feat/multilingual-multiniche-diagnostic  
**Date:** 2026-06-14  
**Phase:** FASE 7 — Multilingual & Multi-Industry Commercial System

---

## Previous architecture (problems)

### Double friction in the evaluation funnel
- `/diagnostico` showed a CTA "Solicitar evaluación" → linked to `/luma-estate-os/diagnostico`
- User had to restart the process on a second page
- The second form was exclusively real-estate focused (operationType, propertyVolume)
- The form had a disclaimer: "Confirmas que diriges una operación inmobiliaria"
- Completely excluded all other industries

### No multilingual support
- All content in Spanish only
- No English routes, no hreflang, no canonical alternates
- No language switcher

### No multi-industry support
- Form hardcoded for real estate verticals
- API route only accepted 10 real-estate-specific fields
- Google Sheets schema had no schema versioning

---

## New architecture

### Route map

#### Spanish (default, unchanged)
| Route | Status |
|-------|--------|
| `/` | Unchanged |
| `/soluciones` | Unchanged |
| `/soluciones/[slug]` | Unchanged |
| `/metodo` | Unchanged |
| `/casos` | Unchanged |
| `/diagnostico` | **Refactored** — form embedded directly |
| `/diagnostico/gracias` | **New** — generic thank-you page |
| `/luma-estate-os` | Unchanged |
| `/luma-estate-os/diagnostico` | **Redirects** → `/diagnostico?industry=real-estate&source=luma-estate-os#assessment-form` |
| `/luma-estate-os/gracias` | Unchanged (legacy compatibility) |
| `/contacto` | Unchanged |

#### English (new)
| Route | Description |
|-------|-------------|
| `/en` | English home |
| `/en/solutions` | English solutions page |
| `/en/assessment` | English diagnostic (same form, English UI) |
| `/en/assessment/thank-you` | English thank-you page |
| `/en/method` | English method page |
| `/en/cases` | English cases page |
| `/en/contact` | English contact page |

### Language switcher
- Component: `src/components/site/LangSwitcher.tsx`
- Added to `SiteHeader` (desktop nav + mobile panel)
- Route map: `/diagnostico` ↔ `/en/assessment`, `/casos` ↔ `/en/cases`, etc.
- No auto-redirect based on browser language (user chooses)

### hreflang & SEO
- Root layout: `alternates.languages` with `es`, `en`, `x-default`
- Each English page: `alternates.canonical` + `alternates.languages` pointing to Spanish equivalent
- Each Spanish page where relevant: `alternates.languages` pointing to `/en/...` equivalent

---

## Multi-industry form

### File
`src/components/diagnostico/DiagnosticoMaestroForm.tsx`

### Industries supported
1. Inmobiliaria / construcción (`real-estate`)
2. Comercio / e-commerce (`commerce`)
3. Beauty / spa / estética (`beauty-spa`)
4. Educación / academia / coaching (`education`)
5. Servicios profesionales (`professional-services`)
6. Servicios locales premium (`local-services`)
7. Finanzas / préstamos (`finance`)
8. Hospitalidad / turismo (`hospitality`)
9. Salud / clínica (`health`)
10. Tecnología / SaaS (`tech-saas`)
11. Otro (`other`)

### Form steps
| Step | Fields |
|------|--------|
| 1 — Profile | fullName, email, phone, company, country, preferredLanguage, role |
| 2 — Operation | industry, industryDetail (dynamic), teamSize, leadVolume, acquisitionChannels, advertisingStatus, currentTools |
| 3 — Objective | mainBottleneck, desiredOutcome, solutionInterest, timeline, investmentRange, consentContact |

### URL param preselection
`/diagnostico?industry=real-estate&source=luma-estate-os` → preselects real estate in Step 2

### Investment ranges (international)
- US$5,000 – US$10,000
- US$10,000 – US$25,000
- US$25,000 – US$50,000
- US$50,000+
- Necesito diagnóstico antes de definirlo

---

## API changes

### File
`src/app/api/luma-leads/route.ts`

### V1 (legacy) — preserved
Accepts old real-estate fields. Routes to `appendLumaLead()` (original Google Sheets function).

### V2 (new) — multi-industry
Detected by `schema_version: '2'`. Routes to `appendLumaLeadV2()`.

#### New fields
`schema_version`, `locale`, `country`, `full_name`, `phone`, `company`, `role`, `industry`, `industry_detail`, `team_size`, `lead_volume`, `acquisition_channels`, `advertising_status`, `current_tools`, `main_bottleneck`, `desired_outcome`, `solution_interest`, `timeline`, `investment_range`, `source`, `page_origin`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `status`

### Security additions
- Honeypot field (`_website`)
- Input sanitization with `sanitize()` helper
- Max length enforcement per field
- HTML character stripping (`<>`)
- Email format validation

---

## Google Sheets

### V1 sheet (unchanged)
Name: `LUMA_LEADS_SHEET_NAME` (default: `Luma Estate Leads`)  
Columns: A:J (10 columns)

### V2 sheet (new)
Name: `LUMA_LEADS_SHEET_V2_NAME` (default: `Luma Leads V2`)  
Columns: A:AC (29 columns — see `V2_COLUMNS` in `google-sheets.ts`)

**Action required:** Create the `Luma Leads V2` sheet tab in the existing Google Spreadsheet, with the 29 column headers matching `V2_COLUMNS`.

---

## Build results

```
Route (app)           Pages
/                     Static
/diagnostico          Static (form embedded)
/diagnostico/gracias  Static
/en                   Static
/en/assessment        Static
/en/assessment/thank-you Static
/en/cases             Static
/en/contact           Static
/en/method            Static
/en/solutions         Static
/luma-estate-os/diagnostico Static (redirect)
... [all others unchanged]

Total: 27 routes — 0 errors
Lint: 0 errors, 0 warnings
```
