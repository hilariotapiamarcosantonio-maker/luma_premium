'use client';

import React, { useState } from 'react';
import CaseCard from '@/components/site/CaseCard';
import SystemGallery from '@/components/site/SystemGallery';
import ProductScreenshotLightbox from '@/components/site/ProductScreenshotLightbox';
import { PRODUCT_SCREENSHOTS } from '@/data/product-screenshots';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import SectionHeading from '@/components/site/SectionHeading';
import CTASection from '@/components/site/CTASection';
import PremiumBadge from '@/components/site/PremiumBadge';
import type { CaseItem } from '@/lib/cases';

interface CasosPageClientProps {
  cases: CaseItem[];
  locale?: 'es' | 'en';
}

export default function CasosPageClient({ cases, locale = 'es' }: CasosPageClientProps) {
  const [activeScreenshotId, setActiveScreenshotId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenScreenshot = (id: string) => {
    setActiveScreenshotId(id);
    setIsLightboxOpen(true);
  };

  const isEn = locale === 'en';

  return (
    <>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">
            {isEn ? 'Cases & references' : 'Casos y referencias'}
          </PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            {isEn ? 'Real systems. Not mockups.' : 'Sistemas reales, no maquetas.'}
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? 'Authorized demos and selected references to see the Luma architecture in action. Each represents a solution line.'
              : 'Demos y referencias autorizadas para ver la arquitectura Luma en funcionamiento. Cada una representa una línea de solución.'}
          </p>
        </div>
      </section>

      {/* Franja de autoridad */}
      <section className="pb-12 px-6">
        <MotionSection className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 md:p-8 text-center">
            <p className="text-lg md:text-xl text-white font-medium leading-snug">
              {isEn ? 'Official demos and selected commercial references.' : 'Demos oficiales y referencias comerciales seleccionadas.'}
            </p>
            <p className="text-slate-400 mt-2">
              {isEn ? 'We do not show theory. We show architecture in operation.' : 'No mostramos teoría. Mostramos arquitectura en funcionamiento.'}
            </p>
          </div>
        </MotionSection>
      </section>

      <section className="pb-24 px-6">
        <MotionStagger className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <MotionItem key={item.url} className="h-full">
              <CaseCard item={item} locale={locale} onScreenshotClick={handleOpenScreenshot} />
            </MotionItem>
          ))}
        </MotionStagger>
        <div className="max-w-7xl mx-auto mt-10">
          <p className="text-xs text-slate-600 border border-slate-800/60 rounded-lg p-4 leading-relaxed">
            {isEn
              ? 'Public demos for demonstration purposes. Commercial references and the founder\'s authority are displayed as such. Internal operating environments and the sales room are not exposed here.'
              : 'Demos públicas con fines demostrativos. Las referencias comerciales y la autoridad del fundador se muestran como tales. Los entornos internos de operación y la sala de ventas no se exponen aquí.'}
          </p>
        </div>
      </section>

      {/* Dentro del sistema */}
      <section className="py-20 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-12">
            <SectionHeading
              badge={isEn ? 'Inside the system' : 'Dentro del sistema'}
              title={isEn ? 'What the operation looks like from the inside.' : 'Así se ve la operación por dentro.'}
              subtitle={
                isEn
                  ? 'A representation of the modules that make up a Luma architecture: control, pipeline, concierge, catalog, and more. Illustrative views, no real data. Click on any to expand.'
                  : 'Representación de los módulos que componen una arquitectura Luma: control, pipeline, concierge, catálogo y más. Vistas ilustrativas, sin datos reales. Haga clic en cualquiera para ampliar.'
              }
            />
          </MotionSection>
          <MotionSection delay={0.1}>
            <SystemGallery locale={locale} onScreenshotClick={handleOpenScreenshot} />
          </MotionSection>
        </div>
      </section>

      <CTASection
        title={isEn ? 'Ready to build yours?' : '¿Quiere un sistema así para su negocio?'}
        subtitle={
          isEn
            ? 'Start with a commercial digital assessment. We show you how this system would look inside your operation.'
            : 'Empiece por una evaluación comercial digital y le mostramos cómo se vería la arquitectura Luma en su operación.'
        }
        primary={{
          label: isEn ? 'Request assessment' : 'Solicitar evaluación',
          href: isEn ? '/en/assessment' : '/diagnostico',
        }}
        secondary={{
          label: isEn ? 'View solutions' : 'Ver soluciones',
          href: isEn ? '/en/solutions' : '/soluciones',
        }}
      />

      <ProductScreenshotLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        currentId={activeScreenshotId || ''}
        screenshots={PRODUCT_SCREENSHOTS}
        locale={locale}
      />
    </>
  );
}
