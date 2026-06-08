import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type CTA = { label: string; href: string; external?: boolean };

// Sección de cierre premium reutilizable.
export default function CTASection({
  title,
  subtitle,
  primary,
  secondary,
  footnote,
}: {
  title: string;
  subtitle?: string;
  primary: CTA;
  secondary?: CTA;
  footnote?: string;
}) {
  return (
    <section className="py-24 px-6 bg-slate-950 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
      <div className="max-w-4xl mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-12 md:p-20 shadow-2xl backdrop-blur-sm">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-10">
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primary.href}
            {...(primary.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-sm font-semibold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
          >
            {primary.label} <ArrowRight className="w-5 h-5" />
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              {...(secondary.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-sm font-medium text-white border border-slate-700 hover:bg-slate-900 transition-colors"
            >
              {secondary.label}
            </Link>
          )}
        </div>
        {footnote && (
          <p className="text-sm text-slate-500 pt-8 font-medium">{footnote}</p>
        )}
      </div>
    </section>
  );
}
