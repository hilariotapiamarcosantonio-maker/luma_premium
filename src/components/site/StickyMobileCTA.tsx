'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

// CTA sticky premium solo en móvil. Aparece tras hacer scroll y no tapa el footer.
export default function StickyMobileCTA({
  label = 'Solicitar evaluación',
  href = '/diagnostico',
}: {
  label?: string;
  href?: string;
}) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  // No mostrar el sticky donde ya hay un CTA principal/formulario inmediato,
  // ni en la propia ruta destino.
  const HIDDEN_ROUTES = ['/diagnostico', '/contacto'];
  const hidden = pathname === href || HIDDEN_ROUTES.includes(pathname);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 600;
      // Ocultar cerca del fondo para no chocar con el footer.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 220;
      setVisible(scrolled && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent absolute inset-0 -z-10" />
      <Link
        href={href}
        className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg ring-1 ring-amber-500/15 transition-colors hover:bg-slate-100"
      >
        {label} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
