'use client';

import React from 'react';
import Image from 'next/image';
import { useLightbox } from './HomeScreenshotShowcase';

type Locale = 'es' | 'en';

export default function HeroComposition({ locale = 'es' }: { locale?: Locale }) {
  const { openLightbox } = useLightbox();
  const isEn = locale === 'en';

  return (
    <div className="relative w-full select-none">
      {/* Premium Dark Blue/Slate Ambient Glow (Zero Green) */}
      <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.09),_rgba(30,41,59,0.02),_transparent_70%)]" />

      {/* Main CRM Desktop Screenshot (Borderless Clean Frame) */}
      <button
        onClick={() => openLightbox('real-estate-crm-os-desktop')}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl relative group cursor-zoom-in overflow-hidden border border-slate-800/85 bg-slate-950 shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition-all duration-300"
        aria-label={isEn ? 'Expand CRM dashboard screenshot' : 'Ampliar captura del panel de CRM'}
      >
        <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
          <Image
            src="/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp"
            alt={isEn ? 'Luma CRM OS control panel' : 'Panel de control de Luma CRM OS'}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-top brightness-[1.02] contrast-[1.01] transition-all duration-300 group-hover:brightness-110"
          />
          {/* Hover Badge */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1.5px]">
            <span className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-sm shadow-md uppercase tracking-wider">
              {isEn ? 'View Larger' : 'Ampliar captura'}
            </span>
          </div>
        </div>
      </button>

      {/* Overlapping Mobile Screenshot (Sleek Clean Phone Mockup) */}
      <div className="absolute -bottom-8 -right-1 w-24 xs:w-28 sm:w-36 lg:w-40 sm:-bottom-10 sm:-right-4 lg:-right-6 lg:-bottom-12 shadow-2xl transition-transform hover:scale-[1.03] duration-300 z-20">
        <button
          onClick={() => openLightbox('real-estate-os-mobile')}
          className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl relative group cursor-zoom-in overflow-hidden border border-slate-850 bg-slate-950 shadow-[0_15px_35px_rgba(37,99,235,0.06)]"
          aria-label={isEn ? 'Expand mobile view screenshot' : 'Ampliar captura de la vista móvil'}
        >
          <div className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden">
            <Image
              src="/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_movil.webp"
              alt={isEn ? 'Luma Real Estate OS mobile catalog' : 'Catálogo móvil de Luma Real Estate OS'}
              fill
              unoptimized
              sizes="180px"
              className="object-cover object-top brightness-[1.02] contrast-[1.01] transition-all duration-300 group-hover:brightness-110"
            />
            {/* Hover Badge */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-amber-500 text-slate-950 font-bold text-[9px] px-2.5 py-1 rounded shadow-md uppercase tracking-wider text-center">
                {isEn ? 'View' : 'Ampliar'}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
