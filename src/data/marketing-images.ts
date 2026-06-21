// Registro central de imágenes de marketing de la web pública.
// Las imágenes son STOCK PROVISIONAL (ver docs/LUMA_PUBLIC_STOCK_IMAGE_MANIFEST.md)
// y deben sustituirse por material propio de Luma Premium más adelante.
// Centralizar aquí permite reemplazarlas en un solo lugar sin tocar componentes.

export type LocalizedText = { es: string; en: string };

export type MarketingImage = {
  src: string;
  width: number;
  height: number;
  /** Texto alternativo localizado. Describe el concepto/sector, no afirma evidencia. */
  alt: LocalizedText;
};

const W = 1200;
const H = 760;
const base = '/images/marketing/stock';

// Imágenes por solución (clave = slug). Refuerzan el sector, no fingen clientes.
export const SOLUTION_IMAGES: Record<string, MarketingImage> = {
  'real-estate-os': {
    src: `${base}/real-estate-os.webp`,
    width: W,
    height: H,
    alt: {
      es: 'Arquitectura inmobiliaria premium representando proyectos de alto valor',
      en: 'Premium real estate architecture representing high-value projects',
    },
  },
  'real-estate-crm-os': {
    src: `${base}/real-estate-crm-os.webp`,
    width: W,
    height: H,
    alt: {
      es: 'Panel de datos y control comercial sobre un escritorio de trabajo',
      en: 'Data dashboard and commercial control on a work desk',
    },
  },
  'real-estate-concierge-os': {
    src: `${base}/real-estate-concierge-os.webp`,
    width: W,
    height: H,
    alt: {
      es: 'Comunicación digital y atención de consultas desde un dispositivo móvil',
      en: 'Digital communication and inquiry handling from a mobile device',
    },
  },
  'commerce-os': {
    src: `${base}/commerce-os.webp`,
    width: W,
    height: H,
    alt: {
      es: 'Comercio y experiencia de compra premium para tiendas y e-commerce',
      en: 'Premium retail and shopping experience for stores and e-commerce',
    },
  },
  'beauty-spa-os': {
    src: `${base}/beauty-spa-os.webp`,
    width: W,
    height: H,
    alt: {
      es: 'Ambiente de spa y estética premium para servicios de bienestar',
      en: 'Premium spa and aesthetics environment for wellness services',
    },
  },
};

export function getSolutionImage(slug: string): MarketingImage | undefined {
  return SOLUTION_IMAGES[slug];
}

// Sectores atendidos. Cada sector reutiliza una imagen de concepto.
export type Industry = {
  id: string;
  /** Icono lucide-react (resuelto en el componente). */
  icon: string;
  label: LocalizedText;
  description: LocalizedText;
  image: MarketingImage;
};

export const INDUSTRIES: Industry[] = [
  {
    id: 'inmobiliarias',
    icon: 'Building2',
    label: { es: 'Inmobiliarias', en: 'Real estate' },
    description: {
      es: 'Proyectos y propiedades de alto valor con captación por perfil de comprador.',
      en: 'High-value projects and properties with buyer-profile capture.',
    },
    image: SOLUTION_IMAGES['real-estate-os'],
  },
  {
    id: 'comercio',
    icon: 'ShoppingBag',
    label: { es: 'Comercio y e-commerce', en: 'Commerce & e-commerce' },
    description: {
      es: 'Catálogo, pedidos, clientes y seguimiento para tiendas que quieren orden.',
      en: 'Catalog, orders, customers, and follow-up for stores that want order.',
    },
    image: SOLUTION_IMAGES['commerce-os'],
  },
  {
    id: 'spas',
    icon: 'Sparkles',
    label: { es: 'Spas y estética', en: 'Spas & aesthetics' },
    description: {
      es: 'Presentación de servicios, captación desde redes y agenda comercial.',
      en: 'Service presentation, social capture, and commercial scheduling.',
    },
    image: SOLUTION_IMAGES['beauty-spa-os'],
  },
  {
    id: 'academias',
    icon: 'GraduationCap',
    label: { es: 'Academias', en: 'Academies' },
    description: {
      es: 'Captación e inscripción ordenada para formaciones y programas.',
      en: 'Organized capture and enrollment for trainings and programs.',
    },
    image: {
      src: `${base}/sector-academias.webp`,
      width: W,
      height: H,
      alt: {
        es: 'Entorno de formación y aprendizaje para academias',
        en: 'Training and learning environment for academies',
      },
    },
  },
  {
    id: 'servicios',
    icon: 'Briefcase',
    label: { es: 'Servicios profesionales', en: 'Professional services' },
    description: {
      es: 'Firmas y consultores que venden por confianza, criterio y seguimiento.',
      en: 'Firms and consultants that sell through trust, judgment, and follow-up.',
    },
    image: {
      src: `${base}/sector-servicios.webp`,
      width: W,
      height: H,
      alt: {
        es: 'Entorno profesional de oficina para servicios de consultoría',
        en: 'Professional office environment for consulting services',
      },
    },
  },
  {
    id: 'equipos',
    icon: 'Users',
    label: { es: 'Equipos comerciales', en: 'Sales teams' },
    description: {
      es: 'Operaciones con varios asesores que necesitan trazabilidad y control.',
      en: 'Operations with multiple reps that need traceability and control.',
    },
    image: {
      src: `${base}/sector-equipos.webp`,
      width: W,
      height: H,
      alt: {
        es: 'Equipo comercial trabajando en una reunión de negocios',
        en: 'Sales team working in a business meeting',
      },
    },
  },
];
