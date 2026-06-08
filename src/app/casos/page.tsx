import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import CaseCard from '@/components/site/CaseCard';
import CTASection from '@/components/site/CTASection';
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
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">
            Casos y referencias
          </PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Sistemas reales, no maquetas.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Demos y referencias autorizadas para ver la arquitectura Luma en
            funcionamiento. Cada una representa una línea de solución.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASES.map((item) => (
            <CaseCard key={item.url} item={item} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-10">
          <p className="text-xs text-slate-600 border border-slate-800/60 rounded-lg p-4 leading-relaxed">
            Demos públicas con fines demostrativos. Los entornos internos de
            operación y la sala de ventas no se exponen aquí.
          </p>
        </div>
      </section>

      <CTASection
        title="¿Quiere un sistema así para su negocio?"
        subtitle="Empiece por una evaluación comercial digital y le mostramos cómo se vería la arquitectura Luma en su operación."
        primary={{ label: 'Solicitar evaluación', href: '/diagnostico' }}
        secondary={{ label: 'Ver soluciones', href: '/soluciones' }}
      />
    </SiteShell>
  );
}
