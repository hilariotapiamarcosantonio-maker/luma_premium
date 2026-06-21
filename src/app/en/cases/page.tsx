import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import CasosPageClient from '@/components/site/CasosPageClient';
import { EN_CASES } from '@/lib/cases';

export const metadata: Metadata = {
  title: 'Cases & demos',
  description:
    'Authorized demos and commercial references of the Luma Premium architecture: Real Estate OS, CRM OS, Concierge OS, Commerce OS, and Beauty Spa OS.',
  alternates: {
    canonical: '/en/cases',
    languages: { 'es': '/casos' },
  },
};

export default function EnCasesPage() {
  return (
    <SiteShell>
      <CasosPageClient cases={EN_CASES} locale="en" />
    </SiteShell>
  );
}
