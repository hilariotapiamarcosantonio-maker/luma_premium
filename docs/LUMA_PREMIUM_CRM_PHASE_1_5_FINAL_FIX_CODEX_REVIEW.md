# Luma Premium CRM Phase 1.5 Final Fix - Codex Review

Fecha: 2026-06-15

Resultado: **BLOCKED**

## Alcance auditado

- Rama actual: `feat/luma-premium-crm-mvp`.
- Commit solicitado por el usuario: `89f1c88c7d0d08003f0b09d660e1d0f50b4ec2db`.
- Ese hash completo no existe en este clon (`fatal: bad object`).
- Commit auditado: `89f1c882c264b1dd239ef7c423ade3b9a8188d3d` (`89f1c88`), HEAD actual de la rama y de `origin/feat/luma-premium-crm-mvp`.
- Preview reportado: `https://luma-premium-rlzg5p719.vercel.app` (revision realizada por codigo local, no por navegacion del preview).

## Hallazgos por severidad

### BLOCKER - `raw_*` no conserva el valor original de Sheets

El requisito indica que el orden debe ser:

`raw original -> correccion visual -> normalizacion`

Pero en `src/lib/crm/google-sheets-repository.ts` el valor se transforma con `fixUtf8Encoding(rawVal)` antes de construir `validData` y antes de asignar los campos `raw_*`:

- `src/lib/crm/google-sheets-repository.ts:94-100`: cada celda se guarda en `mappedObj[colName] = fixUtf8Encoding(rawVal)`.
- `src/lib/crm/google-sheets-repository.ts:112-119`: `raw_investment_range`, `raw_country`, `raw_industry`, `raw_source`, `raw_utm_source`, `raw_utm_medium`, `raw_utm_campaign` y `raw_page_origin` se toman de `validData`, ya corregido.

El mock replica el mismo patron:

- `src/lib/crm/mock-repository.ts:250-254`: crea `cleaned` aplicando `fixUtf8Encoding`.
- `src/lib/crm/mock-repository.ts:257-264`: los `raw_*` salen de `cleaned`, no del objeto `raw` original.

Impacto: si Sheets contiene `Producci�n`, `Espa�ol` o `S�`, el campo `raw_*` termina guardando `Producción`, `Español` o `Sí`. Eso impide auditar que recibio originalmente la hoja y contradice explicitamente el requisito de datos originales.

### MINOR - Etiqueta historica no es uniforme en todo el admin

El detalle del lead renderiza `legacy_review` como `US$1,500–5,000 (histórico)`, pero el dashboard y el filtro admin aun muestran `Revisión Histórica (1k-5k)`.

- `src/app/admin/(protected)/leads/[id]/page.tsx:198-200`: `legacy_review` -> `US$1,500–5,000 (histórico)`.
- `src/app/admin/(protected)/page.tsx:189`: `legacy_review` -> `Revisión Histórica (1k-5k)`.
- `src/app/admin/(protected)/leads/page.tsx:122`: opcion de filtro admin `legacy_review` -> `Revisión Histórica (1k-5k)`.

No es una opcion publica del formulario y el valor interno se mantiene como `legacy_review`, pero la copia visible admin sigue mencionando `1k-5k`.

## Resultado UTF-8

**Aprobado.**

Inspeccion directa de `src/lib/crm/normalizers.ts`:

- No existe `replace(/S/g, ...)`.
- No existe `replaceAll("S", ...)` ni `replaceAll('S', ...)`.
- La unica regla sobre `S` es `S\uFFFD -> Sí`.
- Las reglas son especificas para secuencias danadas: `Producci\uFFFDn`, `Produccin`, `Espa\uFFFDol`, `Espa\uFFFDl`, `Espaol`, `S\uFFFD`.

Verificacion directa con `tsx`:

- `S -> S`
- `US -> US`
- `US$ -> US$`
- `USA -> USA`
- `USD -> USD`
- `Sales -> Sales`
- `Servicios -> Servicios`
- `S� -> Sí`
- `Producci�n -> Producción`
- `Espa�ol -> Español`

No hay blocker por conversion indebida de una `S` valida.

## Resultado de presupuesto

**Aprobado para normalizacion y opciones publicas; con observacion menor de etiqueta admin historica.**

Verificacion directa:

- `US$1,000–3,000 -> US$1,500–3,000`
- `US$1,000-3,000 -> US$1,500–3,000`
- `1k–3k -> US$1,500–3,000`
- `Menos de US$1,500 -> US$1,500–3,000`
- `1k–5k -> legacy_review`

Formulario publico:

- `src/components/diagnostico/DiagnosticoMaestroForm.tsx:231-238`
- `src/components/diagnostico/DiagnosticoMaestroForm.tsx:368-375`
- `src/components/luma-estate/DiagnosticoForm.tsx:137-145`

Las opciones publicas empiezan en `US$1,500–3,000`; no aparece `US$1,000`, `1k` ni `Menos de US$1,500` como opcion oficial publica.

`US$1,500–5,000 (histórico)` aparece solo condicionado a `legacy_review` en el detalle del lead. El filtro y dashboard admin usan otra etiqueta historica (`Revisión Histórica (1k-5k)`), reportada arriba como observacion menor.

`Original recibido` en UI se renderiza de forma condicional cuando raw y normalizado difieren, pero el valor raw subyacente no es verdaderamente original por el BLOCKER de orden de transformacion.

## Datos originales

**No aprobado.**

El pipeline actual aplica correccion visual antes de preservar `raw_*`. Por tanto no cumple:

`raw original -> correccion visual -> normalizacion`

Campos afectados por el patron actual:

- `raw_investment_range`
- `raw_country`
- `raw_industry`
- `raw_source`
- `raw_utm_source`
- `raw_utm_medium`
- `raw_utm_campaign`
- `raw_page_origin`

## Resultado UI

**Aprobado con observacion menor.**

Confirmado:

- `Detalle de industria` tiene etiqueta visible en el detalle del lead.
- La URL de landing se renderiza como enlace clicable con `href`, `target="_blank"` y `rel="noopener noreferrer"`.
- La URL usa `break-all block max-w-full`.
- No se encontro `overflow-x-hidden` global para esconder el defecto.
- Hay solucion de layout con `min-w-0` en el layout admin y `max-w-full`/`break-all` en la URL.
- Plataformas y canales se muestran con etiquetas españolas mediante `getPlatformLabel` y `getChannelLabel`.
- Los valores internos en filtros permanecen en ingles (`web`, `direct`, `paid_social`, etc.).

Observacion: el legacy admin aun muestra `1k-5k` en dashboard/filtro, aunque no como opcion publica del formulario.

## Resultado de filtros

**Aprobado por inspeccion de codigo y pruebas existentes.**

Repositorio real:

- `src/lib/crm/google-sheets-repository.ts:181-197` filtra contra valores normalizados:
  - `l.country`
  - `l.investment_range`
  - `l.platform`
  - `l.channel`

Mock:

- `src/lib/crm/mock-repository.ts:319-335` replica la misma logica.

UI de filtros:

- `country=DO`
- `platform=web`
- `channel=direct`
- `investment_range=US$1,500–3,000`

Todos se envian como valores internos, no como etiquetas traducidas.

Prueba ejecutada:

- `npx tsx scripts/test-normalizers.ts`

El script cubre `País=DO -> cero leads US`, presupuesto `US$1,500–3,000` y combinacion de filtros. No cubre exactamente `platform=web` ni `channel=direct`, pero esos dos quedaron confirmados por inspeccion directa del formulario y de `listLeads`.

## Seguridad y alcance

**Aprobado.**

Sin cambios en el commit auditado:

- `src/lib/google-auth.ts`
- `src/lib/google-sheets.ts`
- `src/app/api/luma-leads/route.ts`
- `src/auth.ts`
- `src/proxy.ts`

Confirmado:

- El CRM afectado por este hotfix es read-only: `src/lib/crm/google-sheets-repository.ts` usa `sheets.spreadsheets.values.get`.
- No se agregaron escrituras CRM ni operaciones `append`, `update`, `batchUpdate`, `clear`, `delete`.
- No se agregaron pestañas sidecar.
- No hubo cambios de esquema ni escrituras sobre `Luma Leads V2 A:AC`.
- No se detectaron secretos en el diff.
- No se detecto PII nueva en logs del diff. El unico log CRM relevante permanece como codigo seguro `CRM_SHEET_SCHEMA_MISMATCH`.

Nota: la ruta publica historica `src/app/api/luma-leads/route.ts` y `src/lib/google-sheets.ts` siguen teniendo escrituras de captura de leads, pero no fueron modificadas por este hotfix.

## Archivos revisados

- `src/lib/crm/normalizers.ts`
- `scripts/test-normalizers.ts`
- `src/lib/crm/google-sheets-repository.ts`
- `src/lib/crm/mock-repository.ts`
- `src/lib/crm/schemas.ts`
- `src/lib/crm/types.ts`
- `src/app/admin/(protected)/layout.tsx`
- `src/app/admin/(protected)/page.tsx`
- `src/app/admin/(protected)/leads/page.tsx`
- `src/app/admin/(protected)/leads/[id]/page.tsx`
- `src/components/diagnostico/DiagnosticoMaestroForm.tsx`
- `src/components/luma-estate/DiagnosticoForm.tsx`
- `src/lib/google-auth.ts`
- `src/lib/google-sheets.ts`
- `src/app/api/luma-leads/route.ts`
- `src/auth.ts`
- `src/proxy.ts`

## Pruebas ejecutadas

```powershell
npx tsx scripts/test-normalizers.ts
```

Resultado: PASS.

```powershell
npm run lint
```

Resultado: PASS.

```powershell
npx tsc --noEmit
```

Resultado: PASS.

```powershell
npm run build
```

Resultado: PASS. Next.js 16.2.4 compilo correctamente con Turbopack.

## Git status

Estado final capturado despues de crear este informe:

```text
## feat/luma-premium-crm-mvp...origin/feat/luma-premium-crm-mvp
 M AGENTS.md
?? docs/LUMA_PREMIUM_CRM_PHASE_1_5_FINAL_FIX_CODEX_REVIEW.md
```

`AGENTS.md` ya estaba modificado antes de la auditoria y no fue tocado por esta revision.
