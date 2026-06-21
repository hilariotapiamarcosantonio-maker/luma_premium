import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Search, FileCheck, Route, Users, Clock, ShieldCheck } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import DiagnosticMatrix from '@/components/site/DiagnosticMatrix';
import EditorialFigure from '@/components/site/EditorialFigure';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import DiagnosticoMaestroForm from '@/components/diagnostico/DiagnosticoMaestroForm';
import { EDITORIAL_IMAGES } from '@/data/marketing-images';

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
          <div className="max-w-3xl mx-auto pt-8">
            <EditorialFigure
              image={EDITORIAL_IMAGES.diagnostic}
              locale="es"
              priority
              aspect="aspect-[2/1]"
              caption="Lectura ejecutiva, no una llamada de ventas"
            />
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
          <DiagnosticMatrix locale="es" />
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

          {/* ── Cómo funciona el Diagnóstico ── */}
          <div className="max-w-5xl mx-auto mt-20 pt-16 border-t border-slate-900">
            <div className="text-center mb-12">
              <PremiumBadge tone="amber" className="mb-3 mx-auto">El Proceso</PremiumBadge>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Cómo funciona la evaluación
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
                Un proceso directo y confidencial en tres etapas para determinar la solución ideal para su negocio.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Line connector */}
              <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-amber-500/10 via-amber-500/30 to-amber-500/10 -z-10" />
              
              {[
                {
                  step: "01",
                  title: "Formulario Técnico",
                  desc: "Complete las preguntas sobre su operación actual, volumen de leads y herramientas comerciales."
                },
                {
                  step: "02",
                  title: "Análisis Confidencial",
                  desc: "Evaluamos de forma interna sus flujos públicos de venta y detectamos las principales fricciones."
                },
                {
                  step: "03",
                  title: "Entrega Ejecutiva",
                  desc: "Reciba en su correo la propuesta de arquitectura ideal y recomendaciones técnicas en 24–48 horas laborables."
                }
              ].map((p, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl border border-slate-900 bg-slate-950/80 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                    Paso {p.step}
                  </span>
                  <h3 className="text-base font-semibold text-white">{p.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Formulario maestro integrado con borde amber glow ── */}
          <div className="max-w-3xl mx-auto mt-20 relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/10 to-amber-600/5 rounded-3xl blur-xl opacity-75 -z-10" />
            
            <div className="relative p-8 md:p-10 rounded-2xl border border-amber-500/20 bg-slate-950 shadow-[0_0_50px_rgba(245,158,11,0.03)]">
              {/* Badge indicativo de seguridad y expectativa */}
              <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 border-b border-slate-900 pb-6 mb-8 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Conexión segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500/80" />
                  <span>Respuesta en 24–48 horas laborables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Información tratada de forma confidencial</span>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                  Complete su solicitud
                </h2>
                <p className="text-slate-400 text-sm">
                  Evaluación técnica confidencial. Responderemos dentro de 24–48 horas laborables.
                </p>
              </div>

              <Suspense fallback={<div className="text-center py-10 text-slate-500">Cargando formulario...</div>}>
                <DiagnosticoMaestroForm locale="es" />
              </Suspense>
            </div>
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
