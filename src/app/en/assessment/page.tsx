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
  title: 'Commercial Assessment',
  description:
    'Request a commercial digital assessment. We review your presence, capture, follow-up, CRM, and conversion — and recommend the right system for your operation.',
  alternates: {
    canonical: '/en/assessment',
    languages: { 'es': '/diagnostico' },
  },
};

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
          <div className="max-w-3xl mx-auto pt-8">
            <EditorialFigure
              image={EDITORIAL_IMAGES.diagnostic}
              locale="en"
              priority
              aspect="aspect-[2/1]"
              caption="An executive read, not a sales call"
            />
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
          <DiagnosticMatrix locale="en" />
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

          {/* ── How it Works ── */}
          <div className="max-w-5xl mx-auto mt-20 pt-16 border-t border-slate-900">
            <div className="text-center mb-12">
              <PremiumBadge tone="amber" className="mb-3 mx-auto">The Process</PremiumBadge>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                How the assessment works
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
                A direct and confidential three-stage process to map the ideal commercial system for your business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Line connector */}
              <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-amber-500/10 via-amber-500/30 to-amber-500/10 -z-10" />
              
              {[
                {
                  step: "01",
                  title: "Technical Survey",
                  desc: "Complete key details regarding your current operation, lead volume, and active sales tools."
                },
                {
                  step: "02",
                  title: "Confidential Audit",
                  desc: "We perform a manual internal evaluation of your public acquisition flows and trace conversion bottlenecks."
                },
                {
                  step: "03",
                  title: "Executive Delivery",
                  desc: "Receive your tailored commercial architecture proposal and technical blueprint directly by email in 24–48 business hours."
                }
              ].map((p, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl border border-slate-900 bg-slate-950/80 flex flex-col items-center text-center space-y-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                    Step {p.step}
                  </span>
                  <h3 className="text-base font-semibold text-white">{p.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Integrated Form with Amber Glow Border ── */}
          <div className="max-w-3xl mx-auto mt-20 relative">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/10 to-amber-600/5 rounded-3xl blur-xl opacity-75 -z-10" />
            
            <div className="relative p-8 md:p-10 rounded-2xl border border-amber-500/20 bg-slate-950 shadow-[0_0_50px_rgba(245,158,11,0.03)]">
              {/* Security & Response expectation badges */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs font-semibold text-white tracking-wide uppercase">Secure Assessment Form</p>
                    <p className="text-[10px] text-slate-500">SSL Encrypted Connection &bull; Demonstration Data</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500/80" />
                  <p className="text-xs text-slate-400 font-medium">
                    Response time: <span className="text-amber-500">24–48 business hours</span>
                  </p>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                  Complete your request
                </h2>
                <p className="text-slate-400 text-sm">
                  Confidential technical review. We will respond within 24–48 business hours.
                </p>
              </div>

              <Suspense fallback={<div className="text-center py-10 text-slate-500">Loading form...</div>}>
                <DiagnosticoMaestroForm locale="en" />
              </Suspense>
            </div>
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
