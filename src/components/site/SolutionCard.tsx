import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon } from './Icon';
import type { Solution } from '@/lib/solutions';

// Tarjeta premium de solución: borde con gradiente, icono con glow y hover fuerte.
export default function SolutionCard({ solution, locale = 'es' }: { solution: Solution; locale?: 'es' | 'en' }) {
  const isEn = locale === 'en';
  return (
    <Link
      href={isEn ? '/en/solutions' : `/soluciones/${solution.slug}`}
      className="group relative block h-full rounded-2xl p-px bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-transparent transition-all duration-300 hover:from-amber-500/50 hover:via-amber-500/10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5"
    >
      <div className="flex h-full flex-col rounded-[15px] bg-slate-950/80 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 transition-colors group-hover:border-amber-500/40">
            <Icon name={solution.icon} className="h-6 w-6 text-amber-500" />
            <span className="absolute inset-0 rounded-xl bg-amber-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </span>
          <ArrowRight className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-500" />
        </div>

        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          {solution.kicker}
        </p>
        <h3 className="mb-3 text-xl font-bold text-white">{solution.name}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-400">
          {solution.positioning}
        </p>

        {/* Tags del flujo */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {solution.commercialFlow.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-[10px] font-medium text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <dl className="space-y-3 border-t border-slate-800 pt-5 text-sm">
          <div>
            <dt className="mb-0.5 text-xs uppercase tracking-wide text-slate-500">
              {isEn ? 'Pain solved' : 'Dolor que resuelve'}
            </dt>
            <dd className="leading-snug text-slate-400">{solution.pain}</dd>
          </div>
          <div>
            <dt className="mb-0.5 text-xs uppercase tracking-wide text-slate-500">
              {isEn ? 'Who it is for' : 'Para quién es'}
            </dt>
            <dd className="leading-snug text-slate-400">{solution.forWho}</dd>
          </div>
        </dl>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-500 transition-colors group-hover:text-amber-400">
          {isEn ? 'View solution' : 'Ver solución'}{' '}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
