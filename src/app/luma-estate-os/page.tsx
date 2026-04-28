import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Database, Globe, LineChart, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Luma Estate OS | Infraestructura Comercial Inmobiliaria',
  description: 'No construyo páginas web. Construyo infraestructura comercial inmobiliaria para captar, medir y cerrar prospectos de alto valor.',
};

export default function LumaEstateOSLanding() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-white">LUMA<span className="text-slate-500 font-light">PREMIUM</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#sistema" className="hidden md:block hover:text-white transition-colors">Sistema</Link>
            <Link href="#demo" className="hidden md:block hover:text-white transition-colors">Caso Demostrativo</Link>
            <Link href="/luma-estate-os/diagnostico" className="bg-white text-slate-950 px-5 py-2.5 rounded-sm font-medium hover:bg-slate-200 transition-colors">
              Auditoría Comercial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium text-amber-400/90 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Luma Estate OS | Foundation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            Propiedades Premium. <br />
            <span className="text-slate-500">Experiencias de venta amateur.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            Si su equipo no sabe qué campaña generó qué venta, está perdiendo dinero. 
            Luma Estate OS es el puente definitivo entre su marketing y sus comisiones.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/luma-estate-os/diagnostico" className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              Agendar Auditoría Comercial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center">
              Ver Caso de Uso
            </Link>
          </div>
        </div>
      </section>

      {/* Core Message / Pitch */}
      <section className="py-24 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-white leading-tight">
            “No construyo páginas web. Construyo infraestructura comercial inmobiliaria para captar, medir y cerrar prospectos de alto valor.”
          </h2>
          <p className="mt-6 text-slate-500">Marcos Hilario — Arquitecto de Sistemas de Venta</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="sistema" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Un sistema operativo integral</h2>
            <p className="text-slate-400 text-lg max-w-2xl">Front-end persuasivo para el cliente + Back-end analítico para su equipo directivo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <Globe className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Landings de Alto Rendimiento</h3>
              <p className="text-slate-400 leading-relaxed">
                Terminales de captación ultra-optimizadas, diseñadas para perfiles de alto patrimonio. Cero fricción, máxima persuasión.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <LineChart className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Atribución Precisa</h3>
              <p className="text-slate-400 leading-relaxed">
                Conozca el ROI exacto de su marketing. Sepa de qué anuncio o campaña proviene el prospecto antes de la primera llamada.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <Database className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">Pipeline Ejecutivo</h3>
              <p className="text-slate-400 leading-relaxed">
                Visibilidad total de los cierres del mes. Un panel premium conectado a arquitecturas ágiles para un despliegue en menos de 20 días.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase / Demo */}
      <section id="demo" className="py-24 px-6 bg-slate-900/30 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900 text-xs font-medium text-slate-300 mb-6">
                Caso Demostrativo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                El caso de la Segmentación Inmobiliaria
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                No vendemos el edificio, vendemos la oportunidad adaptada. A través de Luma Estate OS, creamos <strong className="text-white font-medium">3 terminales de captación distintas</strong> para la misma propiedad:
              </p>
              
              <ul className="space-y-6 mb-8">
                <li className="flex gap-4">
                  <div className="mt-1 bg-slate-800 p-2 rounded-md h-fit"><ShieldCheck className="w-5 h-5 text-amber-500" /></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Inversor Extranjero (Ley 171-07)</h4>
                    <p className="text-slate-400 text-sm">Enfoque 100% en beneficios y exenciones fiscales.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 bg-slate-800 p-2 rounded-md h-fit"><BarChart3 className="w-5 h-5 text-amber-500" /></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Inversor de Renta (Airbnb)</h4>
                    <p className="text-slate-400 text-sm">Proyección de TIR y ocupación garantizada.</p>
                  </div>
                </li>
              </ul>

              <p className="text-slate-300 italic border-l-2 border-slate-700 pl-4 mb-8">
                &quot;Las tres terminales alimentan el mismo CRM, pero el mensaje está adaptado a quien tiene el dinero. Esa es la diferencia entre anunciar y vender.&quot;
              </p>

              <Link href="/luma-estate-os/vista-del-rio" className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors">
                Explorar Caso Vista del Río <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden relative shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Zap className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Interfaz Luma Estate OS</p>
                  <p className="text-slate-600 text-sm mt-2">Pipeline Ejecutivo & Atribución de Tráfico</p>
                </div>
                <div className="absolute top-4 left-4 right-4 h-12 border-b border-slate-800/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-16">Proceso de Despliegue</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-slate-800 -z-10 -translate-y-1/2"></div>
            
            <div className="bg-slate-950 p-6">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-6">1</div>
              <h3 className="text-lg font-medium text-white mb-2">Auditoría Comercial</h3>
              <p className="text-slate-400 text-sm">Analizamos su fuga de leads actual y el costo de adquisición.</p>
            </div>
            <div className="bg-slate-950 p-6">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-6">2</div>
              <h3 className="text-lg font-medium text-white mb-2">Arquitectura</h3>
              <p className="text-slate-400 text-sm">Diseñamos las terminales de captación y el pipeline personalizado.</p>
            </div>
            <div className="bg-slate-950 p-6">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-xl font-bold text-amber-500 mx-auto mb-6">3</div>
              <h3 className="text-lg font-medium text-white mb-2">Despliegue</h3>
              <p className="text-slate-400 text-sm">Infraestructura lista para recibir pauta en 15-20 días.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white text-slate-950 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Deje de perder comisiones por falta de visibilidad.</h2>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Agende una auditoría ejecutiva de 20 minutos. Analizaremos su ecosistema actual y diseñaremos el roadmap para su infraestructura comercial Luma.
          </p>
          <div className="pt-4">
            <Link href="/luma-estate-os/diagnostico" className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20">
              Agendar Auditoría <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 pt-4">Solo para operaciones de alto patrimonio o agencias C-Level.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950 text-center">
        <p className="text-slate-600 text-sm">
          Luma Estate OS es un producto de <strong className="text-slate-400 font-medium">Luma Premium</strong>. <br className="md:hidden" />
          Infraestructura Comercial Inmobiliaria.
        </p>
      </footer>
    </main>
  );
}
