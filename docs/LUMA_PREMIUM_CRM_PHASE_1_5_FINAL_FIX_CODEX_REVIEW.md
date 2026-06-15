# Luma Premium CRM Phase 1.5 Final Fix - Codex Review

Fecha: 2026-06-15

Resultado: **APPROVED**

## Alcance auditado

- Workspace: `F:\Luma Premium`
- Rama: `feat/luma-premium-crm-mvp`
- HEAD auditado: `61844adb7371b722f2b7ddcfbc0a796951de5447`
- Commit tecnico de correccion final: `3050326c7047276123ac4390cf067efa46a3870c` (`fix: preserve original CRM lead values before normalization`)
- Commit documental posterior: `61844ad` (`docs: add final Codex review for CRM phase 1.5`)

No se hizo commit, push, merge ni deployment durante esta auditoria.

## Veredicto

La correccion final queda aprobada. El blocker anterior sobre `raw_*` fue corregido: tanto Sheets como Mock usan el helper compartido `mapRowArrayToNormalizedFields`, que preserva los valores originales en `rawMappedObject` antes de aplicar `trim`, UTF-8, Zod o normalizaciones.

## 1. Preservacion exacta de `raw_*`

**Aprobado.**

Implementacion:

- `src/lib/crm/normalizers.ts:349-408` crea dos objetos:
  - `rawMappedObject`: valor exacto de la celda/fila, sin `trim`, UTF-8, Zod ni normalizacion.
  - `correctedMappedObject`: valor corregido con `fixUtf8Encoding` para validacion y normalizacion.
- `src/lib/crm/google-sheets-repository.ts:87-106` usa `mapRowArrayToNormalizedFields(row, V2_COLUMNS)` para Sheets.
- `src/lib/crm/mock-repository.ts:275-298` construye el row array desde `MOCK_LEADS_RAW` y usa el mismo helper para Mock.

Casos verificados directamente con `tsx`:

```text
Produccin -> raw_industry: Produccin / industry visual: Producción
US$1,000–3,000 -> raw_investment_range igual / investment_range: US$1,500–3,000
facebook -> raw_utm_source: facebook / platform: meta
DO -> raw_country: DO / country: DO
```

Prueba adicional con espacios intencionales:

```text
raw_country: " DO " / country: DO
raw_industry: " Produccin " / industry: Producción
raw_investment_range: " US$1,000–3,000 " / investment_range: US$1,500–3,000
raw_utm_source: " facebook " / platform: meta
raw_utm_medium: " cpc " / channel: paid_social
```

Esto confirma que `raw_*` conserva el valor original antes de `trim`.

## 2. `lead_id` estable, deterministico y sin PII

**Aprobado.**

Implementacion revisada:

- `src/lib/crm/lead-identity.ts:42-58`
- `generateLeadId` normaliza email, telefono y company para estabilidad.
- Construye un string interno con `schema_version`, `created_at`, `locale`, email normalizado, telefono normalizado y company normalizada.
- Devuelve solo `lp_` + 24 caracteres hex de SHA-256.
- `isValidLeadId` exige `^lp_[a-f0-9]{24}$`.

Verificacion directa:

```text
User@Test.com / +1 (809) 555-1234 / Test Company
user@test.com / 18095551234 / test company
```

Ambos generan el mismo ID:

```text
lp_7119b22162d10dc66c3cf9fb
```

El ID es estable, deterministico, valido y no contiene email, telefono ni nombre de empresa en claro.

## 3. `legacy_review`

**Aprobado.**

La etiqueta visible queda uniforme como:

```text
US$1,500–5,000 (histórico)
```

Ubicaciones verificadas:

- `src/app/admin/(protected)/page.tsx:189`
- `src/app/admin/(protected)/leads/page.tsx:122`
- `src/app/admin/(protected)/leads/[id]/page.tsx:198-200`

El valor interno permanece como `legacy_review`.

## 4. `server-only` en package files

**Aprobado con nota.**

Se agrego:

- `package.json`: `devDependencies.server-only = ^0.0.1`
- `package-lock.json`: entrada `node_modules/server-only`

Motivo observado:

- El proyecto ya usa `import 'server-only'` en modulos server/DAL: `src/lib/google-auth.ts`, `src/lib/google-sheets.ts`, `src/proxy.ts`, `src/lib/crm/*`, etc.
- Next.js 16 documenta que instalar `server-only` es opcional porque Next maneja estos imports internamente y el contenido del paquete NPM no se usa en el bundler.
- En este repo, sin embargo, `scripts/test-normalizers.ts` ahora importa `MockCrmRepository` y `GoogleSheetsCrmRepository` directamente con `tsx`, fuera del bundler de Next. Para ese flujo de test, el paquete instalado evita el error `Cannot find module 'server-only'`.

Conclusion:

- No es estrictamente necesario para runtime/bundling de Next.
- Si se mantienen tests `tsx` que importan modulos con `import 'server-only'`, es necesario o al menos practicamente util como dependencia de desarrollo.
- No recomiendo retirarlo salvo que se cambien los tests para mockear/aliasar `server-only`.
- Tenerlo en `devDependencies` es coherente con su uso actual de tooling.

## 5. Pruebas ejecutadas

```powershell
npx tsx scripts/test-normalizers.ts
```

Resultado: PASS. Incluye pruebas de UTF-8, presupuesto, filtros, preservacion `raw_*`, Mock repository y consistencia de columnas con `GoogleSheetsCrmRepository`.

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

```powershell
git diff --check
```

Resultado: PASS sin errores de whitespace. Solo aviso existente:

```text
warning: in the working copy of 'AGENTS.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'docs/LUMA_PREMIUM_CRM_PHASE_1_5_FINAL_FIX_CODEX_REVIEW.md', LF will be replaced by CRLF the next time Git touches it
```

```powershell
git status --short --branch
```

Estado antes de actualizar este informe:

```text
## feat/luma-premium-crm-mvp...origin/feat/luma-premium-crm-mvp
 M AGENTS.md
```

Estado esperado tras actualizar este informe:

```text
## feat/luma-premium-crm-mvp...origin/feat/luma-premium-crm-mvp
 M AGENTS.md
 M docs/LUMA_PREMIUM_CRM_PHASE_1_5_FINAL_FIX_CODEX_REVIEW.md
```

## 6. Seguridad y alcance

**Aprobado.**

CRM read-only:

- `src/lib/crm/google-sheets-repository.ts` usa `sheets.spreadsheets.values.get`.
- No hay escrituras CRM (`append`, `update`, `batchUpdate`, `clear`) en `src/lib/crm` ni en rutas admin.

Sin cambios OAuth/OIDC:

- En el diff de `89f1c88..HEAD` no cambiaron:
  - `src/lib/google-auth.ts`
  - `src/lib/google-sheets.ts`
  - `src/app/api/luma-leads/route.ts`
  - `src/auth.ts`
  - `src/proxy.ts`
- Los unicos cambios de package relacionados son `server-only` en devDependencies/lockfile.

Sin escrituras en `Luma Leads V2` por el CRM:

- El CRM sigue leyendo `${sheetName}!A:AC`.
- Las escrituras publicas existentes en `src/lib/google-sheets.ts` pertenecen al flujo de captura de leads y no fueron modificadas por esta correccion.

`AGENTS.md`:

- `git log main..HEAD -- AGENTS.md` no devuelve commits.
- `AGENTS.md` esta modificado en working tree, pero no fue incluido en commits de esta rama.

Main/deploy:

- HEAD actual no esta contenido en `main`.
- `main` permanece en `b98e340d27bd6edcf94ec1a1885aa3824b0b4487`.
- No se ejecuto merge a `main` en esta auditoria.
- No se ejecuto production deployment en esta auditoria. Desde el repositorio local no hay evidencia de un deployment production asociado a esta correccion.

## Archivos revisados

- `src/lib/crm/normalizers.ts`
- `src/lib/crm/google-sheets-repository.ts`
- `src/lib/crm/mock-repository.ts`
- `src/lib/crm/lead-identity.ts`
- `src/lib/crm/types.ts`
- `src/lib/crm/schemas.ts`
- `scripts/test-normalizers.ts`
- `src/app/admin/(protected)/page.tsx`
- `src/app/admin/(protected)/leads/page.tsx`
- `src/app/admin/(protected)/leads/[id]/page.tsx`
- `package.json`
- `package-lock.json`
- `src/lib/google-auth.ts`
- `src/lib/google-sheets.ts`
- `src/app/api/luma-leads/route.ts`
- `src/auth.ts`
- `src/proxy.ts`
