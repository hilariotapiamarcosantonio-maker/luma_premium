export interface ProductScreenshot {
  id: string;
  solutionSlug: string;
  caseSlug?: string;
  filePath: string;
  optimizedPath: string; // Left for backwards compatibility
  thumbnailPath: string;
  fullPath: string;
  format: string;
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
  usage: 'desktop' | 'mobile';
  altEs: string;
  altEn: string;
  isRealScreenshot: boolean;
  hasMobileVersion: boolean;
  privacyChecked: boolean;
  replacementPriority: 'alta' | 'media' | 'baja';
  
  // Phase 1.5 additions
  lightboxTitleEs: string;
  lightboxTitleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  demoUrl: string;
  galleryGroup: 'real-estate' | 'commerce' | 'beauty' | 'crm' | 'suvoga' | 'general';
  order: number;
  isMobile: boolean;
  isFullScreenshot: boolean;
  isDetailCrop: boolean;
}

export const PRODUCT_SCREENSHOTS: ProductScreenshot[] = [
  // --- REAL ESTATE OS (Vista del Río) ---
  {
    id: 'real-estate-os-desktop',
    solutionSlug: 'real-estate-os',
    caseSlug: 'vista-del-rio',
    filePath: '/images/marketing/screenshots/Luma_Vista_Del_Rio_Desktop.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_vista_del_rio_desktop.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_desktop.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/luma_vista_del_rio_desktop.webp',
    format: 'webp',
    width: 1600,
    height: 880,
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Vista del catálogo y detalles de propiedades en Real Estate OS',
    altEn: 'Property catalog and details view in Real Estate OS',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'alta',
    lightboxTitleEs: 'Real Estate OS — Catálogo de Propiedades',
    lightboxTitleEn: 'Real Estate OS — Property Catalog',
    descriptionEs: 'Catálogo interactivo con filtros avanzados, mapa de ubicaciones y listado dinámico de proyectos.',
    descriptionEn: 'Interactive catalog with advanced filters, location map, and dynamic project listing.',
    demoUrl: 'https://luma-real-estate-os-demo.vercel.app/',
    galleryGroup: 'real-estate',
    order: 1,
    isMobile: false,
    isFullScreenshot: true,
    isDetailCrop: false,
  },
  {
    id: 'real-estate-os-mobile',
    solutionSlug: 'real-estate-os',
    caseSlug: 'vista-del-rio',
    filePath: '/images/marketing/screenshots/Luma_Vista_Del_Rio_Movil.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_vista_del_rio_movil.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_movil.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/luma_vista_del_rio_movil.webp',
    format: 'webp',
    width: 1010,
    height: 1800,
    orientation: 'portrait',
    usage: 'mobile',
    altEs: 'Vista móvil del portal de propiedades de Real Estate OS',
    altEn: 'Mobile view of the Real Estate OS property portal',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'alta',
    lightboxTitleEs: 'Real Estate OS — Vista Móvil de Ventas',
    lightboxTitleEn: 'Real Estate OS — Mobile Sales View',
    descriptionEs: 'Experiencia optimizada de búsqueda y reserva de propiedades adaptada al móvil del cliente.',
    descriptionEn: 'Optimized property search and reservation experience tailored to the client\'s mobile device.',
    demoUrl: 'https://luma-real-estate-os-demo.vercel.app/',
    galleryGroup: 'real-estate',
    order: 2,
    isMobile: true,
    isFullScreenshot: true,
    isDetailCrop: false,
  },
  
  // --- REAL ESTATE CRM OS ---
  {
    id: 'real-estate-crm-os-desktop',
    solutionSlug: 'real-estate-crm-os',
    filePath: '/images/marketing/screenshots/Luma Real Estete OS CRM - Demo.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_real_estete_os_crm_-_demo.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/luma_real_estete_os_crm_-_demo.webp',
    format: 'webp',
    width: 1600,
    height: 893,
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Panel de control y pipeline comercial en Real Estate CRM OS',
    altEn: 'Control panel and sales pipeline in Real Estate CRM OS',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'alta',
    lightboxTitleEs: 'Real Estate CRM OS — Panel de Control',
    lightboxTitleEn: 'Real Estate CRM OS — Control Panel',
    descriptionEs: 'Gestión comercial centralizada con pipeline Kanban, asignación de asesores y trazabilidad de leads.',
    descriptionEn: 'Centralized sales management with Kanban pipeline, agent assignment, and lead traceability.',
    demoUrl: 'https://luma-real-estate-crm-os-demo.vercel.app/',
    galleryGroup: 'crm',
    order: 1,
    isMobile: false,
    isFullScreenshot: true,
    isDetailCrop: false,
  },

  // --- REAL ESTATE CONCIERGE OS ---
  {
    id: 'real-estate-concierge-os-desktop',
    solutionSlug: 'real-estate-concierge-os',
    filePath: '/images/marketing/screenshots/Real Estate Concierge OS - Demo.png',
    optimizedPath: '/images/marketing/screenshots/optimized/real_estate_concierge_os_-_demo.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/real_estate_concierge_os_-_demo.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/real_estate_concierge_os_-_demo.webp',
    format: 'webp',
    width: 1600,
    height: 893,
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Chat interactivo y calificación automatizada en Concierge OS',
    altEn: 'Interactive chat and automated qualification in Concierge OS',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'alta',
    lightboxTitleEs: 'Concierge OS — Asistente de Conversación',
    lightboxTitleEn: 'Concierge OS — Conversation Assistant',
    descriptionEs: 'Flujo de chat automatizado para responder, perfilar y calificar prospectos en tiempo real.',
    descriptionEn: 'Automated chat flow to respond, profile, and qualify prospects in real time.',
    demoUrl: 'https://luma-real-estate-concierge-os-demo.vercel.app/',
    galleryGroup: 'real-estate',
    order: 3,
    isMobile: false,
    isFullScreenshot: true,
    isDetailCrop: false,
  },

  // --- COMMERCE OS ---
  {
    id: 'commerce-os-desktop',
    solutionSlug: 'commerce-os',
    filePath: '/images/marketing/screenshots/Luma Commerce OS - Demo.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_commerce_os_-_demo.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_commerce_os_-_demo.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/luma_commerce_os_-_demo.webp',
    format: 'webp',
    width: 1600,
    height: 900,
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Tienda en línea, catálogo de productos y checkout de Commerce OS',
    altEn: 'Online store, product catalog, and checkout in Commerce OS',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'media',
    lightboxTitleEs: 'Commerce OS — Catálogo y Checkout',
    lightboxTitleEn: 'Commerce OS — Catalog & Checkout',
    descriptionEs: 'Tienda electrónica integrada para la gestión rápida de pedidos, clientes y pasarela de pago.',
    descriptionEn: 'Integrated e-store for quick order management, customers, and checkout flow.',
    demoUrl: 'https://luma-commerce-os-demo.vercel.app/',
    galleryGroup: 'commerce',
    order: 1,
    isMobile: false,
    isFullScreenshot: true,
    isDetailCrop: false,
  },

  // --- BEAUTY SPA OS ---
  {
    id: 'beauty-spa-os-desktop',
    solutionSlug: 'beauty-spa-os',
    filePath: '/images/marketing/screenshots/Luma_Beauty_Spa_Desktop.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_beauty_spa_desktop.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_desktop.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/luma_beauty_spa_desktop.webp',
    format: 'webp',
    width: 1600,
    height: 882,
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Agenda de servicios, citas y reservas en Beauty Spa OS',
    altEn: 'Service schedule, bookings, and reservations in Beauty Spa OS',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'media',
    lightboxTitleEs: 'Beauty Spa OS — Portal de Reservas',
    lightboxTitleEn: 'Beauty Spa OS — Booking Portal',
    descriptionEs: 'Plataforma de agenda y citas de tratamientos estéticos con selección de terapeuta y horario.',
    descriptionEn: 'Booking and scheduling platform for aesthetic treatments with therapist and time selection.',
    demoUrl: 'https://luma-beauty-spa-os-demo.vercel.app/',
    galleryGroup: 'beauty',
    order: 1,
    isMobile: false,
    isFullScreenshot: true,
    isDetailCrop: false,
  },
  {
    id: 'beauty-spa-os-mobile',
    solutionSlug: 'beauty-spa-os',
    filePath: '/images/marketing/screenshots/Luma_Beauty_Spa_Movil.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_beauty_spa_movil.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_movil.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/luma_beauty_spa_movil.webp',
    format: 'webp',
    width: 1077,
    height: 1800,
    orientation: 'portrait',
    usage: 'mobile',
    altEs: 'Vista móvil del sistema de citas en Beauty Spa OS',
    altEn: 'Mobile view of the reservation system in Beauty Spa OS',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'media',
    lightboxTitleEs: 'Beauty Spa OS — Cita Express Móvil',
    lightboxTitleEn: 'Beauty Spa OS — Mobile Express Booking',
    descriptionEs: 'Interfaz móvil ágil para agendar y confirmar citas desde redes sociales de forma inmediata.',
    descriptionEn: 'Agile mobile interface to book and confirm appointments immediately from social channels.',
    demoUrl: 'https://luma-beauty-spa-os-demo.vercel.app/',
    galleryGroup: 'beauty',
    order: 2,
    isMobile: true,
    isFullScreenshot: true,
    isDetailCrop: false,
  },

  // --- SUVOGA OS ACADEMY (Casos / Referencia) ---
  {
    id: 'suvoga-os-academy-desktop',
    solutionSlug: 'suvoga-academy',
    caseSlug: 'suvoga',
    filePath: '/images/marketing/screenshots/Suvoga OS Academy.png',
    optimizedPath: '/images/marketing/screenshots/optimized/suvoga_os_academy.webp',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/suvoga_os_academy.webp',
    fullPath: '/images/marketing/screenshots/optimized/full/suvoga_os_academy.webp',
    format: 'webp',
    width: 1600,
    height: 829,
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Plataforma educativa y catálogo de cursos de Suvoga Academy',
    altEn: 'Educational platform and course catalog in Suvoga Academy',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'baja',
    lightboxTitleEs: 'Suvoga Academy — Plataforma de Formación',
    lightboxTitleEn: 'Suvoga Academy — Learning Platform',
    descriptionEs: 'Infraestructura educativa con catálogo de cursos, lecciones estructuradas e historial comercial.',
    descriptionEn: 'Educational infrastructure with course catalog, structured lessons, and sales history.',
    demoUrl: 'https://suvoga-os-tjaa.vercel.app/',
    galleryGroup: 'suvoga',
    order: 1,
    isMobile: false,
    isFullScreenshot: true,
    isDetailCrop: false,
  },
];

export function getScreenshot(id: string): ProductScreenshot | undefined {
  return PRODUCT_SCREENSHOTS.find(s => s.id === id);
}

export function getScreenshotBySolution(solutionSlug: string, usage: 'desktop' | 'mobile' = 'desktop'): ProductScreenshot | undefined {
  return PRODUCT_SCREENSHOTS.find(s => s.solutionSlug === solutionSlug && s.usage === usage);
}

export function getScreenshotByCase(caseSlug: string, usage: 'desktop' | 'mobile' = 'desktop'): ProductScreenshot | undefined {
  return PRODUCT_SCREENSHOTS.find(s => s.caseSlug === caseSlug && s.usage === usage);
}
