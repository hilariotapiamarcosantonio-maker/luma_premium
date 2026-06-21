import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Compass, Layers, ShieldCheck, LayoutDashboard } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import SolutionCard from '@/components/site/SolutionCard';
import IndustriesSection from '@/components/site/IndustriesSection';
import HeroComposition from '@/components/site/HeroComposition';
import CommercialFlowBand from '@/components/site/CommercialFlowBand';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import { EN_SOLUTIONS } from '@/lib/solutions';
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

export default function EnHomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_rgba(30,41,59,0.5),_transparent_70%)] -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-12 items-center">
          <div className="text-center lg:text-left space-y-7">
            <PremiumBadge tone="amber" className="mx-auto lg:mx-0">
              Commercial Digital Architecture
            </PremiumBadge>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              From digital presence{' '}
              <span className="text-slate-400 font-light">to commercial control.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              We design connected commercial infrastructure for premium businesses
              that sell through trust, speed, and disciplined follow-up.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 pt-2">
              <Link
                href="/en/assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
              >
                Request assessment <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={whatsappLink('Hello, I want to request a commercial assessment with Luma Premium.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Premium product composition */}
          <div className="relative pb-10 lg:pb-0">
            <HeroComposition locale="en" />
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

      {/* Transformation flow */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-10 max-w-2xl">
            <PremiumBadge className="mb-4">The transformation</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              From scattered leads to a connected operation.
            </h2>
          </MotionSection>
          <MotionSection delay={0.1}>
            <CommercialFlowBand locale="en" />
          </MotionSection>
        </div>
      </section>

      {/* Four pillars */}
      <section className="py-28 px-6 bg-gradient-to-b from-slate-950 to-slate-900/20 border-t border-slate-900">
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
            {/* Pillar 1: Capture */}
            <MotionItem className="flex flex-col justify-between p-8 rounded-2xl border border-slate-800 bg-slate-950/80 group hover:border-amber-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-slate-800 leading-none group-hover:text-amber-500/40 transition-colors">01</div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-white">Capture</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">Premium digital presence that positions, qualifies, and converts before the first call.</p>
              </div>
              {/* Micro UI: Mock ad */}
              <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-[9px] space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-800/60 pb-1.5">
                  <span className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-[7px]">L</span>
                  <span className="font-semibold text-white text-[8px]">Luma Estate OS</span>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950/60 p-2 text-slate-400">
                  <span className="block font-medium text-white mb-0.5">Villa Esmeralda</span>
                  <span className="block text-[7px] text-slate-500">Premium Real Estate Routes</span>
                </div>
              </div>
            </MotionItem>

            {/* Pillar 2: Respond */}
            <MotionItem className="flex flex-col justify-between p-8 rounded-2xl border border-slate-800 bg-slate-950/80 group hover:border-amber-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-slate-800 leading-none group-hover:text-amber-500/40 transition-colors">02</div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-white">Respond</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">Intelligent concierge that handles inquiries with speed, consistency, and commercial authority.</p>
              </div>
              {/* Micro UI: Mock Chat */}
              <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-[9px] space-y-2">
                <div className="space-y-1.5">
                  <div className="max-w-[85%] rounded bg-slate-950/80 border border-slate-800 p-1.5 text-slate-300">
                    Are you buying for investment or to live?
                  </div>
                  <div className="ml-auto max-w-[85%] rounded bg-amber-500/10 border border-amber-500/20 p-1.5 text-amber-400">
                    Mainly for investment.
                  </div>
                </div>
              </div>
            </MotionItem>

            {/* Pillar 3: Organize */}
            <MotionItem className="flex flex-col justify-between p-8 rounded-2xl border border-slate-800 bg-slate-950/80 group hover:border-amber-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-slate-800 leading-none group-hover:text-amber-500/40 transition-colors">03</div>
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-white">Organize</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">CRM and commercial control so nothing slips through and follow-up is disciplined.</p>
              </div>
              {/* Micro UI: CRM lead card */}
              <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-[9px] space-y-1.5">
                <div className="flex justify-between items-center text-[7px] text-slate-500 font-mono">
                  <span>Lead Stage</span>
                  <span className="text-emerald-400 font-bold">QUALIFIED</span>
                </div>
                <div className="rounded border border-slate-850 bg-slate-950/60 p-2">
                  <span className="block font-semibold text-white leading-none">A. Mendez</span>
                  <span className="block text-[7px] text-slate-500 mt-1">Interest: Villa Esmeralda</span>
                </div>
              </div>
            </MotionItem>

            {/* Pillar 4: Convert */}
            <MotionItem className="flex flex-col justify-between p-8 rounded-2xl border border-slate-800 bg-slate-950/80 group hover:border-amber-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-slate-800 leading-none group-hover:text-amber-500/40 transition-colors">04</div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-white">Convert</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">Automated follow-up sequences and presentation systems built to close high-ticket deals.</p>
              </div>
              {/* Micro UI: Conversion bar */}
              <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-[9px] space-y-2">
                <div className="flex justify-between text-[7px] text-slate-500">
                  <span>Conversion Rate</span>
                  <span className="text-emerald-400 font-bold">14.8%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded overflow-hidden">
                  <div className="h-full w-[14.8%] bg-amber-500 rounded" />
                </div>
              </div>
            </MotionItem>
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
          <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EN_SOLUTIONS.map((s) => (
              <MotionItem key={s.slug} className="h-full">
                <SolutionCard solution={s} locale="en" />
              </MotionItem>
            ))}
          </MotionStagger>
          <div className="text-center mt-8">
            <Link href="/en/solutions" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              View all solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Industries served */}
      <IndustriesSection locale="en" />

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
