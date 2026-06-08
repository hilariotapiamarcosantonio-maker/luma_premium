# 02_ROUTES.md

## Rutas del Proyecto

### Páginas Públicas

| Ruta | Archivo | Descripción |
|-----|---------|-------------|
| `/` | `src/app/page.tsx` | Entrada principal - Redirección a `/luma-estate-os` |
| `/luma-estate-os` | `src/app/luma-estate-os/page.tsx` | Landing principal del sistema |
| `/luma-estate-os/diagnostico` | `src/app/luma-estate-os/diagnostico/page.tsx` | Formulario de diagnóstico comercial |
| `/luma-estate-os/vista-del-rio` | `src/app/luma-estate-os/vista-del-rio/page.tsx` | Caso de estudio: Vista del Río |
| `/luma-estate-os/gracias` | `src/app/luma-estate-os/gracias/page.tsx` | Página de confirmación post-formulario |

### API

| Ruta | Archivo | Descripción |
|-----|---------|-------------|
| `/api/luma-leads` | `src/app/api/luma-leads/route.ts` | Endpoint para captura de leads B2B (POST) |

### Componentes

| Ruta | Descripción |
|------|-------------|
| `@/components/luma-estate/LumaFooter` | Footer con autoría de Marcos Hilario |
| `@/components/luma-estate/DiagnosticoForm` | Formulario de diagnóstico |

### Alias de Import

El proyecto usa alias `@/` que apunta a `src/`:
```ts
import Component from '@/components/luma-estate/Component'
import lib from '@/lib/google-sheets'
```

---

## Estructura de Navegación

```
/ (root)
  └── /luma-estate-os (landing)
        ├── /diagnostico (formulario)
        ├── /vista-del-rio (caso)
        └── /gracias (confirmación)

/api
  └── /luma-leads (POST - guardar lead)
```

---

## Notas Técnicas

- Todas las páginas son compatibles con Static Export
- La ruta `/` usa `redirect()` de Next.js
- El formulario POST a `/api/luma-leads` guarda en Google Sheets
- Las variables públicas (`NEXT_PUBLIC_*`) permiten cambiar dominio sin código