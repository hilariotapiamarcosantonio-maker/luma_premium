import { Metadata } from 'next';
import Link from 'next/link';
import LumaFooter from '@/components/luma-estate/LumaFooter';

export const metadata: Metadata = {
  title: 'Auditoría Comercial | Luma Estate OS',
  description: 'Diagnóstico ejecutivo para identificar fugas de leads y evaluar su infraestructura comercial inmobiliaria.',
};

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-6 font-sans">
      <div className="max-w-3xl mx-auto pt-24 pb-24">
        <Link href="/luma-estate-os" className="text-slate-500 hover:text-white transition-colors mb-8 inline-block text-sm font-medium">
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
        
        <form className="space-y-8 bg-slate-900/30 border border-slate-800 p-8 md:p-12 rounded-2xl" action="/luma-estate-os/gracias">
          
          <div className="border-b border-slate-800 pb-8 space-y-8">
            <h3 className="text-xl font-semibold text-white">Datos Ejecutivos</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400">Nombre Completo</label>
                <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700" placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400">Correo Corporativo</label>
                <input type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700" placeholder="director@suempresa.com" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400">Tipo de Operación</label>
                <select required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                  <option value="" disabled selected>Seleccione el perfil</option>
                  <option>Inmobiliaria Boutique</option>
                  <option>Desarrollador de Proyectos</option>
                  <option>Equipo Comercial Mayorista</option>
                  <option>Agente Top Producer</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400">Volumen de Propiedades</label>
                <select required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                  <option value="" disabled selected>Cantidad aproximada</option>
                  <option>1 - 5 proyectos exclusivos</option>
                  <option>6 - 20 propiedades</option>
                  <option>21 - 50 propiedades</option>
                  <option>Más de 50 propiedades</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-800 pb-8 space-y-8">
            <h3 className="text-xl font-semibold text-white">Infraestructura Actual</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400">Canales de Captación</label>
                <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700" placeholder="Meta Ads, Google, Referidos..." />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-400">¿Invierten en publicidad?</label>
                <select required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                  <option value="" disabled selected>Seleccione opción</option>
                  <option>Sí, constantemente</option>
                  <option>Sí, de forma esporádica</option>
                  <option>No, todo es orgánico/referidos</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400">¿Usan CRM actualmente?</label>
              <select required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                <option value="" disabled selected>Estado tecnológico</option>
                <option>Sí, y tenemos visibilidad de principio a fin</option>
                <option>Sí, pero no está integrado a la captación (mucha carga manual)</option>
                <option>No, usamos Excel / WhatsApp para el seguimiento</option>
              </select>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-white">Objetivo Comercial</h3>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400">Principal fuga comercial (El &quot;Dolor&quot;)</label>
              <textarea required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all h-28 placeholder:text-slate-700" placeholder="Ej: Las campañas generan leads pero el equipo no logra contactarlos a tiempo, o no sabemos qué anuncio realmente trajo la venta de alto ticket..." />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400">Rango de inversión estimado para su infraestructura comercial</label>
              <select required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all">
                <option value="" disabled selected>Seleccione un rango</option>
                <option>US$1,500 - US$3,000 (Auditoría / Base inicial)</option>
                <option>US$3,000 - US$6,500 (Foundation)</option>
                <option>US$6,500 - US$12,000 (Foundation Avanzado)</option>
                <option>US$12,000+ (Enterprise / Arquitectura Privada)</option>
                <option>Aún estoy definiendo la inversión</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-white text-slate-950 font-bold p-5 rounded-sm hover:bg-slate-200 transition-colors mt-8 text-lg shadow-lg shadow-white/5">
            Solicitar Evaluación Ejecutiva
          </button>
          
          <p className="text-center text-xs text-slate-600 mt-4">
            Al enviar esta solicitud, confirmas que diriges o eres parte de la directiva de una operación inmobiliaria.
          </p>
        </form>
      </div>

      <LumaFooter />
    </main>
  );
}