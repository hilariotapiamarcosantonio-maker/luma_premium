// Línea de tiempo del método de trabajo (vertical, premium).

export type ProcessStep = {
  title: string;
  description: string;
};

export default function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <ol className="relative border-l border-slate-800 ml-3 space-y-12">
      {steps.map((step, i) => (
        <li key={step.title} className="pl-8 relative">
          <span className="absolute -left-[13px] top-0 flex items-center justify-center w-6 h-6 rounded-full border border-amber-500/40 bg-slate-950 text-amber-500 text-xs font-bold">
            {i + 1}
          </span>
          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
