# Documentación de Implementación — CRM MVP Fase 1

Este documento detalla la arquitectura, decisiones de diseño, resultados de calidad y auditorías del QA Final para la **Fase 1** del panel administrativo privado (CRM) de **Luma Premium**.

---

## 1. Dependencias Añadidas
* **`next-auth@5.0.0-beta.25` (o `@beta`):** Integrado para manejar la autenticación federada con Google OAuth en Next.js 16 (App Router) mediante sesiones JWT seguras y sin estado.
* **`zod`:** Utilizado para la validación estricta de variables de entorno de filtrado y el mapeo de campos provenientes de Google Sheets.

---

## 2. Variables de Entorno
Se añadieron los siguientes placeholders ficticios a `.env.example` y se configuraron en `.env.local` para pruebas de compilación local:
* `AUTH_SECRET`: Clave aleatoria para firmar las cookies de sesión.
* `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Credenciales de Google OAuth.
* `CRM_ADMIN_EMAILS`: Lista separada por comas de correos con rol `admin`.
* `CRM_SALES_EMAILS`: Lista separada por comas de correos con rol `sales`.
* `CRM_DATA_MODE`: Configura la persistencia (`mock` para pruebas locales con datos sintéticos, `sheets` para entornos conectados).

---

## 3. Flujo de Login y OAuth
1. El usuario navega a `/admin` y es interceptado por `src/proxy.ts`.
2. Si no hay sesión válida, se le redirige a `/admin/login`.
3. Al pulsar "Continuar con Google", se inicia el flujo OAuth estándar solicitando únicamente los scopes básicos: `openid`, `profile` y `email`. No se solicitan permisos adicionales a nivel del usuario (como Sheets o Drive).
4. **Validaciones en `signIn`:**
   - Verifica que el proveedor es Google.
   - Valida que `email_verified` es verdadero en el perfil de Google.
   - Normaliza el correo electrónico (`trim().toLowerCase()`).
   - Comprueba la allowlist exacta. Si es rechazado, se le deniega el acceso con un mensaje genérico de error de NextAuth (por privacidad, el correo no es impreso en logs).

---

## 4. Allowlist, Roles y Separación de Capas (Proxy vs DAL)
* **Marcos (`role: admin`):** Autorizado a visualizar todo el listado de leads, dashboard y las fichas de prospectos individuales.
* **William (`role: sales`):** Autorizado para el acceso a la información comercial de leads de solo lectura en esta fase.
* **Control en Servidor:** Las rutas y la DAL validan la sesión utilizando las funciones `assertAuthorized` y `assertAdmin` provistas en `src/lib/auth/permissions.ts`.
* **Separación de Capas (Proxy/DAL):** Se verificó mediante auditoría estricta de imports que el proxy (`src/proxy.ts`) actúa puramente como la primera barrera optimista para las páginas del framework. Ningún módulo de la capa de datos (`src/lib/crm/*`) importa el proxy; la DAL utiliza exclusivamente los helpers server-only de `permissions.ts`.

---

## 5. Protección de Rutas y Seguridad
Todas las rutas de administración bajo `/admin/(protected)/*` y la Data Access Layer están doblemente protegidas:
1. **Filtro optimista (`src/proxy.ts`):** Redirección temprana en layouts y páginas si no se detecta sesión.
2. **Validación robusta en servidor:** Verificación en la capa de datos (DAL) y renderizado mediante llamadas directas a `auth()`.
3. **Caché público deshabilitado:** Las páginas se fuerzan a ser 100% dinámicas para proteger la información personal (PII) de los leads y evitar indexación:
   ```ts
   export const dynamic = "force-dynamic";
   export const revalidate = 0;
   ```
   Las lecturas sensibles usan configuraciones de `cache: 'no-store'`.
4. **No PII en URLs:** No se exponen correos ni teléfonos en query strings de búsqueda o URLs. Se utiliza el identificador seguro determinista `lead_id` (basado en `source_fingerprint`). Los filtros URL-safe no contienen PII.
5. **Máximo de Paginación:** El filtro de tamaño de página (`page_size`) tiene un límite estricto de un máximo de 100 elementos controlado vía Zod.

---

## 6. Auditoría de Secretos y `.env.local`
Se realizó una verificación de seguridad local con los siguientes resultados:
* **Ignorados en Git:** Se auditó mediante `git check-ignore -v .env.local` y `git ls-files .env.local` que el archivo de entorno de desarrollo local está correctamente configurado bajo las reglas del `.gitignore` y no ha sido rastreado ni commiteado en el historial de Git.
* **Inspección de Secretos:** La búsqueda de claves privadas o secretos de clientes reales en el repositorio dio resultado limpio. Solo se encontraron las referencias y plantillas genéricas no sensibles configuradas en `.env.example` y la documentación técnica.

---

## 7. Huella de Identidad del Lead (`source_fingerprint`)
Para proveer un identificador seguro e inmutable, se genera en el servidor un hash SHA-256 utilizando los campos de captación:
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
* **Longitud y Formato:** Se conservan los primeros 24 caracteres hexadecimales del hash de identidad para formar el ID: `lp_<24 caracteres hexadecimales>` (ej. `lp_ba454fd40a3a954f08c550ea`).
* **Validación Estricta:** Las consultas de búsqueda de un lead individual validan el parámetro `leadId` mediante la expresión regular `/^lp_[a-f0-9]{24}$/`. Si el formato es inválido, `getLeadById()` retorna `null` inmediatamente sin consultar las hojas de Sheets o datos mock.
* **Pruebas de Identidad Ejecutadas (Paso 4):**
  - Mismo registro produce el mismo ID (Estabilidad: ✅ *Passed*).
  - Cambios en un campo de identidad producen IDs diferentes (Idempotencia: ✅ *Passed*).
  - Correo con mayúsculas y espacios produce el mismo ID normalizado (✅ *Passed*).
  - Teléfono con símbolos o espacios produce el mismo ID normalizado (✅ *Passed*).
  - Dos registros diferentes en la muestra mock no producen colisiones de ID (✅ *Passed*).

---

## 8. Data Access Layer (DAL) y Validación de Encabezados
* **Reutilización OIDC:** La lectura en modo `sheets` importa `getGcpSheetsAuthClient` de `src/lib/google-auth.ts`, aprovechando la autenticación de servidor a servidor (Workload Identity Federation) de GCP sin claves JSON privadas.
* **Paginación y Filtros en Repositorio:** La DAL realiza la paginación y ordenamiento en memoria en la capa del repositorio antes de transferir datos al servidor web de Next.js.
* **Validación de Encabezados:** Se implementó una función exportada `validateSheetHeaders(headers)` que verifica la estructura exacta de las columnas `A:AC` (29 columnas, nombre y posición exacta). Si ocurre alguna discrepancia en la cantidad, nombre o posición, la DAL arroja un error controlado, escribe en logs el código `CRM_SHEET_SCHEMA_MISMATCH` de forma segura (sin imprimir celdas, filas ni PII), y muestra al administrador un mensaje de error genérico.
* **Pruebas del Validador de Encabezados (Paso 1):**
  - Encabezados correctos: Aceptados (✅ *Passed*).
  - Un encabezado cambiado: Rechazado (✅ *Passed*).
  - Dos encabezados intercambiados: Rechazados (✅ *Passed*).
  - 28 columnas: Rechazadas (✅ *Passed*).
  - 30 columnas: Rechazadas (✅ *Passed*).

---

## 9. QA de Protección sin Sesión
Con el servidor local levantado en modo mock, se auditaron las cabeceras y respuestas HTTP de las rutas administrativas sin sesión activa:
* **Rutas Auditadas:**
  - `GET http://localhost:3000/admin`
  - `GET http://localhost:3000/admin/leads`
  - `GET http://localhost:3000/admin/leads/lp_ba454fd40a3a954f08c550ea`
* **Resultado:** Todas las solicitudes devolvieron un código de estado `HTTP/1.1 307 Temporary Redirect` con cabecera `location: /admin/login`. No se renderizó ningún dato confidencial de leads ni hubo exposición de PII del lado del cliente.

---

## 10. QA de Rutas Públicas (HTTP Statuses)
Se levantó el servidor local y se validaron los códigos de estado HTTP para las rutas públicas del sitio, verificando que no existan regresiones en producción:
* `GET http://localhost:3000/` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/diagnostico` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/diagnostico/gracias` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/en` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/en/assessment` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/en/assessment/thank-you` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/soluciones` → **`200 OK`** (✅ *Passed*)
* `GET http://localhost:3000/en/solutions` → **`200 OK`** (✅ *Passed*)

---

## 11. Limpieza de Archivos Temporales
Se verificó mediante `git status` y `git ls-files` que:
- Ningún archivo temporal bajo `node_modules` esté siendo rastreado.
- No se modificó el archivo `package-lock.json` por pruebas de ejecución locales.
- Se eliminó la carpeta dummy local de `server-only` en `node_modules`, restaurando el estado original del workspace.

---

## 12. Estado del Despliegue
* **Estado de la Implementación:** **CÓDIGO LISTO PARA PREVIEW** (Compila y valida tipos perfectamente).
* **Estado del QA de Autenticación:** **OAuth Real Pendiente de Configuración**. El inicio de sesión real en local, preview y producción requiere el registro de las credenciales de Google OAuth en GCP y en las variables de Vercel correspondientes.
* **Callback URLs OAuth requeridas:**
  - `http://localhost:3000/api/auth/callback/google`
  - `https://www.lumapremium.com/api/auth/callback/google`
  - `https://<alias-preview-estable>/api/auth/callback/google` *(Se debe asignar un dominio/alias estable a la rama de Preview en Vercel para autorizar este callback en la consola de Google Cloud antes de probar en Preview).*
