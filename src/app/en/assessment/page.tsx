import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Search, FileCheck, Route, Users, Clock, ShieldCheck } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import DiagnosticoMaestroForm from '@/components/diagnostico/DiagnosticoMaestroForm';

export const metadata: Metadata = {
  title: 'Commercial Assessment',
  description:
    'Request a commercial digital assessment. We review your presence, capture, follow-up, CRM, and conversion — and recommend the right system for your operation.',
  alternates: {
    canonical: '/en/assessment',
    languages: { 'es': '/diagnostico' },
  },
};

const REVIEWS = [
  'Digital presence', 'Lead capture', 'Commercial follow-up',
  'WhatsApp & social', 'CRM & organization', 'Conversion', 'Brand authority',
];

const RECEIVES = [
  {
    icon: Search,
    title: 'Executive read',
    description: 'A clear picture of where demand is lost and where commercial friction exists in your operation.',
  },
  {
    icon: FileCheck,
    title: 'System recommendation',
    description: 'Which Luma system fits your operation and why — without overselling.',
  },
  {
    icon: Route,
    title: 'Implementation roadmap',
    description: 'A phased path from operational chaos to a measurable commercial system.',
  },
];

export default function EnAssessmentPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">
            Premium entry · Assessment
          </PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Request a commercial digital assessment.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            For premium businesses that already sell or want to sell better.
            We review your commercial operation and tell you exactly which system you need.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            {[
              { icon: Users, text: 'For owners and executives' },
              { icon: Clock, text: 'Initial review in 24–48 h' },
              { icon: ShieldCheck, text: 'No sales pressure' },
            ].map((m) => (
              <span key={m.text} className="inline-flex items-center gap-2">
                <m.icon className="w-3.5 h-3.5 text-amber-500/70" />
                {m.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
              What Luma Premium reviews
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              A complete look at your commercial operation — not just your website.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {REVIEWS.map((item) => (
              <span key={item} className="px-5 py-3 rounded-full border border-slate-800 bg-slate-900/30 text-slate-300 text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="text-center mb-14">
            <PremiumBadge className="mb-4 mx-auto">What you receive</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Not a sales call. An executive read.
            </h2>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-3 gap-6 mb-20">
            {RECEIVES.map((item) => (
              <MotionItem key={item.title} className="h-full p-8 rounded-2xl border border-slate-800 bg-slate-900/20">
                <item.icon className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </MotionItem>
            ))}
          </MotionStagger>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                Complete your request
              </h2>
              <p className="text-slate-400 text-base">
                Three steps. Under four minutes. We review and respond within 24–48 h.
              </p>
            </div>
            <Suspense>
              <DiagnosticoMaestroForm locale="en" />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-950 text-center">
        <div className="max-w-2xl mx-auto space-y-3 text-slate-500 text-sm">
          <p>Prefer to talk first?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://wa.me/18492122647?text=Hello%2C+I%27d+like+to+request+a+commercial+assessment+with+Luma+Premium." target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline underline-offset-4">
              WhatsApp
            </a>
            <span className="text-slate-700">·</span>
            <Link href="/en/solutions" className="text-slate-300 hover:text-white transition-colors underline underline-offset-4">View solutions</Link>
            <span className="text-slate-700">·</span>
            <Link href="/en/cases" className="text-slate-300 hover:text-white transition-colors underline underline-offset-4">View cases</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
