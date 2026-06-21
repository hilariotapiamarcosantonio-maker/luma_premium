import React from 'react';
import {
  Globe,
  Magnet,
  Activity,
  MessageCircle,
  LayoutDashboard,
  Target,
  Crown,
  ListChecks,
} from 'lucide-react';

type Locale = 'es' | 'en';

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: { es: string; en: string };
  desc: { es: string; en: string };
  status: { es: string; en: string };
};

const ITEMS: Item[] = [
  {
    icon: Globe,
    label: { es: 'Presencia digital', en: 'Digital presence' },
    desc: { es: 'Desempeño, velocidad y posicionamiento premium.', en: 'Performance, speed, and premium positioning.' },
    status: { es: 'Puntos de fuga', en: 'Leak points' },
  },
  {
    icon: Magnet,
    label: { es: 'Captación', en: 'Lead capture' },
    desc: { es: 'Embudos y atribución del retorno de inversión.', en: 'Funnels and attribution of ROI.' },
    status: { es: 'Filtros activos', en: 'Active filters' },
  },
  {
    icon: Activity,
    label: { es: 'Seguimiento', en: 'Follow-up' },
    desc: { es: 'Trazabilidad y disciplina de contacto.', en: 'Traceability and contact discipline.' },
    status: { es: 'Sin seguimiento', en: 'No tracking' },
  },
  {
    icon: MessageCircle,
    label: { es: 'WhatsApp y redes', en: 'WhatsApp & social' },
    desc: { es: 'Velocidad de respuesta y concierge AI.', en: 'Response speed and concierge AI.' },
    status: { es: 'Cuello botella', en: 'Bottleneck' },
  },
  {
    icon: LayoutDashboard,
    label: { es: 'CRM y organización', en: 'CRM & organization' },
    desc: { es: 'Pipeline comercial y asignación a asesores.', en: 'Sales pipeline and rep assignment.' },
    status: { es: 'Desorden Excel', en: 'Excel clutter' },
  },
  {
    icon: Target,
    label: { es: 'Conversión', en: 'Conversion' },
    desc: { es: 'Cierre con autoridad y kits de ventas.', en: 'Closing with authority and sales kits.' },
    status: { es: 'Poca autoridad', en: 'Low authority' },
  },
  {
    icon: Crown,
    label: { es: 'Autoridad de marca', en: 'Brand authority' },
    desc: { es: 'Coherencia estética y solidez percibida.', en: 'Aesthetic consistency and perceived solidity.' },
    status: { es: 'Diluido', en: 'Diluted' },
  },
  {
    icon: ListChecks,
    label: { es: 'Operación', en: 'Operation' },
    desc: { es: 'Métricas comerciales y reportes ejecutivos.', en: 'Sales metrics and executive reports.' },
    status: { es: 'Intuición', en: 'Intuition-based' },
  },
];

export default function DiagnosticMatrix({ locale = 'es' }: { locale?: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs font-sans">
      {ITEMS.map((item) => (
        <div
          key={item.label.en}
          className="group flex flex-col justify-between items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/10 p-4 transition-all duration-300 hover:border-amber-500/30 hover:bg-slate-900/30 shadow-md"
        >
          <div className="space-y-2">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
              <item.icon className="h-4.5 w-4.5 text-amber-500" />
              <span className="absolute inset-0 rounded-lg bg-amber-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
            </span>
            <span className="block font-bold text-white leading-tight">{item.label[locale]}</span>
            <p className="text-[10px] text-slate-500 leading-normal">{item.desc[locale]}</p>
          </div>
          
          <div className="mt-3 w-full border-t border-slate-850 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>Audit:</span>
            <span className="text-amber-500/70 font-semibold">{item.status[locale]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

