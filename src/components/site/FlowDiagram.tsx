import { ArrowRight } from 'lucide-react';

// Diagrama de flujo comercial: pasos conectados por flechas.
// Responsive: fluye horizontal y se envuelve en mobile. CSS puro.
export default function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-sm font-medium text-slate-200">
            <span className="text-[10px] font-mono text-amber-500/80">
              0{i + 1}
            </span>
            {step}
          </span>
          {i < steps.length - 1 && (
            <ArrowRight className="h-4 w-4 shrink-0 text-amber-500/60" />
          )}
        </div>
      ))}
    </div>
  );
}
