'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import CaseCard from './CaseCard';
import ProductScreenshotLightbox from './ProductScreenshotLightbox';
import { PRODUCT_SCREENSHOTS } from '@/data/product-screenshots';
import { MotionSection, MotionStagger, MotionItem } from './Motion';
import { CASES } from '@/lib/cases';

export default function HomeCasesSection() {
  const [activeScreenshotId, setActiveScreenshotId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenScreenshot = (id: string) => {
    setActiveScreenshotId(id);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <SectionHeading
              badge="Casos y demos"
              title="Sistemas reales, no maquetas."
              subtitle="Referencias autorizadas para ver la arquitectura Luma en funcionamiento. Haga clic en la captura para ampliar."
            />
            <Link
              href="/casos"
              className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Ver todos los casos <ArrowRight className="w-4 h-4" />
            </Link>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASES.slice(0, 3).map((item) => (
              <MotionItem key={item.url} className="h-full">
                <CaseCard item={item} onScreenshotClick={handleOpenScreenshot} locale="es" />
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      <ProductScreenshotLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        currentId={activeScreenshotId || ''}
        screenshots={PRODUCT_SCREENSHOTS}
        locale="es"
      />
    </>
  );
}
