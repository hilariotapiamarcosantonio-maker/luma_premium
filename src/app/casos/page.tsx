import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import CaseCard from '@/components/site/CaseCard';
import CTASection from '@/components/site/CTASection';
import SystemGallery from '@/components/site/SystemGallery';
import SectionHeading from '@/components/site/SectionHeading';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
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

      {/* Franja de autoridad */}
      <section className="pb-12 px-6">
        <MotionSection className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 md:p-8 text-center">
            <p className="text-lg md:text-xl text-white font-medium leading-snug">
              Demos oficiales y referencias comerciales seleccionadas.
            </p>
            <p className="text-slate-400 mt-2">
              No mostramos teoría. Mostramos arquitectura en funcionamiento.
            </p>
          </div>
        </MotionSection>
      </section>

      <section className="pb-24 px-6">
        <MotionStagger className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASES.map((item) => (
            <MotionItem key={item.url} className="h-full">
              <CaseCard item={item} />
            </MotionItem>
          ))}
        </MotionStagger>
        <div className="max-w-7xl mx-auto mt-10">
          <p className="text-xs text-slate-600 border border-slate-800/60 rounded-lg p-4 leading-relaxed">
            Demos públicas con fines demostrativos. Las referencias comerciales y la
            autoridad del fundador se muestran como tales. Los entornos internos de
            operación y la sala de ventas no se exponen aquí.
          </p>
        </div>
      </section>

      {/* Dentro del sistema */}
      <section className="py-20 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-12">
            <SectionHeading
              badge="Dentro del sistema"
              title="Así se ve la operación por dentro."
              subtitle="Representación de los módulos que componen una arquitectura Luma: control, pipeline, concierge, catálogo y más. Vistas ilustrativas, sin datos reales."
            />
          </MotionSection>
          <MotionSection delay={0.1}>
            <SystemGallery locale="es" />
          </MotionSection>
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
