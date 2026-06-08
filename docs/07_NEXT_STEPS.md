# 07_NEXT_STEPS.md

## Próximos Pasos

---

## 1. Configuración Inmediata (Pre-Deploy)

### Dominio

- [ ] Configurar dominio final en Vercel
- [ ] Actualizar `NEXT_PUBLIC_SITE_URL`
- [ ] Verificar que todas las URLs internas funcionen

### Google Sheets

- [ ] Crear hoja de cálculo real en Drive
- [ ] Compartir con Service Account
- [ ] Configurar `LUMA_LEADS_SPREADSHEET_ID` real
- [ ] Probar formulario con datos de prueba
- [ ] Verificar que leads lleguen a la hoja

### Variables en Vercel

- [ ] Agregar todas las variables de `.env.local` a Vercel
- [ ] Verificar que `NEXT_PUBLIC_*` estén configuradas
- [ ] NO exponer `GOOGLE_PRIVATE_KEY` real en variables visibles

---

## 2. Lanzamiento Comercial

### Pre-Lanzamiento

- [ ] Grabación de video demo (ver Recording Guide)
- [ ] Auditoría de navegación (Desktop + Mobile)
- [ ] Verificar primer fold con CTA visible
- [ ] Verificar anchors sin duplicación de hashes
- [ ] Consistencia de CTAs en todas las páginas

### Lanzamiento

- [ ] Campaign inicial de Facebook/Instagram Ads
- [ ] Configurar píxel de meta en Vercel
- [ ] Verificar conversión en Ads Manager
- [ ] Documentar resultados en Implementation Log

---

## 3. Optimización Post-Lanzamiento

### Métricas a Monitorear

| Métrica | Herramienta |
|---------|-------------|
| Tráfico | Vercel Analytics / GA4 |
| Conversión formulario | Google Sheets |
| Costo por lead | Meta Ads |
| Tiempo en página | Analytics |

### Pruebas A/B

- [ ] Test de CTAs ("Auditoría Comercial" vs otro)
- [ ] Test de propuesta de valor
- [ ] Test de caso demostrativo

---

## 4. Escalabilidad Futura

### Posibles Extensiones

| Oportunidad | Descripción |
|------------|-------------|
| CRM propio | Integración con base de datos (PostgreSQL) |
| Dashboard | Panel administrativo para gestionar leads |
| Aut.Email | Secuencia de nurture por email |
| Analytics | Dashboard ejecutivo de métricas |
| Webhooks | Integración con otros sistemas |

---

## 5. Replicación a Otros Nichos

### Preparado Para

- [ ] Clonar proyecto para nuevo sector
- [ ] Adaptar textos y formulario
- [ ] Nueva hoja de Google Sheets
- [ ] Nuevo deploy

### Nichos Sugeridos

- Luma Auto OS (concesionarios)
- Luma Retail OS (retail B2B)
- Luma Health OS (salud privada)

---

## Checklist Final

- [ ] Dominio configurado
- [ ] Google Sheets conectado
- [ ] Formulario funcionando
- [ ] Build exitoso
- [ ] Navegación auditada
- [ ] Video demo grabado
- [ ] Ads configurados
- [ ] Métricas establecidas

---

## Contacto para Soporte

Si hay dudas técnicas:
- Revisar 01_SETUP.md
- Revisar 03_ENVIRONMENT.md
- Revisar 04_MIGRATION.md

Si hay dudas de replicación:
- Revisar 05_REPLICATION_PLAYBOOK.md