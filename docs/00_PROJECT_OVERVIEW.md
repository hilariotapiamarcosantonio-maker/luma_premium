# 00_PROJECT_OVERVIEW.md

## Proyecto: Luma Premium (Luma Estate OS)

### Descripción General

**Luma Premium** es la marca comercial de la firma consultora y **Luma Estate OS** es el producto vertical de infraestructura comercial inmobiliaria B2B. Este proyecto es una landing page de alto-conversión desarrollada en Next.js que funciona como sistema de captación de prospectos interesados en adquirir infraestructura digital para sus negocios inmobiliarios.

Es un activo comercial directo usado para presentar y vender:
- Luma Estate OS (Sistema Operativo Inmobiliario)
- Diagnóstico Inmobiliario Comercial
- Infraestructura Comercial y Sistemas de Captación B2B

### Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| Framework | Next.js 16.2.4 (App Router) |
| Lenguaje | TypeScript |
| Estilización | Tailwind CSS 4 |
| Animaciones | Framer Motion 12 |
| Iconos | Lucide React |
| Backend | Google Sheets API |
| Deploy | Vercel |

### Estructura de Directorios

```
F:\Luma Premium\
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout raíz
│   │   ├── page.tsx           # Homepage (redirect)
│   │   ├── api/              # API Routes
│   │   │   └── luma-leads/   # Lead capture endpoint
│   │   └── luma-estate-os/   # Landing principal
│   │       ├── page.tsx
│   │       ├── diagnostico/
│   │       ├── vista-del-rio/
│   │       └── gracias/
│   ├── components/
│   │   └── luma-estate/     # Componentes específicos
│   └── lib/
│       └── google-sheets.ts  # Integración Google Sheets
├── docs/                      # Documentación del proyecto
├── scripts/                  # Scripts utilitarios
│   └── create-luma-sales-sheet-template.mjs
├── data/                     # Datos generados (template Excel)
├── .env.example              # Variables de entorno (template)
├── .env.local               # Variables locales (privado)
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

### Propósito Comercial

1. **Landing educativa**: Presenta el sistema Luma Estate OS sin vender horas, sino un sistema integral
2. **Caso Demostrativo**: Vista del Río - caso real que demuestra autoridad
3. **Formulario de Diagnóstico**: Filtra prospectos para garantizar clientes calificados (C-Level)
4. **Captura B2B**: Datos almacenados en Google Sheets separado del CRM operativo

### Autoría

Este proyecto sigue el patrón Luma Premium:
- Cada ecosistema debe incluir en el footer: `© [Año] Marcos Hilario. Arquitectura Digital de Alto Rendimiento.`
- Mantiene la autoridad de la consultora mientras paquetiza la solución

### Base de Datos

- **Google Sheets** como backend para captura de leads B2B
- Hoja de cálculo específica con métricas ejecutivas
- Separación estricta: prospectos B2B NUNCA se mezclan con el CRM operativo

---

## Propiedades Editables para Replicación

Para clonar este proyecto para otro cliente o nicho:

| Propiedad | Archivo(s) | Qué cambiar |
|-----------|-----------|--------------|
| Nombre del proyecto | package.json (name) | luma-estate-os → [nuevo-nombre] |
| SEO metadata | src/app/layout.tsx | title, description |
| Texto comercial | src/app/luma-estate-os/page.tsx | Copy, CTAs, precios |
| Caso demostrativo | src/app/luma-estate-os/vista-del-rio/page.tsx | Datos del caso |
| Formulario | src/components/luma-estate/DiagnosticoForm.tsx | Campos preguntas |
| Variables de entorno | .env.local | SPREADSHEET_ID, credentials |
| URLs externas | .env.local | NEXT_PUBLIC_SITE_URL |

---

## Propiedades NO Editables

- Estructura de carpetas (src/app)
- Lógica de API (/api/luma-leads)
- Integración Google Sheets (src/lib/google-sheets.ts)
- Arquitectura de variables de entorno
- Configuraciones de build/Next.js

---

## Riesgos Conocidos

1. **Dominio no configurado**: NEXT_PUBLIC_SITE_URL necesita ser actualizado para producción
2. **Google Sheets no conectado**: Variables reales necesitan ser configuradas
3. **Formulario necesita prueba** antes de tráfico pago

---

## Estado Actual

- ✅ Build exitoso
- ✅ Documentación completa
- ✅ Portabilidad verificada
- ⏳ Dominio final pendiente
- ⏳ Google Sheets pendiente
