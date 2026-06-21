import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, Layers, ShieldCheck } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import SectionHeading from '@/components/site/SectionHeading';
import SolutionCard from '@/components/site/SolutionCard';
import HomeCasesSection from '@/components/site/HomeCasesSection';
import CTASection from '@/components/site/CTASection';
import PremiumBadge from '@/components/site/PremiumBadge';
import HeroComposition from '@/components/site/HeroComposition';
import CommercialFlowBand from '@/components/site/CommercialFlowBand';
import EcosystemLayers from '@/components/site/EcosystemLayers';
import IndustriesSection from '@/components/site/IndustriesSection';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import { SOLUTIONS } from '@/lib/solutions';
import { SITE } from '@/lib/site';

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
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_rgba(30,41,59,0.5),_transparent_70%)] -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-12 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left space-y-7">
            <PremiumBadge pulse tone="amber" className="mx-auto lg:mx-0">
              Firma de arquitectura comercial digital
            </PremiumBadge>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              Sistemas comerciales{' '}
              <span className="text-slate-400">para vender con autoridad.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {SITE.tagline}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
              <Link
                href="/diagnostico"
                className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                Solicitar evaluación <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/soluciones"
                className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center"
              >
                Ver soluciones
              </Link>
            </div>
          </div>

          {/* Composición de producto premium */}
          <div className="relative pb-10 lg:pb-0">
            <HeroComposition locale="es" />
          </div>
        </div>
      </section>

      {/* Promesa / frase guía */}
      <section className="py-20 px-6 border-y border-slate-800/40 bg-slate-950/40">
        <MotionSection className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white leading-snug">
            Luma Premium no es una agencia digital. Es una firma que diseña la
            <span className="text-amber-500"> infraestructura comercial</span> con la
            que un negocio premium capta, responde, organiza y convierte.
          </h2>
        </MotionSection>
      </section>

      {/* Problema */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <MotionSection>
            <SectionHeading
              badge="El problema"
              title="Presencia digital fuerte, operación comercial desordenada."
              subtitle="Muchos negocios premium ya invierten en marca y publicidad, pero su operación comercial vive en chats sueltos, hojas de cálculo y seguimiento improvisado. La demanda existe; lo que falta es el sistema."
            />
          </MotionSection>
          <MotionStagger className="grid sm:grid-cols-2 gap-4">
            {[
              'Leads que llegan y se enfrían sin respuesta a tiempo.',
              'No se sabe qué campaña generó qué venta.',
              'El seguimiento depende de la memoria de cada persona.',
              'La marca se ve premium, pero la venta se siente amateur.',
            ].map((item) => (
              <MotionItem
                key={item}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mb-4" />
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Qué hace Luma Premium */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-gradient-to-b from-slate-900/20 to-blue-950/10">
        <div className="max-w-7xl mx-auto">
          <MotionSection>
            <SectionHeading
              center
              badge="Qué hace Luma Premium"
              title="Diseñamos el sistema, no solo la página."
              subtitle="Cada solución es una arquitectura comercial completa: presentación, captación, respuesta, organización y conversión, conectadas en un mismo flujo."
              className="mb-16"
            />
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-3 gap-6">
            {/* Pilar 1: Captar */}
            <MotionItem className="flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-950/80 h-full justify-between overflow-hidden relative group hover:border-amber-500/20 transition-all duration-300">
              <div>
                <Compass className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-3">Captar con autoridad</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Presentación premium y rutas comerciales que atraen al perfil correcto desde cada campaña.
                </p>
              </div>
              {/* Micro UI: Mock Ad Preview */}
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-[10px] space-y-2.5 transition-colors group-hover:border-slate-700">
                <div className="flex items-center gap-2 border-b border-slate-800/60 pb-2">
                  <span className="h-5 w-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-[8px]">L</span>
                  <div>
                    <span className="block font-semibold text-white leading-none">Luma Estate OS</span>
                    <span className="text-[7px] text-slate-500">Sponsored</span>
                  </div>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950/60 p-2 text-slate-400 font-sans">
                  <span className="block font-medium text-white mb-1">Villa Esmeralda - Punta Cana</span>
                  <span className="block text-[8px] leading-tight text-slate-500">Rutas comerciales segmentadas para inversores y segunda vivienda.</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/30 p-2 rounded">
                  <span className="text-[8px] font-mono text-slate-500">luma-estate.com/punta-cana</span>
                  <span className="bg-white text-slate-950 px-2 py-0.5 rounded-sm font-semibold text-[8px]">Ver proyecto</span>
                </div>
              </div>
            </MotionItem>

            {/* Pilar 2: Responder */}
            <MotionItem className="flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-950/80 h-full justify-between overflow-hidden relative group hover:border-amber-500/20 transition-all duration-300">
              <div>
                <Layers className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-3">Responder y organizar</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Concierge, seguimiento y un centro de control donde ningún prospecto se pierde.
                </p>
              </div>
              {/* Micro UI: Mock Chat qualifier */}
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-[10px] space-y-2.5 transition-colors group-hover:border-slate-700">
                <div className="space-y-2">
                  <div className="max-w-[85%] rounded bg-slate-950/80 border border-slate-800 p-2 text-slate-300">
                    ¿Prefiere financiamiento o pago al contado?
                  </div>
                  <div className="ml-auto max-w-[85%] rounded bg-amber-500/10 border border-amber-500/20 p-2 text-amber-400">
                    Contado, busco retorno inmediato.
                  </div>
                  <div className="flex items-center gap-1.5 justify-center py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-semibold">
                    <span>Intención: Inversor • Cash Buyer</span>
                  </div>
                </div>
              </div>
            </MotionItem>

            {/* Pilar 3: Convertir */}
            <MotionItem className="flex flex-col p-8 rounded-2xl border border-slate-800 bg-slate-950/80 h-full justify-between overflow-hidden relative group hover:border-amber-500/20 transition-all duration-300">
              <div>
                <ShieldCheck className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-3">Convertir con control</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Trazabilidad de punta a punta: menos improvisación, decisiones con datos reales.
                </p>
              </div>
              {/* Micro UI: Mock charts */}
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-[10px] space-y-2.5 transition-colors group-hover:border-slate-700">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950/60 rounded border border-slate-800 p-1.5">
                    <span className="block text-[8px] text-slate-500 uppercase">Tasa Conversión</span>
                    <span className="block font-bold text-emerald-400">14.8%</span>
                  </div>
                  <div className="bg-slate-950/60 rounded border border-slate-800 p-1.5">
                    <span className="block text-[8px] text-slate-500 uppercase">Leads Atendidos</span>
                    <span className="block font-bold text-white">100%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>Atribución Campañas</span>
                    <span className="text-slate-300">76% ROI</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded overflow-hidden">
                    <div className="h-full w-[76%] bg-amber-500 rounded" />
                  </div>
                </div>
              </div>
            </MotionItem>
          </MotionStagger>
        </div>
      </section>

      {/* Flujo comercial conectado */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-10 max-w-2xl">
            <SectionHeading
              badge="El flujo"
              title="De la captación a la operación, en un solo sistema."
              subtitle="Cada etapa alimenta a la siguiente. No es una página suelta: es un flujo comercial conectado donde nada se pierde por el camino."
            />
          </MotionSection>
          <MotionSection delay={0.1}>
            <CommercialFlowBand locale="es" />
          </MotionSection>
        </div>
      </section>

      {/* Soluciones */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <SectionHeading
              badge="Líneas de solución"
              title="Un sistema por nicho, no una landing genérica."
              subtitle="Cada línea resuelve un dolor comercial concreto y tiene su propia ruta de venta."
            />
            <Link
              href="/soluciones"
              className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Ver todas las soluciones <ArrowRight className="w-4 h-4" />
            </Link>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((s) => (
              <MotionItem key={s.slug} className="h-full">
                <SolutionCard solution={s} />
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Sectores atendidos */}
      <IndustriesSection locale="es" />

      {/* Ecosistema Luma Premium */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionSection>
            <PremiumBadge className="mb-4">Ecosistema Luma Premium</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-6">
              No construimos piezas sueltas. <br />
              Diseñamos ecosistemas comerciales por vertical.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Captación, respuesta, seguimiento y conversión en un mismo ecosistema.
              Cada capa sostiene una consecuencia comercial: de la presencia digital
              al control comercial.
            </p>
            <p className="text-slate-300 font-medium">
              Cada negocio premium necesita su propia arquitectura comercial.
            </p>
          </MotionSection>
          <MotionSection delay={0.1}>
            <EcosystemLayers />
          </MotionSection>
        </div>
      </section>

      {/* Método (preview) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionSection>
            <SectionHeading
              badge="Método"
              title="Un proceso consultivo que justifica una implementación seria."
              subtitle="Diagnóstico, arquitectura, diseño, implementación, entrega y optimización. No improvisamos: diseñamos antes de construir."
            />
          </MotionSection>
          <MotionStagger className="space-y-4">
            {[
              'Diagnóstico comercial',
              'Arquitectura de solución',
              'Diseño de experiencia',
              'Implementación y entrega',
            ].map((step, i) => (
              <MotionItem
                key={step}
                className="flex items-center gap-4 p-5 rounded-xl border border-slate-800 bg-slate-950"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/40 text-amber-500 text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-300 font-medium">{step}</span>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
        <div className="max-w-7xl mx-auto mt-8 lg:text-right">
          <Link
            href="/metodo"
            className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors"
          >
            Ver el método completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Casos / demos */}
      <HomeCasesSection />

      {/* CTA */}
      <CTASection
        title="Solicite una evaluación comercial digital."
        subtitle="Analizamos su captación, seguimiento y conversión actual, y le recomendamos el sistema correcto para vender con más autoridad y control."
        primary={{ label: 'Solicitar evaluación', href: '/diagnostico' }}
        secondary={{ label: 'Ver soluciones', href: '/soluciones' }}
        footnote="Para negocios premium que ya venden o quieren vender mejor."
      />
    </SiteShell>
  );
}
