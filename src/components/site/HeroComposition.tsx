import {
  LayoutDashboard,
  MessageSquare,
  Filter,
  LineChart,
  type LucideIcon,
} from 'lucide-react';
import { BrowserFrame, PhoneFrame } from './DeviceFrame';

// Composición de producto premium para el hero de la home.
// Superpone un panel de control (browser) y un concierge (móvil) para
// comunicar "sistema conectado". CSS puro, server component. Mockup
// provisional estilizado, sin datos ni capturas reales.

type Locale = 'es' | 'en';

const T = {
  es: { panel: 'Control comercial', leads: 'Leads', conv: 'Conversión', qualified: 'Calificado' },
  en: { panel: 'Commercial control', leads: 'Leads', conv: 'Conversion', qualified: 'Qualified' },
} as const;

function Bar({ w = 'w-2/3', tone = 'bg-slate-700' }: { w?: string; tone?: string }) {
  return <span className={`block h-2 rounded-full ${w} ${tone}`} />;
}

function Stat({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <Icon className="mb-2 h-4 w-4 text-amber-500" />
      <span className="block text-[10px] text-slate-500">{label}</span>
      <Bar w="w-2/3" tone="bg-amber-500/60" />
    </div>
  );
}

export default function HeroComposition({ locale = 'es' }: { locale?: Locale }) {
  const t = T[locale];
  return (
    <div className="relative w-full">
      {/* halo */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),_transparent_70%)]" />

      <BrowserFrame label="sistema.luma · CRM">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">{t.panel}</p>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <Stat icon={LayoutDashboard} label={t.leads} />
          <Stat icon={LineChart} label={t.conv} />
          <Stat icon={Filter} label={t.qualified} />
        </div>
        <div className="space-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950/50 p-2.5"
            >
              <span className="h-7 w-7 shrink-0 rounded-full border border-slate-800 bg-slate-900" />
              <div className="flex-1 space-y-1.5">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" tone="bg-slate-800" />
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              />
            </div>
          ))}
        </div>
      </BrowserFrame>

      {/* Concierge móvil superpuesto */}
      <div className="absolute -bottom-8 -right-3 w-32 sm:w-40 lg:-right-8">
        <PhoneFrame>
          <div className="mb-2 flex items-center gap-1.5 border-b border-slate-800/70 pb-2">
            <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
            <Bar w="w-1/2" tone="bg-slate-700" />
          </div>
          <div className="space-y-2">
            <div className="max-w-[85%] rounded-lg rounded-tl-sm border border-slate-800 bg-slate-900/60 p-1.5">
              <Bar w="w-full" tone="bg-slate-700" />
            </div>
            <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm border border-amber-500/30 bg-amber-500/10 p-1.5">
              <Bar w="w-3/4" tone="bg-amber-500/40" />
            </div>
            <div className="flex items-center justify-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1 text-[9px] font-medium text-emerald-400">
              <Filter className="h-2.5 w-2.5" /> {t.qualified}
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
