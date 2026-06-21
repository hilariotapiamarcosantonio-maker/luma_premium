import {
  Globe,
  Magnet,
  Activity,
  MessageCircle,
  LayoutDashboard,
  Target,
  Crown,
  ListChecks,
  type LucideIcon,
} from 'lucide-react';

// Matriz visual de lo que revisa el diagnóstico. Reemplaza las "píldoras"
// planas por una rejilla de iconos semánticos. CSS puro, server component.

type Locale = 'es' | 'en';

type Item = { icon: LucideIcon; label: { es: string; en: string } };

const ITEMS: Item[] = [
  { icon: Globe, label: { es: 'Presencia digital', en: 'Digital presence' } },
  { icon: Magnet, label: { es: 'Captación', en: 'Lead capture' } },
  { icon: Activity, label: { es: 'Seguimiento', en: 'Follow-up' } },
  { icon: MessageCircle, label: { es: 'WhatsApp y redes', en: 'WhatsApp & social' } },
  { icon: LayoutDashboard, label: { es: 'CRM y organización', en: 'CRM & organization' } },
  { icon: Target, label: { es: 'Conversión', en: 'Conversion' } },
  { icon: Crown, label: { es: 'Autoridad de marca', en: 'Brand authority' } },
  { icon: ListChecks, label: { es: 'Operación', en: 'Operation' } },
];

export default function DiagnosticMatrix({ locale = 'es' }: { locale?: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ITEMS.map((item) => (
        <div
          key={item.label.en}
          className="group flex flex-col items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition-colors hover:border-amber-500/30 hover:bg-slate-900/50"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
            <item.icon className="h-5 w-5 text-amber-500" />
            <span className="absolute inset-0 rounded-lg bg-amber-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
          </span>
          <span className="text-sm font-medium text-slate-200">{item.label[locale]}</span>
        </div>
      ))}
    </div>
  );
}
