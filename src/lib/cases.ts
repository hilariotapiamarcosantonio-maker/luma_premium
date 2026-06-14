// Demos y referencias públicas autorizadas para mostrar en /casos.
// Solo enlaces aprobados. La Sales Room interna NO se expone aquí.

export type CaseKind = 'demo' | 'reference' | 'authority';

export const CASE_KIND_LABEL: Record<CaseKind, string> = {
  demo: 'Demo oficial',
  reference: 'Referencia comercial',
  authority: 'Autoridad del fundador',
};

export type CaseItem = {
  title: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  /** Tipo de referencia para etiquetado honesto */
  kind: CaseKind;
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
    kind: 'demo',
    solutionSlug: 'real-estate-os',
  },
  {
    title: 'Real Estate CRM OS — Demo',
    category: 'Inmobiliario · Control',
    description:
      'Centro de control comercial: leads, propiedades, asesores y seguimiento con visibilidad ejecutiva.',
    url: 'https://luma-real-estate-crm-os-demo.vercel.app/',
    icon: 'LayoutDashboard',
    kind: 'demo',
    solutionSlug: 'real-estate-crm-os',
  },
  {
    title: 'Real Estate Concierge OS — Demo',
    category: 'Inmobiliario · Concierge',
    description:
      'Concierge comercial que responde, educa y califica prospectos antes de que lleguen al asesor.',
    url: 'https://luma-real-estate-concierge-os-demo.vercel.app/',
    icon: 'MessageSquare',
    kind: 'demo',
    solutionSlug: 'real-estate-concierge-os',
  },
  {
    title: 'Commerce OS — Demo',
    category: 'Retail · Comercio',
    description:
      'Catálogo, pedidos, clientes y seguimiento para tiendas que quieren ordenar su operación comercial.',
    url: 'https://luma-commerce-os-demo.vercel.app/',
    icon: 'ShoppingBag',
    kind: 'demo',
    solutionSlug: 'commerce-os',
  },
  {
    title: 'Beauty Spa OS — Demo',
    category: 'Estética · Servicios',
    description:
      'Presentación de servicios, captación desde redes y solicitud de cita para spas y centros estéticos.',
    url: 'https://luma-beauty-spa-os-demo.vercel.app/',
    icon: 'Sparkles',
    kind: 'demo',
    solutionSlug: 'beauty-spa-os',
  },
  {
    title: 'Beauty Spa OS — Concierge',
    category: 'Estética · Concierge',
    description:
      'Flujo de concierge comercial para resolver dudas y guiar a la clienta hacia la solicitud de cita.',
    url: 'https://luma-beauty-spa-os-demo.vercel.app/concierge',
    icon: 'MessageSquare',
    kind: 'demo',
    solutionSlug: 'beauty-spa-os',
  },
  {
    title: 'Suvoga OS',
    category: 'Sistema comercial',
    description:
      'Referencia de sistema comercial digital construido con la arquitectura Luma Premium.',
    url: 'https://suvoga-os-tjaa.vercel.app/',
    icon: 'Boxes',
    kind: 'reference',
  },
  {
    title: 'Portafolio — Marcos Hilario',
    category: 'Arquitecto Digital',
    description:
      'Portafolio del arquitecto detrás de Luma Premium: infraestructura digital premium de alto rendimiento.',
    url: 'https://marcos-portfolio-premium.vercel.app/',
    icon: 'User',
    kind: 'authority',
  },
];

export const EN_CASES: CaseItem[] = [
  {
    title: 'Real Estate OS — Demo',
    category: 'Real Estate · Presentation',
    description:
      'Premium presentation and capture for real estate projects with routes per buyer profile.',
    url: 'https://luma-real-estate-os-demo.vercel.app/',
    icon: 'Building2',
    kind: 'demo',
    solutionSlug: 'real-estate-os',
  },
  {
    title: 'Real Estate CRM OS — Demo',
    category: 'Real Estate · Control',
    description:
      'Commercial control center: leads, properties, agents, and follow-up with executive visibility.',
    url: 'https://luma-real-estate-crm-os-demo.vercel.app/',
    icon: 'LayoutDashboard',
    kind: 'demo',
    solutionSlug: 'real-estate-crm-os',
  },
  {
    title: 'Real Estate Concierge OS — Demo',
    category: 'Real Estate · Concierge',
    description:
      'Commercial concierge that responds, educates, and qualifies prospects before they reach the agent.',
    url: 'https://luma-real-estate-concierge-os-demo.vercel.app/',
    icon: 'MessageSquare',
    kind: 'demo',
    solutionSlug: 'real-estate-concierge-os',
  },
  {
    title: 'Commerce OS — Demo',
    category: 'Retail · Commerce',
    description:
      'Catalog, orders, clients, and follow-up for stores that want to organize their sales operation.',
    url: 'https://luma-commerce-os-demo.vercel.app/',
    icon: 'ShoppingBag',
    kind: 'demo',
    solutionSlug: 'commerce-os',
  },
  {
    title: 'Beauty Spa OS — Demo',
    category: 'Aesthetics · Services',
    description:
      'Service presentation, social media capture, and booking requests for spas and aesthetic centers.',
    url: 'https://luma-beauty-spa-os-demo.vercel.app/',
    icon: 'Sparkles',
    kind: 'demo',
    solutionSlug: 'beauty-spa-os',
  },
  {
    title: 'Beauty Spa OS — Concierge',
    category: 'Aesthetics · Concierge',
    description:
      'Commercial concierge flow to resolve questions and guide clients toward a booking request.',
    url: 'https://luma-beauty-spa-os-demo.vercel.app/concierge',
    icon: 'MessageSquare',
    kind: 'demo',
    solutionSlug: 'beauty-spa-os',
  },
  {
    title: 'Suvoga OS',
    category: 'Commercial System',
    description:
      'Commercial digital system reference built with the Luma Premium architecture.',
    url: 'https://suvoga-os-tjaa.vercel.app/',
    icon: 'Boxes',
    kind: 'reference',
  },
  {
    title: 'Portfolio — Marcos Hilario',
    category: 'Digital Architect',
    description:
      'Portfolio of the architect behind Luma Premium: premium, high-performance digital infrastructure.',
    url: 'https://marcos-portfolio-premium.vercel.app/',
    icon: 'User',
    kind: 'authority',
  },
];
