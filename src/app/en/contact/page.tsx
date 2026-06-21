import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search, Mail, Clock } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import EditorialFigure from '@/components/site/EditorialFigure';
import { whatsappLink, SOCIALS } from '@/lib/site';
import { EDITORIAL_IMAGES } from '@/data/marketing-images';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Request an assessment, start a conversation, or send a message. Luma Premium designs commercial digital systems for premium businesses.',
  alternates: {
    canonical: '/en/contact',
    languages: { 'es': '/contacto' },
  },
};

const OPTIONS = [
  {
    icon: Search,
    title: 'Request assessment',
    description: 'We evaluate your commercial operation and propose the ideal system. Receive a full technical report within 24–48 business hours.',
    cta: 'Start assessment',
    href: '/en/assessment',
    primary: true,
    guarantee: '24–48 b. hours',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Channel',
    description: 'Direct channel to connect with Luma Premium for quick questions or commercial inquiries. Response within 24–48 business hours.',
    cta: 'Chat on WhatsApp',
    href: whatsappLink('Hello, I would like to discuss a Luma Premium commercial system.'),
    external: true,
    guarantee: '24–48 b. hours',
  },
  {
    icon: Mail,
    title: 'Email Contact',
    description: 'Send us an email with your specific project requirements or custom technical specifications. Response within 24–48 business hours.',
    cta: 'Send email',
    href: 'mailto:contacto@lumapremium.com',
    external: true,
    guarantee: '24–48 b. hours',
  },
];

export default function EnContactPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <PremiumBadge tone="amber" className="mx-auto lg:mx-0">Contact</PremiumBadge>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Let us start the right way.
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              An assessment, a message, or a conversation. Choose the channel that works for you.
            </p>
            <p className="text-sm text-slate-500">
              We serve premium operations across Spanish- and English-speaking markets.
            </p>
          </div>
          <EditorialFigure
            image={EDITORIAL_IMAGES.contact}
            locale="en"
            priority
            aspect="aspect-[16/10]"
            caption="A serious conversation, no sales pressure"
          />
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {OPTIONS.map((opt) => (
            <div key={opt.title} className={`group relative p-8 rounded-2xl border transition-all duration-300 ${
              opt.primary
                ? 'border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-500/50 hover:bg-amber-500/[0.06] hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]'
                : 'border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-950/80'
            }`}>
              {/* Guarantee Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-2.5 py-0.5 text-[10px] text-slate-400">
                <Clock className="w-2.5 h-2.5 text-amber-500/70" />
                <span>{opt.guarantee}</span>
              </div>

              <opt.icon className="w-8 h-8 text-amber-500 mb-6" />
              <h2 className="text-lg font-semibold text-white mb-3">{opt.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{opt.description}</p>
              {opt.external ? (
                <a
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
                >
                  {opt.cta} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <Link href={opt.href} className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                  {opt.cta} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-12 border-t border-slate-900 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p>Follow us</p>
          <div className="flex gap-5">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
