import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Stethoscope, Layers, Sparkles, Boxes, GraduationCap, LineChart } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import MethodJourney, { type MethodPhase } from '@/components/site/MethodJourney';
import EditorialFigure from '@/components/site/EditorialFigure';
import { MotionSection } from '@/components/site/Motion';
import { EDITORIAL_IMAGES } from '@/data/marketing-images';

export const metadata: Metadata = {
  title: 'Method',
  description:
    'The Luma Premium consultative method: assessment, architecture, design, implementation, delivery, and optimization. We design before we build.',
  alternates: {
    canonical: '/en/method',
    languages: { 'es': '/metodo' },
  },
};

const PHASES: MethodPhase[] = [
  {
    icon: Stethoscope,
    title: 'Commercial assessment',
    description:
      'We understand your operation: how you capture, respond, organize, and convert today. We identify leaks and opportunities before proposing anything.',
    deliverable: 'Executive read of the operation',
    result: 'Clarity on where demand is lost',
  },
  {
    icon: Layers,
    title: 'Solution architecture',
    description:
      'We design the system on paper first: commercial routes, capture, follow-up, and control. We define what gets built and why.',
    deliverable: 'System map and scope',
    result: 'A clear plan before investing',
  },
  {
    icon: Sparkles,
    title: 'Experience design',
    description:
      'We design every touchpoint — digital presence, capture forms, automated messages, CRM, and concierge — with commercial precision.',
    deliverable: 'Interface and message design',
    result: 'A brand that feels serious',
  },
  {
    icon: Boxes,
    title: 'Implementation',
    description:
      'We build the system with production-grade quality: connected, tested, and ready to operate. No half-built deliverables.',
    deliverable: 'A connected, working system',
    result: 'An operation ready to sell',
  },
  {
    icon: GraduationCap,
    title: 'Handover & training',
    description:
      'We deliver a system your team can operate. Every module documented, every flow explained.',
    deliverable: 'Handover and team training',
    result: 'A team autonomous with the system',
  },
  {
    icon: LineChart,
    title: 'Optimization',
    description:
      'We monitor, measure, and adjust. A commercial system is not a website — it improves with every cycle.',
    deliverable: 'Metrics and per-cycle improvements',
    result: 'An operation that keeps improving',
  },
];

export default function EnMethodPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <PremiumBadge tone="amber" className="mx-auto lg:mx-0">Our method</PremiumBadge>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              We design before we build.
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A consultative process that justifies a serious implementation.
              No guesswork, no templates, no shortcuts.
            </p>
          </div>
          <EditorialFigure
            image={EDITORIAL_IMAGES.method}
            locale="en"
            priority
            aspect="aspect-[16/10]"
            caption="Architecture before construction"
          />
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <MotionSection>
            <MethodJourney
              phases={PHASES}
              labels={{ deliverable: 'Deliverable', result: 'Outcome' }}
            />
          </MotionSection>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-slate-900 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Start with the assessment.</h2>
          <p className="text-slate-400">The first step is understanding your operation. Everything else follows from there.</p>
          <Link href="/en/assessment" className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors">
            Request assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
