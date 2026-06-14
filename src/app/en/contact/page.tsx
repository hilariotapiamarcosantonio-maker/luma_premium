import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Search, Layers } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import { whatsappLink, SOCIALS } from '@/lib/site';

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
    description: 'The serious way to begin. We review your commercial operation and recommend the right system.',
    cta: 'Go to assessment',
    href: '/en/assessment',
    primary: true,
  },
  {
    icon: MessageCircle,
    title: 'Send a message',
    description: 'Reach Luma Premium directly via WhatsApp for quick questions.',
    cta: 'Write on WhatsApp',
    href: whatsappLink('Hello, I would like to discuss a Luma Premium commercial system.'),
    external: true,
  },
  {
    icon: Layers,
    title: 'See our solutions',
    description: 'Browse our solution lines and find the one that fits your operation.',
    cta: 'View solutions',
    href: '/en/solutions',
    primary: false,
  },
];

export default function EnContactPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">Contact</PremiumBadge>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            Let us start the right way.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            An assessment, a message, or a conversation. Choose the channel that works for you.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {OPTIONS.map((opt) => (
            <div key={opt.title} className={`p-8 rounded-2xl border transition-all ${
              opt.primary
                ? 'border-white/20 bg-white/5'
                : 'border-slate-800 bg-slate-900/20'
            }`}>
              <opt.icon className="w-8 h-8 text-amber-500 mb-6" />
              <h2 className="text-lg font-semibold text-white mb-3">{opt.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{opt.description}</p>
              {opt.external ? (
                <a
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-amber-400 transition-colors"
                >
                  {opt.cta} <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link href={opt.href} className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-amber-400 transition-colors">
                  {opt.cta} <ArrowRight className="w-3.5 h-3.5" />
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
