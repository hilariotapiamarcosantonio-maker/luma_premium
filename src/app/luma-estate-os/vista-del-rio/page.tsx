import { Metadata } from 'next';
import Link from 'next/link';
import { Layers, ArrowRight, TrendingUp, Building2, CheckCircle2 } from 'lucide-react';
import LumaFooter from '@/components/luma-estate/LumaFooter';

export const metadata: Metadata = {
  title: 'Vista del Río - Segmentación Inmobiliaria | Luma Estate OS',
  description: 'El caso de segmentación inmobiliaria: Una misma propiedad, 3 ángulos de venta.',
};

export default function VistaDelRioDemo() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <nav className="fixed top-0 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/luma-estate-os" className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
            &larr; Volver a Luma Estate OS
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900 text-xs font-medium text-amber-500">
            Caso de Estudio
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-6 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">El caso de segmentación inmobiliaria</h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">Cómo convertir una publicación genérica en un ecosistema de captación comercial.</p>
        </div>

        <div className="grid gap-12">
          {/* Problema */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-white">El Problema</h2>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-slate-800 pl-6">
              Una misma propiedad no convence igual a un inversionista, a un comprador corporativo o a un perfil de retiro. Cuando todo se presenta de forma genérica, el mensaje pierde precisión comercial. La fricción aumenta y el cierre se aleja.
            </p>
          </div>

          {/* Sistema Construido */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <Layers className="absolute -right-8 -bottom-8 w-64 h-64 text-slate-800/20" />
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-white">El Sistema Construido</h2>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 relative">
              Vista del Río se estructura como una propiedad con varias rutas comerciales. Cada ruta tiene su propia landing, mensaje, formulario y ángulo de conversión.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                <TrendingUp className="w-6 h-6 text-slate-500 mb-4" />
                <h3 className="text-white font-medium mb-2">Inversión / Airbnb</h3>
                <p className="text-sm text-slate-500">Proyección de ocupación, ROI y gestión de rentas a corto plazo.</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                <Building2 className="w-6 h-6 text-slate-500 mb-4" />
                <h3 className="text-white font-medium mb-2">Alquiler Corporativo</h3>
                <p className="text-sm text-slate-500">Ubicación estratégica, comodidades para ejecutivos y contratos a largo plazo.</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-slate-500 mb-4" />
                <h3 className="text-white font-medium mb-2">Retiro / Ley 171-07</h3>
                <p className="text-sm text-slate-500">Beneficios fiscales, calidad de vida y proceso de inversión para extranjeros.</p>
              </div>
            </div>
          </div>

          {/* Valor Comercial */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-white">El Valor Comercial</h2>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-slate-800 pl-6 mb-8">
              Las rutas alimentan el mismo sistema de leads, atribución y seguimiento. La propiedad deja de ser una publicación aislada y se convierte en un ecosistema de captación.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl text-amber-200/90 font-medium italic">
              &quot;Una landing aislada captura. Un sistema conectado convierte.&quot;
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/luma-estate-os/diagnostico" className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors">
            Auditar mi Infraestructura Comercial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <LumaFooter />
    </main>
  );
}