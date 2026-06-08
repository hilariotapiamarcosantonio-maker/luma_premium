# 01_SETUP.md

## Instalación y Configuración del Proyecto

### Requisitos Previos

| Requisito | Versión mínima |
|----------|---------------|
| Node.js | 18+ |
| npm | 9+ |

### 1. Instalación de Dependencias

```bash
# Navegar al directorio del proyecto
cd "F:\Luma Premium"

# Instalar dependencias
npm install

# Opcional: verificar integridad
npm run build
```

### 2. Configuración de Variables de Entorno

Copiar `.env.example` a `.env.local`:

```bash
# Windows
copy .env.example .env.local

# Unix/Mac
cp .env.example .env.local
```

Editar `.env.local` con los valores reales:

```env
# URL del sitio (producción)
NEXT_PUBLIC_SITE_URL=https://luma-premium.vercel.app
NEXT_PUBLIC_PORTFOLIO_URL=https://marcos-portfolio-premium.vercel.app
NEXT_PUBLIC_SITE_NAME=Luma Premium
NEXT_PUBLIC_SITE_DESCRIPTION=Luma Estate OS - Infraestructura comercial inmobiliaria

# Google Sheets - Credenciales de Service Account
LUMA_LEADS_SPREADSHEET_ID=tu-spreadsheet-id aqui
LUMA_LEADS_SHEET_NAME=Luma Estate Leads
GOOGLE_CLIENT_EMAIL=tu-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### 3. Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

### 4. Build de Producción

```bash
# Crear build optimizado
npm run build

# Probar build localmente
npm run start
```

### 5. Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (puerto 3000) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Verificar código |

---

## Configuración de Google Sheets

### Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto
3. Habilitar APIs:
   - Google Sheets API
   - Google Drive API
4. Crear Service Account:
   - IAM y Admin → Service Accounts → Crear
   - Generar clave JSON
5. Descargar archivo JSON de credenciales

### Configurar Hoja de Cálculo

1. Crear nuevo Google Sheet en Drive
2. Nombrar pestaña: `Luma Estate Leads`
3. Compartir con email del Service Account (dar editor)
4. Copiar spreadsheet ID de la URL: `docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### Generar Plantilla Professional

```bash
# Generar plantilla Excel con estructura profesional
npm run create:luma-sheet-template
```

Esto crea:
- `data/Luma_Premium_Sales_Leads_Template.xlsx`
- `data/luma_estate_google_sheet_columns.csv`

---

## Mover Proyecto a Otro PC

```bash
# 1. Copiar proyecto (sin node_modules)
# 2. Instalar dependencias
npm install

# 3. Configurar .env.local
# 4. Probar desarrollo
npm run dev
```

---

## Errores Comunes

| Error | Solución |
|-------|-----------|
| `Error: LUMA_LEADS_SPREADSHEET_ID is not defined` | Configurar variable en .env.local |
| `Error: GOOGLE_PRIVATE_KEY is not defined` | Verificar credenciales de Service Account |
| `Error: Google Sheets permission` | Compartir hoja con email de Service Account |
| `next: command not found` | Ejecutar `npm install` primero |