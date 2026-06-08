import AnimatedGrid from './AnimatedGrid';
import GlowOrb from './GlowOrb';

// Capa de fondo global premium: gradiente radial + grid tecnológico + orbes de luz.
// Fija, detrás de todo el contenido, sin captura de eventos. CSS puro.
export default function PremiumBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Base radial depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,_rgba(30,41,59,0.55),_transparent_60%)]" />
      {/* Tech grid */}
      <AnimatedGrid />
      {/* Glow orbs */}
      <GlowOrb tone="amber" size="w-[42rem] h-[42rem]" className="-top-40 -left-32 opacity-60" />
      <GlowOrb tone="champagne" size="w-[34rem] h-[34rem]" className="top-1/3 -right-40 opacity-50" />
      <GlowOrb tone="slate" size="w-[30rem] h-[30rem]" className="bottom-0 left-1/4 opacity-40" />
      {/* Vignette to keep contrast on content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,_transparent_55%,_rgba(2,6,23,0.65))]" />
    </div>
  );
}
