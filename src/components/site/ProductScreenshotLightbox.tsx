'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ExternalLink } from 'lucide-react';
import type { ProductScreenshot } from '@/data/product-screenshots';

type Locale = 'es' | 'en';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentId: string;
  screenshots: ProductScreenshot[];
  locale?: Locale;
}

type ZoomState = 'fit' | '100' | 'expanded';

export default function ProductScreenshotLightbox({
  isOpen,
  onClose,
  currentId,
  screenshots,
  locale = 'es',
}: LightboxProps) {
  const [activeId, setActiveId] = useState(currentId);
  const [zoom, setZoom] = useState<ZoomState>('fit');
  const [prevCurrentId, setPrevCurrentId] = useState(currentId);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const isEn = locale === 'en';

  // Synchronize state when currentId prop changes
  if (currentId !== prevCurrentId) {
    setPrevCurrentId(currentId);
    setActiveId(currentId);
    setZoom('fit');
  }

  // Get active screenshot and its index
  const activeIndex = screenshots.findIndex((s) => s.id === activeId);
  const activeScreenshot = screenshots[activeIndex] || screenshots[0];

  // Handle body scroll lock & focus management
  useEffect(() => {
    if (isOpen) {
      // 1. Lock body scroll
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      // 2. Save active element to restore focus later
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // 3. Focus the modal wrapper
      if (modalRef.current) {
        modalRef.current.focus();
      }

      return () => {
        document.body.style.overflow = originalStyle === 'hidden' ? '' : originalStyle;
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (screenshots.length <= 1) return;
    const nextIndex = (activeIndex + 1) % screenshots.length;
    setActiveId(screenshots[nextIndex].id);
    setZoom('fit');
    // Scroll container back to top/left on image change
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollTop = 0;
      imageContainerRef.current.scrollLeft = 0;
    }
  }, [activeIndex, screenshots]);

  const handlePrev = useCallback(() => {
    if (screenshots.length <= 1) return;
    const prevIndex = (activeIndex - 1 + screenshots.length) % screenshots.length;
    setActiveId(screenshots[prevIndex].id);
    setZoom('fit');
    // Scroll container back to top/left on image change
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollTop = 0;
      imageContainerRef.current.scrollLeft = 0;
    }
  }, [activeIndex, screenshots]);

  const cycleZoom = () => {
    setZoom((prev) => {
      if (prev === 'fit') return '100';
      if (prev === '100') return 'expanded';
      return 'fit';
    });
  };

  // Keyboard navigation - defined after handleNext and handlePrev
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Focus trap implementation
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (!modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, a, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  if (!isOpen || !activeScreenshot) return null;

  // Zoom styles mapping
  let imgClassName = 'transition-all duration-300 object-contain';
  let containerClassName = 'flex items-center justify-center w-full h-full overflow-auto p-4';

  if (zoom === 'fit') {
    imgClassName += ' max-w-full max-h-[70vh] sm:max-h-[75vh]';
  } else if (zoom === '100') {
    imgClassName += ' max-w-none max-h-none w-auto h-auto';
    containerClassName += ' cursor-zoom-out';
  } else if (zoom === 'expanded') {
    // 150% size for landscape, 200% size for mobile portrait
    const sizeMultiplier = activeScreenshot.orientation === 'portrait' ? 'w-[200%]' : 'w-[150%]';
    imgClassName += ` max-w-none max-h-none h-auto ${sizeMultiplier}`;
    containerClassName += ' cursor-zoom-out';
  }

  return (
    <AnimatePresence>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={isEn ? 'Screenshot Viewer' : 'Visor de Capturas'}
        tabIndex={-1}
        onKeyDown={handleTabKey}
        className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 text-white focus:outline-none"
      >
        {/* Top Navbar */}
        <div className="flex items-center justify-between border-b border-slate-900 bg-slate-950/90 px-4 py-3 z-10 shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate">
              {isEn ? activeScreenshot.lightboxTitleEn : activeScreenshot.lightboxTitleEs}
            </h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {isEn ? activeScreenshot.descriptionEn : activeScreenshot.descriptionEs}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Button */}
            <button
              onClick={cycleZoom}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white transition-colors"
              title={isEn ? 'Change Zoom' : 'Cambiar Zoom'}
            >
              <ZoomIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {zoom === 'fit' && (isEn ? 'Fit Screen' : 'Ajustar')}
                {zoom === '100' && '100%'}
                {zoom === 'expanded' && (isEn ? 'Expanded' : 'Ampliado')}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white transition-colors cursor-pointer"
              aria-label={isEn ? 'Close' : 'Cerrar'}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Viewport Container */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden">
          {/* Navigation - Previous */}
          {screenshots.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 rounded-full border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white transition-all shadow-xl backdrop-blur-sm cursor-pointer disabled:opacity-40"
              aria-label={isEn ? 'Previous Screenshot' : 'Captura Anterior'}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Interactive Zoomable Viewport */}
          <div
            ref={imageContainerRef}
            className={containerClassName}
            onClick={(e) => {
              // Click on backdrop/container to close, click on image to zoom
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            <div className={`relative ${zoom === 'fit' ? 'max-w-full' : 'max-w-none m-auto'}`}>
              <Image
                src={activeScreenshot.fullPath}
                alt={isEn ? activeScreenshot.altEn : activeScreenshot.altEs}
                width={activeScreenshot.width}
                height={activeScreenshot.height}
                unoptimized
                onClick={cycleZoom}
                className={imgClassName}
              />
            </div>
          </div>

          {/* Navigation - Next */}
          {screenshots.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 rounded-full border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white transition-all shadow-xl backdrop-blur-sm cursor-pointer disabled:opacity-40"
              aria-label={isEn ? 'Next Screenshot' : 'Siguiente Captura'}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Bottom Bar Details & Demo CTA */}
        <div className="border-t border-slate-900 bg-slate-950/90 px-4 py-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {isEn ? activeScreenshot.usage : (activeScreenshot.usage === 'desktop' ? 'Escritorio' : 'Móvil')}
            </span>
            <span className="text-xs text-slate-400">
              {isEn
                ? `Screenshot ${activeIndex + 1} of ${screenshots.length}`
                : `Captura ${activeIndex + 1} de ${screenshots.length}`}
            </span>
          </div>

          {activeScreenshot.demoUrl && (
            <a
              href={activeScreenshot.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-white px-6 py-2.5 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition-colors shadow-lg"
            >
              <span>{isEn ? 'Open Live Demo' : 'Abrir demo interactiva'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
