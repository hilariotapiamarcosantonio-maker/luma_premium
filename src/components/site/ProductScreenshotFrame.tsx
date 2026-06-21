'use client';

import React from 'react';
import Image from 'next/image';

export interface ProductScreenshotFrameProps {
  src: string;
  alt: string;
  screenshotId?: string;
  usage: 'desktop' | 'mobile';
  objectFit?: 'cover' | 'contain';
  locale?: 'es' | 'en';
  onScreenshotClick?: (id: string) => void;
  className?: string; // Additional classes for custom positioning/sizing
  aspectRatio?: string; // Custom aspect ratio classes, e.g. aspect-[16/9.5]
  glow?: boolean; // Whether to render a subtle dark-blue backing glow
  rounded?: string; // Custom rounding classes (defaults to rounded-xl)
  border?: string; // Custom border classes (defaults to border border-slate-800/85)
  shadow?: string; // Custom shadow classes (defaults to shadow-[0_20px_50px_rgba(37,99,235,0.08)])
  hoverBorder?: string; // Custom border hover classes (defaults to hover:border-slate-700/80)
}

export default function ProductScreenshotFrame({
  src,
  alt,
  screenshotId,
  usage,
  objectFit = 'cover',
  locale = 'es',
  onScreenshotClick,
  className = '',
  aspectRatio,
  glow = false,
  rounded = 'rounded-xl',
  border = 'border border-slate-800/85',
  shadow = 'shadow-[0_20px_50px_rgba(37,99,235,0.08)]',
  hoverBorder = 'hover:border-slate-700/80',
}: ProductScreenshotFrameProps) {
  const isEn = locale === 'en';
  const isMobile = usage === 'mobile';
  
  // Set default aspect ratios if none provided
  const aspectClass = aspectRatio || (isMobile ? 'aspect-[9/16]' : 'aspect-[16/9]');
  
  const isClickable = !!(onScreenshotClick && screenshotId);

  // Inner image and hover layout
  const innerContent = (
    <div className={`relative w-full ${aspectClass} bg-slate-950 overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={isMobile ? '200px' : '(max-width: 1024px) 100vw, 60vw'}
        className={`transition-all duration-300 brightness-[1.02] contrast-[1.01] ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover object-top'
        } ${isClickable ? 'group-hover:brightness-110' : ''}`}
      />
      
      {/* Lightbox Trigger Hover Badge */}
      {isClickable && (
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1.5px]">
          <span
            className={`bg-amber-500 text-slate-950 font-bold uppercase tracking-wider shadow-md leading-none ${
              isMobile
                ? 'text-[8px] px-2 py-0.5 rounded'
                : 'text-xs px-4 py-2 rounded-sm'
            }`}
          >
            {isMobile 
              ? (isEn ? 'View' : 'Ampliar') 
              : (isEn ? 'View Larger' : 'Ampliar captura')}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Premium Dark Blue/Slate Ambient Glow */}
      {glow && (
        <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08),_rgba(30,41,59,0.02),_transparent_70%)] pointer-events-none" />
      )}

      {isClickable ? (
        <button
          type="button"
          onClick={() => onScreenshotClick(screenshotId)}
          className={`block w-full text-left focus:outline-none focus:ring-2 focus:ring-amber-500 relative group cursor-zoom-in overflow-hidden transition-all duration-300 ${rounded} ${border} ${shadow} ${hoverBorder}`}
          aria-label={isEn ? `Expand screenshot: ${alt}` : `Ampliar captura de pantalla: ${alt}`}
        >
          {innerContent}
        </button>
      ) : (
        <div className={`block w-full overflow-hidden ${rounded} ${border} ${shadow}`}>
          {innerContent}
        </div>
      )}
    </div>
  );
}
