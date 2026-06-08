import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Stethoscope } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import SectionHeading from '@/components/site/SectionHeading';
import SolutionCard from '@/components/site/SolutionCard';
import PremiumBadge from '@/components/site/PremiumBadge';
import CTASection from '@/components/site/CTASection';
import { SOLUTIONS } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Soluciones',
  description:
    'Líneas de solución Luma Premium: Real Estate OS, CRM OS, Concierge OS, Commerce OS y Beauty Spa OS. Un sistema comercial por nicho.',
  openGraph: {
    title: 'Soluciones | Luma Premium',
    description: 'Un sistema comercial premium por nicho, no una landing genérica.',
    type: 'website',
  },
};

export default function SolucionesPage() {
  return (
    <SiteShell>
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">
            Líneas de solución
          </PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Cada negocio premium necesita su propio sistema comercial.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            No vendemos páginas web. Diseñamos infraestructura de captación,
            respuesta, organización y conversión por vertical.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}

          {/* Tarjeta especial: Diagnóstico / Luma Intelligence */}
          <Link
            href="/diagnostico"
            className="group flex flex-col p-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-amber-500/30 bg-slate-950">
                <Stethoscope className="w-6 h-6 text-amber-500" />
              </span>
              <ArrowRight className="w-5 h-5 text-amber-500/70 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-amber-500/80 mb-2">
              Diagnóstico · Luma Intelligence
            </p>
            <h3 className="text-xl font-bold text-white mb-3">
              No sabe qué sistema necesita
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
              Solicite una evaluación comercial digital. Revisamos su operación y
              le recomendamos la arquitectura correcta antes de invertir.
            </p>
            <span className="inline-flex items-center gap-2 text-amber-500 text-sm font-medium">
              Solicitar evaluación <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            center
            title="¿Cómo elegir?"
            subtitle="Cada solución responde rápido a cuatro preguntas: qué es, para quién es, qué problema resuelve y qué siguiente paso pedir. Si no está seguro, empiece por el diagnóstico."
          />
        </div>
      </section>

      <CTASection
        title="¿No sabe por dónde empezar?"
        subtitle="El diagnóstico comercial es la entrada. Revisamos su captación y seguimiento, y le decimos exactamente qué sistema le conviene."
        primary={{ label: 'Solicitar evaluación', href: '/diagnostico' }}
        secondary={{ label: 'Ver el método', href: '/metodo' }}
      />
    </SiteShell>
  );
}
