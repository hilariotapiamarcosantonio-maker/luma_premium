import { ExternalLink } from 'lucide-react';
import { Icon } from './Icon';
import type { CaseItem } from '@/lib/cases';

// Tarjeta de caso/demo autorizado para /casos.
export default function CaseCard({ item }: { item: CaseItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-slate-800 bg-slate-950">
          <Icon name={item.icon} className="w-6 h-6 text-amber-500" />
        </span>
        <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
        {item.category}
      </p>
      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{item.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-amber-500 text-sm font-medium">
        Ver demo <ExternalLink className="w-4 h-4" />
      </span>
    </a>
  );
}
