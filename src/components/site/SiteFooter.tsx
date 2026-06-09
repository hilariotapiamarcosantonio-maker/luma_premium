import Link from 'next/link';
import { SITE, SOCIALS } from '@/lib/site';
import { SOLUTIONS } from '@/lib/solutions';
import PremiumDivider from './PremiumDivider';

// Footer madre de Luma Premium con navegación de soluciones.
export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950/70 backdrop-blur-sm font-sans">
      {/* Closing statement */}
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <p className="max-w-3xl text-2xl md:text-3xl font-medium text-white leading-snug">
          Arquitectura comercial digital para negocios que venden por{' '}
          <span className="text-amber-500">confianza, seguimiento y percepción</span>.
        </p>
        <PremiumDivider className="mt-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-white"
          >
            {SITE.brandMark.lead}
            <span className="text-slate-500 font-light">{SITE.brandMark.tail}</span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            {SITE.promise}
          </p>

          {/* Redes oficiales */}
          <div className="pt-2">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
              Redes oficiales
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
            Soluciones
          </p>
          <ul className="space-y-2">
            {SOLUTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/soluciones/${s.slug}`}
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
            Firma
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="/metodo" className="text-sm text-slate-400 hover:text-white transition-colors">
                Método
              </Link>
            </li>
            <li>
              <Link href="/casos" className="text-sm text-slate-400 hover:text-white transition-colors">
                Casos
              </Link>
            </li>
            <li>
              <Link href="/diagnostico" className="text-sm text-slate-400 hover:text-white transition-colors">
                Diagnóstico
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="text-sm text-slate-400 hover:text-white transition-colors">
                Contacto
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
            <span className="text-white/70">{SITE.founderRole}.</span>
          </p>
          <p className="text-slate-600 text-xs">
            Arquitectura comercial digital · {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
