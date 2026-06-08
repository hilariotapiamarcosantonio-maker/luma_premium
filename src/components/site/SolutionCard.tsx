import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon } from './Icon';
import type { Solution } from '@/lib/solutions';

// Tarjeta premium de solución para /soluciones y la home.
export default function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`/soluciones/${solution.slug}`}
      className="group flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-slate-800 bg-slate-950 group-hover:border-amber-500/40 transition-colors">
          <Icon name={solution.icon} className="w-6 h-6 text-amber-500" />
        </span>
        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
      </div>

      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
        {solution.kicker}
      </p>
      <h3 className="text-xl font-bold text-white mb-3">{solution.name}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
        {solution.positioning}
      </p>

      <dl className="space-y-3 border-t border-slate-800 pt-5 text-sm">
        <div>
          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Dolor que resuelve</dt>
          <dd className="text-slate-400 leading-snug">{solution.pain}</dd>
        </div>
        <div>
          <dt className="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Para quién es</dt>
          <dd className="text-slate-400 leading-snug">{solution.forWho}</dd>
        </div>
      </dl>

      <span className="mt-6 inline-flex items-center gap-2 text-amber-500 text-sm font-medium group-hover:text-amber-400 transition-colors">
        Ver solución <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
