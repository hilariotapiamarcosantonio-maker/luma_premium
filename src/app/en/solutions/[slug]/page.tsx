import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ExternalLink, Check } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import CTASection from '@/components/site/CTASection';
import FlowDiagram from '@/components/site/FlowDiagram';
import SolutionVisual from '@/components/site/SolutionVisual';
import { Icon } from '@/components/site/Icon';
import { MotionSection } from '@/components/site/Motion';
import { getEnSolution, EN_SOLUTION_SLUGS, EN_SOLUTIONS } from '@/lib/solutions';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return EN_SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getEnSolution(slug);
  if (!solution) return { title: 'Solution' };
  return {
    title: solution.name,
    description: solution.positioning,
    alternates: {
      canonical: `/en/solutions/${slug}`,
      languages: { es: `/soluciones/${slug}`, en: `/en/solutions/${slug}` },
    },
    openGraph: {
      title: `${solution.name} | Luma Premium`,
      description: solution.positioning,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function EnSolutionDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const solution = getEnSolution(slug);
  if (!solution) notFound();

  // Related solutions (other lines), max 3.
  const related = EN_SOLUTIONS.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto">
          <Link
            href="/en/solutions"
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium mb-8 inline-block"
          >
            &larr; All solutions
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-slate-800 bg-slate-900">
                  <Icon name={solution.icon} className="w-7 h-7 text-amber-500" />
                </span>
                <PremiumBadge tone="amber">{solution.kicker}</PremiumBadge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                {solution.name}
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
                {solution.positioning}
              </p>

              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/en/assessment"
                  className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  Request assessment <ArrowRight className="w-4 h-4" />
                </Link>
                {solution.demoUrl && (
                  <a
                    href={solution.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                  >
                    View demo <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Stylized product visual of the solution */}
            <SolutionVisual slug={solution.slug} locale="en" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              The problem
            </span>
          </div>
          <p className="text-2xl md:text-3xl text-white font-medium leading-snug">
            {solution.problem}
          </p>
        </div>
      </section>

      {/* Commercial flow (visual diagram) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection>
            <PremiumBadge className="mb-4">Commercial flow of the solution</PremiumBadge>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8">
              How an opportunity flows inside the system.
            </h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 md:p-8 overflow-x-auto">
              <FlowDiagram steps={solution.commercialFlow} />
            </div>
          </MotionSection>
        </div>
      </section>

      {/* What the system delivers */}
      <section className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <PremiumBadge className="mb-4">What the system delivers</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              A commercial architecture, not a standalone page.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {solution.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors"
              >
                <Icon name={cap.icon} className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">
                  {cap.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prospect journey */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <PremiumBadge className="mb-4">The prospect journey</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              From ad to close, without losing control.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solution.flow.map((step, i) => (
              <div
                key={step.label}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-950 relative"
              >
                <span className="text-amber-500 font-bold text-sm">
                  0{i + 1}
                </span>
                <h3 className="text-white font-semibold mt-2 mb-2">
                  {step.label}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for + next step */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="p-10 rounded-2xl border border-slate-800 bg-slate-900/20">
            <h3 className="text-xl font-bold text-white mb-6">Who it is for</h3>
            <p className="text-slate-300 leading-relaxed mb-8">
              {solution.forWho}
            </p>
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
              What it solves
            </h4>
            <ul className="space-y-3">
              {[solution.pain, solution.delivers].map((line) => (
                <li key={line} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-10 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">Next step</h3>
            <p className="text-slate-300 leading-relaxed mb-8 flex-1">
              {solution.salesNextStep}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/en/assessment"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-6 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Request assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/en/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm font-medium text-white border border-slate-700 hover:bg-slate-900 transition-colors"
              >
                Talk to Luma Premium
              </Link>
            </div>
          </div>
        </div>

        {solution.disclaimer && (
          <div className="max-w-7xl mx-auto mt-8">
            <p className="text-xs text-slate-600 border border-slate-800/60 rounded-lg p-4 leading-relaxed">
              {solution.disclaimer}
            </p>
          </div>
        )}
      </section>

      {/* Related */}
      <section className="py-20 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10">Other solutions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/en/solutions/${s.slug}`}
                className="group flex items-center justify-between gap-4 p-6 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Icon name={s.icon} className="w-6 h-6 text-amber-500 shrink-0" />
                  <span className="text-white font-medium text-sm">{s.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to implement ${solution.name}?`}
        subtitle="Start with a commercial digital assessment. We show you how this system would look inside your operation."
        primary={{ label: 'Request assessment', href: '/en/assessment' }}
        secondary={{ label: 'View cases and demos', href: '/en/cases' }}
      />
    </SiteShell>
  );
}
