'use client';

import React from 'react';
import { useLightbox } from './HomeScreenshotShowcase';
import ProductScreenshotFrame from './ProductScreenshotFrame';

type Locale = 'es' | 'en';

export default function HeroComposition({ locale = 'es' }: { locale?: Locale }) {
  const { openLightbox } = useLightbox();
  const isEn = locale === 'en';

  return (
    <div className="relative w-full select-none">
      {/* Main CRM Desktop Screenshot (Borderless Clean Frame) */}
      <ProductScreenshotFrame
        src="/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp"
        alt={isEn ? 'Luma CRM OS control panel' : 'Panel de control de Luma CRM OS'}
        screenshotId="real-estate-crm-os-desktop"
        usage="desktop"
        locale={locale}
        onScreenshotClick={openLightbox}
        aspectRatio="aspect-[16/9.5]"
        glow={true}
      />

      {/* Overlapping Mobile Screenshot (Sleek Clean Phone Mockup) */}
      <ProductScreenshotFrame
        src="/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_movil.webp"
        alt={isEn ? 'Luma Real Estate OS mobile catalog' : 'Catálogo móvil de Luma Real Estate OS'}
        screenshotId="real-estate-os-mobile"
        usage="mobile"
        locale={locale}
        onScreenshotClick={openLightbox}
        className="absolute -bottom-8 -right-1 w-24 xs:w-28 sm:w-36 lg:w-40 sm:-bottom-10 sm:-right-4 lg:-right-6 lg:-bottom-12 shadow-2xl transition-transform hover:scale-[1.03] duration-300 z-20"
      />
    </div>
  );
}

