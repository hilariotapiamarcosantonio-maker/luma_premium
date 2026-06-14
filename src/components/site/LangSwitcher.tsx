'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

// Map Spanish routes → English equivalents and vice versa.
const ES_TO_EN: Record<string, string> = {
  '/':             '/en',
  '/soluciones':   '/en/solutions',
  '/metodo':       '/en/method',
  '/casos':        '/en/cases',
  '/diagnostico':  '/en/assessment',
  '/diagnostico/gracias': '/en/assessment/thank-you',
  '/contacto':     '/en/contact',
};

const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(ES_TO_EN).map(([es, en]) => [en, es])
);

function getEquivalent(pathname: string): { isEn: boolean; opposite: string } {
  if (pathname.startsWith('/en')) {
    const esPath = EN_TO_ES[pathname] ?? EN_TO_ES[pathname.replace(/\/$/, '')] ?? '/';
    return { isEn: true, opposite: esPath };
  }
  const enPath = ES_TO_EN[pathname] ?? ES_TO_EN[pathname.replace(/\/$/, '')] ?? '/en';
  return { isEn: false, opposite: enPath };
}

export default function LangSwitcher() {
  const pathname = usePathname();
  const { isEn, opposite } = getEquivalent(pathname);
  const queryString = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('popstate', onStoreChange);
      return () => window.removeEventListener('popstate', onStoreChange);
    },
    () => window.location.search.replace(/^\?/, ''),
    () => ''
  );
  const currentHref = queryString ? `${pathname}?${queryString}` : pathname;
  const oppositeHref = queryString ? `${opposite}?${queryString}` : opposite;

  return (
    <div className="flex items-center gap-1 text-xs font-medium tracking-wider border border-slate-800 rounded-sm overflow-hidden">
      <Link
        href={isEn ? oppositeHref : currentHref}
        className={`px-2.5 py-1.5 transition-colors ${
          !isEn
            ? 'bg-slate-800 text-white'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        ES
      </Link>
      <span className="text-slate-700 select-none">|</span>
      <Link
        href={isEn ? currentHref : oppositeHref}
        className={`px-2.5 py-1.5 transition-colors ${
          isEn
            ? 'bg-slate-800 text-white'
            : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        EN
      </Link>
    </div>
  );
}
