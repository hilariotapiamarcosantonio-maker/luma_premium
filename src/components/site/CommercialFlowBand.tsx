import {
  Megaphone,
  Filter,
  Activity,
  Target,
  LayoutDashboard,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

// Banda visual del flujo comercial conectado: de la captación a la operación.
// CSS puro, server component. Comunica "sistema conectado", no piezas sueltas.

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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 md:p-8">
      <ol className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-2">
        {STAGES.map((stage, i) => (
          <li key={stage.label.en} className="flex flex-1 items-center gap-2 md:flex-col md:gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition-colors hover:border-amber-500/30 md:w-full md:flex-col md:items-start md:gap-2">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                <stage.icon className="h-5 w-5 text-amber-500" />
                <span className="absolute inset-0 rounded-xl bg-amber-500/10 blur-md" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">{stage.label[locale]}</p>
                <p className="text-xs text-slate-500">{stage.sub[locale]}</p>
              </div>
            </div>
            {i < STAGES.length - 1 && (
              <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-amber-500/50 md:rotate-0" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
