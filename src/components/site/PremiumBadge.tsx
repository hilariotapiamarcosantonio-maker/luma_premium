// Badge pill premium reutilizable. Variante con punto pulsante opcional.

export default function PremiumBadge({
  children,
  pulse = false,
  tone = 'muted',
  className = '',
}: {
  children: React.ReactNode;
  pulse?: boolean;
  tone?: 'muted' | 'amber';
  className?: string;
}) {
  const toneClass =
    tone === 'amber' ? 'text-amber-400/90' : 'text-slate-400';
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium ${toneClass} ${className}`}
    >
      {pulse && (
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      )}
      {children}
    </span>
  );
}
