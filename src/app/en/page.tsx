import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import { whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Commercial Digital Architecture',
  description:
    'Commercial digital systems built to capture, qualify, and convert high-value opportunities. From digital presence to commercial control.',
  alternates: {
    canonical: '/en',
    languages: { 'es': '/' },
  },
};

const PILLARS = [
  {
    title: 'Capture',
    description: 'Premium digital presence that positions, qualifies, and converts before the first call.',
  },
  {
    title: 'Respond',
    description: 'Intelligent concierge that handles inquiries with speed, consistency, and commercial authority.',
  },
  {
    title: 'Organize',
    description: 'CRM and commercial control so nothing slips through and follow-up is disciplined.',
  },
  {
    title: 'Convert',
    description: 'Automated follow-up sequences and presentation systems built to close high-ticket deals.',
  },
];

export default function EnHomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-5xl mx-auto text-center space-y-7">
          <PremiumBadge tone="amber" className="mx-auto">
            Commercial Digital Architecture
          </PremiumBadge>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
            From digital presence<br />
            <span className="text-slate-400 font-light">to commercial control.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            We design connected commercial infrastructure for premium businesses
            that sell through trust, speed, and disciplined follow-up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/en/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-sm font-semibold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
            >
              Request assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={whatsappLink('Hello, I want to request a commercial assessment with Luma Premium.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Positioning line */}
      <section className="py-16 px-6 border-y border-slate-900 bg-slate-950/60">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium text-white leading-snug">
            We do not sell isolated websites.{' '}
            <span className="text-slate-400 font-light">
              We design connected commercial infrastructure.
            </span>
          </p>
        </div>
      </section>

      {/* Four pillars */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="text-center mb-16">
            <PremiumBadge className="mb-4 mx-auto">The system</PremiumBadge>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Capture, respond, organize, convert.
            </h2>
            <p className="text-slate-400 text-xl font-light mt-4 max-w-2xl mx-auto">
              One connected ecosystem. Every touchpoint working together.
            </p>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <MotionItem key={p.title} className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 space-y-4">
                <div className="text-4xl font-bold text-slate-700 leading-none">0{i + 1}</div>
                <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-24 px-6 bg-slate-950/60 border-y border-slate-900">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge className="mx-auto">Designed for</PremiumBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Premium businesses that sell through trust.
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Real estate developers, professional services, premium commerce, clinics,
            hospitality, education, and any operation where a single lost lead means
            a significant missed opportunity.
          </p>
        </div>
      </section>

      {/* Solutions preview */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Our systems
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Each system addresses a specific commercial operation. Not a template — purpose-built infrastructure.
            </p>
          </MotionSection>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Real Estate OS', desc: 'Presentation, capture, and commercial control for high-value projects.', href: '/en/solutions' },
              { name: 'Commerce OS', desc: 'End-to-end digital commerce with automated follow-up and conversion tracking.', href: '/en/solutions' },
              { name: 'Beauty Spa OS', desc: 'Booking, client management, and retention system for premium wellness brands.', href: '/en/solutions' },
            ].map((s) => (
              <Link key={s.name} href={s.href} className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40 transition-all">
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">{s.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/en/solutions" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              View all solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900/40 border border-white/10 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Understand first. Build right.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-10">
            The assessment is how serious engagements begin. We review your operation
            and recommend the exact system your business needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/en/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-10 py-5 rounded-sm font-semibold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
            >
              Request assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/en/solutions" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-sm font-medium text-white border border-slate-700 hover:bg-slate-900 transition-colors">
              View solutions
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
