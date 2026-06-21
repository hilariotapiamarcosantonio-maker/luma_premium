import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { BrowserFrame, PhoneFrame } from './DeviceFrame';

type Locale = 'es' | 'en';

function FloatChip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-slate-950/90 px-3 py-1.5 text-[11px] font-medium text-amber-400/90 shadow-lg font-sans">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

export default function SolutionVisual({
  slug,
  locale = 'es',
  view = 'client',
  chip = true,
  className = '',
  onScreenshotClick,
}: {
  slug: string;
  locale?: Locale;
  view?: 'client' | 'team';
  chip?: boolean;
  className?: string;
  onScreenshotClick?: (id: string) => void;
}) {
  const isEn = locale === 'en';

  // Determine which screenshots to render based on slug and view type
  let desktopSrc = '';
  let mobileSrc = '';
  let desktopLabel = '';
  let mobileLabel = '';
  let desktopScreenshotId = '';
  let mobileScreenshotId = '';

  if (slug === 'real-estate-os') {
    if (view === 'team') {
      desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp';
      desktopLabel = isEn ? 'Real Estate CRM OS - Team View' : 'Real Estate CRM OS - Panel de Equipo';
      desktopScreenshotId = 'real-estate-crm-os-desktop';
    } else {
      desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_desktop.webp';
      mobileSrc = '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_movil.webp';
      desktopLabel = isEn ? 'Real Estate OS - Property Portal' : 'Real Estate OS - Portal de Propiedades';
      mobileLabel = isEn ? 'Real Estate OS - Mobile View' : 'Real Estate OS - Vista Móvil';
      desktopScreenshotId = 'real-estate-os-desktop';
      mobileScreenshotId = 'real-estate-os-mobile';
    }
  } else if (slug === 'real-estate-crm-os') {
    desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp';
    desktopLabel = isEn ? 'Real Estate CRM OS - Pipelines & Control' : 'Real Estate CRM OS - Pipelines y Control';
    desktopScreenshotId = 'real-estate-crm-os-desktop';
  } else if (slug === 'real-estate-concierge-os') {
    if (view === 'team') {
      desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp';
      desktopLabel = isEn ? 'Real Estate CRM OS - Qualified Leads List' : 'Real Estate CRM OS - Leads Calificados';
      desktopScreenshotId = 'real-estate-crm-os-desktop';
    } else {
      desktopSrc = '/images/marketing/screenshots/optimized/thumb/real_estate_concierge_os_-_demo.webp';
      desktopLabel = isEn ? 'Concierge OS - AI Assistant Chat' : 'Concierge OS - Chat del Asistente AI';
      desktopScreenshotId = 'real-estate-concierge-os-desktop';
    }
  } else if (slug === 'commerce-os') {
    desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_commerce_os_-_demo.webp';
    desktopLabel = isEn ? 'Commerce OS - Storefront & Checkout' : 'Commerce OS - Tienda y Checkout';
    desktopScreenshotId = 'commerce-os-desktop';
  } else if (slug === 'beauty-spa-os') {
    if (view === 'team') {
      desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp';
      desktopLabel = isEn ? 'Beauty Spa OS - Booking Control' : 'Beauty Spa OS - Control de Citas';
      desktopScreenshotId = 'real-estate-crm-os-desktop';
    } else {
      desktopSrc = '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_desktop.webp';
      mobileSrc = '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_movil.webp';
      desktopLabel = isEn ? 'Beauty Spa OS - Booking Portal' : 'Beauty Spa OS - Portal de Reservas';
      mobileLabel = isEn ? 'Beauty Spa OS - Mobile Booking' : 'Beauty Spa OS - Reserva Móvil';
      desktopScreenshotId = 'beauty-spa-os-desktop';
      mobileScreenshotId = 'beauty-spa-os-mobile';
    }
  }

  if (!desktopSrc) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Visual Halo */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.12),_transparent_70%)]" />
      
      {mobileSrc ? (
        // Premium overlapping layout for Desktop + Mobile
        <div className="relative w-full">
          <div className="w-[85%] sm:w-[88%]">
            <button
              onClick={() => onScreenshotClick && onScreenshotClick(desktopScreenshotId)}
              disabled={!onScreenshotClick}
              aria-label={isEn ? `Expand ${desktopLabel}` : `Ampliar ${desktopLabel}`}
              className="w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg group/btn cursor-zoom-in block"
            >
              <BrowserFrame label={desktopSrc.split('/').pop() || 'desktop.webp'}>
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={desktopSrc}
                    alt={desktopLabel}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="rounded object-cover object-top border border-slate-900 shadow-lg brightness-[1.02] contrast-[1.02] transition-all duration-300 group-hover/btn:brightness-110"
                  />
                  {onScreenshotClick && (
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="bg-amber-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded shadow-md uppercase tracking-wider">
                        {isEn ? 'View larger' : 'Ampliar captura'}
                      </span>
                    </div>
                  )}
                </div>
              </BrowserFrame>
            </button>
          </div>
          
          <div className="absolute w-[125px] xs:w-[150px] sm:w-[190px] -right-2 xs:-right-4 sm:-right-6 -bottom-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-[1.04] hover:rotate-1 z-10">
            <button
              onClick={() => onScreenshotClick && onScreenshotClick(mobileScreenshotId)}
              disabled={!onScreenshotClick}
              aria-label={isEn ? `Expand ${mobileLabel}` : `Ampliar ${mobileLabel}`}
              className="w-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-2xl group/phone cursor-zoom-in block"
            >
              <PhoneFrame>
                <div className="relative w-full aspect-[9/16] min-h-[200px] xs:min-h-[250px] sm:min-h-[320px]">
                  <Image
                    src={mobileSrc}
                    alt={mobileLabel}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 150px, 200px"
                    className="rounded-2xl object-cover object-top brightness-[1.02] contrast-[1.02] transition-all duration-300 group-hover/phone:brightness-110"
                  />
                  {onScreenshotClick && (
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/phone:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px] rounded-2xl">
                      <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-1 rounded shadow-md uppercase tracking-wider text-center leading-none">
                        {isEn ? 'View' : 'Ampliar'}
                      </span>
                    </div>
                  )}
                </div>
              </PhoneFrame>
            </button>
          </div>
        </div>
      ) : (
        // Simple Browser layout for Desktop-only solutions
        <div className="w-full">
          <button
            onClick={() => onScreenshotClick && onScreenshotClick(desktopScreenshotId)}
            disabled={!onScreenshotClick}
            aria-label={isEn ? `Expand ${desktopLabel}` : `Ampliar ${desktopLabel}`}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg group/btn cursor-zoom-in block"
          >
            <BrowserFrame label={desktopSrc.split('/').pop() || 'desktop.webp'}>
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={desktopSrc}
                  alt={desktopLabel}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="rounded object-cover object-top border border-slate-900 shadow-lg brightness-[1.02] contrast-[1.02] transition-all duration-300 group-hover/btn:brightness-110"
                />
                {onScreenshotClick && (
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-amber-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded shadow-md uppercase tracking-wider">
                      {isEn ? 'View larger' : 'Ampliar captura'}
                    </span>
                  </div>
                )}
              </div>
            </BrowserFrame>
          </button>
        </div>
      )}

      {chip && (
        <div aria-hidden className="pointer-events-none absolute -right-3 -top-3 hidden sm:block">
          <FloatChip
            icon={Check}
            label={
              view === 'team'
                ? isEn
                  ? 'Team view'
                  : 'Vista del equipo'
                : isEn
                  ? 'Customer view'
                  : 'Vista del cliente'
            }
          />
        </div>
      )}
    </div>
  );
}

