# Guía de Migración

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta en Vercel (para despliegue)
- Proyecto de Google Cloud con Google Sheets API habilitado

## 1. Mover el Proyecto a Otra PC

```bash
# Clonar o copiar el proyecto
git clone https://github.com/tu-repo/luma-premium.git
cd luma-premium

# Instalar dependencias
npm install
```

## 2. Configurar .env.local

Copiar `.env.example` a `.env.local` y completar las variables:

```env
# URL del sitio (production)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_PORTFOLIO_URL=https://tu-portfolio.com

# Identidad del sitio
NEXT_PUBLIC_SITE_NAME=Luma Premium
NEXT_PUBLIC_SITE_DESCRIPTION=Luma Estate OS - Infraestructura comercial inmobiliaria

# Google Sheets - Credenciales de Service Account
LUMA_LEADS_SPREADSHEET_ID=tu spreadsheet ID
LUMA_LEADS_SHEET_NAME=Luma Estate Leads
GOOGLE_CLIENT_EMAIL=tu-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

## 3. Probar Localmente

```bash
npm run dev
# Abrir http://localhost:3000
```

## 4. Configurar Variables en Vercel

1. Ir a Vercel Dashboard → Proyecto → Settings → Environment Variables
2. Agregar cada variable de `.env.local`
3. IMPORTANT: No incluir GOOGLE_PRIVATE_KEY real en variables de proyecto visible
4. Usar Secrets de Vercel si es necesario

## 5. Conectar Google Sheets

1. Crear proyecto en Google Cloud Console
2. Habilitar Google Sheets API y Google Drive API
3. Crear Service Account
4. Descargar JSON de credenciales
5. Compartir la hoja de cálculo con el email del Service Account
6. Copiar spreadsheet ID (url entre /d/ y /edit)

## 6. Cambiar Dominio

Para cambiar el dominio del proyecto:

1. Actualizar `NEXT_PUBLIC_SITE_URL` en `.env.local`
2. Hacer rebuild en Vercel
3. Actualizar dominios en Settings → Domains

## 7. Verificar Build

```bash
npm run build
npm run start
# Probar en http://localhost:3000
```

## 8. Verificar Exposición de Secretos

```bash
# Verificar que .env no esté en git
git status | grep -E "\.env"
# No debe mostrar archivos .env locales

# Verificar .gitignore
cat .gitignore | grep "\.env"
# Debe mostrar: .env*
```

## Notas

- `.env.local` está en `.gitignore` - nunca se sube al repo
- Solo `.env.example` se versiona
- Las credenciales de Google Sheets son asunto del equipo comercial
