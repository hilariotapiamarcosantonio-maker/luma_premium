import {
  Megaphone,
  Filter,
  Activity,
  Target,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

type Locale = 'es' | 'en';

type Stage = { icon: LucideIcon; label: { es: string; en: string }; sub: { es: string; en: string } };

const STAGES: Stage[] = [
  {
    icon: Megaphone,
    label: { es: 'Captación', en: 'Capture' },
    sub: { es: 'Ads, redes y landings', en: 'Ads, social & landings' },
  },
  {
    icon: Filter,
    label: { es: 'Calificación', en: 'Qualification' },
    sub: { es: 'Concierge que filtra', en: 'Concierge that filters' },
  },
  {
    icon: Activity,
    label: { es: 'Seguimiento', en: 'Follow-up' },
    sub: { es: 'Trazabilidad real', en: 'Real traceability' },
  },
  {
    icon: Target,
    label: { es: 'Conversión', en: 'Conversion' },
    sub: { es: 'Cierre con autoridad', en: 'Close with authority' },
  },
  {
    icon: LayoutDashboard,
    label: { es: 'Operación', en: 'Operation' },
    sub: { es: 'Control en un panel', en: 'Control in one panel' },
  },
];

export default function CommercialFlowBand({ locale = 'es' }: { locale?: Locale }) {
  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-950/40 p-8 overflow-hidden shadow-2xl">
      {/* Background radial highlight */}
      <div className="absolute -left-1/4 top-1/2 -z-10 h-72 w-72 rounded-full bg-blue-950/20 blur-3xl" />
      <div className="absolute -right-1/4 top-1/2 -z-10 h-72 w-72 rounded-full bg-amber-950/10 blur-3xl" />

      {/* SVG Connecting lines (Desktop/Tablet) */}
      <div aria-hidden className="absolute inset-x-8 top-[3.7rem] hidden h-1 border-t border-dashed border-slate-800 md:block z-0">
        {/* Animated glow path moving across */}
        <div className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      <ol className="relative flex flex-col gap-6 md:flex-row md:items-stretch md:gap-4 z-10">
        {STAGES.map((stage, i) => (
          <li key={stage.label.en} className="flex-1">
            <div className="group relative flex flex-col items-center text-center rounded-xl border border-slate-800 bg-slate-900/10 hover:bg-slate-900/30 hover:border-amber-500/30 p-5 transition-all duration-300 h-full">
              
              {/* Icon Container with glowing dot */}
              <div className="relative mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 group-hover:border-amber-500/50 transition-colors">
                <stage.icon className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="absolute inset-0 rounded-xl bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Micro active animation dot (only on first node as active indicator, or all on hover) */}
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-amber-500/60 transition-colors">0{i + 1}</span>
                  <h4 className="text-sm font-bold text-white tracking-tight">{stage.label[locale]}</h4>
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-snug group-hover:text-slate-400 transition-colors">{stage.sub[locale]}</p>
              </div>

              {/* Connected details widget to look realistic */}
              <div className="mt-4 w-full border-t border-slate-800/40 pt-3 text-[10px] text-slate-500 font-mono text-center">
                {i === 0 && 'Lead Captación Ads'}
                {i === 1 && 'Filtro Bot 24/7'}
                {i === 2 && 'WhatsApp CRM OS'}
                {i === 3 && 'Handoff a Asesor'}
                {i === 4 && 'Métricas Luma'}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

