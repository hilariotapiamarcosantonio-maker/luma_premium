import { ExternalLink, User } from 'lucide-react';
import Image from 'next/image';
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

function CaseThumb({
  item,
  onScreenshotClick,
  locale = 'es',
}: {
  item: CaseItem;
  onScreenshotClick?: (id: string) => void;
  locale?: 'es' | 'en';
}) {
  const slug = item.solutionSlug;

  // Map screenshots
  let screenshotPath = '';
  let altText = '';
  let isMobile = false;
  let screenshotId = '';

  if (slug === 'real-estate-os') {
    screenshotPath = '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_desktop.webp';
    altText = 'Real Estate OS - Vista del Río';
    screenshotId = 'real-estate-os-desktop';
  } else if (slug === 'real-estate-crm-os') {
    screenshotPath = '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp';
    altText = 'Real Estate CRM OS';
    screenshotId = 'real-estate-crm-os-desktop';
  } else if (slug === 'real-estate-concierge-os') {
    screenshotPath = '/images/marketing/screenshots/optimized/thumb/real_estate_concierge_os_-_demo.webp';
    altText = 'Real Estate Concierge OS';
    screenshotId = 'real-estate-concierge-os-desktop';
  } else if (slug === 'commerce-os') {
    screenshotPath = '/images/marketing/screenshots/optimized/thumb/luma_commerce_os_-_demo.webp';
    altText = 'Commerce OS';
    screenshotId = 'commerce-os-desktop';
  } else if (slug === 'beauty-spa-os') {
    if (item.title.toLowerCase().includes('concierge')) {
      screenshotPath = '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_movil.webp';
      altText = 'Beauty Spa OS - Concierge Flow';
      isMobile = true;
      screenshotId = 'beauty-spa-os-mobile';
    } else {
      screenshotPath = '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_desktop.webp';
      altText = 'Beauty Spa OS';
      screenshotId = 'beauty-spa-os-desktop';
    }
  } else if (item.title.toLowerCase().includes('suvoga')) {
    screenshotPath = '/images/marketing/screenshots/optimized/thumb/suvoga_os_academy.webp';
    altText = 'Suvoga OS Academy';
    screenshotId = 'suvoga-os-academy-desktop';
  }

  if (screenshotPath) {
    if (isMobile) {
      return (
        <div className="relative h-44 w-full overflow-hidden border-b border-slate-800 bg-slate-950 flex items-center justify-center p-3">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-950 -z-10" />
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded blur opacity-50 -z-10" />
          
          <button
            onClick={(e) => {
              if (onScreenshotClick && screenshotId) {
                e.preventDefault();
                e.stopPropagation();
                onScreenshotClick(screenshotId);
              }
            }}
            aria-label={locale === 'en' ? 'Expand screenshot' : 'Ampliar captura de pantalla'}
            className="w-[85px] h-[150px] rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 hover:scale-[1.04] focus:outline-none focus:ring-1 focus:ring-amber-500/50 relative group cursor-zoom-in"
          >
            {/* Simple Mobile Notch/Bar */}
            <div className="flex justify-center bg-slate-900/60 py-0.5 border-b border-slate-800/80 shrink-0 w-full">
              <span className="h-0.5 w-6 rounded-full bg-slate-700" />
            </div>
            {/* Screenshot */}
            <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
              <Image
                src={screenshotPath}
                alt={altText}
                fill
                unoptimized
                sizes="120px"
                className="object-cover object-top brightness-[1.03] contrast-[1.02]"
              />
              {/* Ampliar Captura Badge Overlay */}
              {onScreenshotClick && screenshotId && (
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-amber-500 text-slate-950 font-bold text-[7px] px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider text-center leading-none">
                    {locale === 'en' ? 'View' : 'Ampliar'}
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
      );
    } else {
      return (
        <div className="relative h-44 w-full overflow-hidden border-b border-slate-850 bg-slate-950 p-2 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950 -z-10" />
          
          <button
            onClick={(e) => {
              if (onScreenshotClick && screenshotId) {
                e.preventDefault();
                e.stopPropagation();
                onScreenshotClick(screenshotId);
              }
            }}
            aria-label={locale === 'en' ? 'Expand screenshot' : 'Ampliar captura de pantalla'}
            className="w-full h-full rounded-lg border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus:ring-1 focus:ring-amber-500/50 relative group cursor-zoom-in"
          >
            {/* Simple Browser Bar */}
            <div className="flex items-center gap-1 border-b border-slate-800/80 bg-slate-900/40 px-2.5 py-1 shrink-0 w-full">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
              <span className="ml-2 truncate rounded bg-slate-950/70 px-2 py-0.5 text-[7px] font-mono text-slate-500 flex-1 leading-none text-left">
                {item.url.replace('https://', '').replace(/\/$/, '')}
              </span>
            </div>
            {/* Screenshot */}
            <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
              <Image
                src={screenshotPath}
                alt={altText}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover object-top brightness-[1.03] contrast-[1.02]"
              />
              {/* Ampliar Captura Badge Overlay */}
              {onScreenshotClick && screenshotId && (
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-amber-500 text-slate-950 font-bold text-[9px] px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                    {locale === 'en' ? 'View larger' : 'Ampliar captura'}
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
      );
    }
  }

  // Fallback (for Portafolio and other things)
  return (
    <div className="relative h-44 w-full overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_65%)]" />
      <div className="relative flex items-center gap-1.5 border-b border-slate-800/80 bg-slate-900/60 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700/80" />
        <span className="ml-2 h-3 flex-1 rounded-sm border border-slate-800 bg-slate-950/70 px-2 py-0.5 text-[7px] font-mono text-slate-500 truncate">
          demo.luma-premium.com/{slug ?? 'preview'}
        </span>
      </div>
      <div className="p-3 text-[9px] font-sans">
        <div className="flex gap-2">
          <div className="flex-1 rounded border border-slate-850 bg-slate-950/50 p-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-900 border border-slate-800">
                <User className="h-2 w-2 text-amber-500" />
              </span>
              <span className="font-semibold text-white leading-none">Founder Dashboard</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded overflow-hidden mt-1">
              <div className="h-full w-[85%] bg-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tarjeta de caso/demo autorizado para /casos.
export default function CaseCard({
  item,
  locale = 'es',
  onScreenshotClick,
}: {
  item: CaseItem;
  locale?: 'es' | 'en';
  onScreenshotClick?: (id: string) => void;
}) {
  const isEn = locale === 'en';
  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
    >
      <CaseThumb item={item} onScreenshotClick={onScreenshotClick} locale={locale} />

      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          {/* Etiqueta de tipo (honestidad comercial) */}
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${KIND_STYLE[item.kind]}`}
          >
            {isEn ? CASE_KIND_LABEL_EN[item.kind] : CASE_KIND_LABEL[item.kind]}
          </span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isEn ? `Open ${item.title} demo` : `Abrir demo de ${item.title}`}
          >
            <ExternalLink className="w-5 h-5 text-slate-600 hover:text-amber-500 transition-colors" />
          </a>
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
          {item.category}
        </p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none"
        >
          <h3 className="text-lg font-bold text-white mb-3 hover:text-amber-500 transition-colors">{item.title}</h3>
        </a>
        <p className="text-slate-400 text-sm leading-relaxed flex-1">{item.description}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-amber-500 text-sm font-medium hover:text-amber-400 transition-colors"
        >
          {isEn
            ? (item.kind === 'demo' ? 'View demo' : 'View reference')
            : (item.kind === 'demo' ? 'Ver demo' : 'Ver referencia')}{' '}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

