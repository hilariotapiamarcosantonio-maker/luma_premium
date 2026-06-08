import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Layers, Compass } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import SectionHeading from '@/components/site/SectionHeading';
import SolutionCard from '@/components/site/SolutionCard';
import CaseCard from '@/components/site/CaseCard';
import CTASection from '@/components/site/CTASection';
import PremiumBadge from '@/components/site/PremiumBadge';
import { SOLUTIONS } from '@/lib/solutions';
import { CASES } from '@/lib/cases';
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

const PILLARS = [
  {
    icon: Compass,
    title: 'Captar con autoridad',
    description:
      'Presentación premium y rutas comerciales que atraen al perfil correcto desde cada campaña.',
  },
  {
    icon: Layers,
    title: 'Responder y organizar',
    description:
      'Concierge, seguimiento y un centro de control donde ningún prospecto se pierde.',
  },
  {
    icon: ShieldCheck,
    title: 'Convertir con control',
    description:
      'Trazabilidad de punta a punta: menos improvisación, decisiones con datos reales.',
  },
];

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-7">
          <PremiumBadge pulse tone="amber" className="mx-auto">
            Firma de arquitectura comercial digital
          </PremiumBadge>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
            Sistemas comerciales <br className="hidden md:block" />
            <span className="text-slate-400">para vender con autoridad.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            {SITE.tagline}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </section>

      {/* Promesa / frase guía */}
      <section className="py-20 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white leading-snug">
            Luma Premium no es una agencia digital. Es una firma que diseña la
            <span className="text-amber-500"> infraestructura comercial</span> con la
            que un negocio premium capta, responde, organiza y convierte.
          </h2>
        </div>
      </section>

      {/* Problema */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <SectionHeading
            badge="El problema"
            title="Presencia digital fuerte, operación comercial desordenada."
            subtitle="Muchos negocios premium ya invierten en marca y publicidad, pero su operación comercial vive en chats sueltos, hojas de cálculo y seguimiento improvisado. La demanda existe; lo que falta es el sistema."
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Leads que llegan y se enfrían sin respuesta a tiempo.',
              'No se sabe qué campaña generó qué venta.',
              'El seguimiento depende de la memoria de cada persona.',
              'La marca se ve premium, pero la venta se siente amateur.',
            ].map((item) => (
              <div
                key={item}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mb-4" />
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué hace Luma Premium */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            center
            badge="Qué hace Luma Premium"
            title="Diseñamos el sistema, no solo la página."
            subtitle="Cada solución es una arquitectura comercial completa: presentación, captación, respuesta, organización y conversión, conectadas en un mismo flujo."
            className="mb-16"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="p-8 rounded-2xl border border-slate-800 bg-slate-950"
              >
                <p.icon className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Soluciones */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
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
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((s) => (
              <SolutionCard key={s.slug} solution={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Método (preview) */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <SectionHeading
            badge="Método"
            title="Un proceso consultivo que justifica una implementación seria."
            subtitle="Diagnóstico, arquitectura, diseño, implementación, entrega y optimización. No improvisamos: diseñamos antes de construir."
          />
          <div className="space-y-4">
            {[
              'Diagnóstico comercial',
              'Arquitectura de solución',
              'Diseño de experiencia',
              'Implementación y entrega',
            ].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-4 p-5 rounded-xl border border-slate-800 bg-slate-950"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/40 text-amber-500 text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-300 font-medium">{step}</span>
              </div>
            ))}
            <Link
              href="/metodo"
              className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors pt-2"
            >
              Ver el método completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Casos / demos */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <SectionHeading
              badge="Casos y demos"
              title="Sistemas reales, no maquetas."
              subtitle="Referencias autorizadas para ver la arquitectura Luma en funcionamiento."
            />
            <Link
              href="/casos"
              className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Ver todos los casos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASES.slice(0, 3).map((item) => (
              <CaseCard key={item.url} item={item} />
            ))}
          </div>
        </div>
      </section>

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
