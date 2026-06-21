import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import HomeContent from '@/components/site/HomeContent';

export const metadata: Metadata = {
  title: {
    absolute: 'Luma Premium | Arquitectura comercial digital para negocios premium',
  },
  description:
    'Sistemas comerciales digitales para negocios premium que necesitan captar, responder, organizar y convertir oportunidades con más autoridad, seguimiento y control.',
  openGraph: {
    title: 'Luma Premium | Arquitectura comercial digital',
    description:
      'Sistemas comerciales digitales para negocios premium que venden con autoridad, seguimiento y control.',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function HomePage() {
  return (
    <SiteShell>
      <HomeContent locale="es" />
    </SiteShell>
  );
}
