import PremiumBadge from './PremiumBadge';

// Encabezado de sección consistente. Centrado opcional.
export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = false,
  className = '',
}: {
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${center ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}
    >
      {badge && (
        <PremiumBadge className="mb-4">{badge}</PremiumBadge>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-slate-400 text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
