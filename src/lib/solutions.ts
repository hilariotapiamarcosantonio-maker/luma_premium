// Catálogo central de soluciones Luma Premium.
// Cada solución es una línea de producto vendible por separado, pensada para
// que cada campaña publicitaria tenga un enlace específico por nicho.
//
// Convención de iconos: nombres de lucide-react (se resuelven en el cliente).

export type SolutionFlow = { label: string; detail: string };

export type SolutionFAQ = { q: string; a: string };
export type SolutionView = { caption: string; points: string[] };

export type Solution = {
  slug: string;
  /** Nombre comercial corto */
  name: string;
  /** Categoría / vertical */
  kicker: string;
  /** Posicionamiento de una línea (no es "página web") */
  positioning: string;
  /** Icono lucide-react */
  icon: string;
  /** Dolor que resuelve (para tarjeta) */
  pain: string;
  /** Qué entrega (para tarjeta) */
  delivers: string;
  /** Para quién es (para tarjeta) */
  forWho: string;
  /** Bloque problema → sistema en la página de detalle */
  problem: string;
  /** Qué construye el sistema (lista de capacidades) */
  capabilities: { title: string; description: string; icon: string }[];
  /** Flujo comercial paso a paso (lo que pasa con el prospecto) */
  flow: SolutionFlow[];
  /** Flujo comercial resumido para el diagrama visual */
  commercialFlow: string[];
  /** Demo pública autorizada */
  demoUrl?: string;
  /** Ruta interna a experiencia completa (si existe en este proyecto) */
  internalUrl?: string;
  /** Qué debe pedir el vendedor (William) como siguiente paso */
  salesNextStep: string;
  /** Nota de cumplimiento / honestidad comercial */
  disclaimer?: string;
  // ── Campos de landing comercial (Fase 1.2) ──
  /** Propuesta de valor de una línea para el hero */
  valueProp?: string;
  /** Transformación: situación antes del sistema */
  before?: string;
  /** Transformación: operación controlada después */
  after?: string;
  /** Qué ve el cliente final (experiencia) */
  clientView?: SolutionView;
  /** Qué ve el equipo (panel / backend) */
  teamView?: SolutionView;
  /** Escenario de uso cualitativo (sin métricas inventadas) */
  useCase?: { context: string; resolution: string };
  /** Preguntas frecuentes de compra */
  faq?: SolutionFAQ[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: 'real-estate-os',
    name: 'Real Estate OS',
    kicker: 'Inmobiliario · Presentación y captación',
    positioning:
      'Sistema de presentación, captación y autoridad para proyectos inmobiliarios de alto valor.',
    icon: 'Building2',
    pain: 'Propiedades premium presentadas como publicaciones genéricas que no diferencian al comprador.',
    delivers:
      'Presentación premium del proyecto, rutas comerciales por perfil de comprador y captación conectada a campañas.',
    forWho: 'Desarrolladores, inmobiliarias boutique y agentes de proyectos de alto valor.',
    problem:
      'Una propiedad o proyecto no se presenta igual a un inversionista, a un retirado, a una familia o a un comprador corporativo. Cuando todo se muestra de forma genérica, el mensaje pierde precisión comercial y las campañas pagan por leads que nunca se diferencian ni se siguen.',
    capabilities: [
      {
        title: 'Presentación premium del proyecto',
        description:
          'Una arquitectura visual que comunica autoridad y valor desde el primer segundo, no una ficha más.',
        icon: 'Layers',
      },
      {
        title: 'Rutas comerciales por perfil',
        description:
          'Inversión, alquiler corporativo, retiro o vivienda: cada perfil recibe el ángulo, el mensaje y el formulario correcto.',
        icon: 'Target',
      },
      {
        title: 'Captación conectada a campañas',
        description:
          'Cada anuncio dirige a su ruta, con captura de leads lista para Facebook, Instagram, TikTok y WhatsApp.',
        icon: 'Globe',
      },
      {
        title: 'Base para seguimiento comercial',
        description:
          'Los leads llegan con contexto completo de interés, listos para el equipo de ventas y la atribución.',
        icon: 'Activity',
      },
    ],
    flow: [
      { label: 'Anuncio', detail: 'El prospecto entra desde una campaña segmentada por perfil.' },
      { label: 'Ruta comercial', detail: 'Ve una presentación pensada para su tipo de compra.' },
      { label: 'Captación', detail: 'Deja sus datos con su interés ya identificado.' },
      { label: 'Seguimiento', detail: 'El lead queda listo para el asesor con todo el contexto.' },
    ],
    commercialFlow: ['Proyecto', 'Perfil comprador', 'Landing', 'Captación', 'Lead', 'Seguimiento'],
    demoUrl: 'https://luma-real-estate-os-demo.vercel.app/',
    internalUrl: '/luma-estate-os',
    salesNextStep: 'Pedir una auditoría comercial inmobiliaria (diagnóstico).',
    valueProp:
      'Presenta cada proyecto con autoridad y convierte tus campañas en leads calificados por perfil de comprador.',
    before:
      'Propiedades premium publicadas como anuncios genéricos; el lead llega sin contexto y se enfría.',
    after:
      'Cada proyecto con su presentación, su ruta por perfil y captación conectada lista para el seguimiento.',
    clientView: {
      caption: 'Lo que ve el comprador',
      points: [
        'Presentación premium del proyecto',
        'Una ruta según su perfil (inversión, retiro, vivienda)',
        'Galería, ubicación y beneficios claros',
        'Un formulario corto para dejar su interés',
      ],
    },
    teamView: {
      caption: 'Lo que ve su equipo',
      points: [
        'Leads con perfil e interés ya identificados',
        'Origen de campaña en cada oportunidad',
        'Material listo para enviar al asesor',
        'Base ordenada para seguimiento y atribución',
      ],
    },
    useCase: {
      context:
        'Un desarrollo con varias tipologías recibe tráfico de Facebook e Instagram, pero todos los anuncios llevan a la misma página y los leads llegan sin saber qué buscan.',
      resolution:
        'Con Real Estate OS cada anuncio dirige a una ruta por perfil; el comprador ve una presentación pensada para su caso y deja su interés ya calificado para el asesor.',
    },
  },
  {
    slug: 'real-estate-crm-os',
    name: 'Real Estate CRM OS',
    kicker: 'Inmobiliario · Control comercial',
    positioning:
      'Centro de control comercial para propiedades, prospectos, asesores y seguimiento inmobiliario.',
    icon: 'LayoutDashboard',
    pain: 'Leads en Excel y WhatsApp, sin saber el estado del prospecto ni el próximo paso.',
    delivers:
      'Leads organizados, propiedades asociadas, estado del prospecto, próximo paso, historial y control para gerencia.',
    forWho: 'Equipos comerciales y gerencias inmobiliarias que necesitan trazabilidad.',
    problem:
      'Sin un centro de control, los prospectos viven dispersos entre hojas de cálculo, chats y la memoria de cada asesor. La gerencia no sabe qué propiedad tiene tracción, qué lead está por enfriarse ni cuál es el próximo paso. Se pierde dinero por desorden, no por falta de demanda.',
    capabilities: [
      {
        title: 'Leads organizados',
        description: 'Cada prospecto con su origen, interés y propiedad asociada en un solo lugar.',
        icon: 'Users',
      },
      {
        title: 'Estado y próximo paso',
        description: 'Visibilidad de en qué punto está cada prospecto y qué acción sigue.',
        icon: 'ListChecks',
      },
      {
        title: 'Asesores y asignación',
        description: 'Distribución clara por asesor con responsabilidad y trazabilidad.',
        icon: 'UserCheck',
      },
      {
        title: 'Control para gerencia',
        description: 'Historial y seguimiento que convierten la intuición en decisiones medibles.',
        icon: 'LineChart',
      },
    ],
    flow: [
      { label: 'Captación', detail: 'El lead entra desde Real Estate OS o una campaña.' },
      { label: 'Asignación', detail: 'Se asigna a un asesor con su propiedad de interés.' },
      { label: 'Seguimiento', detail: 'Cada interacción queda registrada con su próximo paso.' },
      { label: 'Gerencia', detail: 'La dirección ve el pipeline y decide con datos reales.' },
    ],
    commercialFlow: ['Lead', 'Propiedad', 'Asesor', 'Estado', 'Próximo paso', 'Cierre'],
    demoUrl: 'https://luma-real-estate-crm-os-demo.vercel.app/',
    salesNextStep: 'Mostrar el demo del CRM y pedir el diagnóstico de seguimiento.',
    valueProp:
      'Centraliza leads, propiedades y seguimiento en un pipeline donde la gerencia ve todo en tiempo real.',
    before:
      'Prospectos dispersos en Excel y WhatsApp; nadie sabe el estado real ni cuál es el próximo paso.',
    after:
      'Un pipeline único con estado, responsable y próximo paso visible para todo el equipo.',
    clientView: {
      caption: 'Lo que percibe el prospecto',
      points: [
        'Respuesta más rápida y ordenada',
        'Seguimiento sin que le repitan preguntas',
        'Atención coherente entre asesores',
        'Una experiencia que se siente profesional',
      ],
    },
    teamView: {
      caption: 'Lo que ve su equipo',
      points: [
        'Pipeline con el estado de cada lead',
        'Ficha con historial, propiedad e interés',
        'Asignación por asesor con responsabilidad',
        'Tablero de control para la gerencia',
      ],
    },
    useCase: {
      context:
        'Una inmobiliaria con varios asesores pierde oportunidades porque cada quien lleva sus leads a su manera y la gerencia no tiene visibilidad.',
      resolution:
        'El CRM OS unifica todos los prospectos con estado y próximo paso; la dirección ve el pipeline completo y ninguna oportunidad se queda sin seguimiento.',
    },
  },
  {
    slug: 'real-estate-concierge-os',
    name: 'Real Estate Concierge OS',
    kicker: 'Inmobiliario · Respuesta y calificación',
    positioning:
      'Concierge comercial para responder, educar y calificar prospectos inmobiliarios antes de que lleguen al asesor.',
    icon: 'MessageSquare',
    pain: 'Prospectos que preguntan lo mismo y se enfrían esperando respuesta del asesor.',
    delivers:
      'Respuesta a preguntas frecuentes, educación plano vs. listo, entrega de material y leads calificados.',
    forWho: 'Proyectos con alto volumen de consultas que necesitan filtrar antes del asesor.',
    problem:
      'El asesor pierde horas respondiendo lo mismo —ubicación, precio, plano vs. listo, formas de pago— y los prospectos serios se enfrían en la espera. Sin un primer filtro, el equipo invierte tiempo en curiosos y descuida a quien sí está listo para comprar.',
    capabilities: [
      {
        title: 'Responde y educa',
        description:
          'Atiende preguntas frecuentes y explica diferencias clave como plano vs. listo.',
        icon: 'MessageSquare',
      },
      {
        title: 'Entrega material comercial',
        description: 'Ubicación, fotos o renders, brochure/PDF y beneficios, de forma ordenada.',
        icon: 'FileText',
      },
      {
        title: 'Califica al prospecto',
        description: 'Identifica intención, presupuesto y momento de compra antes del asesor.',
        icon: 'Filter',
      },
      {
        title: 'Resume y entrega el lead',
        description: 'Deja un resumen de la conversación y el prospecto listo para el asesor humano.',
        icon: 'ClipboardList',
      },
    ],
    flow: [
      { label: 'Consulta', detail: 'El prospecto pregunta desde el anuncio o la web.' },
      { label: 'Concierge', detail: 'Recibe respuestas, material y educación inmediata.' },
      { label: 'Calificación', detail: 'Se identifica su intención y presupuesto.' },
      { label: 'Asesor', detail: 'El lead calificado llega al humano con contexto resumido.' },
    ],
    commercialFlow: ['Consulta', 'Respuesta', 'Recurso', 'Calificación', 'Resumen', 'Asesor humano'],
    demoUrl: 'https://luma-real-estate-concierge-os-demo.vercel.app/',
    salesNextStep: 'Mostrar el flujo demo del concierge y pedir el diagnóstico.',
    disclaimer:
      'Flujo de concierge demostrativo. Preparado para integraciones de mensajería; sin conexión real a plataformas de terceros en esta etapa.',
    valueProp:
      'Responde, educa y califica a cada prospecto al instante, y entrega al asesor solo los que están listos.',
    before:
      'El asesor responde lo mismo una y otra vez; los prospectos serios se enfrían esperando respuesta.',
    after:
      'Un concierge que atiende a toda hora, califica y deriva al asesor con un resumen del prospecto.',
    clientView: {
      caption: 'Lo que ve el prospecto',
      points: [
        'Respuesta inmediata a sus dudas',
        'Ubicación, precio y material a la mano',
        'Explicación de plano vs. listo',
        'Atención disponible a cualquier hora',
      ],
    },
    teamView: {
      caption: 'Lo que ve su equipo',
      points: [
        'Prospectos calificados por intención',
        'Un resumen de cada conversación',
        'Solo los leads listos llegan al asesor',
        'Menos tiempo en curiosos, más en compradores',
      ],
    },
    useCase: {
      context:
        'Una campaña genera decenas de consultas por WhatsApp con las mismas preguntas, y el equipo no da abasto para responder a tiempo.',
      resolution:
        'El Concierge OS responde y educa al instante, identifica intención y presupuesto, y entrega al asesor un prospecto calificado con su contexto resumido.',
    },
  },
  {
    slug: 'commerce-os',
    name: 'Commerce OS',
    kicker: 'Retail · Catálogo y pedidos',
    positioning:
      'Sistema comercial para tiendas que necesitan catálogo, pedidos, clientes, seguimiento y control.',
    icon: 'ShoppingBag',
    pain: 'Ventas por DM sin catálogo ordenado, sin registro de cliente ni seguimiento.',
    delivers:
      'Catálogo, solicitud o carrito, pedido, cliente, CRM, seguimiento y panel de administración.',
    forWho: 'Tiendas y marcas que venden por redes y quieren ordenar su operación comercial.',
    problem:
      'Vender por mensajes directos funciona hasta que el volumen crece: pedidos que se pierden, clientes sin historial y cero seguimiento. Sin un sistema, cada venta depende de la memoria y la disponibilidad de quien responde el chat.',
    capabilities: [
      {
        title: 'Catálogo y solicitud',
        description: 'Tienda o catálogo presentado con orden, con carrito o solicitud de pedido.',
        icon: 'ShoppingBag',
      },
      {
        title: 'Pedido y cliente',
        description: 'Cada pedido queda registrado y asociado a un cliente con su historial.',
        icon: 'Package',
      },
      {
        title: 'CRM y seguimiento',
        description: 'Clientes organizados para recompra, seguimiento y postventa.',
        icon: 'Users',
      },
      {
        title: 'Panel de administración',
        description: 'Control de productos, pedidos y clientes, listo para WhatsApp y campañas.',
        icon: 'LayoutDashboard',
      },
    ],
    flow: [
      { label: 'Catálogo', detail: 'El cliente explora productos presentados con orden.' },
      { label: 'Pedido', detail: 'Solicita o agrega al carrito y confirma su pedido.' },
      { label: 'Cliente', detail: 'Queda registrado con su historial de compra.' },
      { label: 'Seguimiento', detail: 'El panel permite recompra, postventa y control.' },
    ],
    commercialFlow: ['Catálogo', 'Pedido', 'Cliente', 'Seguimiento', 'Recompra'],
    demoUrl: 'https://luma-commerce-os-demo.vercel.app/',
    salesNextStep: 'Mostrar el demo de tienda y pedir el diagnóstico comercial.',
    valueProp:
      'Ordena tu venta por redes en una tienda con catálogo, pedidos, clientes y panel de control.',
    before:
      'Ventas por DM sin catálogo, sin registro de cliente y sin forma de hacer seguimiento.',
    after:
      'Catálogo, pedidos y clientes organizados en un panel listo para recompra y postventa.',
    clientView: {
      caption: 'Lo que ve el cliente',
      points: [
        'Catálogo presentado con orden',
        'Producto con detalle y precio claros',
        'Carrito o solicitud de pedido simple',
        'Checkout y confirmación sin fricción',
      ],
    },
    teamView: {
      caption: 'Lo que ve su equipo',
      points: [
        'Pedidos registrados y asociados a un cliente',
        'Historial de compra por cliente',
        'Panel de productos, pedidos y clientes',
        'Base lista para WhatsApp y campañas',
      ],
    },
    useCase: {
      context:
        'Una marca que vende por Instagram pierde pedidos en la bandeja de mensajes y no tiene registro de quién compró qué.',
      resolution:
        'Commerce OS convierte ese flujo en una tienda con pedidos y clientes registrados, con un panel para gestionar todo y activar la recompra.',
    },
  },
  {
    slug: 'beauty-spa-os',
    name: 'Beauty Spa OS',
    kicker: 'Estética · Servicios y agenda',
    positioning:
      'Sistema premium para spas y centros estéticos que necesitan presentar servicios, captar consultas, calificar clientas y ordenar su agenda comercial.',
    icon: 'Sparkles',
    pain: 'Consultas desde Instagram que no se ordenan ni se convierten en citas reales.',
    delivers:
      'Presentación de servicios premium, concierge, captación desde redes, solicitud de cita y seguimiento.',
    forWho: 'Spas, centros estéticos y clínicas de belleza con marca premium.',
    problem:
      'Las clientas llegan desde Instagram y los anuncios, pero las consultas se pierden entre mensajes sin orden. Sin un sistema que presente los servicios con nivel, califique y agende, la marca premium se diluye y la agenda queda a merced de la improvisación.',
    capabilities: [
      {
        title: 'Servicios premium',
        description: 'Presentación de servicios con la estética y autoridad que la marca merece.',
        icon: 'Sparkles',
      },
      {
        title: 'Concierge y captación',
        description: 'Atiende consultas desde Instagram y ads, y guía hacia la solicitud de cita.',
        icon: 'MessageSquare',
      },
      {
        title: 'Solicitud de cita',
        description: 'Captación ordenada de citas con la información necesaria para confirmar.',
        icon: 'CalendarCheck',
      },
      {
        title: 'Seguimiento y experiencia',
        description: 'Seguimiento de clientas y una experiencia de marca coherente de punta a punta.',
        icon: 'Activity',
      },
    ],
    flow: [
      { label: 'Anuncio', detail: 'La clienta entra desde Instagram o una campaña.' },
      { label: 'Concierge', detail: 'Conoce los servicios y resuelve sus dudas.' },
      { label: 'Cita', detail: 'Solicita su cita con la información necesaria.' },
      { label: 'Seguimiento', detail: 'Queda registrada para recordatorios y recompra.' },
    ],
    commercialFlow: ['Servicio', 'Consulta', 'Calificación', 'Agenda', 'Seguimiento'],
    demoUrl: 'https://luma-beauty-spa-os-demo.vercel.app/',
    salesNextStep: 'Mostrar el demo y el concierge, luego pedir el diagnóstico.',
    disclaimer:
      'Sistema de presentación y captación comercial. No realiza afirmaciones médicas ni promete resultados clínicos.',
    valueProp:
      'Presenta tus servicios con nivel, capta consultas desde redes y ordena tu agenda comercial.',
    before:
      'Consultas de Instagram que se pierden entre mensajes y una agenda a merced de la improvisación.',
    after:
      'Servicios presentados con autoridad, consultas calificadas y citas solicitadas con orden.',
    clientView: {
      caption: 'Lo que ve la clienta',
      points: [
        'Servicios presentados con estética premium',
        'Un concierge que resuelve sus dudas',
        'Solicitud de cita simple y clara',
        'Una experiencia de marca coherente',
      ],
    },
    teamView: {
      caption: 'Lo que ve su equipo',
      points: [
        'Consultas captadas desde redes y ads',
        'Clientas con su información para confirmar',
        'Una agenda ordenada de solicitudes',
        'Base para seguimiento y recompra',
      ],
    },
    useCase: {
      context:
        'Un centro estético recibe muchas consultas por Instagram, pero sin un sistema que presente, califique y agende se diluye la marca y se pierden citas.',
      resolution:
        'Beauty Spa OS presenta los servicios con nivel, atiende y califica con un concierge, y ordena la solicitud de citas para que la agenda deje de depender de la improvisación.',
    },
  },
];

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export const SOLUTION_SLUGS = SOLUTIONS.map((s) => s.slug);

export const EN_SOLUTIONS: Solution[] = [
  {
    slug: 'real-estate-os',
    name: 'Real Estate OS',
    kicker: 'Real Estate · Presentation & Capture',
    positioning:
      'Premium presentation, capture, and authority system for high-value real estate projects.',
    icon: 'Building2',
    pain: 'Premium properties presented as generic listings that fail to differentiate the buyer.',
    delivers:
      'Premium project presentation, commercial routes per buyer profile, and campaign-connected lead capture.',
    forWho: 'Developers, boutique agencies, and agents of high-value projects.',
    problem:
      'A property or project should not be presented the same way to an investor, a retiree, a family, or a corporate buyer. When everything is generic, the message loses commercial precision and campaigns waste money on unqualified leads.',
    capabilities: [
      {
        title: 'Premium Project Presentation',
        description:
          'A visual architecture that communicates authority and value from the first second, not just another listing.',
        icon: 'Layers',
      },
      {
        title: 'Commercial Routes per Profile',
        description:
          'Investment, corporate rental, retirement, or living: each profile gets the correct angle, message, and form.',
        icon: 'Target',
      },
      {
        title: 'Campaign-Connected Capture',
        description:
          'Each ad directs to its corresponding route, with lead capture ready for Facebook, Instagram, TikTok, and WhatsApp.',
        icon: 'Globe',
      },
      {
        title: 'Base for Commercial Follow-up',
        description:
          'Leads arrive with full interest context, ready for the sales team and attribution tracking.',
        icon: 'Activity',
      },
    ],
    flow: [
      { label: 'Ad', detail: 'The prospect enters from a segmented campaign per profile.' },
      { label: 'Commercial Route', detail: 'Sees a presentation tailored to their type of purchase.' },
      { label: 'Capture', detail: 'Submits details with their specific interest already identified.' },
      { label: 'Follow-up', detail: 'The lead is ready for the agent with full context.' },
    ],
    commercialFlow: ['Project', 'Buyer profile', 'Landing', 'Capture', 'Lead', 'Follow-up'],
    demoUrl: 'https://luma-real-estate-os-demo.vercel.app/',
    internalUrl: '/luma-estate-os',
    salesNextStep: 'Request a real estate commercial audit (assessment).',
    valueProp:
      'Present every project with authority and turn your campaigns into leads qualified by buyer profile.',
    before:
      'Premium properties published as generic listings; the lead arrives without context and cools down.',
    after:
      'Each project with its own presentation, profile route, and connected capture ready for follow-up.',
    clientView: {
      caption: 'What the buyer sees',
      points: [
        'A premium presentation of the project',
        'A route matched to their profile (investment, retirement, living)',
        'Gallery, location, and clear benefits',
        'A short form to leave their interest',
      ],
    },
    teamView: {
      caption: 'What your team sees',
      points: [
        'Leads with profile and interest already identified',
        'Campaign source on every opportunity',
        'Material ready to send to the agent',
        'A clean base for follow-up and attribution',
      ],
    },
    useCase: {
      context:
        'A development with several unit types gets traffic from Facebook and Instagram, but every ad leads to the same page and leads arrive without knowing what they want.',
      resolution:
        'With Real Estate OS each ad routes to a profile-based path; the buyer sees a presentation built for their case and leaves their interest already qualified for the agent.',
    },
  },
  {
    slug: 'real-estate-crm-os',
    name: 'Real Estate CRM OS',
    kicker: 'Real Estate · Commercial Control',
    positioning:
      'Commercial control center for properties, prospects, agents, and real estate follow-up.',
    icon: 'LayoutDashboard',
    pain: 'Leads lost in spreadsheets and WhatsApp, without knowing their status or next step.',
    delivers:
      'Organized leads, associated properties, prospect status, next steps, interaction history, and management control.',
    forWho: 'Sales teams and real estate agencies that require full traceability.',
    problem:
      'Without a control center, prospects are scattered across spreadsheets, chats, and individual agents memory. Management does not know which property has traction or which lead is cooling down. Money is lost due to disorder, not lack of demand.',
    capabilities: [
      {
        title: 'Organized Leads',
        description: 'Each prospect with their source, interest, and associated property in one place.',
        icon: 'Users',
      },
      {
        title: 'Status & Next Step',
        description: 'Full visibility of where each prospect is and what action follows.',
        icon: 'ListChecks',
      },
      {
        title: 'Agent Assignment',
        description: 'Clear distribution per agent with responsibility and traceability.',
        icon: 'UserCheck',
      },
      {
        title: 'Management Control',
        description: 'History and follow-up data that turn intuition into measurable decisions.',
        icon: 'LineChart',
      },
    ],
    flow: [
      { label: 'Capture', detail: 'The lead enters from Real Estate OS or a campaign.' },
      { label: 'Assignment', detail: 'Assigned to an agent with their property of interest.' },
      { label: 'Follow-up', detail: 'Every interaction is registered with its next step.' },
      { label: 'Management', detail: 'Management views the pipeline and decides with real data.' },
    ],
    commercialFlow: ['Lead', 'Property', 'Agent', 'Status', 'Next step', 'Close'],
    demoUrl: 'https://luma-real-estate-crm-os-demo.vercel.app/',
    salesNextStep: 'Show CRM demo and request follow-up assessment.',
    valueProp:
      'Centralize leads, properties, and follow-up in one pipeline where management sees everything in real time.',
    before:
      'Prospects scattered across spreadsheets and WhatsApp; no one knows the real status or the next step.',
    after:
      'A single pipeline with status, owner, and next step visible to the whole team.',
    clientView: {
      caption: 'What the prospect feels',
      points: [
        'A faster, more orderly response',
        'Follow-up without repeating the same questions',
        'Consistent attention across agents',
        'An experience that feels professional',
      ],
    },
    teamView: {
      caption: 'What your team sees',
      points: [
        'A pipeline with each lead’s status',
        'A record with history, property, and interest',
        'Per-agent assignment with accountability',
        'A control board for management',
      ],
    },
    useCase: {
      context:
        'An agency with several agents loses opportunities because everyone tracks leads their own way and management has no visibility.',
      resolution:
        'CRM OS unifies every prospect with status and next step; leadership sees the full pipeline and no opportunity is left without follow-up.',
    },
  },
  {
    slug: 'real-estate-concierge-os',
    name: 'Real Estate Concierge OS',
    kicker: 'Real Estate · Response & Qualification',
    positioning:
      'Commercial concierge to respond, educate, and qualify real estate prospects before they reach the agent.',
    icon: 'MessageSquare',
    pain: 'Prospects asking the same questions and cooling down while waiting for an agent response.',
    delivers:
      'FAQ response, pre-construction vs. ready education, material delivery, and qualified leads.',
    forWho: 'Projects with high query volume that need filtering before reaching an agent.',
    problem:
      'Agents waste hours answering the same questions — location, price, pre-construction vs. ready, payment terms — and serious prospects cool down. Without a first filter, the team spends time on curious users and neglects buyers.',
    capabilities: [
      {
        title: 'Respond & Educate',
        description: 'Handles FAQs and explains key differences like pre-construction vs. ready.',
        icon: 'MessageSquare',
      },
      {
        title: 'Deliver Commercial Material',
        description: 'Orderly delivery of location, photos/renders, brochures/PDFs, and benefits.',
        icon: 'FileText',
      },
      {
        title: 'Qualify the Prospect',
        description: 'Identifies intent, budget, and purchasing timeframe before the agent step.',
        icon: 'Filter',
      },
      {
        title: 'Summarize & Hand Over',
        description: 'Provides a conversation summary and delivers the qualified prospect to the human agent.',
        icon: 'ClipboardList',
      },
    ],
    flow: [
      { label: 'Inquiry', detail: 'Prospect inquires from the ad or website.' },
      { label: 'Concierge', detail: 'Receives immediate answers, materials, and education.' },
      { label: 'Qualification', detail: 'Intent and budget are identified.' },
      { label: 'Agent', detail: 'Qualified lead reaches the human agent with summarized context.' },
    ],
    commercialFlow: ['Inquiry', 'Response', 'Resource', 'Qualification', 'Summary', 'Human agent'],
    demoUrl: 'https://luma-real-estate-concierge-os-demo.vercel.app/',
    salesNextStep: 'Show concierge demo flow and request assessment.',
    disclaimer:
      'Demonstrative concierge flow. Prepared for messaging integrations; no real connection to third-party platforms at this stage.',
    valueProp:
      'Responds, educates, and qualifies every prospect instantly, handing the agent only the ones who are ready.',
    before:
      'The agent answers the same questions over and over; serious prospects cool down while waiting.',
    after:
      'A concierge that responds around the clock, qualifies, and hands off to the agent with a prospect summary.',
    clientView: {
      caption: 'What the prospect sees',
      points: [
        'Instant answers to their questions',
        'Location, price, and material at hand',
        'Pre-construction vs. ready explained',
        'Attention available at any hour',
      ],
    },
    teamView: {
      caption: 'What your team sees',
      points: [
        'Prospects qualified by intent',
        'A summary of each conversation',
        'Only ready leads reach the agent',
        'Less time on browsers, more on buyers',
      ],
    },
    useCase: {
      context:
        'A campaign generates dozens of WhatsApp inquiries with the same questions, and the team cannot keep up with timely replies.',
      resolution:
        'Concierge OS responds and educates instantly, identifies intent and budget, and hands the agent a qualified prospect with summarized context.',
    },
  },
  {
    slug: 'commerce-os',
    name: 'Commerce OS',
    kicker: 'Retail · Catalog & Orders',
    positioning:
      'Commercial system for stores that need catalog, orders, clients, follow-up, and control.',
    icon: 'ShoppingBag',
    pain: 'Sales via DM without an orderly catalog, client record, or follow-up.',
    delivers:
      'Catalog, request or cart, order, client, CRM, follow-up, and administration panel.',
    forWho: 'Stores and brands selling via social media that want to organize their sales operation.',
    problem:
      'Selling via DMs works until volume grows: lost orders, zero client history, and no follow-up. Without a system, each sale depends on memory and chat availability.',
    capabilities: [
      {
        title: 'Catalog & Request',
        description: 'Store or catalog presented in order, with cart or order request.',
        icon: 'ShoppingBag',
      },
      {
        title: 'Order & Client',
        description: 'Each order is registered and associated with a client and their purchase history.',
        icon: 'Package',
      },
      {
        title: 'CRM & Follow-up',
        description: 'Clients organized for repeat purchases, follow-up, and after-sales care.',
        icon: 'Users',
      },
      {
        title: 'Admin Panel',
        description: 'Control of products, orders, and clients, ready for WhatsApp and campaigns.',
        icon: 'LayoutDashboard',
      },
    ],
    flow: [
      { label: 'Catalog', detail: 'Client explores products presented in an orderly layout.' },
      { label: 'Order', detail: 'Requests or adds to cart and confirms the order.' },
      { label: 'Client', detail: 'Registered with their purchase history.' },
      { label: 'Follow-up', detail: 'The panel allows repeat purchase, post-sales, and control.' },
    ],
    commercialFlow: ['Catalog', 'Order', 'Client', 'Follow-up', 'Repeat purchase'],
    demoUrl: 'https://luma-commerce-os-demo.vercel.app/',
    salesNextStep: 'Show store demo and request commercial assessment.',
    valueProp:
      'Bring order to your social selling with a store: catalog, orders, clients, and an admin panel.',
    before:
      'Sales via DM with no catalog, no client record, and no way to follow up.',
    after:
      'Catalog, orders, and clients organized in a panel ready for repeat purchase and after-sales.',
    clientView: {
      caption: 'What the customer sees',
      points: [
        'A catalog presented in order',
        'Products with clear detail and price',
        'A simple cart or order request',
        'A frictionless checkout and confirmation',
      ],
    },
    teamView: {
      caption: 'What your team sees',
      points: [
        'Orders registered and tied to a client',
        'Purchase history per client',
        'A panel for products, orders, and clients',
        'A base ready for WhatsApp and campaigns',
      ],
    },
    useCase: {
      context:
        'A brand selling on Instagram loses orders in the message inbox and has no record of who bought what.',
      resolution:
        'Commerce OS turns that flow into a store with registered orders and clients, plus a panel to manage everything and trigger repeat purchases.',
    },
  },
  {
    slug: 'beauty-spa-os',
    name: 'Beauty Spa OS',
    kicker: 'Aesthetics · Services & Booking',
    positioning:
      'Premium system for spas and aesthetic centers to present services, capture inquiries, qualify clients, and organize bookings.',
    icon: 'Sparkles',
    pain: 'Inquiries from Instagram that are not organized or converted into real bookings.',
    delivers:
      'Premium service presentation, concierge, social media capture, booking requests, and follow-up.',
    forWho: 'Spas, aesthetic centers, and beauty clinics with a premium brand.',
    problem:
      'Clients arrive from Instagram and ads, but inquiries get lost in unorganized messages. Without a system that presents services with authority, qualifies, and books, the premium brand is diluted and bookings are left to improvisation.',
    capabilities: [
      {
        title: 'Premium Services',
        description: 'Service presentation with the aesthetics and authority the brand deserves.',
        icon: 'Sparkles',
      },
      {
        title: 'Concierge & Capture',
        description: 'Attends inquiries from Instagram/ads and guides them to booking requests.',
        icon: 'MessageSquare',
      },
      {
        title: 'Booking Request',
        description: 'Orderly booking capture with the necessary information to confirm.',
        icon: 'CalendarCheck',
      },
      {
        title: 'Follow-up & Experience',
        description: 'Client follow-up and a consistent brand experience from end to end.',
        icon: 'Activity',
      },
    ],
    flow: [
      { label: 'Ad', detail: 'The client enters from Instagram or a campaign.' },
      { label: 'Concierge', detail: 'Explores services and resolves questions.' },
      { label: 'Booking', detail: 'Requests a booking with the required details.' },
      { label: 'Follow-up', detail: 'Registered for reminders and repeat visits.' },
    ],
    commercialFlow: ['Service', 'Inquiry', 'Qualification', 'Booking', 'Follow-up'],
    demoUrl: 'https://luma-beauty-spa-os-demo.vercel.app/',
    salesNextStep: 'Show demo and concierge, then request assessment.',
    disclaimer:
      'Presentation and commercial capture system. Does not make medical claims or promise clinical results.',
    valueProp:
      'Present your services with authority, capture inquiries from social, and bring order to your booking agenda.',
    before:
      'Instagram inquiries lost among messages and a schedule left to improvisation.',
    after:
      'Services presented with authority, qualified inquiries, and bookings requested in an orderly way.',
    clientView: {
      caption: 'What the client sees',
      points: [
        'Services presented with premium aesthetics',
        'A concierge that resolves their questions',
        'A simple, clear booking request',
        'A consistent brand experience',
      ],
    },
    teamView: {
      caption: 'What your team sees',
      points: [
        'Inquiries captured from social and ads',
        'Clients with the info needed to confirm',
        'An orderly schedule of requests',
        'A base for follow-up and repeat visits',
      ],
    },
    useCase: {
      context:
        'An aesthetics center receives many Instagram inquiries, but without a system to present, qualify, and book, the brand is diluted and bookings are lost.',
      resolution:
        'Beauty Spa OS presents services with authority, attends and qualifies with a concierge, and brings order to booking requests so the schedule stops depending on improvisation.',
    },
  },
];

export function getEnSolution(slug: string): Solution | undefined {
  return EN_SOLUTIONS.find((s) => s.slug === slug);
}

export const EN_SOLUTION_SLUGS = EN_SOLUTIONS.map((s) => s.slug);

// ── Contenido compartido de landing (igual para todas las soluciones) ──

export const IMPLEMENTATION_STEPS_ES: { title: string; detail: string }[] = [
  { title: 'Diagnóstico', detail: 'Entendemos su operación comercial antes de construir nada.' },
  { title: 'Configuración', detail: 'Levantamos el sistema base de la solución.' },
  { title: 'Personalización', detail: 'Lo adaptamos a su marca, su nicho y sus procesos.' },
  { title: 'Conexión', detail: 'Integramos captación, canales y seguimiento.' },
  { title: 'Despliegue', detail: 'Entregamos el sistema funcionando, con entrenamiento al equipo.' },
  { title: 'Optimización', detail: 'Medimos, ajustamos y escalamos por ciclos.' },
];

export const IMPLEMENTATION_STEPS_EN: { title: string; detail: string }[] = [
  { title: 'Assessment', detail: 'We understand your commercial operation before building anything.' },
  { title: 'Setup', detail: 'We stand up the base system for the solution.' },
  { title: 'Customization', detail: 'We adapt it to your brand, niche, and processes.' },
  { title: 'Integration', detail: 'We connect capture, channels, and follow-up.' },
  { title: 'Deployment', detail: 'We deliver a working system, with team training.' },
  { title: 'Optimization', detail: 'We measure, adjust, and scale in cycles.' },
];

export const SOLUTION_FAQ_ES: SolutionFAQ[] = [
  {
    q: '¿Se adapta a mi negocio?',
    a: 'Sí. Cada sistema se configura para su operación, su nicho y su forma de vender. Partimos del diagnóstico para ajustar el alcance exacto.',
  },
  {
    q: '¿Se conecta con WhatsApp y mis redes?',
    a: 'Está diseñado para trabajar con WhatsApp y redes como canal de captación y respuesta. La integración concreta se define en el diagnóstico.',
  },
  {
    q: '¿Puede trabajar con mi equipo?',
    a: 'Sí. El sistema asigna y da visibilidad por persona, y entregamos el entrenamiento para que su equipo lo opere con criterio.',
  },
  {
    q: '¿Se puede personalizar?',
    a: 'Sí. Se adapta a su marca, sus procesos y sus rutas comerciales. No es una plantilla cerrada.',
  },
  {
    q: '¿Tiene demo?',
    a: 'Sí. En esta misma página puede abrir la demo pública de esta solución y verla en funcionamiento.',
  },
  {
    q: '¿Cuánto tarda la implementación?',
    a: 'Depende del alcance que definamos en el diagnóstico. Trabajamos por fases para que vea avances sin esperar meses a un único gran lanzamiento.',
  },
  {
    q: '¿Qué ocurre después del diagnóstico?',
    a: 'Recibe una lectura ejecutiva y una recomendación de sistema con una ruta por fases. Sin compromiso de venta.',
  },
];

export const SOLUTION_FAQ_EN: SolutionFAQ[] = [
  {
    q: 'Does it adapt to my business?',
    a: 'Yes. Each system is configured for your operation, your niche, and how you sell. We start from the assessment to set the exact scope.',
  },
  {
    q: 'Does it connect with WhatsApp and my socials?',
    a: 'It is designed to work with WhatsApp and social channels for capture and response. The specific integration is defined in the assessment.',
  },
  {
    q: 'Can it work with my team?',
    a: 'Yes. The system assigns and gives per-person visibility, and we provide the training so your team can operate it confidently.',
  },
  {
    q: 'Can it be customized?',
    a: 'Yes. It adapts to your brand, your processes, and your commercial routes. It is not a closed template.',
  },
  {
    q: 'Is there a demo?',
    a: 'Yes. On this page you can open the public demo of this solution and see it in action.',
  },
  {
    q: 'How long does implementation take?',
    a: 'It depends on the scope we define in the assessment. We work in phases so you see progress without waiting months for a single big launch.',
  },
  {
    q: 'What happens after the assessment?',
    a: 'You receive an executive read and a system recommendation with a phased roadmap. No sales commitment.',
  },
];
