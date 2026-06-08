import {
  Crown,
  Magnet,
  MessageSquare,
  LayoutDashboard,
  Activity,
  Target,
  BarChart3,
} from 'lucide-react';

// Sección "Ecosistema Luma Premium": las capas comerciales como arquitectura.
const LAYERS = [
  { icon: Crown, title: 'Presencia y autoridad', desc: 'La marca se percibe seria desde el primer segundo.' },
  { icon: Magnet, title: 'Captación', desc: 'Rutas y landings que atraen el perfil correcto.' },
  { icon: MessageSquare, title: 'Respuesta / concierge', desc: 'Responde, educa y califica antes del asesor.' },
  { icon: LayoutDashboard, title: 'CRM / control', desc: 'Cada prospecto con estado y próximo paso.' },
  { icon: Activity, title: 'Seguimiento', desc: 'Trazabilidad en lugar de improvisación.' },
  { icon: Target, title: 'Conversión', desc: 'Cierre con criterio y autoridad.' },
  { icon: BarChart3, title: 'Medición', desc: 'Decisiones con datos, no con intuición.' },
];

export default function EcosystemLayers() {
  return (
    <div className="grid gap-3">
      {LAYERS.map((layer, i) => (
        <div
          key={layer.title}
          className="group relative flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-900/20 p-5 transition-colors hover:border-amber-500/30 hover:bg-slate-900/40"
          style={{ marginLeft: `${i * 4}px` }}
        >
          <span className="font-mono text-xs text-slate-600 w-6 shrink-0">
            0{i + 1}
          </span>
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
            <layer.icon className="h-5 w-5 text-amber-500" />
            <span className="absolute inset-0 rounded-xl bg-amber-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white">{layer.title}</h3>
            <p className="text-sm text-slate-400">{layer.desc}</p>
          </div>
          <span className="hidden sm:block h-px flex-1 max-w-[80px] bg-gradient-to-r from-slate-800 to-transparent" />
        </div>
      ))}
    </div>
  );
}
