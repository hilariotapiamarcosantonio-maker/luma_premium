import React from 'react';
import {
  MessageSquare,
  Check,
  CalendarCheck,
  Filter,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { BrowserFrame, PhoneFrame } from './DeviceFrame';

// Composición de producto premium por solución (CSS puro).
// Representa de forma detallada la operación de cada sistema. Mockups ficticios
// y conceptuales para demostración comercial.

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
    statusNew: 'Nuevo',
    statusContact: 'Contacto',
    statusQualified: 'Calificado',
    time930: '09:30 AM · Disponible',
    time1130: '11:30 AM · Reservado',
    time1500: '03:00 PM · Disponible',
    price: 'Precio',
    confirm: 'Confirmar',
    brochure: 'Brochure_Proyecto.pdf',
    download: 'Descargar',
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
    statusNew: 'New',
    statusContact: 'Contact',
    statusQualified: 'Qualified',
    time930: '09:30 AM · Available',
    time1130: '11:30 AM · Booked',
    time1500: '03:00 PM · Available',
    price: 'Price',
    confirm: 'Confirm',
    brochure: 'Project_Brochure.pdf',
    download: 'Download',
  },
} as const;

function FloatChip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-slate-950/90 px-3 py-1.5 text-[11px] font-medium text-amber-400/90 shadow-lg">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

function RealEstateOS() {
  return (
    <BrowserFrame label="real-estate-os.luma">
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        {[
          { name: 'Vista del Río', price: '€280,000', location: 'Punta Cana', type: 'Apartamento', status: 'Disponible' },
          { name: 'Villa Esmeralda', price: '€520,000', location: 'Santo Domingo', type: 'Villa B2B', status: 'Planos' },
          { name: 'Torre Platinum', price: '€390,000', location: 'Punta Cana', type: 'Penthouse', status: 'Planos' },
          { name: 'Marina Loft', price: '€410,000', location: 'Cap Cana', type: 'Apartamento', status: 'Disponible' },
        ].map((prop, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-white truncate max-w-[80px]">{prop.name}</span>
              <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded font-mono">
                {prop.price}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-slate-500">
              <MapPin className="h-3 w-3 text-slate-600 shrink-0" />
              <span>{prop.location}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] border-t border-slate-800/40 pt-2 mt-1">
              <span className="text-slate-400">{prop.type}</span>
              <span className={`text-[8px] font-semibold ${prop.status === 'Disponible' ? 'text-emerald-400' : 'text-amber-400'}`}>{prop.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/60 pt-3">
        {['Inversión', 'Retiro', 'Corporativo', 'Vivienda'].map((p) => (
          <span
            key={p}
            className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[10px] font-medium text-slate-400"
          >
            {p}
          </span>
        ))}
      </div>
    </BrowserFrame>
  );
}

function CrmOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <BrowserFrame label="crm-os.luma">
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        {/* Col 1 */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
          <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{t.statusNew}</span>
          <div className="space-y-1 rounded-md border border-slate-850 bg-slate-900/40 p-2 hover:border-slate-800">
            <span className="block font-semibold text-white">Mateo G.</span>
            <span className="block text-[9px] text-slate-500">Apto Vista del Río</span>
          </div>
          <div className="space-y-1 rounded-md border border-slate-850 bg-slate-900/40 p-2 hover:border-slate-800">
            <span className="block font-semibold text-white">Sofía R.</span>
            <span className="block text-[9px] text-slate-500">Commerce OS Store</span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
          <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wide">{t.statusContact}</span>
          <div className="space-y-1 rounded-md border border-slate-850 bg-slate-900/40 p-2 hover:border-slate-800">
            <span className="block font-semibold text-white">Dra. Elena V.</span>
            <span className="block text-[9px] text-slate-500">Beauty Spa OS</span>
          </div>
        </div>

        {/* Col 3 */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
          <span className="block text-[9px] font-semibold text-emerald-500 uppercase tracking-wide">{t.statusQualified}</span>
          <div className="space-y-1 rounded-md border border-emerald-500/20 bg-emerald-500/[0.04] p-2 hover:border-emerald-500/30">
            <span className="block font-semibold text-white">Carlos M.</span>
            <span className="block text-[9px] text-slate-400">Torre Platinum</span>
            <span className="inline-flex items-center gap-1 text-[8px] text-emerald-400 mt-1 font-semibold">
              <Check className="h-2.5 w-2.5" /> Qualified
            </span>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ConciergeOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <div className="mx-auto max-w-[300px]">
      <PhoneFrame>
        {/* Chat head */}
        <div className="mb-3 flex items-center gap-2 border-b border-slate-800/70 pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
            <MessageSquare className="h-4 w-4 text-amber-500" />
          </span>
          <div>
            <span className="block text-[10px] font-bold text-white leading-none">Luma Concierge</span>
            <span className="text-[8px] text-emerald-400 font-medium">Assistant AI</span>
          </div>
        </div>

        {/* Dialogues */}
        <div className="space-y-2.5 text-[10px]">
          {/* User message */}
          <div className="max-w-[85%] rounded-lg rounded-tl-sm border border-slate-800 bg-slate-900/60 p-2.5 text-slate-300">
            Hola, ¿tienen locales comerciales disponibles en Torre Platinum?
          </div>
          {/* Concierge reply */}
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm border border-amber-500/20 bg-amber-500/[0.04] p-2.5 text-amber-300">
            ¡Hola! Sí, contamos con 3 locales comerciales en planta baja. ¿Su interés es para comercio o inversión?
          </div>
          {/* User message 2 */}
          <div className="max-w-[85%] rounded-lg rounded-tl-sm border border-slate-800 bg-slate-900/60 p-2.5 text-slate-300">
            Inversión para rentar.
          </div>
          {/* Concierge reply 2 */}
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm border border-amber-500/20 bg-amber-500/[0.04] p-2.5 text-amber-300 space-y-2">
            <span>Perfecto. Le adjunto el brochure con la tasa de retorno estimada:</span>
            <div className="flex items-center justify-between rounded border border-amber-500/30 bg-amber-500/10 p-1.5 text-[9px]">
              <span className="font-semibold truncate max-w-[100px]">{t.brochure}</span>
              <span className="text-[8px] underline shrink-0 cursor-pointer">{t.download}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-[10px] font-medium text-emerald-400">
          <Filter className="h-3.5 w-3.5" /> {t.qualified}
        </div>
      </PhoneFrame>
    </div>
  );
}

function CommerceOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <BrowserFrame label="commerce-os.luma">
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        {/* Products column */}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {[
            { name: 'Silla Premium', price: '€240' },
            { name: 'Escritorio Ergo', price: '€480' },
          ].map((prod, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
              <span className="flex h-12 items-center justify-center rounded bg-slate-950 border border-slate-850 text-slate-600 font-mono text-[9px]">
                Product Image
              </span>
              <span className="font-semibold text-white truncate">{prod.name}</span>
              <span className="text-amber-500 font-bold">{prod.price}</span>
            </div>
          ))}
        </div>

        {/* Order checkout panel */}
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold">{t.order}</span>
          <div className="space-y-1.5">
            <div className="flex justify-between border-b border-slate-850 pb-1 text-[10px]">
              <span className="text-slate-400">1x Silla Premium</span>
              <span className="text-white">€240</span>
            </div>
            <div className="flex justify-between border-b border-slate-850 pb-1 text-[10px]">
              <span className="text-slate-400">1x Escritorio Ergo</span>
              <span className="text-white">€480</span>
            </div>
            <div className="flex justify-between font-bold pt-1 text-[10px]">
              <span className="text-slate-300">Total:</span>
              <span className="text-amber-500">€720</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-2 text-[10px] font-medium text-amber-400 cursor-pointer hover:bg-amber-500/20 transition-colors">
            <Check className="h-3.5 w-3.5" /> {t.confirm}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function BeautySpaOS({ t }: { t: (typeof T)[Locale] }) {
  return (
    <BrowserFrame label="beauty-spa-os.luma">
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        {/* Services */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold">{t.services}</span>
          {[
            { name: 'Limpieza Facial', time: '60 min' },
            { name: 'Masaje Relajante', time: '90 min' },
            { name: 'Tratamiento Age', time: '75 min' },
          ].map((serv, i) => (
            <div key={i} className="flex items-center justify-between gap-2 border-b border-slate-850/60 pb-1.5">
              <span className="font-semibold text-white truncate max-w-[100px]">{serv.name}</span>
              <span className="text-[9px] text-slate-500 shrink-0">{serv.time}</span>
            </div>
          ))}
        </div>

        {/* Calendar Agenda */}
        <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
          <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold">{t.agenda}</span>
          <div className="space-y-2">
            <div className="rounded border border-slate-800 bg-slate-950/50 p-2 text-[9px] text-slate-400">
              {t.time930}
            </div>
            <div className="rounded border border-amber-500/30 bg-amber-500/10 p-2 text-[9px] flex justify-between items-center text-amber-400 font-medium">
              <span>{t.time1130}</span>
              <span className="inline-flex items-center gap-0.5 text-[8px] bg-amber-500/20 px-1 rounded">
                <CalendarCheck className="h-2.5 w-2.5" /> {t.booked}
              </span>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950/50 p-2 text-[9px] text-slate-400">
              {t.time1500}
            </div>
          </div>
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
    <BrowserFrame label={`${slug}.luma · CRM OS`}>
      {/* Metric Cards */}
      <div className="mb-4 grid grid-cols-3 gap-3 text-[11px]">
        {labels.map((label, i) => (
          <div key={label} className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
            <span className="block text-[9px] uppercase tracking-wide text-slate-500">{label}</span>
            <span className="mt-0.5 block font-bold text-white">
              {i === 0 ? '1,482' : i === 1 ? '98%' : 'Active'}
            </span>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        <div className="col-span-2 space-y-2">
          <div className="grid grid-cols-3 px-1 text-[8px] uppercase tracking-wider text-slate-600 font-semibold">
            <span>Name</span>
            <span>Interest</span>
            <span className="text-right">Action</span>
          </div>
          {[
            { name: 'Alejandro M.', interest: 'Vista del Río Apto 204', action: 'Call Client', color: 'text-amber-400' },
            { name: 'Elena V.', interest: 'Beauty Spa OS', action: 'Schedule Visit', color: 'text-sky-400' },
            { name: 'Carlos M.', interest: 'Commerce OS', action: 'Send Contract', color: 'text-emerald-400' },
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 items-center rounded-md border border-slate-850 bg-slate-950/50 px-2 py-1.5 hover:border-slate-800">
              <span className="font-semibold text-white truncate">{item.name}</span>
              <span className="text-slate-400 truncate">{item.interest}</span>
              <span className={`text-[9px] font-medium text-right ${item.color}`}>{item.action}</span>
            </div>
          ))}
        </div>

        {/* Activity sidebar */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5 space-y-2">
          <span className="block text-[8px] uppercase text-slate-500 font-bold">Activity Log</span>
          {[
            'Lead qualified',
            'AI Concierge handoff',
            'Citas reservadas',
            'Payment verified',
          ].map((act, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[9px] text-slate-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">{act}</span>
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
      {/* Halo visual */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.15),_transparent_70%)]" />
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

