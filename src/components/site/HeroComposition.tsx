import {
  MessageSquare,
  Filter,
  Building2,
  ShoppingBag,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { BrowserFrame, PhoneFrame } from './DeviceFrame';

// Composición de producto premium para el hero de la home.
// Superpone un panel de control (browser) y un concierge (móvil) para
// comunicar "sistema conectado". CSS puro. Mockup conceptual con datos ficticios.

type Locale = 'es' | 'en';

const T = {
  es: {
    panel: 'sistema.luma · CRM OS',
    search: 'Buscar lead, propiedad...',
    leadsTab: 'Leads activos',
    propertiesTab: 'Propiedades',
    conciergeTab: 'Concierge AI',
    statusQualified: 'Calificado',
    statusInContact: 'Contacto',
    statusHandoff: 'Handoff',
    metricL: 'Leads calificados',
    metricR: 'Tiempo respuesta',
    metricP: 'Pipeline estimado',
    chatUser1: 'Hola, me interesa el apartamento de 3 habitaciones en Vista del Río.',
    chatAgent1: '¡Hola! Con gusto. Contamos con disponibilidad. ¿Su compra es para inversión o para vivir?',
    chatUser2: 'Es para inversión familiar.',
    chatStatus: 'Calificado • Inversor • Presupuesto Alto',
    ctaBadge: 'Lead Calificado & Asignado a Asesor',
  },
  en: {
    panel: 'sistema.luma · CRM OS',
    search: 'Search lead, property...',
    leadsTab: 'Active Leads',
    propertiesTab: 'Properties',
    conciergeTab: 'Concierge AI',
    statusQualified: 'Qualified',
    statusInContact: 'Contact',
    statusHandoff: 'Handoff',
    metricL: 'Qualified Leads',
    metricR: 'Response Time',
    metricP: 'Est. Pipeline',
    chatUser1: 'Hello, I am interested in the 3-bedroom apartment at Vista del Río.',
    chatAgent1: 'Hello! Sure. We have availability. Is your purchase for investment or living?',
    chatUser2: 'It is for family investment.',
    chatStatus: 'Qualified • Investor • High Budget',
    ctaBadge: 'Lead Qualified & Assigned to Rep',
  },
} as const;

export default function HeroComposition({ locale = 'es' }: { locale?: Locale }) {
  const t = T[locale];

  return (
    <div className="relative w-full">
      {/* Halo de luz de fondo */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.18),_transparent_70%)]" />

      {/* Navegador principal: CRM Dashboard */}
      <BrowserFrame label={t.panel}>
        <div className="flex gap-4">
          {/* Sidebar lateral del CRM */}
          <div className="hidden w-40 shrink-0 flex-col gap-1.5 border-r border-slate-800/80 pr-4 sm:flex">
            <span className="mb-2 block px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              Navigation
            </span>
            <div className="flex items-center gap-2 rounded bg-amber-500/10 px-2 py-1.5 text-xs font-semibold text-amber-400">
              <Users className="h-3.5 w-3.5" />
              <span>{t.leadsTab}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300">
              <Building2 className="h-3.5 w-3.5" />
              <span>{t.propertiesTab}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{t.conciergeTab}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Commerce OS</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Beauty Spa OS</span>
            </div>
          </div>

          {/* Área principal del Dashboard */}
          <div className="flex-1 min-w-0">
            {/* Cabecera del CRM */}
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-800/40 pb-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                <div className="w-full rounded border border-slate-800 bg-slate-950/80 py-1.5 pl-8 pr-3 text-[10px] text-slate-500">
                  {t.search}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-slate-400">Concierge Active</span>
              </div>
            </div>

            {/* Fila de Métricas */}
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                <span className="block text-[9px] uppercase tracking-wide text-slate-500">{t.metricL}</span>
                <span className="mt-0.5 block text-sm font-bold text-white">1,482</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                <span className="block text-[9px] uppercase tracking-wide text-slate-500">{t.metricR}</span>
                <span className="mt-0.5 block text-sm font-bold text-emerald-400">1.2 min</span>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5">
                <span className="block text-[9px] uppercase tracking-wide text-slate-500">{t.metricP}</span>
                <span className="mt-0.5 block text-sm font-bold text-white">€2.4M</span>
              </div>
            </div>

            {/* Listado de leads interactivo mock */}
            <div className="space-y-2">
              <div className="grid grid-cols-4 px-2 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">
                <span>Lead</span>
                <span>Interés</span>
                <span>Origen</span>
                <span className="text-right">Estado</span>
              </div>
              {[
                { name: 'Alejandro M.', interest: 'Apto Vista del Río', source: 'Facebook Ads', status: t.statusQualified, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { name: 'Sofía R.', interest: 'Commerce OS Store', source: 'Instagram Org', status: t.statusInContact, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                { name: 'Dra. Elena V.', interest: 'Beauty Spa OS', source: 'TikTok Campaign', status: t.statusHandoff, color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
              ].map((lead, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 items-center rounded-md border border-slate-800/80 bg-slate-950/50 px-2 py-2 text-[11px] hover:border-slate-700 transition-colors"
                >
                  <span className="font-medium text-white truncate">{lead.name}</span>
                  <span className="text-slate-400 truncate">{lead.interest}</span>
                  <span className="text-slate-500 truncate">{lead.source}</span>
                  <span className="ml-auto">
                    <span className={`inline-block rounded border px-1.5 py-0.5 text-[9px] font-semibold leading-none ${lead.color}`}>
                      {lead.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserFrame>

      {/* Concierge móvil superpuesto */}
      <div className="absolute -bottom-10 -right-4 w-40 sm:w-48 lg:-right-8 shadow-2xl transition-transform hover:scale-[1.02] duration-300">
        <PhoneFrame>
          {/* Header del chat */}
          <div className="mb-2 flex items-center gap-2 border-b border-slate-800/70 pb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10">
              <MessageSquare className="h-3 w-3 text-amber-500" />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-white leading-none">Luma Concierge</span>
              <span className="text-[7px] text-emerald-400 font-medium">Assistant AI</span>
            </div>
          </div>

          {/* Burbujas de conversación */}
          <div className="space-y-2.5 max-h-[140px] overflow-hidden text-[9px]">
            {/* Msg Cliente */}
            <div className="max-w-[90%] rounded-lg rounded-tl-sm border border-slate-800 bg-slate-900/60 p-2 text-slate-300">
              {t.chatUser1}
            </div>
            {/* Msg Concierge */}
            <div className="ml-auto max-w-[90%] rounded-lg rounded-tr-sm border border-amber-500/20 bg-amber-500/[0.04] p-2 text-amber-300">
              {t.chatAgent1}
            </div>
            {/* Msg Cliente 2 */}
            <div className="max-w-[90%] rounded-lg rounded-tl-sm border border-slate-800 bg-slate-900/60 p-2 text-slate-300">
              {t.chatUser2}
            </div>
            {/* Calificación interna */}
            <div className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[8px] font-medium text-emerald-400 justify-center">
              <Filter className="h-2 w-2" /> {t.chatStatus}
            </div>
          </div>

          {/* Badge final */}
          <div className="mt-3 flex items-center justify-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/30 py-1 text-[8px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>{t.ctaBadge}</span>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
