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

## 5. Capturas de pantalla reales (Integración de Demos)
*Detalle de las capturas reales de demostración optimizadas e integradas en la web pública.*

| Archivo Original | Versión Optimizada | Producto / Sistema | Sección Usada | Dim. Orig. | Dim. Web | Peso Orig. | Peso Opt. | Orientación | Privacidad | Datos Ocultos | Estado | Uso Desktop | Uso Móvil |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `Luma_Vista_Del_Rio_Desktop.png` | `luma_vista_del_rio_desktop.webp` | Real Estate OS | Solution Hero/Preview, Demo Preview, Cases page, System Gallery | 4438x2442 | 1600x880 | 708 KB | 33.2 KB | landscape | Revisado OK | Ninguno | definitiva | Sí | No |
| `Luma_Vista_Del_Rio_Movil.png` | `luma_vista_del_rio_movil.webp` | Real Estate OS | Solution Hero/Preview, Demo Preview, System Gallery | 2172x3872 | 1010x1800 | 871 KB | 44.7 KB | portrait | Revisado OK | Ninguno | definitiva | No | Sí |
| `Luma Real Estete OS CRM - Demo.png` | `luma_real_estete_os_crm_-_demo.webp` | Real Estate CRM OS | Solution Team View, System Gallery, Cases page | 2752x1536 | 1600x893 | 5.84 MB | 71.1 KB | landscape | Revisado OK | Ninguno | definitiva | Sí | No |
| `Real Estate Concierge OS - Demo.png` | `real_estate_concierge_os_-_demo.webp` | Real Estate Concierge OS | Solution Hero/Preview, Demo Preview, System Gallery, Cases page | 2752x1536 | 1600x893 | 5.79 MB | 79.1 KB | landscape | Revisado OK | Ninguno | definitiva | Sí | No |
| `Luma Commerce OS - Demo.png` | `luma_commerce_os_-_demo.webp` | Commerce OS | Solution Hero/Preview, Demo Preview, System Gallery, Cases page | 2854x1472 | 1600x825 | 6.18 MB | 71.4 KB | landscape | Revisado OK | Ninguno | definitiva | Sí | No |
| `Luma_Beauty_Spa_Desktop.png` | `luma_beauty_spa_desktop.webp` | Beauty Spa OS | Solution Hero/Preview, Demo Preview, Cases page | 4424x2438 | 1600x882 | 1.56 MB | 48.0 KB | landscape | Revisado OK | Ninguno | definitiva | Sí | No |
| `Luma_Beauty_Spa_Movil.png` | `luma_beauty_spa_movil.webp` | Beauty Spa OS | Solution Hero/Preview, Demo Preview, System Gallery, Cases page | 2172x3632 | 1076x1800 | 917 KB | 45.8 KB | portrait | Revisado OK | Ninguno | definitiva | No | Sí |
| `Suvoga OS Academy.png` | `suvoga_os_academy.webp` | Suvoga Academy | Cases page | 2842x1472 | 1600x829 | 6.80 MB | 98.5 KB | landscape | Revisado OK | Ninguno | definitiva | Sí | No |

---

## Directrices para el Reemplazo

* **Fotografías contextuales vivas:** Deben combinarse de manera equilibrada con capturas de pantalla reales de las demostraciones.
* **Aislamiento absoluto:** Todo elemento visual, métrica o conversación expuesta en estos componentes debe ser 100% de demostración y no conectarse en ningún caso con CRM o bases de datos de clientes reales.
* **Previsualizaciones en Casos:** Las secciones "Ver demo" o "Sistemas reales" tienen prioridad de mostrar capturas directas de las demos públicas operativas de Luma Premium.
