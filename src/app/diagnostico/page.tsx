import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Search, FileCheck, Route, Users, Clock, ShieldCheck } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import DiagnosticoMaestroForm from '@/components/diagnostico/DiagnosticoMaestroForm';

export const metadata: Metadata = {
  title: 'Diagnóstico comercial digital',
  description:
    'Solicite una evaluación comercial digital. Revisamos su presencia, captación, seguimiento, CRM y conversión, y le recomendamos el sistema correcto para su operación.',
  openGraph: {
    title: 'Diagnóstico comercial digital | Luma Premium',
    description:
      'Una entrada premium para negocios que ya venden o quieren vender mejor.',
    type: 'website',
  },
  alternates: {
    canonical: '/diagnostico',
    languages: { 'en': '/en/assessment' },
  },
};

const REVISA = [
  'Presencia digital',
  'Captación de oportunidades',
  'Seguimiento comercial',
  'WhatsApp y redes',
  'CRM y organización',
  'Conversión',
  'Autoridad de marca',
];

const RECIBE = [
  {
    icon: Search,
    title: 'Observación inicial',
    description:
      'Una lectura ejecutiva de dónde se pierde demanda y dónde hay fricción comercial.',
  },
  {
    icon: FileCheck,
    title: 'Recomendación de sistema',
    description:
      'Qué solución Luma encaja con su operación y por qué, sin venderle de más.',
  },
  {
    icon: Route,
    title: 'Ruta de implementación',
    description:
      'Un camino claro por fases para pasar del desorden a una operación medible.',
  },
];

export default function DiagnosticoPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">
            Entrada premium · Diagnóstico
          </PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Solicite una evaluación comercial digital.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Para negocios premium que ya venden o quieren vender mejor. Revisamos
            su operación comercial y le decimos exactamente qué sistema necesita.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            {[
              { icon: Users, text: 'Para dueños y directivos' },
              { icon: Clock, text: 'Revisión inicial en 24–48 h' },
              { icon: ShieldCheck, text: 'Sin compromiso de venta' },
            ].map((m) => (
              <span key={m.text} className="inline-flex items-center gap-2">
                <m.icon className="w-3.5 h-3.5 text-amber-500/70" />
                {m.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Qué revisa Luma Premium */}
      <section className="py-16 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
              Qué revisa Luma Premium
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              Una mirada completa a su operación comercial, no solo a su sitio web.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {REVISA.map((item) => (
              <span
                key={item}
                className="px-5 py-3 rounded-full border border-slate-800 bg-slate-900/30 text-slate-300 text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Qué recibe el prospecto */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="text-center mb-14">
            <PremiumBadge className="mb-4 mx-auto">Qué recibe</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              No es una llamada de ventas. Es una lectura ejecutiva.
            </h2>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-3 gap-6 mb-20">
            {RECIBE.map((item) => (
              <MotionItem
                key={item.title}
                className="h-full p-8 rounded-2xl border border-slate-800 bg-slate-900/20"
              >
                <item.icon className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </MotionItem>
            ))}
          </MotionStagger>

          {/* ── Formulario maestro integrado ── */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Complete su solicitud
              </h2>
              <p className="text-slate-400 text-base">
                Tres pasos. Menos de cuatro minutos. Revisamos y respondemos en 24–48 h.
              </p>
            </div>
            <Suspense>
              <DiagnosticoMaestroForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-slate-950 text-center">
        <div className="max-w-2xl mx-auto space-y-3 text-slate-500 text-sm">
          <p>¿Prefiere hablar primero?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/18492122647?text=Hola%2C+quiero+solicitar+una+evaluaci%C3%B3n+comercial+con+Luma+Premium."
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors underline underline-offset-4"
            >
              WhatsApp
            </a>
            <span className="text-slate-700">·</span>
            <Link href="/soluciones" className="text-slate-300 hover:text-white transition-colors underline underline-offset-4">
              Ver soluciones
            </Link>
            <span className="text-slate-700">·</span>
            <Link href="/casos" className="text-slate-300 hover:text-white transition-colors underline underline-offset-4">
              Ver casos
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
