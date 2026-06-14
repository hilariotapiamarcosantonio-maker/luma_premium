import { ExternalLink } from 'lucide-react';
import { Icon } from './Icon';
import { CASE_KIND_LABEL, type CaseItem } from '@/lib/cases';

const CASE_KIND_LABEL_EN: Record<CaseItem['kind'], string> = {
  demo: 'Official demo',
  reference: 'Commercial reference',
  authority: 'Founder authority',
};

const KIND_STYLE: Record<CaseItem['kind'], string> = {
  demo: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  reference: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  authority: 'border-slate-600 bg-slate-800/60 text-slate-300',
};

// Tarjeta de caso/demo autorizado para /casos.
export default function CaseCard({ item, locale = 'es' }: { item: CaseItem; locale?: 'es' | 'en' }) {
  const isEn = locale === 'en';
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-slate-800 bg-slate-950">
          <Icon name={item.icon} className="w-6 h-6 text-amber-500" />
        </span>
        <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
      </div>

      {/* Etiqueta de tipo (honestidad comercial) */}
      <span
        className={`mb-4 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_STYLE[item.kind]}`}
      >
        {isEn ? CASE_KIND_LABEL_EN[item.kind] : CASE_KIND_LABEL[item.kind]}
      </span>

      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
        {item.category}
      </p>
      <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{item.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-amber-500 text-sm font-medium">
        {isEn
          ? (item.kind === 'demo' ? 'View demo' : 'View reference')
          : (item.kind === 'demo' ? 'Ver demo' : 'Ver referencia')}{' '}
        <ExternalLink className="w-4 h-4" />
      </span>
    </a>
  );
}
