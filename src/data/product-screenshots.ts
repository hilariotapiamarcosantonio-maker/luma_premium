export interface ProductScreenshot {
  id: string;
  solutionSlug: string;
  caseSlug?: string;
  filePath: string;
  optimizedPath: string;
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
}

export const PRODUCT_SCREENSHOTS: ProductScreenshot[] = [
  // --- REAL ESTATE OS (Vista del Río) ---
  {
    id: 'real-estate-os-desktop',
    solutionSlug: 'real-estate-os',
    caseSlug: 'vista-del-rio',
    filePath: '/images/marketing/screenshots/Luma_Vista_Del_Rio_Desktop.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_vista_del_rio_desktop.webp',
    format: 'webp',
    width: 1600,
    height: 880, // Resized equivalent
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Vista del catálogo y detalles de propiedades en Real Estate OS',
    altEn: 'Property catalog and details view in Real Estate OS',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'alta',
  },
  {
    id: 'real-estate-os-mobile',
    solutionSlug: 'real-estate-os',
    caseSlug: 'vista-del-rio',
    filePath: '/images/marketing/screenshots/Luma_Vista_Del_Rio_Movil.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_vista_del_rio_movil.webp',
    format: 'webp',
    width: 1010, // Resized equivalent
    height: 1800,
    orientation: 'portrait',
    usage: 'mobile',
    altEs: 'Vista móvil del portal de propiedades de Real Estate OS',
    altEn: 'Mobile view of the Real Estate OS property portal',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'alta',
  },
  
  // --- REAL ESTATE CRM OS ---
  {
    id: 'real-estate-crm-os-desktop',
    solutionSlug: 'real-estate-crm-os',
    filePath: '/images/marketing/screenshots/Luma Real Estete OS CRM - Demo.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_real_estete_os_crm_-_demo.webp',
    format: 'webp',
    width: 1600,
    height: 893, // Resized equivalent
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Panel de control y pipeline comercial en Real Estate CRM OS',
    altEn: 'Control panel and sales pipeline in Real Estate CRM OS',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'alta',
  },

  // --- REAL ESTATE CONCIERGE OS ---
  {
    id: 'real-estate-concierge-os-desktop',
    solutionSlug: 'real-estate-concierge-os',
    filePath: '/images/marketing/screenshots/Real Estate Concierge OS - Demo.png',
    optimizedPath: '/images/marketing/screenshots/optimized/real_estate_concierge_os_-_demo.webp',
    format: 'webp',
    width: 1600,
    height: 893, // Resized equivalent
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Chat interactivo y calificación automatizada en Concierge OS',
    altEn: 'Interactive chat and automated qualification in Concierge OS',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'alta',
  },

  // --- COMMERCE OS ---
  {
    id: 'commerce-os-desktop',
    solutionSlug: 'commerce-os',
    filePath: '/images/marketing/screenshots/Luma Commerce OS - Demo.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_commerce_os_-_demo.webp',
    format: 'webp',
    width: 1600,
    height: 825, // Resized equivalent
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Tienda en línea, catálogo de productos y checkout de Commerce OS',
    altEn: 'Online store, product catalog, and checkout in Commerce OS',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'media',
  },

  // --- BEAUTY SPA OS ---
  {
    id: 'beauty-spa-os-desktop',
    solutionSlug: 'beauty-spa-os',
    filePath: '/images/marketing/screenshots/Luma_Beauty_Spa_Desktop.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_beauty_spa_desktop.webp',
    format: 'webp',
    width: 1600,
    height: 882, // Resized equivalent
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Agenda de servicios, citas y reservas en Beauty Spa OS',
    altEn: 'Service schedule, bookings, and reservations in Beauty Spa OS',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'media',
  },
  {
    id: 'beauty-spa-os-mobile',
    solutionSlug: 'beauty-spa-os',
    filePath: '/images/marketing/screenshots/Luma_Beauty_Spa_Movil.png',
    optimizedPath: '/images/marketing/screenshots/optimized/luma_beauty_spa_movil.webp',
    format: 'webp',
    width: 1077, // Resized equivalent
    height: 1800,
    orientation: 'portrait',
    usage: 'mobile',
    altEs: 'Vista móvil del sistema de citas en Beauty Spa OS',
    altEn: 'Mobile view of the reservation system in Beauty Spa OS',
    isRealScreenshot: true,
    hasMobileVersion: true,
    privacyChecked: true,
    replacementPriority: 'media',
  },

  // --- SUVOGA OS ACADEMY (Casos / Referencia) ---
  {
    id: 'suvoga-os-academy-desktop',
    solutionSlug: 'suvoga-academy',
    caseSlug: 'suvoga',
    filePath: '/images/marketing/screenshots/Suvoga OS Academy.png',
    optimizedPath: '/images/marketing/screenshots/optimized/suvoga_os_academy.webp',
    format: 'webp',
    width: 1600,
    height: 829, // Resized equivalent
    orientation: 'landscape',
    usage: 'desktop',
    altEs: 'Plataforma educativa y catálogo de cursos de Suvoga Academy',
    altEn: 'Educational platform and course catalog in Suvoga Academy',
    isRealScreenshot: true,
    hasMobileVersion: false,
    privacyChecked: true,
    replacementPriority: 'baja',
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
