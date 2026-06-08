// Configuración central de la marca madre Luma Premium.
// Centraliza navegación, CTA y enlaces externos para que toda la web
// (ads, ventas, presentaciones) hable con un solo lenguaje.

export const SITE = {
  name: 'Luma Premium',
  brandMark: { lead: 'LUMA', tail: 'PREMIUM' },
  founder: 'Marcos Hilario',
  founderRole: 'Arquitecto Digital de Alto Rendimiento',
  tagline:
    'Sistemas comerciales digitales para negocios premium que necesitan vender con más autoridad, seguimiento y control.',
  promise:
    'Luma Premium diseña sistemas comerciales digitales para que negocios premium capten, respondan, organicen y conviertan oportunidades con más autoridad y control.',
} as const;

// Número de WhatsApp parametrizado. Si no hay número confirmado se usa un
// placeholder seguro — nunca un dato real de cliente.
const WHATSAPP_RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

export function whatsappLink(message?: string): string {
  const number = WHATSAPP_RAW.replace(/[^\d]/g, '');
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : '';
  // Sin número confirmado: enviamos a wa.me genérico (el usuario completará destino).
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text}`;
}

export const PORTFOLIO_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
  'https://marcos-portfolio-premium.vercel.app';

// Navegación principal de la web madre.
export const NAV_LINKS = [
  { label: 'Soluciones', href: '/soluciones' },
  { label: 'Método', href: '/metodo' },
  { label: 'Casos', href: '/casos' },
  { label: 'Diagnóstico', href: '/diagnostico' },
] as const;

export const PRIMARY_CTA = {
  label: 'Solicitar evaluación',
  href: '/diagnostico',
} as const;
