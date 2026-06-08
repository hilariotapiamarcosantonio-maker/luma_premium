// Tarjeta de métrica / pilar para reforzar autoridad.

export default function MetricCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 text-center">
      <p className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</p>
      <p className="text-slate-400 text-sm leading-snug">{label}</p>
    </div>
  );
}
