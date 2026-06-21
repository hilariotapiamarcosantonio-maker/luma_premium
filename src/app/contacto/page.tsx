import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search, CalendarClock, Mail, Clock } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import EditorialFigure from '@/components/site/EditorialFigure';
import { whatsappLink, SOCIALS } from '@/lib/site';
import { EDITORIAL_IMAGES } from '@/data/marketing-images';

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
    title: 'Solicitar diagnóstico',
    description:
      'Evaluamos su operación comercial y le proponemos el sistema ideal. Reciba un informe técnico completo.',
    cta: 'Iniciar evaluación',
    href: '/diagnostico',
    primary: true,
    guarantee: '24–48 h laborables',
  },
  {
    icon: MessageCircle,
    title: 'Canal de WhatsApp',
    description:
      'Hable de forma directa con Luma Premium para consultas rápidas o dudas comerciales.',
    cta: 'Chat por WhatsApp',
    href: whatsappLink('Hola, me gustaría conversar sobre un sistema comercial de Luma Premium.'),
    external: true,
    guarantee: '< 2 horas laborables',
  },
  {
    icon: Mail,
    title: 'Correo Electrónico',
    description:
      'Envíenos un correo con los requerimientos específicos o especificaciones de su proyecto.',
    cta: 'Enviar correo',
    href: 'mailto:hola@sistema.luma',
    external: true,
    guarantee: '< 12 horas laborables',
  },
];

export default function ContactoPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <PremiumBadge tone="amber" className="mx-auto lg:mx-0">
              Contacto
            </PremiumBadge>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Conversemos sobre su operación comercial.
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Elija cómo prefiere empezar. Trabajamos con negocios premium que
              quieren vender con más autoridad, seguimiento y control.
            </p>
            <p className="text-sm text-slate-500">
              Atendemos operaciones premium en mercados de habla hispana e inglesa.
            </p>
          </div>
          <EditorialFigure
            image={EDITORIAL_IMAGES.contact}
            locale="es"
            priority
            aspect="aspect-[16/10]"
            caption="Una conversación seria, sin presión de venta"
          />
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {OPTIONS.map((opt) => {
            const isLink = !opt.external;
            const className = `group relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
              opt.primary
                ? 'border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-500/50 hover:bg-amber-500/[0.06] hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]'
                : 'border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-950/80'
            }`;
            const inner = (
              <>
                {/* Guarantee Badge */}
                <div className="absolute top-6 right-6 flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-2.5 py-0.5 text-[10px] text-slate-400">
                  <Clock className="w-2.5 h-2.5 text-amber-500/70" />
                  <span>{opt.guarantee}</span>
                </div>

                <opt.icon className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">
                  {opt.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                  {opt.description}
                </p>
                <span className="inline-flex items-center gap-2 text-amber-500 text-sm font-medium">
                  {opt.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
