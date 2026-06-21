# Luma Premium — Manifiesto de Reemplazo de Imágenes (web pública)

> Registro de **todo** el material visual de la web pública. Actualizado en la
> **Fase 1.2** (landings de venta + brillo/legibilidad). Define qué es provisional
> y cómo sustituirlo por material real de Luma Premium antes de campañas serias.
>
> **visual_type** (clasificación pedida):
> - `stock_temporal` — foto de stock provisional (archivo WebP).
> - `mockup_conceptual` — representación CSS/SVG de producto/proceso (sin archivo, sin datos reales).
> - `screenshot_real` — captura real del sistema (con PII oculta). *Aún no hay ninguno en el repo.*
> - `placeholder_demo` — hueco marcado a la espera de captura/recurso real.
> - `imagen_definitiva` — material propio final. *Aún ninguno.*
>
> Registro central de rutas/alt/tamaños: `src/data/marketing-images.ts`.
> Carga: `next/image` con `width`/`height` o `fill`, `sizes`, `alt` y lazy (salvo heroes con `priority`).

- **Fuente stock:** Unsplash (`images.unsplash.com`). Licencia Unsplash (uso comercial, sin atribución obligatoria) — https://unsplash.com/license
- **Reglas:** no marcas reales, no clientes/equipo/oficina falsos, no resultados/testimonios inventados, alt honesto (concepto, nunca evidencia).

### Ajuste de brillo / overlay (Fase 1.2)

Todas las fotos se sirven ahora más vivas y legibles vía clases utilitarias en los
componentes (no se re-procesaron los archivos):

- **brightness_notes:** `brightness-110 contrast-105` (+ `saturate-105` en editoriales);
  `opacity` subida a `0.95` (antes `0.70`–`0.80`).
- **overlay_notes:** gradientes oscuros reducidos (p. ej. `from-slate-950/90 … to-transparent`,
  antes `from-slate-950 via-slate-950/40`); en editoriales el refuerzo oscuro se limita
  al tercio inferior solo si hay caption, para no apagar la imagen.
- **safe_area:** sujeto centrado; texto/caption siempre sobre el refuerzo inferior.

---

## 1. Fotos stock de soluciones (`SolutionCard`)

Mostradas en tarjetas de: `/`, `/soluciones`, `/en`, `/en/solutions`.

| campo | real-estate-os | real-estate-crm-os | real-estate-concierge-os | commerce-os | beauty-spa-os |
|---|---|---|---|---|---|
| image_id | sol-real-estate-os | sol-crm-os | sol-concierge-os | sol-commerce-os | sol-beauty-os |
| current_file_path | `stock/real-estate-os.webp` | `stock/real-estate-crm-os.webp` | `stock/real-estate-concierge-os.webp` | `stock/commerce-os.webp` | `stock/beauty-spa-os.webp` |
| placeholder_stock | sí | sí | sí | sí | sí |
| replacement_needed | sí | sí | sí | sí | sí |
| replacement_type | sector_photography | crm_screenshot | concierge_mobile_screenshot | ecommerce_admin_screenshot | sector_photography |
| source_system | — | Real Estate CRM OS | Concierge OS | Commerce OS | — |
| recommended_ratio | 1.58:1 | 1.58:1 | 1.58:1 | 1.58:1 | 1.58:1 |
| recommended_dimensions | 1200×760 | 1200×760 | 1200×760 | 1200×760 | 1200×760 |
| recommended_format | WebP | WebP | WebP | WebP | WebP |
| priority | media | alta | alta | media | media |
| peso actual | ~184 KB | ~79 KB | ~77 KB | ~88 KB | ~89 KB |

- alt_es / alt_en: definidos en `SOLUTION_IMAGES` (`src/data/marketing-images.ts`).
- safe_area_notes: el componente aplica gradiente inferior `from-slate-950`; mantener el sujeto en el tercio superior.
- mobile_crop / desktop_crop: `object-cover`, altura fija 160px; centrar el sujeto horizontalmente.
- replacement_instructions: reemplazar `src` en `SOLUTION_IMAGES`; conservar ratio o actualizar `width`/`height`.

## 2. Fotos stock de sectores (`IndustriesSection`)

Inmobiliarias/Comercio/Spas **reutilizan** las imágenes de solución. Propias:

| campo | sector-academias | sector-servicios | sector-equipos |
|---|---|---|---|
| current_file_path | `stock/sector-academias.webp` | `stock/sector-servicios.webp` | `stock/sector-equipos.webp` |
| placeholder_stock | sí | sí | sí |
| replacement_needed | sí | sí | sí |
| replacement_type | sector_photography | sector_photography | sector_photography |
| recommended_dimensions | 1200×760 | 1200×760 | 1200×760 |
| recommended_format | WebP | WebP | WebP |
| priority | baja | baja | media |
| peso actual | ~42 KB | ~65 KB | ~102 KB |

- safe_area / crop: igual que soluciones (gradiente inferior, `object-cover` 144px).
- replacement_instructions: reemplazar `src` en `INDUSTRIES`. `sector-equipos`: no presentar como equipo real de Luma.

## 3. Fotos stock editoriales (NUEVAS — heroes)

| campo | editorial-method | editorial-diagnostic | editorial-contact |
|---|---|---|---|
| image_id | edi-method | edi-diagnostic | edi-contact |
| page | `/metodo`, `/en/method` | `/diagnostico`, `/en/assessment` | `/contacto`, `/en/contact` |
| section | hero | hero | hero |
| current_file_path | `stock/editorial-method.webp` | `stock/editorial-diagnostic.webp` | `stock/editorial-contact.webp` |
| placeholder_stock | sí | sí | sí |
| replacement_needed | sí (opcional) | sí (opcional) | sí (opcional) |
| replacement_type | diagnostic_editorial / process_illustration | diagnostic_editorial | diagnostic_editorial |
| recommended_ratio | 16:9 (mostrado 16:10 / 2:1) | 16:9 (mostrado 2:1) | 16:9 (mostrado 16:10) |
| recommended_dimensions | 1600×900 | 1600×900 | 1600×900 |
| recommended_format | WebP | WebP | WebP |
| priority | media | media | baja |
| peso actual | ~147 KB | ~97 KB | ~81 KB |
| alt_es | Arquitectura e integración de sistemas (abstracto) | Análisis de datos y métricas comerciales | Espacio de trabajo premium para planificación |
| alt_en | Architecture and systems integration (abstract) | Data analysis and commercial metrics | Premium workspace for commercial planning |

- safe_area_notes: `EditorialFigure` aplica overlay diagonal oscuro + caption inferior izquierda; dejar la esquina inferior izquierda despejada.
- mobile_crop / desktop_crop: `fill` + `object-cover`; sujeto centrado, válido en 16:10 y 2:1.
- replacement_instructions: reemplazar `src` en `EDITORIAL_IMAGES`. **No** usar fotos que sugieran equipo/oficina/sede reales de Luma.

## 4. Mockups y diagramas en código (CSS/SVG — sin archivo)

Representaciones **estilizadas** de producto/proceso. No son capturas reales ni
muestran datos. Para máxima autoridad conviene sustituirlas por **capturas reales**
(con datos sensibles ocultos) cuando estén disponibles.

| image_id | componente | visual_type | page / section | replacement_type | replacement_needed | priority |
|---|---|---|---|---|---|---|
| mock-hero | `HeroComposition` | mockup_conceptual | `/`, `/en` · hero | product_composition / real_dashboard_screenshot | recomendado | alta |
| mock-solution-client | `SolutionVisual view="client"` | mockup_conceptual | fichas · hero + demo | premium_mockup → screenshot real (vista cliente) | recomendado | alta |
| mock-solution-team | `SolutionVisual view="team"` (`TeamPanel`) | mockup_conceptual | fichas · "qué ve el equipo" | crm_screenshot / real_dashboard_screenshot | recomendado | alta |
| mock-transform | `SolutionLanding` (Antes→Luma→Después) | mockup_conceptual | fichas · transformación | process_illustration | no | — |
| mock-flow | `CommercialFlowBand` | mockup_conceptual | `/`, `/en` · flujo | process_illustration | no | — |
| mock-method | `MethodJourney` | mockup_conceptual | `/metodo`, `/en/method` | process_illustration | no | — |
| mock-case-thumb | `CaseCard` (thumb) | mockup_conceptual | `/casos`, `/en/cases`, home | browser_mockup + mobile_mockup → screenshot real de la demo | recomendado | media |
| mock-gallery | `SystemGallery` | mockup_conceptual | `/casos`, `/en/cases`, fichas · "Dentro del sistema" | premium_mockup → screenshots reales de módulos | recomendado | media |
| mock-diag-matrix | `DiagnosticMatrix` | mockup_conceptual | `/diagnostico`, `/en/assessment` | process_illustration | no | — |

> **Fichas como landing (Fase 1.2):** cada `/soluciones/[slug]` y `/en/solutions/[slug]`
> usa `SolutionLanding` con 13 bloques (hero, problema, transformación, qué incluye,
> cómo funciona, vista cliente/equipo, demo real, galería, escenario, implementación,
> FAQ, CTA). Los visuales `mock-solution-client` y `mock-solution-team` son los
> candidatos #1 a sustituir por **capturas reales de las demos** (URLs en `src/lib/solutions.ts`).

- safe_area / crop: responsivos por diseño (CSS), sin layout shift; no requieren recorte.
- replacement_instructions: al disponer de capturas reales por sistema, sustituir el
  cuerpo de `SolutionVisual`/`CaseCard`/`SystemGallery` por `next/image` con marco
  (`DeviceFrame`), ocultando PII. `HeroComposition` puede pasar a composición real
  de productos Luma.

---

## Prioridad de sustitución (primero lo de mayor impacto comercial)

1. **`SolutionVisual` (fichas) + `HeroComposition` (home)** → capturas reales de CRM,
   Concierge, Commerce, etc. Es lo que más vende "sistemas reales".
2. **`CaseCard` thumbnails + `SystemGallery`** → capturas reales de las demos públicas.
3. **Stock de soluciones `crm-os` / `concierge-os`** → capturas reales del producto.
4. **Editoriales (método/diagnóstico/contacto)** → opcional; el stock abstracto es aceptable.
5. **Stock de sectores** → menor prioridad; conceptuales.

**Peso total de imágenes (11 WebP):** ~1.05 MB (8 sectoriales ~725 KB + 3 editoriales ~325 KB).
Todas lazy salvo heroes editoriales (`priority`). Los mockups/diagramas no añaden peso de imagen.
