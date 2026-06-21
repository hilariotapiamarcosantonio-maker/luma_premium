import { Package, Sparkles, type LucideIcon } from 'lucide-react';

// Metodología visual propietaria: cada fase con número protagonista, icono,
// línea de conexión, descripción, entregable y resultado esperado.
// CSS puro, server component. Reemplaza la lista vertical monótona.

export type MethodPhase = {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverable: string;
  result: string;
};

export default function MethodJourney({
  phases,
  labels,
}: {
  phases: MethodPhase[];
  labels: { deliverable: string; result: string };
}) {
  return (
    <ol className="relative space-y-5">
      {phases.map((phase, i) => (
        <li key={phase.title} className="relative">
          {/* conector hacia la siguiente fase */}
          {i < phases.length - 1 && (
            <span
              aria-hidden
              className="absolute left-7 top-[88px] hidden h-[calc(100%-32px)] w-px bg-gradient-to-b from-amber-500/40 to-slate-800 md:block"
            />
          )}
          <div className="group relative flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/20 p-6 transition-colors hover:border-amber-500/30 md:flex-row md:items-center md:gap-6">
            {/* Número + icono protagonista */}
            <div className="flex items-center gap-4 md:w-56 md:shrink-0">
              <span className="font-mono text-4xl font-bold leading-none text-slate-700 transition-colors group-hover:text-amber-500/40">
                0{i + 1}
              </span>
              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                <phase.icon className="h-6 w-6 text-amber-500" />
                <span className="absolute inset-0 rounded-xl bg-amber-500/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
              </span>
            </div>

            {/* Texto */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{phase.description}</p>
            </div>

            {/* Entregable + resultado */}
            <div className="grid gap-3 border-t border-slate-800/70 pt-4 sm:grid-cols-2 md:w-72 md:shrink-0 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <div className="flex items-start gap-2">
                <Package className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{labels.deliverable}</p>
                  <p className="text-xs leading-snug text-slate-300">{phase.deliverable}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500/70" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{labels.result}</p>
                  <p className="text-xs leading-snug text-slate-300">{phase.result}</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
