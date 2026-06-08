// Luz radial difusa premium. CSS puro (sin JS). Se anima con .luma-orb
// salvo prefers-reduced-motion (ver globals.css).

type GlowOrbProps = {
  className?: string;
  /** Color tone of the glow */
  tone?: 'amber' | 'slate' | 'champagne';
  /** Diameter utility classes, e.g. "w-[40rem] h-[40rem]" */
  size?: string;
  animate?: boolean;
};

const TONES: Record<NonNullable<GlowOrbProps['tone']>, string> = {
  amber: 'rgba(245, 158, 11, 0.16)',
  champagne: 'rgba(250, 230, 190, 0.10)',
  slate: 'rgba(148, 163, 184, 0.10)',
};

export default function GlowOrb({
  className = '',
  tone = 'amber',
  size = 'w-[36rem] h-[36rem]',
  animate = true,
}: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${size} ${
        animate ? 'luma-orb' : ''
      } ${className}`}
      style={{
        background: `radial-gradient(circle at center, ${TONES[tone]} 0%, transparent 70%)`,
      }}
    />
  );
}
