import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';

export const metadata: Metadata = {
  title: 'Solicitud recibida',
  description: 'Su evaluación comercial ha sido recibida. Luma Premium revisará su perfil y se pondrá en contacto en 24–48 h.',
  robots: { index: false },
};

export default function GraciasPage() {
  return (
    <SiteShell>
      <section className="min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
            <ShieldCheck className="w-10 h-10 text-amber-500" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Solicitud recibida
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              Hemos recibido su información de forma segura.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-left space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              Nuestro equipo revisará su perfil comercial y evaluará el sistema que mejor se adapta a su operación.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nos pondremos en contacto en las próximas{' '}
              <strong className="text-white font-semibold">24–48 horas laborables</strong>{' '}
              para agendar la evaluación ejecutiva.
            </p>
            <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
              Si desea hablar antes, puede escribirnos directamente por WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/18492122647?text=Hola%2C+ya+envié+mi+solicitud+de+evaluación+en+Luma+Premium."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-6 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link
              href="/soluciones"
              className="flex-1 flex items-center justify-center gap-2 border border-slate-700 text-slate-300 px-6 py-4 rounded-sm font-medium hover:bg-slate-900 transition-colors text-sm"
            >
              Ver soluciones <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Link href="/" className="block text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
