import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import CasosPageClient from '@/components/site/CasosPageClient';
import { CASES } from '@/lib/cases';

export const metadata: Metadata = {
  title: 'Casos y demos',
  description:
    'Demos y referencias autorizadas de la arquitectura Luma Premium: Real Estate OS, CRM OS, Concierge OS, Commerce OS y Beauty Spa OS.',
  openGraph: {
    title: 'Casos y demos | Luma Premium',
    description: 'Sistemas reales construidos con la arquitectura Luma Premium.',
    type: 'website',
  },
};

export default function CasosPage() {
  return (
    <SiteShell>
      <CasosPageClient cases={CASES} locale="es" />
    </SiteShell>
  );
}
