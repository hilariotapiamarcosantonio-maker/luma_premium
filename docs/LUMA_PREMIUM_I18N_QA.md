# Luma Premium — i18n QA Checklist

**Date:** 2026-06-14  
**Branch:** feat/multilingual-multiniche-diagnostic

---

## Routes verified

### Spanish routes (existing — must not break)
- [x] `/` — Home
- [x] `/soluciones` — Solutions
- [x] `/soluciones/[slug]` — Individual solution pages
- [x] `/metodo` — Method
- [x] `/casos` — Cases
- [x] `/diagnostico` — Diagnostic (refactored — form embedded)
- [x] `/diagnostico/gracias` — Thank-you (new)
- [x] `/contacto` — Contact
- [x] `/luma-estate-os` — Estate OS landing
- [x] `/luma-estate-os/diagnostico` — Redirects correctly
- [x] `/luma-estate-os/gracias` — Legacy thank-you (preserved)

### English routes (new)
- [x] `/en` — English home
- [x] `/en/solutions` — English solutions
- [x] `/en/assessment` — English assessment (same form)
- [x] `/en/assessment/thank-you` — English thank-you
- [x] `/en/method` — English method
- [x] `/en/cases` — English cases
- [x] `/en/contact` — English contact

## Language switcher

- [x] Component: `src/components/site/LangSwitcher.tsx`
- [x] Present in desktop nav
- [x] Present in mobile menu
- [x] Shows active language highlighted
- [x] Maps `/diagnostico` ↔ `/en/assessment`
- [x] Maps `/casos` ↔ `/en/cases`
- [x] Maps `/metodo` ↔ `/en/method`
- [x] Maps `/contacto` ↔ `/en/contact`
- [x] Maps `/soluciones` ↔ `/en/solutions`
- [x] Maps `/` ↔ `/en`
- [ ] **TODO:** Maps `/soluciones/[slug]` ↔ `/en/solutions/[slug]` (English individual solution pages not yet created)

## SEO & metadata

- [x] Root layout has `alternates.languages` with `es`, `en`, `x-default`
- [x] English pages have `alternates.canonical` pointing to themselves
- [x] English pages have `alternates.languages` pointing to Spanish equivalents
- [x] English layout sets `openGraph.locale: 'en_US'`
- [x] Spanish root layout sets `openGraph.locale: 'es_ES'`
- [x] `metadataBase` updated to `https://www.lumapremium.com`
- [ ] **TODO:** Sitemap generation (`src/app/sitemap.ts`) — not yet created
- [ ] **TODO:** robots.txt — verify no new routes are blocked

## Form behavior

- [x] `/diagnostico?industry=real-estate` pre-selects real estate
- [x] `/diagnostico?source=luma-estate-os` captures source in submission
- [x] Honeypot field present
- [x] Validation on each step
- [x] Cannot proceed without required fields
- [x] No double submit (button disabled during submission)
- [x] UTM params captured from URL
- [x] Redirects to `/diagnostico/gracias` on success
- [x] Error message shown on API failure

## Build verification

```
npm run lint    → 0 errors, 0 warnings
npm run build   → 27 routes, 0 errors
```

## Pending before push

1. Create `Luma Leads V2` tab in Google Spreadsheet with correct column headers
2. Add `LUMA_LEADS_SHEET_V2_NAME=Luma Leads V2` to Vercel environment variables
3. Human QA on mobile (form overflow, selector behavior)
4. Human QA on desktop (all English routes render correctly)
5. Verify language switcher on `/diagnostico` links to `/en/assessment` correctly
6. Create sitemap if required
7. Final `npm run build` after any last edits
