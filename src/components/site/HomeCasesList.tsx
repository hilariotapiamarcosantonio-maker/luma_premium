'use client';

import React from 'react';
import CaseCard from './CaseCard';
import { useLightbox } from './HomeScreenshotShowcase';
import type { CaseItem } from '@/lib/cases';
import { MotionStagger, MotionItem } from './Motion';

export default function HomeCasesList({
  cases,
  locale = 'es',
}: {
  cases: CaseItem[];
  locale?: 'es' | 'en';
}) {
  const { openLightbox } = useLightbox();

  return (
    <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((item) => (
        <MotionItem key={item.url} className="h-full">
          <CaseCard item={item} onScreenshotClick={openLightbox} locale={locale} />
        </MotionItem>
      ))}
    </MotionStagger>
  );
}
