# Luma Premium — Diagnostic Flow Refactor

**Date:** 2026-06-14

---

## Before

```
[Any CTA "Solicitar evaluación"]
        ↓
/diagnostico  (landing page only — no form)
        ↓
CTA "Solicitar evaluación" button
        ↓
/luma-estate-os/diagnostico  (real-estate only form)
        ↓
/luma-estate-os/gracias  (real-estate branded thank-you)
```

**Problems:**
- 2 clicks before reaching the form
- Completely real-estate specific
- Excluded all other industries
- Duplicated form logic
- Inconsistent branding between Luma Premium and Luma Estate OS

## After

```
[Any CTA "Solicitar evaluación"]
        ↓
/diagnostico#assessment-form  (page with form embedded directly)
        ↓
3-step form (multi-industry, dynamic)
        ↓
/diagnostico/gracias  (generic, multi-industry thank-you)
```

**From /luma-estate-os/diagnostico:**
```
/luma-estate-os/diagnostico
        ↓ (redirect — no user action required)
/diagnostico?industry=real-estate&source=luma-estate-os#assessment-form
        ↓ (form pre-selects real estate industry)
Step 2 has "Inmobiliaria / construcción" pre-selected
```

## Files changed

| File | Change |
|------|--------|
| `src/app/diagnostico/page.tsx` | Removed landing-only layout. Embedded `DiagnosticoMaestroForm` directly. |
| `src/app/luma-estate-os/diagnostico/page.tsx` | Replaced with `redirect()` call. |
| `src/app/diagnostico/gracias/page.tsx` | New generic thank-you page. |
| `src/components/diagnostico/DiagnosticoMaestroForm.tsx` | New 3-step multi-industry form. |
| `src/app/api/luma-leads/route.ts` | Added V2 schema support. |
| `src/lib/google-sheets.ts` | Added `appendLumaLeadV2()`. |

## Backward compatibility

- `/luma-estate-os/gracias` still exists (legacy compatibility for any bookmarks)
- V1 API schema still accepted (old form submissions work)
- `appendLumaLead()` function untouched
- All existing real-estate routes remain intact
