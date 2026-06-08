# 05_REPLICATION_PLAYBOOK.md

## Playbook de Replicabilidad

Este documento detalla el patrón para replicar el Luma Estate OS en futuros nichos o agencias.

---

## 1. El Patrón de Replicación

### 1.1 Marca Madre y Producto Vertical

- **Marca Madre:** Luma Premium (la firma consultora)
- **Producto Vertical:** Luma Estate OS (el sistema comercial)
  - Mantiene la autoridad de la consultora mientras paquetiza la solución

### 1.2 Estructura de Landing

| Sección | Propósito |
|---------|----------|
| **Header** | Logo + Navegación (CTA Diagnóstico) |
| **Hero** | Problema + Solución + CTA principal |
| **Fuga de Leads** | Por qué se pierden leads (dolor) |
| **Sistema** | Lo que ofrece Luma Estate OS |
| **Caso Demostrativo** | Vista del Río (prueba de autoridad) |
| **CTA Final** | Agendar Auditoría Comercial |
| **Footer** | Autoría Marcos Hilario |

### 1.3 Componentes Obligatorios

1. **Footer con autoría:**
   ```
   © [Año] Marcos Hilario. Arquitectura Digital de Alto Rendimiento.
   ```

2. **Formulario de Diagnóstico:**
   - Preguntas filtro: Volumen, inversión en pauta, tamaño del equipo
   - Guarda en Google Sheets separado

3. **Separación B2B vs Operativo:**
   - Prospectos interesados en el sistema NUNCA se mezclan con CRM operativo

---

## 2. Pasos para Adaptar a Otro Sector

### 2.1 Identificar la Fuga

| Sector | Fuga de Leads |
|-------|-------------|
| Inmobiliario | Leads no responden rápido, falta de atribución |
| Concesionarios | Prospectos perdidos en follow-up |
| Servicios B2B | Sin visibilidad de campañas |

### 2.2 Renombrar Producto

| Original | Nuevo Nicho |
|----------|-----------|
| Luma Estate OS | Luma Auto OS |
| Propiedades | Vehículos |
| Diagnóstico | Auditoría |

### 2.3 Adaptar Caso Demostrativo

- Usar un activo real del nuevo sector
- Presentar 3 opciones distintas
- Demostrar valor adaptable

### 2.4 Ajustar Formulario

```
# Inmobiliario (original)
- Tipo de operación
- Cantidad de propiedades
- Inversión en pauta

# Automotriz (nuevo)
- Tipo de inventario
- Volumen anual de ventas
- Inversión en pauta
```

---

## 3. Checklist de Replicación

### Antes de Lanzar

- [ ] Landing copiado y renombrado
- [ ] Textos adaptados al nicho
- [ ] Formulario con campos correctos
- [ ] Caso demostrativo actualizado
- [ ] Variables de entorno configuradas
- [ ] Google Sheets creado
- [ ] Build funcionando
- [ ] Navegación probada (Desktop + Mobile)
- [ ] Formulario guardando datos

### Pre-Tráfico Pago

- [ ] Auditoría de navegación grabada
- [ ] Primer fold con CTA visible
- [ ] Anclas sin duplicación de hashes
- [ ] Consistencia de CTAs
- [ ] Estética C-Level (no genérica)
- [ ] Formulario capturando datos reales

---

## 4. Partes que DEBEN Cambiar

Para replicar, cambiar:

| Elemento | Archivo |
|---------|---------|
| Nombre del proyecto | package.json |
| SEO metadata | src/app/layout.tsx |
| Copy comercial | src/app/luma-estate-os/page.tsx |
| Caso demostrativo | src/app/luma-estate-os/vista-del-rio/page.tsx |
| Campos del formulario | src/components/luma-estate/DiagnosticoForm.tsx |
| Variables de entorno | .env.local |

---

## 5. Partes que NO DEBEN Cambiar

Mantener inalterado:

| Elemento | Razón |
|---------|-------|
| Estructura de carpetas (src/app) | Next.js App Router |
| Lógica de API (/api/*) | Funciona genérica |
| Integración Google Sheets | Patrón reutilizable |
| Arquitectura de env vars | Portable |
| Configuración Next.js | Build optimizado |
| .gitignore | Seguridad |

---

## 6. Tiempo Estimado

| Tarea | Tiempo |
|--------|-------|
| Copiar proyecto | 5 min |
| Adaptar textos | 2-4 horas |
| Adaptar formulario | 1-2 horas |
| Nuevo Google Sheets | 30 min |
| Build y pruebas | 30 min |
| Auditoría navegación | 1 hora |

**Total:** ~8 horas para replicación completa