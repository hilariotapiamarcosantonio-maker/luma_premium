import React from 'react';
import { Package, Sparkles, type LucideIcon } from 'lucide-react';

// Metodología visual propietaria: cada fase con número protagonista, icono,
// línea de conexión, descripción, entregable y resultado esperado.
// CSS puro. Reemplaza la lista vertical monótona por una editorial alternante.

export type MethodPhase = {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverable: string;
  result: string;
};

// Componente para representar el mini-visual de cada fase
function PhaseVisual({ index }: { index: number }) {
  return (
    <div className="w-full max-w-[240px] rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-[9px] text-slate-500 shadow-md">
      {index === 0 && (
        <div className="space-y-2">
          <div className="flex justify-between border-b border-slate-900 pb-1">
            <span>Audit status</span>
            <span className="text-amber-500 font-bold">Scanning...</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>· CRM Check</span>
            <span className="text-emerald-400">Done</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>· Lead Leakage</span>
            <span className="text-emerald-400">Found</span>
          </div>
        </div>
      )}
      {index === 1 && (
        <div className="space-y-2">
          <span className="block border-b border-slate-900 pb-1 text-slate-400 font-semibold">Architecture blueprint</span>
          <div className="flex justify-between items-center bg-slate-900/40 p-1.5 rounded">
            <span>Ads &rarr; Landing &rarr; AI Filter &rarr; CRM</span>
          </div>
        </div>
      )}
      {index === 2 && (
        <div className="space-y-2">
          <span className="block border-b border-slate-900 pb-1 text-slate-400">Layout wireframe</span>
          <div className="grid grid-cols-3 gap-1 h-8 items-end">
            <span className="h-4 bg-slate-800 rounded-sm" />
            <span className="h-7 bg-amber-500/40 rounded-sm" />
            <span className="h-5 bg-slate-800 rounded-sm" />
          </div>
        </div>
      )}
      {index === 3 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Deploying system</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden">
            <div className="h-full w-[90%] bg-amber-500" />
          </div>
        </div>
      )}
      {index === 4 && (
        <div className="space-y-2">
          <span className="block border-b border-slate-900 pb-1 text-slate-400">Training completed</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle className="h-3 w-3" />
            <span>Rep Certification</span>
          </div>
        </div>
      )}
      {index === 5 && (
        <div className="space-y-2">
          <span className="block border-b border-slate-900 pb-1 text-slate-400">Optimization cycle</span>
          <div className="flex items-center justify-between text-white font-bold">
            <span>Performance index</span>
            <span className="text-emerald-400">+34%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-500" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

export default function MethodJourney({
  phases,
  labels,
}: {
  phases: MethodPhase[];
  labels: { deliverable: string; result: string };
}) {
  return (
    <div className="relative">
      {/* Central timeline line (only on desktop md+) */}
      <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-amber-500/50 via-slate-800 to-slate-900 md:block" />

      <ol className="space-y-12 md:space-y-16">
        {phases.map((phase, i) => {
          const isEven = i % 2 === 0;

          return (
            <li key={phase.title} className="relative flex flex-col md:flex-row md:items-center">
              {/* Timeline Center Dot (Desktop md+) */}
              <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-950 bg-amber-500 shadow-xl shadow-amber-500/20 md:block z-10" />

              {/* Card Container */}
              <div
                className={`flex flex-col md:flex-row items-center gap-6 w-full ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Details side */}
                <div className="flex-1 w-full">
                  <div className="group relative flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 hover:border-amber-500/30 transition-all duration-300">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-3xl font-bold leading-none text-slate-700 transition-colors group-hover:text-amber-500/50">
                        0{i + 1}
                      </span>
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                        <phase.icon className="h-5 w-5 text-amber-500" />
                        <span className="absolute inset-0 rounded-xl bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight">{phase.title}</h3>
                    </div>

                    {/* Desc */}
                    <p className="text-slate-400 text-xs leading-relaxed">{phase.description}</p>

                    {/* Deliverable & Result Badges */}
                    <div className="grid gap-3 border-t border-slate-800/60 pt-4 sm:grid-cols-2">
                      <div className="flex items-start gap-2 rounded-lg border border-slate-850 bg-slate-950/30 p-2">
                        <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                        <div className="min-w-0">
                          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">{labels.deliverable}</p>
                          <p className="text-[10px] leading-snug text-slate-300 truncate">{phase.deliverable}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg border border-amber-500/10 bg-amber-500/[0.02] p-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500/70" />
                        <div className="min-w-0">
                          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">{labels.result}</p>
                          <p className="text-[10px] leading-snug text-slate-300 truncate">{phase.result}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Vertical Divider (Spacings) */}
                <div className="hidden md:block w-8 shrink-0" />

                {/* Visual side */}
                <div className="flex-1 flex justify-center w-full md:w-auto">
                  <PhaseVisual index={i} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

