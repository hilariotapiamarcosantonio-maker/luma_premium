# 03_ENVIRONMENT.md

## Variables de Entorno

### Variables Públicas (NEXT_PUBLIC_*)

Estas variables están expuestas en el cliente y pueden configurarse en Vercel:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_SITE_URL` | URL canónica del proyecto | `https://tu-dominio.com` |
| `NEXT_PUBLIC_PORTFOLIO_URL` | URL del portfolio de Marcos Hilario | `https://marcos-portfolio-premium.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | Nombre público del sitio | `Luma Premium` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Descripción para SEO | `Luma Estate OS - Infraestructura comercial inmobiliaria` |

### Variables Privadas (Backend)

Estas variables solo están disponibles en el servidor y NO deben exponerse:

| Variable | Descripción | Requerido |
|----------|-------------|----------|
| `LUMA_LEADS_SPREADSHEET_ID` | ID del Google Sheet para leads B2B | ✅ Sí |
| `LUMA_LEADS_SHEET_NAME` | Nombre de la pestaña | `Luma Estate Leads` |
| `GOOGLE_CLIENT_EMAIL` | Email de Service Account | ✅ Sí |
| `GOOGLE_PRIVATE_KEY` | Clave privada de Service Account | ✅ Sí |

---

## Archivo .env.example

```env
# Canonical URL del proyecto Luma Premium
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com

# URL del portfolio Marcos Hilario
NEXT_PUBLIC_PORTFOLIO_URL=https://tu-portfolio.com

# Nombre y descripción pública del sitio
NEXT_PUBLIC_SITE_NAME=Luma Premium
NEXT_PUBLIC_SITE_DESCRIPTION=Luma Estate OS - Infraestructura comercial inmobiliaria

# Google Sheets Integration - B2B Leads
LUMA_LEADS_SPREADSHEET_ID=
LUMA_LEADS_SHEET_NAME=Luma Estate Leads
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

---

## Configuración en Vercel

### Pasos

1. Ir a **Vercel Dashboard** → Proyecto → **Settings** → **Environment Variables**
2. Agregar cada variable:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_PORTFOLIO_URL=https://marcos-portfolio-premium.vercel.app
NEXT_PUBLIC_SITE_NAME=Luma Premium
NEXT_PUBLIC_SITE_DESCRIPTION=Luma Estate OS - Infraestructura comercial inmobiliaria
```

3. Para variables privadas, agregarlas desde el archivo `.env.local`:
   - NO incluir `GOOGLE_PRIVATE_KEY` completo en variables visibles
   - Usar Vercel Secrets si es necesario

### Dominio Personalizado

Para usar dominio propio:

1. Settings → **Domains**
2. Agregar dominio (ej. `luma-premium.com`)
3. Actualizar `NEXT_PUBLIC_SITE_URL` al dominio configurado
4. Hacer rebuild del proyecto

---

## Seguridad

### .gitignore

El archivo `.gitignore` protege los archivos sensibles:

```
# env files (can opt-in for committing if needed)
.env*
!.env.example
```

**Importante:** `.env.local` NUNCA se sube al repositorio.

### Verificar Protección

```bash
# Verificar que .env no esté en git
git status | grep -E "\.env"

# Resultado esperado: solo .env.example
```

---

## Cambiar Valores para Replicación

| Escenario | Variable a cambiar |
|-----------|-------------------|
| Cambiar dominio | `NEXT_PUBLIC_SITE_URL` |
| Cambiar portfolio link | `NEXT_PUBLIC_PORTFOLIO_URL` |
| Nueva hoja de Google Sheets | `LUMA_LEADS_SPREADSHEET_ID` |
| Nueva cuenta de service | `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` |