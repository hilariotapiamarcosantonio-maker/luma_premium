// Configuración central de la marca madre Luma Premium.
// Centraliza navegación, CTA y enlaces externos para que toda la web
// (ads, ventas, presentaciones) hable con un solo lenguaje.

export const SITE = {
  name: 'Luma Premium',
  brandMark: { lead: 'LUMA', tail: 'PREMIUM' },
  founder: 'Marcos Hilario',
  founderRole: 'Arquitecto Digital de Alto Rendimiento',
  whatsappDisplay: '+1 849-212-2647',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://luma-premium.vercel.app',
  tagline:
    'Sistemas comerciales digitales para negocios premium que necesitan vender con más autoridad, seguimiento y control.',
  promise:
    'Luma Premium diseña sistemas comerciales digitales para que negocios premium capten, respondan, organicen y conviertan oportunidades con más autoridad y control.',
} as const;

// WhatsApp público de Luma Premium. El número es un dato público, por lo que se
// define un fallback seguro: los CTA funcionan aunque la variable de entorno no
// esté configurada en Vercel. `NEXT_PUBLIC_WHATSAPP_NUMBER` permite overridearlo.
const DEFAULT_WHATSAPP = '18492122647';
const WHATSAPP_RAW = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP;

export function whatsappLink(message?: string): string {
  const number = WHATSAPP_RAW.replace(/[^\d]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  // Con número: enlace directo. Sin número (caso extremo): wa.me genérico seguro.
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text}`;
}

export const PORTFOLIO_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
  'https://marcos-portfolio-premium.vercel.app';

// Redes oficiales públicas de Luma Premium.
// Solo se listan las redes activas. YouTube y LinkedIn quedan pendientes y NO se
// muestran públicamente hasta que existan (ver docs).
export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/lumapremiumvip/' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590330015365' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@luma.premium' },
] as const;

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
