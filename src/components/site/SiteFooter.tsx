'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE, SOCIALS } from '@/lib/site';
import { SOLUTIONS } from '@/lib/solutions';
import PremiumDivider from './PremiumDivider';

export default function SiteFooter() {
  const pathname = usePathname();
  const isEn = pathname.startsWith('/en');
  const copy = isEn
    ? {
        closing: (
          <>
            Commercial digital architecture for businesses that sell through{' '}
            <span className="text-amber-500">trust, follow-up, and perception</span>.
          </>
        ),
        promise:
          'Luma Premium designs commercial digital systems so premium businesses can capture, respond, organize, and convert opportunities with more authority and control.',
        socials: 'Official channels',
        solutions: 'Solutions',
        firm: 'Firm',
        method: 'Method',
        cases: 'Cases',
        assessment: 'Assessment',
        contact: 'Contact',
        founderRole: 'High-Performance Digital Architect',
        bottom: `Commercial digital architecture · ${SITE.name}`,
        homeHref: '/en',
        solutionsHref: '/en/solutions',
        methodHref: '/en/method',
        casesHref: '/en/cases',
        assessmentHref: '/en/assessment',
        contactHref: '/en/contact',
      }
    : {
        closing: (
          <>
            Arquitectura comercial digital para negocios que venden por{' '}
            <span className="text-amber-500">confianza, seguimiento y percepción</span>.
          </>
        ),
        promise: SITE.promise,
        socials: 'Redes oficiales',
        solutions: 'Soluciones',
        firm: 'Firma',
        method: 'Método',
        cases: 'Casos',
        assessment: 'Diagnóstico',
        contact: 'Contacto',
        founderRole: SITE.founderRole,
        bottom: `Arquitectura comercial digital · ${SITE.name}`,
        homeHref: '/',
        solutionsHref: '/soluciones',
        methodHref: '/metodo',
        casesHref: '/casos',
        assessmentHref: '/diagnostico',
        contactHref: '/contacto',
      };

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/70 backdrop-blur-sm font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <p className="max-w-3xl text-2xl md:text-3xl font-medium text-white leading-snug">
          {copy.closing}
        </p>
        <PremiumDivider className="mt-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Link href={copy.homeHref} className="text-xl font-semibold tracking-tight text-white">
            {SITE.brandMark.lead}
            <span className="text-slate-500 font-light">{SITE.brandMark.tail}</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            {copy.promise}
          </p>

          <div className="pt-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              {copy.socials}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-amber-500 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {copy.solutions}
          </p>
          <ul className="space-y-2">
            {SOLUTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={isEn ? `/en/solutions/${s.slug}` : `/soluciones/${s.slug}`}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {copy.firm}
          </p>
          <ul className="space-y-2">
            <li>
              <Link href={copy.methodHref} className="text-sm text-slate-400 hover:text-white transition-colors">
                {copy.method}
              </Link>
            </li>
            <li>
              <Link href={copy.casesHref} className="text-sm text-slate-400 hover:text-white transition-colors">
                {copy.cases}
              </Link>
            </li>
            <li>
              <Link href={copy.assessmentHref} className="text-sm text-slate-400 hover:text-white transition-colors">
                {copy.assessment}
              </Link>
            </li>
            <li>
              <Link href={copy.contactHref} className="text-sm text-slate-400 hover:text-white transition-colors">
                {copy.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
          <p className="text-sm">
            <span className="text-white font-semibold">
              &copy; {new Date().getFullYear()} {SITE.founder}.
            </span>{' '}
            <span className="text-white/70">{copy.founderRole}.</span>
          </p>
          <p className="text-slate-600 text-xs">
            {copy.bottom}
          </p>
        </div>
      </div>
    </footer>
  );
}
