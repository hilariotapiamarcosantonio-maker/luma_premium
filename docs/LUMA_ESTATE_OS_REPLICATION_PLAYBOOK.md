# Luma Estate OS - Replication Playbook

Este documento establece el patrón para replicar el sistema comercial Luma Estate OS en futuros nichos o agencias.

## El Patrón de Replicación

### 1. Marca Madre y Producto Vertical
- **Marca Madre:** Luma Premium (La firma consultora).
- **Producto Vertical:** Luma Estate OS (El sistema comercial). Mantiene la autoridad de la consultora mientras paquetiza la solución.

### 2. Landing Principal
La puerta de entrada. Su objetivo es educar y generar curiosidad.
- No vende horas. Vende un sistema integral.
- Centrado en resolver la fricción y la falta de atribución en leads de alto valor.
- Botón principal: "Agendar Auditoría Comercial".

### 3. Caso Demostrativo
El ancla de autoridad.
- Se presenta un caso de uso hiper-segmentado (Ej. Vista del Río con 3 ofertas distintas).
- Demuestra que el valor está en la adaptación del mensaje al comprador, no en un diseño web genérico.

### 4. Formulario de Diagnóstico
Filtra prospectos para asegurar que solo tratemos con clientes calificados (C-Level).
- Preguntas clave: Volumen de ventas anual, inversión en pauta, tamaño del equipo de ventas.

### 5. Oferta Foundation (Tier 1)
- Sistema ágil apoyado en arquitecturas ligeras (Next.js front, Google Sheets back).
- Alto valor percibido, implementación rápida (15-20 días).
- Vende la infraestructura y el diseño de la captación.

### 6. Oferta Enterprise (Tier 2)
- El upgrade natural. Base de datos propia, roles y automatizaciones profundas.

### 7. Sistema de Captación y Dashboard
- **Captación:** Landings ultra-optimizadas con atribución (saber de qué anuncio vino el lead).
- **Dashboard/CRM:** Pipeline de seguimiento sin distracciones para el equipo de ventas.

### 8. Firma de Autoría Permanente
- Cada ecosistema debe incluir en el footer: `© [Año] Marcos Hilario. Arquitectura Digital de Alto Rendimiento.`
- La firma de Marcos Hilario debe aparecer en cada proyecto futuro y replicarse en los próximos ecosistemas comerciales construidos.
- Se debe asegurar un contraste visual alto (texto blanco, nombre en negrita) para reforzar autoridad, propiedad intelectual, consistencia de marca personal y percepción premium.

### 9. Sales Kit y Prospección
- Todo nuevo vertical debe ir acompañado de su Sales Kit, incluyendo:
  - **Video Demo Script:** Estructura de Problema -> Sistema -> Valor.
  - **Plan de Ads:** Enfocado en el sistema B2B, no en propiedades sueltas.
  - **Outreach Playbook:** Mensajes, seguimiento y manejo de objeciones.
  - **Diagnostic Call Script:** Guion de venta y diagnóstico C-Level.
  - **Prospecting System:** Matriz de calificación y base de datos (CSV).

### 10. Auditoría de Navegación Pre-Pauta
- Antes de enviar tráfico pagado a un nuevo ecosistema, es obligatorio realizar una revisión grabada en video de la navegación en Desktop y Mobile.
- Puntos de validación:
  - Primer fold (que el CTA sea visible sin scroll).
  - Anclajes de menú (uso de `scroll-mt` para no pisar títulos con el header).
  - Consistencia del copy en los botones (ej. mantener siempre "Solicitar Auditoría Comercial" a lo largo de la ruta).
  - Estética C-Level: Evitar bloques de color disruptivos (ej. blanco puro en diseño oscuro) que parezcan plantillas de SaaS genéricas.
  - **Regla estricta:** Ningún ecosistema futuro debe recibir tráfico pagado hasta que sus formularios capturen datos reales y sus anchors estén limpios de duplicaciones de hashes.

### 11. Arquitectura de Datos Segura (B2B vs Operativo)
- **Separación estricta:** La base de prospectos interesados en comprar la infraestructura (B2B) NUNCA debe mezclarse con el CRM inmobiliario operativo que gestiona compradores de propiedades o cierres de los clientes.
- **Patrón replicable de integración:**
  1. Crear plantilla profesional `.xlsx` con dashboards integrados (`scripts/create-luma-sales-sheet-template.mjs`).
  2. Subir a Google Drive como hoja nativa.
  3. Declarar variables exclusivas con prefijo (ej. `LUMA_LEADS_SPREADSHEET_ID`).
  4. Mantener `.env.local` fuera de Git. Solo versionar `.env.example` limpio.
  5. Probar captura de datos localmente antes de Vercel.

### 12. CRM Operativo - Contratos de Dominio y Repositorio Mock (Subfase 2.0)
Para habilitar la operatividad comercial sin comprometer la base de datos de captación ni incurrir en costes de infraestructura iniciales, se replica el siguiente patrón de arquitectura desacoplada:
- **Contratos de Dominio Desacoplados (`operations-types.ts`, `operations-repository.ts`):** Definición estricta de interfaces para operaciones, notas inmutables y logs de actividad. Contratos definidos mediante interfaces TypeScript en lugar de clases concretas para permitir el intercambio transparente entre hojas de cálculo y bases de datos SQL (Supabase).
- **Fábrica de Repositorios Dinámica (`operations-repository-factory.ts`):** Carga dinámica del repositorio concreto basada en variables de entorno (`CRM_OPERATIONS_MODE` = `mock` | `sheets`). Evita problemas de compilación en fases tempranas y facilita pruebas de integración ágiles.
- **Capa de Composición (`crm-lead-service.ts`):** Orquesta la combinación de datos inmutables de captación con el estado operativo de los leads. Aplica valores por defecto seguros (`crm_status` = `new`, `owner_email` = `null`) y realiza filtros/paginación en memoria.
- **Validación Estricta y Normalización (`operations-schemas.ts`):** Esquemas Zod que preprocesan correos electrónicos para limpiarlos (trim) y normalizarlos a minúsculas antes de la validación. Reglas de negocio condicionales estrictas (ej. `lost_reason` obligatorio únicamente si el estado es `lost`, y prohibido en otros casos).
- **Aislamiento en Pruebas Unitarias (`mock-operations-repository.ts`):** Implementación en memoria con un método estático `reset()` para limpiar mapas de almacenamiento y evitar contaminación de datos entre ejecuciones de pruebas.

### Proceso para Adaptar a Otro Sector
1. **Identificar la fuga de leads** en ese sector (Ej. concesionarios de lujo).
2. **Renombrar el producto** si es necesario (Ej. Luma Auto OS).
3. **Adaptar el caso demostrativo** a un activo real de ese sector.
4. **Ajustar el formulario** a las métricas del sector (Ej. Inventario de vehículos en lugar de propiedades).