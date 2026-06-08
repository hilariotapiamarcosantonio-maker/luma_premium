// Grid tecnológico muy sutil, con máscara radial para desvanecer en los bordes.
// CSS puro (.luma-grid en globals.css).

export default function AnimatedGrid({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 luma-grid ${className}`}
    />
  );
}
