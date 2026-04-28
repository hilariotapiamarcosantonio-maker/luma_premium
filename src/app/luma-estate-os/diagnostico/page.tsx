import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Auditoría Comercial | Luma Estate OS',
  description: 'Agende una auditoría para evaluar la infraestructura comercial de su inmobiliaria.',
};

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 p-6">
      <div className="max-w-3xl mx-auto pt-24">
        <Link href="/luma-estate-os" className="text-slate-500 hover:text-white transition-colors mb-8 inline-block text-sm">
          &larr; Volver a Luma Estate OS
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Auditoría Comercial</h1>
        <p className="text-xl text-slate-400 mb-12 font-light">Complete el formulario para calificar su operación y diseñar el roadmap de su infraestructura Luma.</p>
        
        <form className="space-y-8 bg-slate-900/40 border border-slate-800 p-8 md:p-10 rounded-xl" action="/luma-estate-os/gracias">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Nombre de la Agencia / Desarrolladora</label>
              <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 transition-colors" placeholder="Su empresa" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Correo Corporativo</label>
              <input type="email" required className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 transition-colors" placeholder="director@empresa.com" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Volumen de ventas anual estimado</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 transition-colors">
              <option value="" disabled selected>Seleccione un rango</option>
              <option>Menos de $1M USD</option>
              <option>$1M - $5M USD</option>
              <option>$5M - $20M USD</option>
              <option>Más de $20M USD</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">¿Cuenta actualmente con un CRM?</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 transition-colors">
              <option value="" disabled selected>Estado de su infraestructura</option>
              <option>Sí, pero no está integrado a la captación online</option>
              <option>Sí, y tenemos visibilidad de principio a fin</option>
              <option>No, usamos Excel / WhatsApp para el seguimiento</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Principal fuga de prospectos (El &quot;Dolor&quot;)</label>
            <textarea className="w-full bg-slate-950 border border-slate-800 rounded-sm p-4 text-slate-300 focus:outline-none focus:border-amber-500 transition-colors h-24" placeholder="Ej: Recibimos leads pero no cerramos, o perdemos rastro de quién generó la venta..." />
          </div>

          <button type="submit" className="w-full bg-white text-slate-950 font-medium p-4 rounded-sm hover:bg-slate-200 transition-colors mt-8 text-lg">
            Solicitar Evaluación Confidencial
          </button>
        </form>
      </div>
    </main>
  );
}