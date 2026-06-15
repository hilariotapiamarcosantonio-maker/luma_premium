# Documentación de Implementación — CRM MVP Fase 1

Este documento detalla la arquitectura, decisiones de diseño y resultados de calidad para la **Fase 1** del panel administrativo privado (CRM) de **Luma Premium**.

---

## 1. Dependencias Añadidas
* **`next-auth@5.0.0-beta.25` (o `@beta`):** Se integró para manejar la autenticación federada con Google OAuth en Next.js 16 (App Router) mediante sesiones JWT seguras y sin estado.
* **`zod`:** Utilizado para validación estricta de variables de entorno de filtrado y el mapeo de campos provenientes de Google Sheets.

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
3. Al pulsar "Continuar con Google", se inicia el flujo OAuth estándar solicitando únicamente los scopes básicos: `openid`, `profile` y `email` (no se solicitan permisos de lectura/escritura de Sheets a nivel del usuario).
4. **Validaciones en `signIn`:**
   - Verifica que el proveedor es Google.
   - Valida que `email_verified` es verdadero.
   - Normaliza el correo electrónico (`trim().toLowerCase()`).
   - Comprueba la allowlist exacta. Si es rechazado, se le deniega el acceso con un mensaje genérico de error de NextAuth (por privacidad, el correo no es impreso en logs).

---

## 4. Allowlist y Roles
* **Marcos (`role: admin`):** Autorizado a visualizar todo el listado de leads, dashboard y las fichas de prospectos individuales.
* **William (`role: sales`):** Autorizado para el acceso a la información comercial de leads de solo lectura en esta fase.
* **Control en Servidor:** Las rutas y la DAL validan la sesión utilizando las funciones `assertAuthorized` y `assertAdmin` provistas en `src/lib/auth/permissions.ts`.

---

## 5. Protección de Rutas
Todas las rutas de administración bajo `/admin/(protected)/*` y la Data Access Layer están doblemente protegidas:
1. **Filtro optimista (`src/proxy.ts`):** Redirección temprana en layouts y páginas si no se detecta sesión.
2. **Validación robusta en servidor:** Verificación en la capa de datos (DAL) y renderizado mediante llamadas directas a `auth()`.
3. **Caché público deshabilitado:** Las páginas se fuerzan a ser 100% dinámicas para proteger la información personal (PII) de los leads y evitar indexación:
   ```ts
   export const dynamic = "force-dynamic";
   export const revalidate = 0;
   ```
   Las lecturas sensibles usan configuraciones de `cache: 'no-store'`.
4. **No PII en URLs:** No se exponen correos ni teléfonos en query strings de búsqueda o URLs. Se utiliza el identificador seguro determinista `lead_id` (basado en `source_fingerprint`).

---

## 6. Data Access Layer (DAL)
* **Reutilización OIDC:** La lectura en modo `sheets` importa `getGcpSheetsAuthClient` de `src/lib/google-auth.ts`, aprovechando la autenticación de servidor a servidor (Workload Identity Federation) de GCP sin claves JSON privadas.
* **Paginación y Filtros en Repositorio:** Debido a que Google Sheets no cuenta con capacidades nativas de paginación relacional o indexado de búsquedas rápidas, la DAL realiza la paginación y ordenamiento en memoria en la capa del repositorio antes de transferir datos al servidor web de Next.js, protegiendo el ancho de banda del navegador.
* **Validación Robusta (Zod):** Cada fila de `Luma Leads V2` (columnas `A:AC`) se valida con `SheetRowSchema.safeParse`. Si alguna fila está corrupta, se omite silenciosamente para no corromper el resto de los registros en el CRM.

---

## 7. Huella de Identidad determinista (`source_fingerprint`)
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
Se formatea como `lp_<primeros_16_caracteres_del_hash>`. En fases posteriores, al crearse las pestañas operativas `Luma CRM Leads`, se guardará este `lead_id` como un registro inmutable.

---

## 8. Rutas y Componentes Creados
* `src/auth.ts`: Configuración principal de Auth.js.
* `src/proxy.ts`: Interceptor y redireccionador optimista de sesión.
* `src/types/next-auth.d.ts`: Extensiones de tipado de TypeScript.
* `src/lib/auth/authorized-users.ts`: Gestor de allowlist.
* `src/lib/auth/permissions.ts`: Helpers de validación de permisos en el servidor.
* `src/lib/crm/types.ts`: Tipos del CRM.
* `src/lib/crm/schemas.ts`: Esquemas de Zod para leads y filtros.
* `src/lib/crm/lead-identity.ts`: Generador del `source_fingerprint`.
* `src/lib/crm/repository.ts`: Interfaz y factoría del repositorio.
* `src/lib/crm/mock-repository.ts`: Datos de prueba sintéticos de alta fidelidad.
* `src/lib/crm/google-sheets-repository.ts`: Implementación OIDC lectora de Google Sheets.
* `src/app/admin/login/page.tsx`: Vista de login premium externa al layout protegido.
* `src/app/admin/(protected)/layout.tsx`: Layout del panel privado con barra lateral responsive y logout.
* `src/app/admin/(protected)/page.tsx`: Dashboard comercial.
* `src/app/admin/(protected)/leads/page.tsx`: Vista de tabla de leads con paginación y filtros URL-safe.
* `src/app/admin/(protected)/leads/[id]/page.tsx`: Ficha del lead con integración a WhatsApp normalizado y mailto.

---

## 9. QA y Verificación de Regresión Pública
* **Verificación de Tipos y Construcción:** Compilación estática de producción exitosa en Next.js. Todas las rutas de `/admin` son detectadas y compiladas como rutas dinámicas de servidor (`ƒ`).
* **QA del Login en Preview:** Actualmente se reporta como **Bloqueado/Pendiente** hasta configurar las credenciales OAuth reales de Google en Vercel y asociar el alias Preview correspondiente en la consola de Google. El inicio de sesión local se probó con las validaciones de tipos e interfaces MOCK y redirige correctamente a Google OAuth.
* **Regresión Pública:** Los endpoints públicos (`/api/luma-leads`) y los formularios de captación en español (`/diagnostico`) e inglés (`/en/assessment`) continúan operando con total estabilidad e independencia, sin verse afectados en lo absoluto por los módulos del CRM.

---

## 10. Limitaciones y Próximos Pasos (Fase 2)
* Creación de las celdas y pestañas sidecar en Google Sheets (`Luma CRM Leads`, `Luma CRM Notes`, `Luma CRM Audit`).
* Implementación de escrituras CRM (cambio de estados, responsable, fecha de seguimiento).
* Bitácoras y registro comercial de notas internas por lead.
