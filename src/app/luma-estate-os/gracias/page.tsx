import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solicitud Recibida | Luma Estate OS',
  description: 'Su solicitud de auditoría comercial ha sido recibida.',
};

export default function GraciasPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-8 border border-amber-500/20">
          <ShieldCheck className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Solicitud Recibida</h1>
        <p className="text-xl text-slate-400 font-light leading-relaxed">
          Hemos recibido su información corporativa de forma segura. 
        </p>
        <p className="text-slate-500 bg-slate-900/30 p-6 border border-slate-800 rounded-xl">
          Nuestro equipo analizará su perfil para confirmar que califica para el despliegue de <strong className="text-slate-300 font-medium">Luma Estate OS</strong>. Nos pondremos en contacto en las próximas 24 horas laborables para agendar la auditoría.
        </p>
        <div className="pt-8">
          <Link href="/luma-estate-os" className="text-slate-300 font-medium border border-slate-800 px-8 py-4 rounded-sm hover:bg-slate-900 transition-colors inline-block">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}