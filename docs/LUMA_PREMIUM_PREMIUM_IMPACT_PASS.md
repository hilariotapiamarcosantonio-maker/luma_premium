# Luma Premium — Premium Impact Pass (Fase 4.5)

> Elevación visual premium de la web madre, sin rediseñar ni cambiar la línea
> gráfica. Más high-tech, más profundidad, más sensación de ecosistema comercial.

**Fecha:** 2026-06-08 · **Rama:** `feat/luma-premium-impact-pass` · Stack: Next.js 16.2.4, React 19, Tailwind v4, framer-motion.

---

## 1. Objetivo

Convertir Luma Premium de una web ejecutiva limpia a una experiencia más premium,
high-tech y memorable, que transmita arquitectura comercial digital, ecosistema de
soluciones, capas conectadas y autoridad para vender tickets altos — manteniendo la
identidad visual (slate-950 + ámbar), performance móvil razonable y `/luma-estate-os` intacta.

---

## 2. Componentes creados

| Componente | Tipo | Rol |
|---|---|---|
| `PremiumBackground` | Server (CSS) | Fondo global: gradiente radial + grid tecnológico + orbes de luz + viñeta. |
| `AnimatedGrid` | Server (CSS) | Grid tecnológico sutil con máscara radial. |
| `GlowOrb` | Server (CSS) | Luz radial difusa (ámbar/champagne/slate), animación lenta. |
| `PremiumDivider` | Server (CSS) | Separador hairline con brillo ámbar animado. |
| `Motion` (`MotionSection`, `MotionStagger`, `MotionItem`) | Client | Wrappers de animación de entrada con framer-motion. |
| `EcosystemScene` | Server (CSS) | Escena del hero: sistema conectado de nodos + chips. |
| `EcosystemLayers` | Server (CSS) | Sección "Ecosistema": 7 capas comerciales como arquitectura. |
| `FlowDiagram` | Server (CSS) | Flujo comercial por solución (pasos conectados por flechas). |
| `StickyMobileCTA` | Client | CTA sticky móvil que aparece tras scroll y se oculta cerca del footer. |

---

## 3. Páginas y componentes tocados

- `src/app/globals.css` — keyframes premium (`luma-float`, `luma-pulse`, `luma-shimmer`,
  `luma-trace`), clase `.luma-grid`, `scroll-behavior: smooth` y bloque
  `@media (prefers-reduced-motion: reduce)` que desactiva animaciones/transiciones.
- `src/components/site/SiteShell.tsx` — integra `PremiumBackground` + `StickyMobileCTA`;
  el wrapper deja de ser opaco para que el fondo global se vea.
- `src/components/site/SiteFooter.tsx` — frase institucional de cierre + `PremiumDivider`.
- `src/components/site/SolutionCard.tsx` — borde con gradiente, icono con glow, hover-lift
  reforzado, flecha animada y tags de flujo.
- `src/components/site/CaseCard.tsx` — etiqueta de tipo (Demo oficial / Referencia /
  Autoridad) con color diferenciado + hover-lift.
- `src/app/page.tsx` (home) — hero de dos columnas con `EcosystemScene`; animaciones de
  entrada; nueva sección "Ecosistema Luma Premium" (`EcosystemLayers`).
- `src/app/soluciones/page.tsx` — grilla animada (stagger) + card de diagnóstico diferenciada.
- `src/app/soluciones/[slug]/page.tsx` — bloque visual "Flujo comercial de la solución"
  (`FlowDiagram` con `commercialFlow`).
- `src/app/diagnostico/page.tsx` — meta-chips (para quién · 24–48 h · sin compromiso),
  animaciones, refuerzo de entrada premium.
- `src/app/casos/page.tsx` — franja de autoridad + grilla animada + etiquetas por tipo.
- `src/lib/solutions.ts` — campo `commercialFlow` por solución.
- `src/lib/cases.ts` — campo `kind` + `CASE_KIND_LABEL` (demo / reference / authority).

---

## 4. Mejoras visuales

- **Profundidad global**: fondo premium con gradiente, grid técnico y orbes de luz tenues.
- **Hero con sistema vivo**: escena de ecosistema con nodos conectados (Ads → Diagnóstico
  → Concierge → CRM → Seguimiento → Conversión) y chips de capacidades.
- **Cards más potentes**: borde gradiente, glow en icono, hover-lift, flecha animada, tags.
- **Sección Ecosistema**: 7 capas como arquitectura (presencia, captación, respuesta, CRM,
  seguimiento, conversión, medición).
- **Flujo por solución**: diagrama visual del recorrido comercial.
- **`/diagnostico` premium**: meta-chips de confianza, lectura ejecutiva.
- **`/casos` con honestidad comercial**: diferenciación clara Demo oficial / Referencia /
  Autoridad del fundador, sin exponer Sales Room.
- **Footer institucional**: frase de cierre de marca.
- **CTA sticky móvil**: discreto, aparece tras scroll, no tapa el footer.

---

## 5. Animaciones agregadas

- Fade-up por sección (`MotionSection`) al entrar en viewport (once).
- Stagger en grillas de cards (`MotionStagger` + `MotionItem`).
- Hover-lift + glow de icono + flecha en cards (CSS).
- Orbes de luz con drift/pulse lento (CSS).
- Shimmer ámbar en divisores (CSS).
- **`prefers-reduced-motion`**: todas las animaciones se neutralizan (CSS global +
  `useReducedMotion` en los wrappers).

### Nota técnica (hydration)
Se detectó y corrigió un **hydration mismatch** de framer-motion (el SSR emitía estilos
de animación que no coincidían con el cliente, dejando bloques en `opacity:0`). Solución:
los wrappers de `Motion` renderizan contenido estático en SSR/primer render y activan la
animación solo tras el montaje en cliente, detectado con `useSyncExternalStore`
(sin `setState` en efecto). Resultado: **0 errores de consola**.

---

## 6. Resultado de QA local

### Desktop (1280×820)
- ✓ Hero con escena de ecosistema visible y conectada.
- ✓ Fondo premium con profundidad, sin sobrecargar.
- ✓ Cards de soluciones con borde gradiente, glow y tags.
- ✓ Sección "Ecosistema" como arquitectura por capas.
- ✓ Sin overflow horizontal (`scrollWidth == clientWidth`).
- ✓ 0 errores de consola.

### Mobile (375×812)
- ✓ Hero centrado, escena apilada, CTAs full-width.
- ✓ Grillas stackean sin overflow (overflow = 0 en `/`, `/casos`).
- ✓ Sticky CTA aparece tras scroll (opacity→1), se oculta cerca del footer, link a `/diagnostico`.
- ✓ Menú hamburguesa operativo.
- ✓ `/diagnostico` con meta-chips; `/casos` con etiquetas diferenciadas.
- ✓ `/luma-estate-os` intacta (hero "Propiedades Premium", título original).

---

## 7. Validaciones

| Validación | Resultado |
|---|---|
| `npm run lint` (`eslint src`) | ✓ Sin errores ni warnings |
| `npm run build` | ✓ Éxito — 19 rutas, 5 soluciones SSG |
| Consola del navegador | ✓ Sin errores (hydration resuelto) |

---

## 8. Confirmaciones de seguridad / reglas

- ✓ **No se tocaron secretos** ni `.env` / `.env.local` (ignorados).
- ✓ **No se inventó número de WhatsApp** — sigue `wa.me/?text=…` parametrizado.
- ✓ **No se expuso Sales Room** — `/casos` solo demos/referencias autorizadas.
- ✓ **No se tocó el dominio** ni variables de entorno de Vercel.
- ✓ **No se mezcló el portafolio de Marcos** como producto (sigue etiquetado "Autoridad").
- ✓ **`/luma-estate-os` intacta**.
- ✓ No se subió `.claude/` (ignorado; `launch.json` solo config local de preview).

---

## 9. Riesgos de performance móvil

- Bajo. El fondo premium y la mayoría de efectos son **CSS puro** (server components),
  sin coste de JS. framer-motion se limita a wrappers ligeros con `whileInView`/`once`.
- Animaciones lentas y sutiles; `prefers-reduced-motion` las desactiva.
- Recomendación opcional a futuro: medir LCP/CLS reales en producción y, si hiciera falta,
  reducir el número de orbes en móvil.

---

## 10. Pendientes antes del deploy

1. `NEXT_PUBLIC_WHATSAPP_NUMBER` — activar CTAs de WhatsApp con destino real (Marcos).
2. `NEXT_PUBLIC_SITE_URL` — dominio final para `metadataBase` / OG (Marcos).
3. Decisión de push/deploy de esta fase (no realizado; requiere aprobación).
4. (Opcional) Medición de performance real en producción.

---

## 11. Estado

Listo para **commit local**. Lint y build limpios, QA desktop/mobile OK, sin archivos
sensibles, `/luma-estate-os` intacta. **Push/deploy pendiente de aprobación de Marcos.**
