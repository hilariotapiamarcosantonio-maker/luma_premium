'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function StickyMobileCTA({
  label,
  href,
}: {
  label?: string;
  href?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [overlapped, setOverlapped] = useState(false);
  const pathname = usePathname();
  const isEn = pathname.startsWith('/en');
  const targetLabel = label ?? (isEn ? 'Request assessment' : 'Solicitar evaluación');
  const targetHref = href ?? (isEn ? '/en/assessment' : '/diagnostico');

  // No mostrar el sticky donde ya hay un CTA principal/formulario inmediato
  const HIDDEN_ROUTES = ['/diagnostico', '/contacto', '/en/assessment', '/en/contact'];
  const hidden = pathname === targetHref || HIDDEN_ROUTES.includes(pathname);

  // 1. Mostrar/ocultar por desplazamiento (scroll)
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setVisible(scrolled);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Observar colisiones visuales con footer, cta final y formularios
  useEffect(() => {
    if (hidden) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const isAnyVisible = entries.some((entry) => entry.isIntersecting);
      setOverlapped(isAnyVisible);
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null, // viewport
      rootMargin: '0px 0px 80px 0px', // Ocultar ligeramente antes
      threshold: 0.05, // 5% de visibilidad es suficiente para ocultar
    });

    // Encontrar elementos conflictivos
    const finalCta = document.getElementById('final-cta');
    const footer = document.querySelector('footer');
    const forms = document.querySelectorAll('form');

    const targets: Element[] = [];
    if (finalCta) targets.push(finalCta);
    if (footer) targets.push(footer);
    forms.forEach((f) => targets.push(f));

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [pathname, hidden]);

  if (hidden) return null;

  const isBarActive = visible && !overlapped;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-all duration-300 border-t border-slate-900/60 bg-slate-950/65 backdrop-blur-md shadow-2xl shadow-black/80 ${
        isBarActive
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-8 opacity-0'
      }`}
    >
      <Link
        href={targetHref}
        className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-md ring-1 ring-amber-500/10 hover:bg-slate-100 transition-all active:scale-[0.98]"
      >
        <span>{targetLabel}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
