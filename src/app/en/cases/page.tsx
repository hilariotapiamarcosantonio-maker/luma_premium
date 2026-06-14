import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import CaseCard from '@/components/site/CaseCard';
import { MotionSection, MotionStagger, MotionItem } from '@/components/site/Motion';
import { CASES } from '@/lib/cases';

export const metadata: Metadata = {
  title: 'Cases & demos',
  description:
    'Authorized demos and commercial references of the Luma Premium architecture: Real Estate OS, CRM OS, Concierge OS, Commerce OS, and Beauty Spa OS.',
  alternates: {
    canonical: '/en/cases',
    languages: { 'es': '/casos' },
  },
};

export default function EnCasesPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <PremiumBadge tone="amber" className="mx-auto">Cases & references</PremiumBadge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Real systems. Not mockups.
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Authorized demos and selected references to see the Luma architecture
            in action. Each represents a solution line.
          </p>
        </div>
      </section>

      <section className="pb-12 px-6">
        <MotionSection className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 md:p-8 text-center">
            <p className="text-lg md:text-xl text-white font-medium leading-snug">
              Official demos and selected commercial references.
            </p>
            <p className="text-slate-400 mt-2">
              We do not show theory. We show architecture in operation.
            </p>
          </div>
        </MotionSection>
      </section>

      <section className="pb-24 px-6">
        <MotionStagger className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASES.map((c) => (
            <MotionItem key={c.title} className="h-full">
              <CaseCard item={c} />
            </MotionItem>
          ))}
        </MotionStagger>
      </section>

      <section className="py-16 px-6 border-t border-slate-900 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Ready to build yours?</h2>
          <p className="text-slate-400">Start with an assessment. We will review your operation and recommend the right system.</p>
          <Link href="/en/assessment" className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors">
            Request assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
