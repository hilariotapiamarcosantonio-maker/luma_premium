import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Vista del Río - Demo Segmentación | Luma Estate OS',
  description: 'Caso demostrativo de Luma Estate OS. Una misma propiedad, 3 ángulos de venta.',
};

export default function VistaDelRioDemo() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium text-amber-400 mb-4">Caso Demostrativo</div>
        <h1 className="text-4xl font-bold text-white">Vista del Río</h1>
        <p className="text-xl text-slate-400">Demostración de Landing Segmentada</p>
        <p className="text-slate-500 border border-slate-800 p-6 rounded-lg bg-slate-900/20 leading-relaxed">
          Esta ruta está reservada para el caso de uso hiper-segmentado: <br />
          <strong className="text-white font-medium">Airbnb, Ley 171-07 y Corporativo.</strong>
          <br /><br />
          Aquí se demostrará cómo una misma propiedad cuenta con 3 terminales de captación distintas que alimentan un único CRM con atribución.
        </p>
        <div className="pt-4">
          <Link href="/luma-estate-os" className="text-amber-500 hover:text-amber-400 transition-colors font-medium">
            &larr; Volver a Luma Estate OS
          </Link>
        </div>
      </div>
    </main>
  );
}