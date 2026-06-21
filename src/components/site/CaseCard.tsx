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

// Miniatura estilizada (marco de navegador) por caso. Representa la UI del
// sistema sin ser una captura real ni exponer datos.
function CaseThumb({ item }: { item: CaseItem }) {
  return (
    <div className="relative h-36 w-full overflow-hidden border-b border-slate-800 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_70%)]" />
      {/* barra de navegador */}
      <div className="flex items-center gap-1.5 border-b border-slate-800/70 bg-slate-900/60 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
      </div>
      {/* contenido estilizado */}
      <div className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
          <Icon name={item.icon} className="h-5 w-5 text-amber-500" />
        </span>
        <div className="flex-1 space-y-2">
          <span className="block h-2 w-3/4 rounded-full bg-slate-700" />
          <span className="block h-2 w-1/2 rounded-full bg-slate-800" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-6 rounded-md border border-slate-800 bg-slate-900/50" />
        ))}
      </div>
    </div>
  );
}

// Tarjeta de caso/demo autorizado para /casos.
export default function CaseCard({ item, locale = 'es' }: { item: CaseItem; locale?: 'es' | 'en' }) {
  const isEn = locale === 'en';
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
    >
      <CaseThumb item={item} />

      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          {/* Etiqueta de tipo (honestidad comercial) */}
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_STYLE[item.kind]}`}
          >
            {isEn ? CASE_KIND_LABEL_EN[item.kind] : CASE_KIND_LABEL[item.kind]}
          </span>
          <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
        </div>

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
      </div>
    </a>
  );
}
