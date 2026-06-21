'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  Check,
  AlertTriangle,
  Sparkles,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import PremiumBadge from './PremiumBadge';
import CTASection from './CTASection';
import FlowDiagram from './FlowDiagram';
import SolutionVisual from './SolutionVisual';
import SystemGallery from './SystemGallery';
import ProductScreenshotLightbox from './ProductScreenshotLightbox';
import { PRODUCT_SCREENSHOTS } from '@/data/product-screenshots';
import { Icon } from './Icon';
import { MotionSection } from './Motion';
import type { Solution } from '@/lib/solutions';
import {
  IMPLEMENTATION_STEPS_ES,
  IMPLEMENTATION_STEPS_EN,
  SOLUTION_FAQ_ES,
  SOLUTION_FAQ_EN,
} from '@/lib/solutions';

type Locale = 'es' | 'en';

const UI = {
  es: {
    back: '← Todas las soluciones',
    backHref: '/soluciones',
    requestCta: 'Solicitar evaluación',
    requestHref: '/diagnostico',
    viewDemo: 'Ver demo',
    viewExperience: 'Ver experiencia completa',
    demoBadgeHero: 'Demo real disponible',
    problemBadge: 'El problema',
    problemTitle: 'Qué está fallando hoy',
    transformBadge: 'La transformación',
    before: 'Antes',
    bridge: 'Con el sistema Luma',
    after: 'Operación controlada',
    includesBadge: 'Qué incluye',
    includesTitle: 'Una arquitectura comercial, no una página suelta.',
    deliversLabel: 'En conjunto entrega',
    howBadge: 'Cómo funciona',
    howTitle: 'Del primer contacto al cierre, paso a paso.',
    splitBadge: 'Las dos caras del sistema',
    demoBadge: 'Demo real',
    demoTitle: 'Véalo funcionando.',
    demoText: 'Explore la arquitectura de esta solución en una demo pública e interactiva.',
    demoOpen: 'Abrir demo interactiva',
    requestAccess: 'Solicitar acceso',
    galleryBadge: 'Dentro del sistema',
    galleryTitle: 'Así se ve el sistema en funcionamiento.',
    galleryNote: 'Vistas reales de las diferentes pantallas y flujos del sistema. Haga clic en cualquiera para ampliar.',
    useCaseBadge: 'Escenario de uso',
    challenge: 'El reto',
    withLuma: 'Con Luma',
    implBadge: 'Implementación',
    implTitle: 'Cómo lo ponemos en marcha.',
    faqBadge: 'Preguntas frecuentes',
    faqTitle: 'Lo que suelen preguntar antes de empezar.',
    seeCases: 'Ver casos y demos',
    casesHref: '/casos',
    ctaSub:
      'Empiece por una evaluación comercial digital. Le mostramos cómo se vería este sistema en su operación.',
    ctaTitle: (n: string) => `¿Listo para implementar ${n}?`,
  },
  en: {
    back: '← All solutions',
    backHref: '/en/solutions',
    requestCta: 'Request assessment',
    requestHref: '/en/assessment',
    viewDemo: 'View demo',
    viewExperience: 'View full experience',
    demoBadgeHero: 'Live demo available',
    problemBadge: 'The problem',
    problemTitle: 'What is breaking today',
    transformBadge: 'The transformation',
    before: 'Before',
    bridge: 'With the Luma system',
    after: 'Controlled operation',
    includesBadge: 'What it includes',
    includesTitle: 'A commercial architecture, not a standalone page.',
    deliversLabel: 'Together it delivers',
    howBadge: 'How it works',
    howTitle: 'From first contact to close, step by step.',
    splitBadge: 'Both sides of the system',
    demoBadge: 'Live demo',
    demoTitle: 'See it in action.',
    demoText: 'Explore the architecture of this solution in a public, interactive demo.',
    demoOpen: 'Open interactive demo',
    requestAccess: 'Request access',
    galleryBadge: 'Inside the system',
    galleryTitle: 'See the system in action.',
    galleryNote: 'Real views of the system screens and operations. Click on any to expand.',
    useCaseBadge: 'Use case',
    challenge: 'The challenge',
    withLuma: 'With Luma',
    implBadge: 'Implementation',
    implTitle: 'How we roll it out.',
    faqBadge: 'FAQ',
    faqTitle: 'What people usually ask before starting.',
    seeCases: 'View cases and demos',
    casesHref: '/en/cases',
    ctaSub:
      'Start with a commercial digital assessment. We show you how this system would look inside your operation.',
    ctaTitle: (n: string) => `Ready to implement ${n}?`,
  },
} as const;

export default function SolutionLanding({
  solution,
  locale,
  related,
}: {
  solution: Solution;
  locale: Locale;
  related: Solution[];
}) {
  const [activeScreenshotId, setActiveScreenshotId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenScreenshot = (id: string) => {
    setActiveScreenshotId(id);
    setIsLightboxOpen(true);
  };

  const t = UI[locale];
  const steps = locale === 'en' ? IMPLEMENTATION_STEPS_EN : IMPLEMENTATION_STEPS_ES;
  const faq = locale === 'en' ? SOLUTION_FAQ_EN : SOLUTION_FAQ_ES;
  const solHref = (slug: string) =>
    locale === 'en' ? `/en/solutions/${slug}` : `/soluciones/${slug}`;

  return (
    <>
      {/* 1 · Hero comercial */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto">
          <Link
            href={t.backHref}
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium mb-8 inline-block"
          >
            {t.back}
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
              <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                {solution.valueProp ?? solution.positioning}
              </p>
              {solution.demoUrl && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t.demoBadgeHero}
                </div>
              )}
              <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href={t.requestHref}
                  className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  {t.requestCta} <ArrowRight className="w-4 h-4" />
                </Link>
                {solution.internalUrl ? (
                  <Link
                    href={solution.internalUrl}
                    className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                  >
                    {t.viewExperience} <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  solution.demoUrl && (
                    <a
                      href={solution.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                    >
                      {t.viewDemo} <ExternalLink className="w-4 h-4" />
                    </a>
                  )
                )}
              </div>
            </div>
            <SolutionVisual slug={solution.slug} locale={locale} view="client" onScreenshotClick={handleOpenScreenshot} />
          </div>
        </div>
      </section>

      {/* 2 · El problema */}
      <section className="py-20 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <PremiumBadge className="mb-4">{t.problemBadge}</PremiumBadge>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
              {t.problemTitle}
            </h2>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">{solution.problem}</p>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">{t.before}</p>
                <p className="mt-1 text-lg font-medium text-white leading-snug">{solution.before ?? solution.pain}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · La transformación */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-12 max-w-2xl">
            <PremiumBadge className="mb-4">{t.transformBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {t.before} → {t.bridge} → {t.after}
            </h2>
          </MotionSection>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> {t.before}
              </span>
              <p className="mt-3 text-slate-300 leading-relaxed">{solution.before ?? solution.pain}</p>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-amber-500/60" />
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] p-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-400">
                <Sparkles className="h-3.5 w-3.5" /> {solution.name}
              </span>
              <p className="mt-3 text-slate-200 leading-relaxed">{solution.delivers}</p>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-emerald-400/60" />
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                <Check className="h-3.5 w-3.5" /> {t.after}
              </span>
              <p className="mt-3 text-slate-300 leading-relaxed">{solution.after ?? solution.delivers}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Qué incluye */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <PremiumBadge className="mb-4">{t.includesBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t.includesTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {solution.capabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-8 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/40 hover:border-slate-700 transition-colors"
              >
                <Icon name={cap.icon} className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-lg font-semibold text-white mb-3">{cap.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-slate-200">
              <span className="text-slate-500 text-sm uppercase tracking-wide">{t.deliversLabel}: </span>
              {solution.delivers}
            </p>
          </div>
        </div>
      </section>

      {/* 5 · Cómo funciona */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <PremiumBadge className="mb-4">{t.howBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t.howTitle}</h2>
          </div>
          <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-950/50 p-6 md:p-8 overflow-x-auto">
            <FlowDiagram steps={solution.commercialFlow} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {solution.flow.map((step, i) => (
              <div key={step.label} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 relative">
                <span className="text-amber-500 font-bold text-sm">0{i + 1}</span>
                <h3 className="text-white font-semibold mt-2 mb-2">{step.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 + 7 · Qué ve el cliente / qué ve el equipo */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <PremiumBadge className="mb-10">{t.splitBadge}</PremiumBadge>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* Cliente */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                  <Users className="h-5 w-5 text-amber-500" />
                </span>
                <h3 className="text-xl font-bold text-white">
                  {solution.clientView?.caption ?? (locale === 'en' ? 'What the client sees' : 'Lo que ve el cliente')}
                </h3>
              </div>
              <ul className="space-y-3">
                {(solution.clientView?.points ?? []).map((p) => (
                  <li key={p} className="flex gap-3 text-slate-300 leading-relaxed">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-amber-500" /> {p}
                  </li>
                ))}
              </ul>
              <SolutionVisual slug={solution.slug} locale={locale} view="client" chip={false} className="mt-8" onScreenshotClick={handleOpenScreenshot} />
            </div>
            {/* Equipo */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                  <LayoutDashboard className="h-5 w-5 text-amber-500" />
                </span>
                <h3 className="text-xl font-bold text-white">
                  {solution.teamView?.caption ?? (locale === 'en' ? 'What your team sees' : 'Lo que ve su equipo')}
                </h3>
              </div>
              <ul className="mb-8 space-y-3">
                {(solution.teamView?.points ?? []).map((p) => (
                  <li key={p} className="flex gap-3 text-slate-300 leading-relaxed">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-amber-500" /> {p}
                  </li>
                ))}
              </ul>
              <SolutionVisual slug={solution.slug} locale={locale} view="team" chip={false} onScreenshotClick={handleOpenScreenshot} />
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Demo real */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <SolutionVisual slug={solution.slug} locale={locale} view="client" chip={false} onScreenshotClick={handleOpenScreenshot} />
          </div>
          <div className="order-1 lg:order-2">
            <PremiumBadge className="mb-4">{t.demoBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">{t.demoTitle}</h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">{t.demoText}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              {solution.demoUrl ? (
                <a
                  href={solution.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  {t.demoOpen} <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  href={t.requestHref}
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  {t.requestAccess} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {solution.internalUrl && (
                <Link
                  href={solution.internalUrl}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-medium text-white border border-slate-700 hover:bg-slate-900 transition-colors"
                >
                  {t.viewExperience} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9 · Galería de pantallas */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-12 max-w-2xl">
            <PremiumBadge className="mb-4">{t.galleryBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t.galleryTitle}</h2>
            <p className="mt-3 text-slate-400">{t.galleryNote}</p>
          </MotionSection>
          <SystemGallery locale={locale} onScreenshotClick={handleOpenScreenshot} />
        </div>
      </section>

      {/* 10 · Escenario de uso */}
      {solution.useCase && (
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <PremiumBadge className="mb-8">{t.useCaseBadge}</PremiumBadge>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-8">
                <p className="text-sm uppercase tracking-wide text-slate-500 mb-3">{t.challenge}</p>
                <p className="text-lg text-slate-300 leading-relaxed">{solution.useCase.context}</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-8">
                <p className="text-sm uppercase tracking-wide text-amber-400/80 mb-3">{t.withLuma}</p>
                <p className="text-lg text-white leading-relaxed">{solution.useCase.resolution}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 11 · Implementación */}
      <section className="py-24 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <PremiumBadge className="mb-4">{t.implBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t.implTitle}</h2>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                <span className="font-mono text-2xl font-bold leading-none text-slate-700">0{i + 1}</span>
                <div>
                  <h3 className="text-white font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-400 leading-relaxed">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 12 · FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <PremiumBadge className="mb-4 mx-auto">{t.faqBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t.faqTitle}</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-800 bg-slate-900/30 p-5 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 text-white font-medium list-none">
                  {item.q}
                  <ArrowRight className="h-4 w-4 shrink-0 text-amber-500 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Relacionadas */}
      <section className="py-20 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10">
            {locale === 'en' ? 'Other solutions' : 'Otras soluciones'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={solHref(s.slug)}
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

      {/* 13 · CTA final */}
      <CTASection
        title={t.ctaTitle(solution.name)}
        subtitle={t.ctaSub}
        primary={{ label: t.requestCta, href: t.requestHref }}
        secondary={{ label: t.seeCases, href: t.casesHref }}
      />
      <ProductScreenshotLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        currentId={activeScreenshotId || ''}
        screenshots={PRODUCT_SCREENSHOTS}
        locale={locale}
      />
    </>
  );
}
