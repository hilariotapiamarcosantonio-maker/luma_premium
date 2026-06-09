import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search, CalendarClock, Layers } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import { whatsappLink, SOCIALS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Solicite una evaluación, agende una conversación o envíe un mensaje. Luma Premium diseña sistemas comerciales digitales para negocios premium.',
  openGraph: {
    title: 'Contacto | Luma Premium',
    description: 'Solicite una evaluación o agende una conversación con Luma Premium.',
    type: 'website',
  },
};

const OPTIONS = [
  {
    icon: Search,
    title: 'Solicitar evaluación',
    description:
      'La forma seria de empezar. Revisamos su operación comercial y le recomendamos el sistema correcto.',
    cta: 'Ir al diagnóstico',
    href: '/diagnostico',
    primary: true,
  },
  {
    icon: MessageCircle,
    title: 'Enviar mensaje',
    description:
      'Hable directamente con Luma Premium por WhatsApp para resolver dudas rápidas.',
    cta: 'Escribir por WhatsApp',
    href: whatsappLink('Hola, me gustaría conversar sobre un sistema comercial de Luma Premium.'),
    external: true,
  },
  {
    icon: Layers,
    title: 'Ver solución recomendada',
    description:
      'Explore las líneas de solución y descubra cuál encaja con su negocio.',
    cta: 'Ver soluciones',
    href: '/soluciones',
  },
];

export default function ContactoPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">
            Contacto
          </PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Conversemos sobre su operación comercial.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Elija cómo prefiere empezar. Trabajamos con negocios premium que
            quieren vender con más autoridad, seguimiento y control.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {OPTIONS.map((opt) => {
            const isLink = !opt.external;
            const className = `group flex flex-col p-8 rounded-2xl border transition-colors ${
              opt.primary
                ? 'border-amber-500/30 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                : 'border-slate-800 bg-slate-900/20 hover:bg-slate-900/40'
            }`;
            const inner = (
              <>
                <opt.icon className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">
                  {opt.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  {opt.description}
                </p>
                <span className="inline-flex items-center gap-2 text-amber-500 text-sm font-medium">
                  {opt.cta} <ArrowRight className="w-4 h-4" />
                </span>
              </>
            );
            return isLink ? (
              <Link key={opt.title} href={opt.href} className={className}>
                {inner}
              </Link>
            ) : (
              <a
                key={opt.title}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            );
          })}
        </div>
      </section>

      {/* Redes oficiales */}
      <section className="pb-8 px-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/20 p-8 text-center">
          <p className="text-slate-300 font-medium mb-5">
            También puede seguir Luma Premium en sus redes oficiales.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-800 bg-slate-950/60 px-5 py-2.5 text-sm font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <CalendarClock className="w-6 h-6 text-amber-500" />
          <p className="text-slate-400">
            Respondemos solicitudes de operaciones premium en un plazo razonable
            de días laborables.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
