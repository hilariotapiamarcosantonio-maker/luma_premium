import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ExternalLink, Check } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import CTASection from '@/components/site/CTASection';
import FlowDiagram from '@/components/site/FlowDiagram';
import { Icon } from '@/components/site/Icon';
import { MotionSection } from '@/components/site/Motion';
import { getSolution, SOLUTION_SLUGS, SOLUTIONS } from '@/lib/solutions';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return { title: 'Solución' };
  return {
    title: solution.name,
    description: solution.positioning,
    openGraph: {
      title: `${solution.name} | Luma Premium`,
      description: solution.positioning,
      type: 'website',
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  // Soluciones relacionadas (mismo nicho o resto), máximo 3.
  const related = SOLUTIONS.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto">
          <Link
            href="/soluciones"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium mb-8 inline-block"
          >
            &larr; Todas las soluciones
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-slate-800 bg-slate-900">
              <Icon name={solution.icon} className="w-7 h-7 text-amber-500" />
            </span>
            <PremiumBadge tone="amber">{solution.kicker}</PremiumBadge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            {solution.name}
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl">
            {solution.positioning}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/diagnostico"
              className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              Solicitar evaluación <ArrowRight className="w-4 h-4" />
            </Link>
            {solution.internalUrl && (
              <Link
                href={solution.internalUrl}
                className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                Ver experiencia completa <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {solution.demoUrl && (
              <a
                href={solution.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                Ver demo <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="py-20 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              El problema
            </span>
          </div>
          <p className="text-2xl md:text-3xl text-white font-medium leading-snug">
            {solution.problem}
          </p>
        </div>
      </section>

      {/* Flujo comercial (diagrama visual) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection>
            <PremiumBadge className="mb-4">Flujo comercial de la solución</PremiumBadge>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
              Así fluye una oportunidad dentro del sistema.
            </h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 md:p-8 overflow-x-auto">
              <FlowDiagram steps={solution.commercialFlow} />
            </div>
          </MotionSection>
        </div>
      </section>

      {/* Qué construye el sistema */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <PremiumBadge className="mb-4">Qué entrega el sistema</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Una arquitectura comercial, no una página suelta.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {solution.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors"
              >
                <Icon name={cap.icon} className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">
                  {cap.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flujo comercial */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <PremiumBadge className="mb-4">El recorrido del prospecto</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Del anuncio al cierre, sin perder el control.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solution.flow.map((step, i) => (
              <div
                key={step.label}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-950 relative"
              >
                <span className="text-amber-500 font-bold text-sm">
                  0{i + 1}
                </span>
                <h3 className="text-white font-semibold mt-2 mb-2">
                  {step.label}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién + siguiente paso */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="p-10 rounded-2xl border border-slate-800 bg-slate-900/20">
            <h3 className="text-xl font-bold text-white mb-6">Para quién es</h3>
            <p className="text-slate-300 leading-relaxed mb-8">
              {solution.forWho}
            </p>
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
              Lo que resuelve
            </h4>
            <ul className="space-y-3">
              {[solution.pain, solution.delivers].map((line) => (
                <li key={line} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-10 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Siguiente paso</h3>
            <p className="text-slate-300 leading-relaxed mb-8 flex-1">
              {solution.salesNextStep}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/diagnostico"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-6 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Solicitar evaluación <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm font-medium text-white border border-slate-700 hover:bg-slate-900 transition-colors"
              >
                Hablar con Luma Premium
              </Link>
            </div>
          </div>
        </div>

        {solution.disclaimer && (
          <div className="max-w-7xl mx-auto mt-8">
            <p className="text-xs text-slate-600 border border-slate-800/60 rounded-lg p-4 leading-relaxed">
              {solution.disclaimer}
            </p>
          </div>
        )}
      </section>

      {/* Relacionadas */}
      <section className="py-20 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10">Otras soluciones</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/soluciones/${s.slug}`}
                className="group flex items-center justify-between gap-4 p-6 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Icon name={s.icon} className="w-6 h-6 text-amber-500 shrink-0" />
                  <span className="text-white font-medium text-sm">{s.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`¿Listo para implementar ${solution.name}?`}
        subtitle="Empiece por una evaluación comercial digital. Le mostramos cómo se vería este sistema en su operación."
        primary={{ label: 'Solicitar evaluación', href: '/diagnostico' }}
        secondary={{ label: 'Ver casos y demos', href: '/casos' }}
      />
    </SiteShell>
  );
}
