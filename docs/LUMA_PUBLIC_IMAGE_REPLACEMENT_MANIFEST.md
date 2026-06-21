# Luma Premium — Manifiesto de Reemplazo de Imágenes (web pública)

> Registro de todo el material visual de la web pública. Actualizado para cumplir con las categorías obligatorias del sistema visual y dirección de arte.

## Categorías de Clasificación Visual

1. **`fotografía stock temporal`** — Fotos de stock comerciales provisionales (archivos WebP locales) que ambientan los sectores y la estética general.
2. **`screenshot de demo pública`** — Capturas o vistas directas de las demos públicas funcionales (CRM, Real Estate, etc.) que validan "sistemas reales".
3. **`mockup conceptual`** — Representaciones estilizadas e interactivas construidas mediante código puro (CSS/SVG) que simulan paneles de control, flujos y chats de demostración, sin datos reales.
4. **`imagen definitiva pendiente`** — Materiales finales de marca, producto o equipo que se integrarán en producción.

---

## 1. Fotos stock de soluciones (`SolutionCard`)
*Mostradas en tarjetas de `/`, `/soluciones`, `/en`, `/en/solutions`.*

| campo | real-estate-os | real-estate-crm-os | real-estate-concierge-os | commerce-os | beauty-spa-os |
|---|---|---|---|---|---|
| **image_id** | sol-real-estate-os | sol-crm-os | sol-concierge-os | sol-commerce-os | sol-beauty-os |
| **ruta_archivo** | `stock/real-estate-os.webp` | `stock/real-estate-crm-os.webp` | `stock/real-estate-concierge-os.webp` | `stock/commerce-os.webp` | `stock/beauty-spa-os.webp` |
| **clasificación** | `fotografía stock temporal` | `fotografía stock temporal` | `fotografía stock temporal` | `fotografía stock temporal` | `fotografía stock temporal` |
| **reemplazo_por** | `screenshot de demo pública` | `screenshot de demo pública` | `screenshot de demo pública` | `screenshot de demo pública` | `screenshot de demo pública` |
| **estado** | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` |
| **prioridad** | media | alta | alta | media | media |
| **dimensiones** | 1200×760 | 1200×760 | 1200×760 | 1200×760 | 1200×760 |

---

## 2. Fotos stock de sectores (`IndustriesSection`)
*Mostradas en la sección de sectores industriales.*

| campo | sector-academias | sector-servicios | sector-equipos |
|---|---|---|---|
| **image_id** | ind-academias | ind-servicios | ind-equipos |
| **ruta_archivo** | `stock/sector-academias.webp` | `stock/sector-servicios.webp` | `stock/sector-equipos.webp` |
| **clasificación** | `fotografía stock temporal` | `fotografía stock temporal` | `fotografía stock temporal` |
| **estado** | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` |
| **prioridad** | baja | baja | media |

---

## 3. Fotos stock editoriales (Heroes de página)
*Mostradas en las cabeceras de secciones principales.*

| campo | editorial-method | editorial-diagnostic | editorial-contact |
|---|---|---|---|
| **image_id** | edi-method | edi-diagnostic | edi-contact |
| **página** | `/metodo` | `/diagnostico` | `/contacto` |
| **ruta_archivo** | `stock/editorial-method.webp` | `stock/editorial-diagnostic.webp` | `stock/editorial-contact.webp` |
| **clasificación** | `fotografía stock temporal` | `fotografía stock temporal` | `fotografía stock temporal` |
| **estado** | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` |
| **prioridad** | media | media | baja |

---

## 4. Mockups y diagramas en código (CSS/SVG)
*Construidos de forma interactiva en la web pública. Los datos son ficticios y de demostración.*

| campo | HeroComposition | SolutionVisual | CaseCard (Thumb) | SystemGallery | MethodJourney | DiagnosticMatrix |
|---|---|---|---|---|---|---|
| **image_id** | mock-hero | mock-solution | mock-case-thumb | mock-gallery | mock-method | mock-diag-matrix |
| **componente** | `HeroComposition` | `SolutionVisual` | `CaseCard` (thumb) | `SystemGallery` | `MethodJourney` | `DiagnosticMatrix` |
| **clasificación** | `mockup conceptual` | `mockup conceptual` | `screenshot de demo pública` | `screenshot de demo pública` | `mockup conceptual` | `mockup conceptual` |
| **origen_datos** | 100% ficticios | 100% ficticios | Derivado de demo pública | Derivado de demo pública | N/A (proceso) | N/A (matriz) |
| **reemplazo_por** | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` | `imagen definitiva pendiente` | No requiere | No requiere |
| **prioridad** | alta | alta | alta | media | — | — |

---

## Directrices para el Reemplazo

* **Fotografías contextuales vivas:** Deben combinarse de manera equilibrada con capturas de pantalla reales de las demostraciones.
* **Aislamiento absoluto:** Todo elemento visual, métrica o conversación expuesta en estos componentes debe ser 100% de demostración y no conectarse en ningún caso con CRM o bases de datos de clientes reales.
* **Previsualizaciones en Casos:** Las secciones "Ver demo" o "Sistemas reales" tienen prioridad de mostrar capturas directas de las demos públicas operativas de Luma Premium.
