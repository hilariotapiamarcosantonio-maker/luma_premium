# Auditoría Técnica Fase 1.5 — CRM Luma Premium (Reporte de CODEX)

**Documento:** `docs/LUMA_PREMIUM_CRM_PHASE_1_5_CODEX_REVIEW.md`  
**Auditor:** AGENTE 2 — CODEX (Technical Auditor)  
**Rama de Trabajo:** `fix/crm-preview-commercial-normalization`  
**Fecha:** 15 de junio de 2026  

---

## 1. Resumen de la Auditoría

Este documento presenta la revisión técnica detallada del código en la rama `fix/crm-preview-commercial-normalization`, que introduce la capa de normalización de datos comerciales, categorización de industrias y atribución omnicanal para **Luma Premium CRM Fase 1.5**. 

La evaluación determina que **NO existen problemas de nivel BLOCKER ni de severidades HIGH/MEDIUM/LOW**. Todo el código cumple estrictamente con las especificaciones de seguridad, consistencia de datos y requerimientos comerciales del proyecto.

**Estado de la Auditoría: APROBADO (APPROVED)**

---

## 2. Checkpoints de la Revisión

A continuación se exponen las verificaciones ejecutadas para cada uno de los puntos requeridos en el checklist de auditoría:

### 1. Rango de Presupuesto Mínimo Visible
* **Requerimiento:** Asegurar que ningún rango de presupuesto visible sea inferior a **US$1,500**.
* **Estado:** **APPROVED**
* **Detalle:** 
  * En la lógica del normalizador (`src/lib/crm/normalizers.ts`), la función `normalizeInvestmentRange` captura cualquier entrada inferior a US$1,500 (por ejemplo, `"US$1,000-3,000"`, `"menos de 1500"`, `"menos de US$1,500"`) y la re-mapea automáticamente al rango oficial mínimo de **`US$1,500–3,000`**.
  * Para los registros históricos que contienen rangos ambiguos como `"1k-5k"`, el sistema genera internamente el valor especial `legacy_review`. En la UI de detalle de leads y del listado se renderiza automáticamente como **`US$1,500–5,000 (histórico)`**, elevando el umbral de visualización mínimo a US$1,500 para evitar mostrar cifras inferiores.

### 2. Rangos Oficiales en Formularios (ES/EN)
* **Requerimiento:** Confirmar que ambos formularios (Español/Inglés) implementen exactamente los rangos oficiales de inversión.
* **Estado:** **APPROVED**
* **Detalle:**
  * **Formulario Diagnóstico Maestro (`src/components/diagnostico/DiagnosticoMaestroForm.tsx`):**
    * **Español (ES):** El array `investmentRanges` (L231) contiene exactamente:
      1. `US$1,500–3,000`
      2. `US$3,000–5,000`
      3. `US$5,000–10,000`
      4. `US$10,000–20,000`
      5. `US$20,000+`
      6. `Necesito diagnóstico antes de definirlo`
    * **Inglés (EN):** El array `investmentRanges` (L368) contiene exactamente:
      1. `US$1,500–3,000`
      2. `US$3,000–5,000`
      3. `US$5,000–10,000`
      4. `US$10,000–20,000`
      5. `US$20,000+`
      6. `I need an assessment before defining it`
  * **Formulario Inmobiliario Luma Estate (`src/components/luma-estate/DiagnosticoForm.tsx`):**
    * En el elemento `<select name="investmentRange">` (L137-L145), las opciones corresponden de manera idéntica a los rangos oficiales (desde `US$1,500–3,000` hasta `US$20,000+` y `Necesito diagnóstico antes de definirlo`).

### 3. Integridad de Columnas del Ledger (A:AC)
* **Requerimiento:** Confirmar que las columnas de la hoja de cálculo (A:AC) se mantengan sin cambios.
* **Estado:** **APPROVED**
* **Detalle:**
  * La constante `V2_COLUMNS` definida en `src/lib/crm/google-sheets-repository.ts` (L17) y en `src/lib/google-sheets.ts` (L71) contiene exactamente **29 campos**, correspondientes a las columnas de la **A** a la **AC** del Google Sheet.
  * La función `validateSheetHeaders` realiza una validación posicional y de longitud estricta de las columnas para asegurar que la estructura del Ledger no cambie.
  * Se mantiene la lectura inmutables mediante `${sheetName}!A:AC`.

### 4. Seguridad de Endpoint y Autenticación (WIF + OIDC)
* **Requerimiento:** Verificar que `src/lib/google-auth.ts`, el flujo OIDC y la seguridad de endpoints no presenten modificaciones en esta rama.
* **Estado:** **APPROVED**
* **Detalle:**
  * Se realizó un análisis de diferencias (`git diff`) frente a la rama `main` confirmando que `src/lib/google-auth.ts` **no tiene modificaciones**. El mecanismo de obtención de credenciales de Sheets a través de Vercel OIDC y la federación de identidades (Workload Identity Federation) de GCP permanece 100% intacto y seguro.
  * Los filtros de acceso administrativo (`src/proxy.ts` y `src/auth.ts`) comprueban de forma efectiva la sesión y comparan los correos contra la allowlist dinámica provista por variables de entorno (`CRM_ADMIN_EMAILS` y `CRM_SALES_EMAILS`), protegiendo de accesos no autorizados sin cambios en la capa de seguridad.

### 5. Operación de Filtros y Métricas sobre Datos Normalizados
* **Requerimiento:** Verificar que los filtros y métricas operen en base a la data normalizada y no a los datos crudos.
* **Estado:** **APPROVED**
* **Detalle:**
  * **Filtros:** En `listLeads` dentro de `src/lib/crm/google-sheets-repository.ts` (L171), las comparaciones se realizan sobre los campos ya normalizados (ej: `l.investment_range === filters.investment_range` y `l.industry`).
  * **Métricas:** En `getDashboardMetrics` (L236), las agrupaciones y conteos (como `byInvestmentRange`, `byIndustry`, `byPlatform`, `byChannel`) se calculan a partir del array resultante tras la normalización. Esto asegura métricas consistentes y precisas (por ejemplo, consolidando `"commerce"` bajo `"Comercio y e-commerce"`).

### 6. Visualización Raw vs. Normalized en Detalle de Leads
* **Requerimiento:** Confirmar que la página de detalle de leads muestra tanto la data cruda recibida en el formulario como los resultados normalizados.
* **Estado:** **APPROVED**
* **Detalle:**
  * El archivo `src/app/admin/(protected)/leads/[id]/page.tsx` incluye etiquetas condicionales para contrastar la información:
    * **País:** Muestra el nombre normalizado mediante `getCountryLabel(lead.country)` y opcionalmente añade `Original recibido: "{lead.raw_country}"` si difieren.
    * **Industria:** Muestra `lead.industry` (normalizada) y muestra `Original recibido: "{lead.raw_industry}"` si son diferentes.
    * **Presupuesto:** Muestra el rango normalizado de inversión e incluye `Original recibido: "{lead.raw_investment_range}"` si hubo cambio.
    * **Atribución:** Muestra la plataforma y canal normalizados frente a los parámetros originales recibidos (`raw_source`, `raw_utm_source`, `raw_utm_medium`, `raw_utm_campaign`, `raw_page_origin`).

### 7. Inmutabilidad de Registros Históricos en Sheets
* **Requerimiento:** Garantizar que no se modifique ningún registro histórico en Google Sheets.
* **Estado:** **APPROVED**
* **Detalle:**
  * La interfaz `CrmRepository` (definida en `src/lib/crm/repository.ts`) expone únicamente firmas de lectura: `listLeads`, `getLeadById` y `getDashboardMetrics`.
  * La implementación de `GoogleSheetsCrmRepository` no contiene métodos de escritura (`update`, `delete` o `save`).
  * El único punto de entrada de escritura hacia Sheets en la aplicación es para la creación (append) de nuevos prospectos en el endpoint público (`src/app/api/luma-leads/route.ts`), asegurando que la data existente sea completamente de **solo lectura**.

### 8. Prevención de Fugas de PII en Logs de Ejecución
* **Requerimiento:** Confirmar que no se escriba información personal identificable (PII) en los registros de runtime.
* **Estado:** **APPROVED**
* **Detalle:**
  * En `src/app/api/luma-leads/route.ts`, la función `classifyError` captura excepciones utilizando `classifyGcpFailure` y registra únicamente metadatos de diagnóstico (`stage`, `code`, `message`), evitando loguear los datos de entrada del cuerpo del request (nombres, correos, teléfonos).
  * En `src/auth.ts`, el callback de autenticación `signIn` deniega las peticiones no autorizadas de forma silenciosa (`return false`), sin imprimir direcciones de correo electrónico en consola ni persistirlas.
  * La función `redact` en `src/lib/google-auth.ts` filtra y reemplaza cualquier secuencia similar a un JSON Web Token (JWT) para evitar la filtración accidental de firmas criptográficas.

### 9. Rutas Forzadas a Comportamiento Dinámico (Sin Caché Pública)
* **Requerimiento:** Verificar que no se agregue caché a las rutas del panel y que operen bajo comportamiento dinámico.
* **Estado:** **APPROVED**
* **Detalle:**
  * Todos los Server Components del panel administrativo privado:
    * `src/app/admin/(protected)/page.tsx`
    * `src/app/admin/(protected)/leads/page.tsx`
    * `src/app/admin/(protected)/leads/[id]/page.tsx`
  * Declaran de forma explícita al inicio del archivo:
    ```typescript
    export const dynamic = 'force-dynamic';
    export const revalidate = 0;
    ```
  * Esto fuerza a Next.js a evaluar el backend de forma dinámica en cada petición HTTP y deshabilita toda caché estática y pública, garantizando datos en tiempo real y consistencia en los roles.

---

## 3. Resultados de Pruebas Unitarias y de Integración

Se ejecutaron las pruebas automáticas definidas en el archivo utilitario `scripts/test-normalizers.ts`:

```bash
npx tsx scripts/test-normalizers.ts
```

### Log de Ejecución de Pruebas:
```text
Running normalizer tests...
✅ PASS: UTF-8 Produccin
✅ PASS: UTF-8 Espaol
✅ PASS: UTF-8 S
✅ PASS: Valid text not modified
✅ PASS: 1k-3k range mapping
✅ PASS: Under 1.5k mapping
✅ PASS: 1k-5k maps to legacy_review
✅ PASS: 5k-10k range
✅ PASS: commerce industry normalization
✅ PASS: professional-services industry normalization
✅ PASS: Country code DO
✅ PASS: Country name Dominicana
✅ PASS: Country label DO
✅ PASS: Country label US
✅ PASS: facebook/cpc attribution
✅ PASS: google/cpc attribution
✅ PASS: google/organic attribution
✅ PASS: linkedin empty medium attribution
✅ PASS: page origin direct attribution
All tests passed successfully!
```

**Resultado:** **100% de éxito (19/19 asserts correctos)**.

---

## 4. Conclusión y Veredicto de Codex

| ID | Control | Severidad | Estado | Razón |
|---|---|---|---|---|
| 1 | Rango de Presupuesto Mínimo | - | **APPROVED** | Normalizador y UI limitan visualización mínima a US$1,500. |
| 2 | Opciones de Presupuesto en Forms | - | **APPROVED** | Ambos formularios emplean los rangos oficiales de forma exacta. |
| 3 | Estructura de Columnas A:AC | - | **APPROVED** | Se respeta el mapeo posicional de 29 columnas sin alteración. |
| 4 | Seguridad de google-auth.ts | - | **APPROVED** | Sin cambios en OIDC y Workload Identity Federation frente a `main`. |
| 5 | Filtros e Indicadores sobre Normalizados | - | **APPROVED** | La agrupación y búsqueda operan sobre las propiedades normalizadas. |
| 6 | Visualización Comparativa (Raw vs Norm) | - | **APPROVED** | La vista de detalle de lead muestra con claridad ambas vertientes. |
| 7 | Inmutabilidad de Historial de Sheets | - | **APPROVED** | Capa CRM puramente de solo lectura; sin firmas de edición. |
| 8 | Cero Fuga de PII en Logs | - | **APPROVED** | Redacción de tokens, denegación silenciosa y logs sanitizados. |
| 9 | Rutas Dinámicas | - | **APPROVED** | Declaraciones explícitas de `force-dynamic` y revalidate a 0. |

### Veredicto Final:
* **Bloqueadores encontrados:** **NINGUNO**
* **Estado de la rama:** **LISTA PARA PRODUCCIÓN**
