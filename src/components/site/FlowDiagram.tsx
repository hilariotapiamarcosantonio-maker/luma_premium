import { ArrowRight } from 'lucide-react';

// Diagrama de flujo comercial: pasos conectados por flechas.
// Responsive: fluye horizontal y se envuelve en mobile. CSS puro.
export default function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <span className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-xs font-semibold text-slate-200 transition-all hover:border-amber-500/30 hover:bg-slate-900/60 shadow-lg">
            <span className="text-[10px] font-mono text-amber-500/80 group-hover:scale-110 transition-transform">
              0{i + 1}
            </span>
            <span>{step}</span>
          </span>
          {i < steps.length - 1 && (
            <ArrowRight className="h-4 w-4 shrink-0 text-amber-500/50 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}

