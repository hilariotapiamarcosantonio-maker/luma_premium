# 04_MIGRATION.md

## Guía de Migración y Despliegue

---

## 1. Mover Proyecto a Otra PC

### Pasos

```bash
# 1. Copiar proyecto completo (sin node_modules)
# - Usar Git: git clone o zip del proyecto
# - NO copiar node_modules

# 2. Instalar dependencias
cd "F:\Luma Premium"
npm install

# 3. Configurar variables locales
# Copiar .env.example a .env.local
# Agregar valores reales

# 4. Probar desarrollo
npm run dev
```

### Verificar Integridad

```bash
# Build debe completarse sin errores
npm run build

# Servidor debe iniciar
npm run dev
# Abrir http://localhost:3000
```

---

## 2. Desplegar a Vercel

### Opción A: Deploy Automático (Git)

1. **Conectar repositorio:**
   - Vercel Dashboard → Import Project
   - Conectar GitHub/GitLab/Bitbucket

2. **Configurar:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Agregar variables:**
   - Settings → Environment Variables
   - Copiar desde `.env.local`

4. **Deploy:**
   - Click "Deploy"

### Opción B: Deploy Manual

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

### Post-Deploy

1. Verificar que el sitio funciona
2. Probar formulario de diagnóstico
3. Confirmar que leads llegan a Google Sheets
4. Configurar dominio personalizado (opcional)

---

## 3. Migrar a Otro Dominio

### Pasos

1. **Cambiar dominio en Vercel:**
   - Settings → Domains
   - Agregar nuevo dominio

2. **Actualizar variable:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://nuevo-dominio.com
   ```

3. **Hacer rebuild:**
   ```bash
   vercel --prod
   # o esperar próximo deploy desde Git
   ```

4. **Actualizar DNS** (si es nuevo dominio):
   - Configurar registros A o CNAME en el registrador

---

## 4. Migrar a Otro Cliente/Nicho

### Pasos

1. **Duplicar proyecto:**
   - Copiar archivos (sin .env.local, node_modules)
   - O crear nueva rama en Git

2. **Actualizar configuración:**

   | Elemento | Archivo | Acción |
   |----------|---------|--------|
   | Nombre | package.json | Cambiar nombre |
   | SEO | layout.tsx | Cambiar title/description |
   | Copy | page.tsx | Adaptar texto |
   | Variables | .env.local | Nuevas credenciales |

3. **Procesar imágenes:**
   - Reemplazar imágenes propias con nuevas
   - Verificar rutas en código

4. **Probar:**
   - `npm run build`
   - `npm run dev`

---

## 5. Clonar para Otro Nicho

### Ejemplo: Luma Auto OS

1. **Copiar proyecto completo**
2. **Cambiar textos:**
   - "inmobiliario" → "automotriz"
   - "propiedades" → "vehículos"
   - "Luma Estate OS" → "Luma Auto OS"
3. **Adaptar formulario:**
   - Nuevos campos: tipo de inventario, volumen anual
4. **Crear nueva hoja Google Sheets:**
   - Configurar nuevas variables
5. **Build y deploy**

---

## 6. Checklist Post-Migración

- [ ] `npm install` completado
- [ ] `.env.local` configurado
- [ ] `npm run build` sin errores
- [ ] `npm run dev` funcionando
- [ ] Formulario guardando en Google Sheets
- [ ] Dominio configurado en Vercel
- [ ] SEO metadata correcto