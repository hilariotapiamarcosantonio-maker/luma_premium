import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Stethoscope } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import SolutionCard from '@/components/site/SolutionCard';
import PremiumBadge from '@/components/site/PremiumBadge';
import { MotionStagger, MotionItem } from '@/components/site/Motion';
import { SOLUTIONS } from '@/lib/solutions';

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Luma Premium solution lines: Real Estate OS, CRM OS, Concierge OS, Commerce OS, and Beauty Spa OS. A dedicated commercial system per vertical.',
  alternates: {
    canonical: '/en/solutions',
    languages: { 'es': '/soluciones' },
  },
};

export default function EnSolutionsPage() {
  return (
    <SiteShell>
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">Solution lines</PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Every premium business needs its own commercial system.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            We do not sell websites. We design capture, response, organization,
            and conversion infrastructure — purpose-built per vertical.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <MotionStagger className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((s) => (
            <MotionItem key={s.slug} className="h-full">
              <SolutionCard solution={s} />
            </MotionItem>
          ))}

          <MotionItem className="h-full">
            <Link
              href="/en/assessment"
              className="group flex h-full flex-col p-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-amber-500/30 bg-slate-950">
                  <Stethoscope className="w-6 h-6 text-amber-500" />
                </span>
                <ArrowRight className="w-5 h-5 text-amber-500/70 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-500/70 mb-2">
                Entry point
              </p>
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                Not sure yet? Start with an assessment.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                We review your operation and recommend the right system. No commitment required.
              </p>
            </Link>
          </MotionItem>
        </MotionStagger>
      </section>
    </SiteShell>
  );
}
