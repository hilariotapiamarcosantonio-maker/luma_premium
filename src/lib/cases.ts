// Demos y referencias públicas autorizadas para mostrar en /casos.
// Solo enlaces aprobados. La Sales Room interna NO se expone aquí.

export type CaseItem = {
  title: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  /** Solución relacionada (slug) para venta cruzada */
  solutionSlug?: string;
};

export const CASES: CaseItem[] = [
  {
    title: 'Real Estate OS — Demo',
    category: 'Inmobiliario · Presentación',
    description:
      'Presentación y captación premium para proyectos inmobiliarios con rutas por perfil de comprador.',
    url: 'https://luma-real-estate-os-demo.vercel.app/',
    icon: 'Building2',
    solutionSlug: 'real-estate-os',
  },
  {
    title: 'Real Estate CRM OS — Demo',
    category: 'Inmobiliario · Control',
    description:
      'Centro de control comercial: leads, propiedades, asesores y seguimiento con visibilidad ejecutiva.',
    url: 'https://luma-real-estate-crm-os-demo.vercel.app/',
    icon: 'LayoutDashboard',
    solutionSlug: 'real-estate-crm-os',
  },
  {
    title: 'Real Estate Concierge OS — Demo',
    category: 'Inmobiliario · Concierge',
    description:
      'Concierge comercial que responde, educa y califica prospectos antes de que lleguen al asesor.',
    url: 'https://luma-real-estate-concierge-os-demo.vercel.app/',
    icon: 'MessageSquare',
    solutionSlug: 'real-estate-concierge-os',
  },
  {
    title: 'Commerce OS — Demo',
    category: 'Retail · Comercio',
    description:
      'Catálogo, pedidos, clientes y seguimiento para tiendas que quieren ordenar su operación comercial.',
    url: 'https://luma-commerce-os-demo.vercel.app/',
    icon: 'ShoppingBag',
    solutionSlug: 'commerce-os',
  },
  {
    title: 'Beauty Spa OS — Demo',
    category: 'Estética · Servicios',
    description:
      'Presentación de servicios, captación desde redes y solicitud de cita para spas y centros estéticos.',
    url: 'https://luma-beauty-spa-os-demo.vercel.app/',
    icon: 'Sparkles',
    solutionSlug: 'beauty-spa-os',
  },
  {
    title: 'Beauty Spa OS — Concierge',
    category: 'Estética · Concierge',
    description:
      'Flujo de concierge comercial para resolver dudas y guiar a la clienta hacia la solicitud de cita.',
    url: 'https://luma-beauty-spa-os-demo.vercel.app/concierge',
    icon: 'MessageSquare',
    solutionSlug: 'beauty-spa-os',
  },
  {
    title: 'Suvoga OS',
    category: 'Sistema comercial',
    description:
      'Referencia de sistema comercial digital construido con la arquitectura Luma Premium.',
    url: 'https://suvoga-os-tjaa.vercel.app/',
    icon: 'Boxes',
  },
  {
    title: 'Portafolio — Marcos Hilario',
    category: 'Arquitecto Digital',
    description:
      'Portafolio del arquitecto detrás de Luma Premium: infraestructura digital premium de alto rendimiento.',
    url: 'https://marcos-portfolio-premium.vercel.app/',
    icon: 'User',
  },
];
