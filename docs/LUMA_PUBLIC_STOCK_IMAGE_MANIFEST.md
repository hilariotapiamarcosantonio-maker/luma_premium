# Luma Premium — Manifiesto de Imágenes Stock (web pública)

> Imágenes **provisionales** de stock usadas en la web pública para reforzar
> sectores y conceptos. **No representan clientes, oficinas ni evidencia real de
> Luma Premium.** Deben sustituirse por material propio antes de campañas serias.

- **Fuente:** Unsplash (CDN `images.unsplash.com`).
- **Licencia:** Unsplash License — uso libre, comercial, sin permiso ni atribución
  obligatoria (atribución apreciada). https://unsplash.com/license
- **Formato:** WebP, 1200×760, q≈68 (servido ya optimizado por el CDN de Unsplash).
- **Ubicación local:** `public/images/marketing/stock/`
- **Registro central:** `src/data/marketing-images.ts` (cambiar `src` allí sustituye en toda la web).
- **Carga:** `next/image` con `width`/`height`/`sizes`/`alt`; lazy (ninguna en el hero → sin impacto en LCP).

> Nota: el autor concreto de cada foto no se incluye porque el ID de archivo del CDN
> no mapea de forma fiable a la página de autor. Antes de producción, si se desea
> atribución, confirmar autor en unsplash.com o (recomendado) sustituir por material propio.

---

## Imágenes de soluciones (componente `SolutionCard`)

Se muestran en: home ES (`/`), `/soluciones`, home EN (`/en`), `/en/solutions`.

| Archivo local | Solución / sección | URL original (CDN) | Plataforma | Licencia | Peso | Sustituir por |
|---|---|---|---|---|---|---|
| `real-estate-os.webp` | Real Estate OS | `images.unsplash.com/photo-1486406146926-c627a92ad1ab` | Unsplash | Unsplash License | ~184 KB | Render/foto real de un proyecto inmobiliario representado |
| `real-estate-crm-os.webp` | Real Estate CRM OS | `images.unsplash.com/photo-1551288049-bebda4e38f71` | Unsplash | Unsplash License | ~79 KB | Captura real del panel/CRM (sin datos sensibles) |
| `real-estate-concierge-os.webp` | Real Estate Concierge OS | `images.unsplash.com/photo-1512941937669-90a1b58e7e9c` | Unsplash | Unsplash License | ~77 KB | Captura real del flujo de concierge/conversación |
| `commerce-os.webp` | Commerce OS | `images.unsplash.com/photo-1556742049-0cfed4f6a45d` | Unsplash | Unsplash License | ~88 KB | Foto/captura real de la tienda o catálogo construido |
| `beauty-spa-os.webp` | Beauty Spa OS | `images.unsplash.com/photo-1540555700478-4be289fbecef` | Unsplash | Unsplash License | ~89 KB | Foto real del spa/centro o de la experiencia de marca |

## Imágenes de sectores (componente `IndustriesSection`)

Se muestran en: home ES (`/`) y home EN (`/en`). Los sectores Inmobiliarias,
Comercio y Spas **reutilizan** las imágenes de solución correspondientes.

| Archivo local | Sector | URL original (CDN) | Plataforma | Licencia | Peso | Sustituir por |
|---|---|---|---|---|---|---|
| `sector-academias.webp` | Academias | `images.unsplash.com/photo-1503676260728-1c00da094a0b` | Unsplash | Unsplash License | ~42 KB | Material propio de academia/formación |
| `sector-servicios.webp` | Servicios profesionales | `images.unsplash.com/photo-1497366216548-37526070297c` | Unsplash | Unsplash License | ~65 KB | Material propio de firma/servicios |
| `sector-equipos.webp` | Equipos comerciales | `images.unsplash.com/photo-1600880292203-757bb62b4baf` | Unsplash | Unsplash License | ~102 KB | Foto real (autorizada) de equipo comercial |

**Peso total aproximado:** ~725 KB (8 imágenes).

---

## Reglas de sustitución

1. Reemplazar `src` en `src/data/marketing-images.ts` (un solo punto de cambio).
2. Mantener proporción 1200×760 (o actualizar `width`/`height` en el registro).
3. Conservar `alt` descriptivo y honesto (concepto/sector, nunca afirmar clientes reales).
4. No usar logotipos de terceros, personas públicas, marcas sin permiso ni evidencia falsa.
5. Optimizar a WebP/AVIF antes de subir; mantener cada imagen ligera.
