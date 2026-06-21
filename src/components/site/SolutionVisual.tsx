import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Check,
  CalendarCheck,
  Filter,
  type LucideIcon,
} from 'lucide-react';
import { BrowserFrame, PhoneFrame } from './DeviceFrame';

// Composición de producto premium por solución (CSS puro, server component).
// Representa de forma ESTILIZADA la operación de cada sistema. No son capturas
// reales ni muestran datos de clientes. Pensado como mockup provisional de alto
// nivel hasta sustituir por capturas reales (ver manifiesto de imágenes).

type Locale = 'es' | 'en';

const T = {
  es: {
    project: 'Proyecto',
    profile: 'Perfil',
    pipeline: 'Pipeline comercial',
    leads: 'Leads activos',
    next: 'Próximo paso',
    conversation: 'Conversación',
    qualified: 'Calificado',
    catalog: 'Catálogo',
    order: 'Pedido',
    services: 'Servicios',
    agenda: 'Agenda',
    booked: 'Reservado',
    captured: 'Captado',
    inProgress: 'En proceso',
    closed: 'Cerrado',
  },
  en: {
    project: 'Project',
    profile: 'Profile',
    pipeline: 'Sales pipeline',
    leads: 'Active leads',
    next: 'Next step',
    conversation: 'Conversation',
    qualified: 'Qualified',
    catalog: 'Catalog',
    order: 'Order',
    services: 'Services',
    agenda: 'Schedule',
    booked: 'Booked',
    captured: 'Captured',
    inProgress: 'In progress',
    closed: 'Closed',
  },
} as const;

function Bar({ w = 'w-2/3', tone = 'bg-slate-700' }: { w?: string; tone?: string }) {
  return <span className={`block h-2 rounded-full ${w} ${tone}`} />;
}

function Tile({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <Icon className="h-4 w-4 text-amber-500" />
      <Bar w="w-3/4" />
      <Bar w="w-1/2" tone="bg-slate-800" />
      <p className="sr-only">{title}</p>
    </div>
  );
}

// Tarjeta UI flotante de acento (decorativa, refuerza "sistema vivo").
function FloatChip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-slate-950/90 px-3 py-1.5 text-[11px] font-medium text-amber-400/90 shadow-lg">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

function RealEstateOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <BrowserFrame label="real-estate-os.luma">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[Building2, Building2, Building2, Building2, Building2, Building2].map((Icon, i) => (
          <Tile key={i} icon={Icon} title={`${t.project} ${i + 1}`} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/70 pt-4">
        {['Inversión', 'Retiro', 'Corporativo', 'Vivienda'].map((p) => (
          <span
            key={p}
            className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[11px] font-medium text-slate-400"
          >
            {p}
          </span>
        ))}
      </div>
    </BrowserFrame>
  );
}

function CrmOS({ t }: { t: (typeof T)[Locale] }) {
  const cols = [
    { label: t.captured, n: 3 },
    { label: t.inProgress, n: 2 },
    { label: t.closed, n: 2 },
  ];
  return (
    <BrowserFrame label="crm-os.luma">
      {/* Stat row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[LayoutDashboard, LayoutDashboard, LayoutDashboard].map((Icon, i) => (
          <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <Icon className="mb-2 h-4 w-4 text-amber-500" />
            <Bar w="w-1/2" tone="bg-amber-500/70" />
          </div>
        ))}
      </div>
      {/* Pipeline */}
      <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">{t.pipeline}</p>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((col) => (
          <div key={col.label} className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
            <span className="block text-[10px] font-medium text-slate-400">{col.label}</span>
            {Array.from({ length: col.n }).map((_, i) => (
              <div key={i} className="space-y-1.5 rounded-md border border-slate-800 bg-slate-900/50 p-2">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" tone="bg-slate-800" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

function ConciergeOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <div className="mx-auto max-w-[300px]">
      <PhoneFrame>
        <div className="mb-3 flex items-center gap-2 border-b border-slate-800/70 pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
            <MessageSquare className="h-4 w-4 text-amber-500" />
          </span>
          <div className="flex-1">
            <Bar w="w-2/3" />
          </div>
        </div>
        <div className="space-y-2.5">
          {/* incoming */}
          <div className="max-w-[80%] space-y-1.5 rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/60 p-2.5">
            <Bar w="w-full" tone="bg-slate-700" />
            <Bar w="w-2/3" tone="bg-slate-800" />
          </div>
          {/* outgoing */}
          <div className="ml-auto max-w-[80%] space-y-1.5 rounded-2xl rounded-tr-sm border border-amber-500/30 bg-amber-500/10 p-2.5">
            <Bar w="w-full" tone="bg-amber-500/40" />
            <Bar w="w-1/2" tone="bg-amber-500/30" />
          </div>
          <div className="max-w-[80%] space-y-1.5 rounded-2xl rounded-tl-sm border border-slate-800 bg-slate-900/60 p-2.5">
            <Bar w="w-3/4" tone="bg-slate-700" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-[11px] font-medium text-emerald-400">
          <Filter className="h-3.5 w-3.5" /> {t.qualified}
        </div>
      </PhoneFrame>
    </div>
  );
}

function CommerceOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <BrowserFrame label="commerce-os.luma">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {[ShoppingBag, ShoppingBag, ShoppingBag, ShoppingBag].map((Icon, i) => (
            <Tile key={i} icon={Icon} title={`${t.catalog} ${i + 1}`} />
          ))}
        </div>
        {/* Order panel */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <span className="block text-[10px] uppercase tracking-widest text-slate-500">{t.order}</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-5 w-5 shrink-0 rounded border border-slate-800 bg-slate-950" />
              <Bar w="w-full" tone="bg-slate-800" />
            </div>
          ))}
          <div className="mt-1 flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[11px] font-medium text-amber-400">
            <Check className="h-3.5 w-3.5" /> Checkout
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function BeautySpaOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <BrowserFrame label="beauty-spa-os.luma">
      <div className="grid grid-cols-2 gap-3">
        {/* Services */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <span className="block text-[10px] uppercase tracking-widest text-slate-500">{t.services}</span>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <Bar w="w-full" tone="bg-slate-800" />
            </div>
          ))}
        </div>
        {/* Agenda */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <span className="block text-[10px] uppercase tracking-widest text-slate-500">{t.agenda}</span>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-md border p-2 ${
                i === 1
                  ? 'border-amber-500/30 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-950/50'
              }`}
            >
              <Bar w="w-1/2" tone={i === 1 ? 'bg-amber-500/50' : 'bg-slate-800'} />
              {i === 1 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400">
                  <CalendarCheck className="h-3 w-3" /> {t.booked}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

const VISUALS: Record<string, (p: { t: (typeof T)[Locale] }) => React.ReactElement> = {
  'real-estate-os': RealEstateOS,
  'real-estate-crm-os': CrmOS,
  'real-estate-concierge-os': ConciergeOS,
  'commerce-os': CommerceOS,
  'beauty-spa-os': BeautySpaOS,
};

// Vista de "equipo": panel/dashboard genérico parametrizado por solución.
// Comunica el backend que opera el negocio (stats + tabla + lista lateral).
const TEAM_LABELS: Record<string, { es: string[]; en: string[] }> = {
  'real-estate-os': { es: ['Proyectos', 'Leads', 'Perfiles'], en: ['Projects', 'Leads', 'Profiles'] },
  'real-estate-crm-os': { es: ['Leads', 'En proceso', 'Cierres'], en: ['Leads', 'In progress', 'Closed'] },
  'real-estate-concierge-os': { es: ['Consultas', 'Calificados', 'Derivados'], en: ['Inquiries', 'Qualified', 'Handed off'] },
  'commerce-os': { es: ['Pedidos', 'Clientes', 'Productos'], en: ['Orders', 'Clients', 'Products'] },
  'beauty-spa-os': { es: ['Citas', 'Clientas', 'Servicios'], en: ['Bookings', 'Clients', 'Services'] },
};

function TeamPanel({ slug, locale }: { slug: string; locale: Locale }) {
  const labels = (TEAM_LABELS[slug] ?? TEAM_LABELS['real-estate-crm-os'])[locale];
  return (
    <BrowserFrame label={`${slug}.luma · panel`}>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {labels.map((label, i) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <span className="block text-[10px] uppercase tracking-wide text-slate-500">{label}</span>
            <span className={`mt-1 block h-2.5 rounded-full ${i === 0 ? 'w-3/4 bg-amber-500/70' : i === 1 ? 'w-1/2 bg-sky-400/60' : 'w-2/3 bg-emerald-400/60'}`} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-2.5">
              <span className="h-6 w-6 shrink-0 rounded-full border border-slate-800 bg-slate-900" />
              <div className="flex-1 space-y-1.5">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" tone="bg-slate-800" />
              </div>
              <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-amber-500' : 'bg-slate-700'}`} />
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60" />
              <Bar w={i % 2 ? 'w-2/3' : 'w-full'} tone="bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

export default function SolutionVisual({
  slug,
  locale = 'es',
  view = 'client',
  chip = true,
  className = '',
}: {
  slug: string;
  locale?: Locale;
  view?: 'client' | 'team';
  chip?: boolean;
  className?: string;
}) {
  const Visual = VISUALS[slug];
  if (!Visual) return null;
  const t = T[locale];
  return (
    <div className={`relative ${className}`}>
      {/* halo */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),_transparent_70%)]" />
      {view === 'team' ? <TeamPanel slug={slug} locale={locale} /> : <Visual t={t} />}
      {chip && (
        <div aria-hidden className="pointer-events-none absolute -right-3 -top-3 hidden sm:block">
          <FloatChip
            icon={Check}
            label={
              view === 'team'
                ? locale === 'en'
                  ? 'Team panel'
                  : 'Panel del equipo'
                : locale === 'en'
                  ? 'Customer view'
                  : 'Vista del cliente'
            }
          />
        </div>
      )}
    </div>
  );
}
