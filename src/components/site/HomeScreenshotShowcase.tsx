'use client';

import React, { createContext, useContext, useState } from 'react';
import ProductScreenshotLightbox from './ProductScreenshotLightbox';
import { PRODUCT_SCREENSHOTS } from '@/data/product-screenshots';

type LightboxContextType = {
  openLightbox: (id: string) => void;
};

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error('useLightbox must be used within a HomeScreenshotShowcase');
  }
  return context;
}

export default function HomeScreenshotShowcase({
  children,
  locale = 'es',
}: {
  children: React.ReactNode;
  locale?: 'es' | 'en';
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (id: string) => {
    setActiveId(id);
    setIsOpen(true);
  };

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      {children}
      <ProductScreenshotLightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentId={activeId || ''}
        screenshots={PRODUCT_SCREENSHOTS}
        locale={locale}
      />
    </LightboxContext.Provider>
  );
}
