import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search, FileCheck, Route, Users, Clock, ShieldCheck } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import { whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Diagnóstico comercial digital',
  description:
    'Solicite una evaluación comercial digital. Revisamos su presencia, captación, seguimiento, WhatsApp, CRM y conversión, y le recomendamos el sistema correcto.',
  openGraph: {
    title: 'Diagnóstico comercial digital | Luma Premium',
    description:
      'Una entrada premium para negocios que ya venden o quieren vender mejor.',
    type: 'website',
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
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/luma-estate-os/diagnostico"
              className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              Solicitar evaluación <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={whatsappLink('Hola, quiero solicitar una evaluación comercial digital con Luma Premium.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
            </a>
          </div>

          {/* Meta info */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
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
      <section className="py-24 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Qué revisa Luma Premium
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="text-center mb-16">
            <PremiumBadge className="mb-4 mx-auto">Qué recibe</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              No es una llamada de ventas. Es una lectura ejecutiva.
            </h2>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6 bg-slate-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-12 md:p-20 shadow-2xl backdrop-blur-sm">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Empiece por entender, no por gastar.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-10">
            El diagnóstico es la forma seria de empezar. Primero entendemos su
            operación; luego diseñamos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/luma-estate-os/diagnostico"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-sm font-semibold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
            >
              Solicitar evaluación <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/soluciones"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-sm font-medium text-white border border-slate-700 hover:bg-slate-900 transition-colors"
            >
              Ver soluciones
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
