// Separador hairline premium con brillo ámbar central animado.
export default function PremiumDivider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative h-px w-full bg-slate-800/60 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 luma-shimmer" />
    </div>
  );
}
