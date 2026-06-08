import {
  Megaphone,
  MessageSquare,
  LayoutDashboard,
  Activity,
  Target,
  Stethoscope,
} from 'lucide-react';

// Escena visual del ecosistema comercial Luma para el hero.
// Representa un sistema conectado (no una página): captación → conversión.
// CSS puro + lucide. Sin JS de cliente.

const NODES = [
  { icon: Megaphone, label: 'Ads / Redes', sub: 'Entrada de demanda' },
  { icon: Stethoscope, label: 'Diagnóstico', sub: 'Lectura ejecutiva' },
  { icon: MessageSquare, label: 'Concierge', sub: 'Responde y califica' },
  { icon: LayoutDashboard, label: 'CRM', sub: 'Control comercial' },
  { icon: Activity, label: 'Seguimiento', sub: 'Trazabilidad' },
  { icon: Target, label: 'Conversión', sub: 'Cierre con autoridad' },
];

const CHIPS = [
  'Captación',
  'Diagnóstico',
  'CRM',
  'Concierge',
  'Commerce',
  'Seguimiento',
  'Conversión',
];

export default function EcosystemScene() {
  return (
    <div className="relative w-full">
      {/* Panel */}
      <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm p-6 md:p-8 shadow-2xl shadow-black/40">
        {/* Window chrome */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="ml-3 text-[11px] uppercase tracking-widest text-slate-500">
            Sistema Luma · Ecosistema comercial
          </span>
        </div>

        {/* Flow of connected nodes */}
        <ol className="relative space-y-1">
          {NODES.map((node, i) => (
            <li key={node.label} className="relative flex items-center gap-4 py-2.5">
              {/* connector line */}
              {i < NODES.length - 1 && (
                <span className="absolute left-[19px] top-[42px] h-[calc(100%-12px)] w-px bg-gradient-to-b from-amber-500/40 to-slate-800" />
              )}
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                <node.icon className="h-5 w-5 text-amber-500" />
                <span className="absolute inset-0 rounded-xl bg-amber-500/10 blur-md" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white leading-tight">
                  {node.label}
                </p>
                <p className="text-xs text-slate-500">{node.sub}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-600">
                0{i + 1}
              </span>
            </li>
          ))}
        </ol>

        {/* Capability chips */}
        <div className="mt-7 flex flex-wrap gap-2 border-t border-slate-800/70 pt-6">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[11px] font-medium text-slate-400"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Floating caption */}
      <div className="absolute -bottom-4 left-6 right-6 mx-auto hidden md:flex items-center justify-center">
        <span className="rounded-full border border-amber-500/20 bg-slate-950/90 px-4 py-1.5 text-[11px] font-medium text-amber-400/90 shadow-lg">
          Infraestructura conectada, no piezas sueltas
        </span>
      </div>
    </div>
  );
}
