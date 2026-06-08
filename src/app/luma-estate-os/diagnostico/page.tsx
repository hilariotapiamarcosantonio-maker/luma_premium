import { Metadata } from 'next';
import Link from 'next/link';
import LumaFooter from '@/components/luma-estate/LumaFooter';
import DiagnosticoForm from '@/components/luma-estate/DiagnosticoForm';

export const metadata: Metadata = {
  title: { absolute: 'Auditoría Comercial | Luma Estate OS' },
  description: 'Diagnóstico ejecutivo para identificar fugas de leads y evaluar su infraestructura comercial inmobiliaria.',
};

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-6 font-sans">
      <div className="max-w-3xl mx-auto pt-20 pb-24">
        <Link href="/luma-estate-os" className="text-slate-400 hover:text-white transition-colors mb-8 inline-block text-sm font-medium">
          &larr; Volver a Luma Estate OS
        </Link>
        
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium text-amber-500 mb-6">
            Aplicación C-Level
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Auditoría Comercial</h1>
          <p className="text-xl text-slate-400 font-light leading-relaxed">
            Diagnóstico ejecutivo para identificar fugas de leads, fricción en seguimiento, debilidad de presentación y falta de atribución en su operación inmobiliaria.
          </p>
        </div>
        
        <DiagnosticoForm />
      </div>

      <LumaFooter />
    </main>
  );
}