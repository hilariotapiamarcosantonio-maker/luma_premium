# Luma Premium — Cierre Comercial (Fase 5)

> WhatsApp real, redes oficiales, URL pública, ajuste del CTA sticky móvil y metadata.
> **Sin rediseñar. Sin dominio final todavía. Sin YouTube/LinkedIn públicos.**

**Fecha:** 2026-06-08 · Producción: https://luma-premium.vercel.app

---

## 1. WhatsApp configurado

- **Número visible:** `+1 849-212-2647`
- **Formato `wa.me`:** `18492122647`
- Centralizado en `src/lib/site.ts`:
  - `whatsappLink(message?)` normaliza con `replace(/[^\d]/g,'')`.
  - Fallback público seguro `DEFAULT_WHATSAPP = '18492122647'` → los CTA funcionan
    aunque la variable no esté en Vercel; `NEXT_PUBLIC_WHATSAPP_NUMBER` permite override.
  - `SITE.whatsappDisplay = '+1 849-212-2647'`.
- **CTAs que usan el número:** `/diagnostico` ("Solicitar evaluación" → form; "Hablar por
  WhatsApp") y `/contacto` ("Enviar mensaje"). Verificado en runtime:
  `https://wa.me/18492122647?text=...`.
- Mensajes cortos, p.ej.: *"Hola, quiero solicitar una evaluación comercial digital con Luma Premium."*

---

## 2. Redes oficiales agregadas

Centralizadas en `src/lib/site.ts` → `SOCIALS` (solo las activas):

| Red | URL |
|---|---|
| Instagram | https://www.instagram.com/lumapremiumvip/ |
| Facebook | https://www.facebook.com/profile.php?id=61590330015365 |
| TikTok | https://www.tiktok.com/@luma.premium |

- **Footer**: sección discreta "Redes oficiales" (texto con hover ámbar).
- **`/contacto`**: bloque "También puede seguir Luma Premium en sus redes oficiales." con
  los 3 enlaces en chips.
- **YouTube y LinkedIn**: NO se muestran públicamente (pendientes). Documentados aquí como
  próximos.

---

## 3. URL pública

- En uso: `https://luma-premium.vercel.app`.
- `metadataBase` (`src/app/layout.tsx`) lee `process.env.NEXT_PUBLIC_SITE_URL` con fallback
  a `https://luma-premium.vercel.app`.
- `SITE.url` en `site.ts` con la misma lógica.
- Dominio final `https://lumapremium.com`: **pendiente** hasta que Marcos confirme activación.

---

## 4. CTA sticky móvil (ajustado)

- **Se muestra en:** home, `/soluciones`, `/soluciones/[slug]`, `/casos`.
- **Se oculta en:** `/diagnostico` y `/contacto` (`HIDDEN_ROUTES`) y en su propia ruta destino.
- **No invasivo:** altura compacta (`py-3.5`), sombra/anillo más sutiles, gradiente de
  fondo para fundir con el contenido.
- **No tapa contenido:** aparece tras `scrollY > 600`, se oculta a ~220px del fondo (no
  choca con el footer), respeta `env(safe-area-inset-bottom)`.
- `/luma-estate-os` no usa `SiteShell`, por lo que el sticky nunca aparece allí.

---

## 5. Variables de entorno necesarias (configurar en Vercel)

```
NEXT_PUBLIC_SITE_URL=https://luma-premium.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=18492122647
```

> Ambas tienen **fallback seguro en código**, por lo que el sitio funciona aunque no estén
> configuradas en Vercel. Configurarlas igualmente deja el control centralizado para el
> cambio de dominio. `.env.example` actualizado con estos valores.

---

## 6. Rutas revisadas (QA local, dev server)

| Ruta | Verificación |
|---|---|
| `/` | Footer con redes; sticky CTA visible tras scroll (link `/diagnostico`); sin overflow; 0 errores consola. |
| `/diagnostico` | WhatsApp real `wa.me/18492122647`; **sticky oculto**. |
| `/contacto` | WhatsApp real; bloque de redes; **sticky oculto**; sin overflow. |
| `/casos` | Sin Sales Room; etiquetas demo/autoridad intactas. |
| `/soluciones` | OK. |
| `/soluciones/real-estate-os` | Bloque "Flujo comercial" presente. |
| `/luma-estate-os` | **Intacta** (hero "Propiedades Premium"); sin cambios. |

Confirmaciones: YouTube/LinkedIn **no aparecen** públicos; sin overflow horizontal;
sin errores de consola; Sales Room **no expuesta**.

---

## 7. Validaciones

| Validación | Resultado |
|---|---|
| `npm run lint` (`eslint src`) | ✓ Sin errores ni warnings |
| `npm run build` | ✓ Éxito — 19 rutas, 5 soluciones SSG |

---

## 8. Archivos modificados

```
src/lib/site.ts                       (WhatsApp real + fallback, SITE.url, whatsappDisplay, SOCIALS)
src/components/site/SiteFooter.tsx     (sección "Redes oficiales")
src/components/site/StickyMobileCTA.tsx (oculto en /diagnostico y /contacto, más compacto)
src/app/contacto/page.tsx              (bloque de redes oficiales)
.env.example                           (NEXT_PUBLIC_SITE_URL + NEXT_PUBLIC_WHATSAPP_NUMBER reales)
docs/LUMA_PREMIUM_COMMERCIAL_CLOSEOUT.md (este documento)
```

---

## 9. Pendientes

1. **Dominio `lumapremium.com`** — apuntar en Vercel + actualizar `NEXT_PUBLIC_SITE_URL`.
2. **YouTube** — agregar a `SOCIALS` cuando exista el canal.
3. **LinkedIn** — agregar a `SOCIALS` cuando exista la página.
4. **QA final tras dominio** — revalidar metadata/OG, CTAs y redes con el dominio definitivo.
5. (Opcional) Configurar las dos variables en Vercel para centralizar el control.
