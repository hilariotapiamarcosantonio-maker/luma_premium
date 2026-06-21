import { ExternalLink, User, MapPin } from 'lucide-react';
import { CASE_KIND_LABEL, type CaseItem } from '@/lib/cases';

const CASE_KIND_LABEL_EN: Record<CaseItem['kind'], string> = {
  demo: 'Official demo',
  reference: 'Commercial reference',
  authority: 'Founder authority',
};

const KIND_STYLE: Record<CaseItem['kind'], string> = {
  demo: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  reference: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  authority: 'border-slate-600 bg-slate-800/60 text-slate-300',
};

function CaseThumb({ item }: { item: CaseItem }) {
  const slug = item.solutionSlug;

  return (
    <div className="relative h-44 w-full overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950">
      {/* Background glow orb */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_65%)]" />

      {/* Browser Bar Chrome */}
      <div className="relative flex items-center gap-1.5 border-b border-slate-800/80 bg-slate-900/60 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
        <span className="ml-2 h-3 flex-1 rounded-sm border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[7px] font-mono text-slate-500 truncate">
          demo.luma-premium.com/{slug ?? 'preview'}
        </span>
      </div>

      {/* Custom Mockup Render based on Slug */}
      <div className="p-3 text-[9px] font-sans">
        {slug === 'real-estate-os' && (
          <div className="grid grid-cols-2 gap-2 text-white">
            <div className="rounded border border-slate-850 bg-slate-950/50 p-2 space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-semibold truncate max-w-[50px]">Vista del Río</span>
                <span className="text-[7px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-0.5 rounded font-mono">€280k</span>
              </div>
              <div className="flex items-center gap-0.5 text-[7px] text-slate-500">
                <MapPin className="h-2 w-2 shrink-0" />
                <span>Punta Cana</span>
              </div>
            </div>
            <div className="rounded border border-slate-850 bg-slate-950/50 p-2 space-y-1">
              <div className="flex justify-between items-start">
                <span className="font-semibold truncate max-w-[50px]">Villa Esmeralda</span>
                <span className="text-[7px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-0.5 rounded font-mono">€520k</span>
              </div>
              <div className="flex items-center gap-0.5 text-[7px] text-slate-500">
                <MapPin className="h-2 w-2 shrink-0" />
                <span>Santo Domingo</span>
              </div>
            </div>
          </div>
        )}

        {slug === 'real-estate-crm-os' && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded border border-slate-850 bg-slate-950/50 p-1.5 space-y-1">
              <span className="block text-[6px] uppercase tracking-wide text-slate-500 font-bold">New</span>
              <div className="bg-slate-900/50 rounded border border-slate-800 p-1 text-[8px] text-white truncate">Mateo G.</div>
            </div>
            <div className="rounded border border-slate-850 bg-slate-950/50 p-1.5 space-y-1">
              <span className="block text-[6px] uppercase tracking-wide text-slate-500 font-bold">Contact</span>
              <div className="bg-slate-900/50 rounded border border-slate-800 p-1 text-[8px] text-white truncate">Elena V.</div>
            </div>
            <div className="rounded border border-slate-850 bg-slate-950/50 p-1.5 space-y-1">
              <span className="block text-[6px] uppercase tracking-wide text-emerald-500 font-bold">Qualified</span>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-1 text-[8px] text-white truncate">Carlos M.</div>
            </div>
          </div>
        )}

        {slug === 'real-estate-concierge-os' && (
          <div className="space-y-1.5 max-w-[90%] mx-auto">
            <div className="rounded bg-slate-900/80 border border-slate-850 p-1.5 text-slate-300">
              Hola, ¿tienen locales en Torre Platinum?
            </div>
            <div className="ml-auto max-w-[90%] rounded bg-amber-500/10 border border-amber-500/20 p-1.5 text-amber-400">
              ¡Hola! Sí, contamos con 3 locales comerciales en PB.
            </div>
          </div>
        )}

        {slug === 'commerce-os' && (
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 rounded border border-slate-850 bg-slate-950/50 p-2 space-y-1">
              <span className="block font-semibold text-white truncate">Silla Ergonómica</span>
              <span className="block text-amber-500 font-bold font-mono">€240</span>
            </div>
            <div className="rounded border border-slate-850 bg-slate-900/40 p-1.5 flex flex-col justify-between items-center text-center">
              <span className="text-[7px] text-slate-500 uppercase">Cart</span>
              <span className="font-bold text-white leading-none">1 item</span>
            </div>
          </div>
        )}

        {slug === 'beauty-spa-os' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border border-slate-850 bg-slate-950/50 p-1.5 space-y-1">
              <span className="block text-[6px] uppercase tracking-wide text-slate-500 font-bold">Services</span>
              <span className="block text-white truncate leading-none">Limpieza Facial</span>
            </div>
            <div className="rounded border border-amber-500/20 bg-amber-500/10 p-1.5 space-y-1">
              <span className="block text-[6px] uppercase tracking-wide text-amber-400 font-bold">Booked</span>
              <span className="block text-white truncate leading-none">11:30 AM</span>
            </div>
          </div>
        )}

        {/* Default / Suvoga OS / Personal Portfolio */}
        {!slug && (
          <div className="flex gap-2">
            <div className="flex-1 rounded border border-slate-850 bg-slate-950/50 p-2 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-900 border border-slate-800">
                  <User className="h-2 w-2 text-amber-500" />
                </span>
                <span className="font-semibold text-white leading-none">Founder Dashboard</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden mt-1">
                <div className="h-full w-[85%] bg-amber-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tarjeta de caso/demo autorizado para /casos.
export default function CaseCard({ item, locale = 'es' }: { item: CaseItem; locale?: 'es' | 'en' }) {
  const isEn = locale === 'en';
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
    >
      <CaseThumb item={item} />

      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          {/* Etiqueta de tipo (honestidad comercial) */}
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_STYLE[item.kind]}`}
          >
            {isEn ? CASE_KIND_LABEL_EN[item.kind] : CASE_KIND_LABEL[item.kind]}
          </span>
          <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
          {item.category}
        </p>
        <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-1">{item.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-amber-500 text-sm font-medium">
          {isEn
            ? (item.kind === 'demo' ? 'View demo' : 'View reference')
            : (item.kind === 'demo' ? 'Ver demo' : 'Ver referencia')}{' '}
          <ExternalLink className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
}
