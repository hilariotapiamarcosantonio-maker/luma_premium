import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, LineChart, Layers, Target, Activity, ExternalLink } from 'lucide-react';
import LumaFooter from '@/components/luma-estate/LumaFooter';

export const metadata: Metadata = {
  title: 'Luma Estate OS | Infraestructura Comercial Inmobiliaria',
  description: 'No construyo páginas web. Construyo infraestructura comercial inmobiliaria para captar, medir y cerrar prospectos de alto valor.',
  openGraph: {
    title: 'Luma Estate OS | Infraestructura Comercial Inmobiliaria',
    description: 'No construyo páginas web. Construyo infraestructura comercial inmobiliaria para captar, medir y cerrar prospectos de alto valor.',
    type: 'website',
  },
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
            <Link href="#oferta" className="hidden md:block hover:text-white transition-colors">Oferta</Link>
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
              Ver Caso de Segmentación
            </Link>
          </div>
        </div>
      </section>

      {/* Core Message / Pitch */}
      <section className="py-24 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-white leading-tight">
            &quot;No construyo páginas web. Construyo infraestructura comercial inmobiliaria para captar, medir y cerrar prospectos de alto valor.&quot;
          </h2>
          <p className="mt-8 text-slate-400 font-light text-lg">
            Una propiedad de alto valor no debería depender de seguimiento improvisado.
          </p>
        </div>
      </section>

      {/* NEW: Infraestructura Conectada */}
      <section id="sistema" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium text-slate-400 mb-4">
              Arquitectura del Sistema
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Infraestructura conectada</h2>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Cada capa de Luma Estate OS está diseñada para sostener una consecuencia comercial: captar mejor, seguir con criterio, medir la demanda y dirigir el pipeline inmobiliario con visibilidad ejecutiva.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <Globe className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-lg font-semibold text-white mb-3">Captación Premium</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Landings de alta conversión diseñadas para atraer perfiles de alto patrimonio. El diseño premium atrae. La infraestructura sólida cierra.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <Activity className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-lg font-semibold text-white mb-3">Seguimiento Comercial</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Recepción inmediata de leads con contexto completo de su interés. Luma Estate OS protege los prospectos que sus campañas ya pagaron.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <Target className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-lg font-semibold text-white mb-3">Atribución y Pipeline</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Saber exactamente qué anuncio genera reuniones, no solo clics. Si no puede medir esto, su operación comercial funciona por intuición.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
              <LineChart className="w-8 h-8 text-amber-500 mb-6" />
              <h3 className="text-lg font-semibold text-white mb-3">Dashboard Ejecutivo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Panel gerencial para tomar decisiones de negocio basadas en el rendimiento real del pipeline. Backend operativo ágil y seguro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase / Demo - Vista del Río */}
      <section id="demo" className="py-24 px-6 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900 text-xs font-medium text-amber-500 mb-6">
                Caso Demostrativo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                El caso de la Segmentación Inmobiliaria
              </h2>
              
              <div className="space-y-8 mb-8">
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Problema
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Una misma propiedad no convence igual a un inversionista, a un comprador corporativo o a un perfil de retiro. Cuando todo se presenta de forma genérica, el mensaje pierde precisión comercial.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Sistema construido
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Vista del Río se estructura como una propiedad con varias rutas comerciales: inversión/Airbnb, alquiler corporativo y retiro/Ley 171-07. Cada ruta tiene su propia landing, mensaje, formulario y ángulo de conversión.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Valor comercial
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Las rutas alimentan el mismo sistema de leads, atribución y seguimiento. La propiedad deja de ser una publicación aislada y se convierte en un ecosistema de captación. Una landing aislada captura. Un sistema conectado convierte.
                  </p>
                </div>
              </div>

              <Link href="/luma-estate-os/vista-del-rio" className="inline-flex items-center gap-2 text-amber-500 font-medium hover:text-amber-400 transition-colors">
                Explorar Caso Vista del Río <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden relative shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Layers className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Arquitectura de Segmentación</p>
                  <p className="text-slate-600 text-sm mt-2">1 Propiedad &rarr; 3 Terminales Comerciales</p>
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

      {/* NEW: Niveles de Oferta */}
      <section id="oferta" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Tres niveles para pasar del desorden comercial a una operación inmobiliaria medible.
            </h2>
            <p className="text-slate-400 text-lg">
              Escale su infraestructura tecnológica en función del tamaño de su operación y volumen de ventas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col">
              <div className="text-slate-500 font-medium text-sm mb-4">NIVEL 01</div>
              <h3 className="text-xl font-bold text-white mb-4">Auditoría Comercial Inmobiliaria</h3>
              <p className="text-slate-400 leading-relaxed flex-1">
                Diagnóstico ejecutivo para identificar fugas de leads, fricción en seguimiento, debilidad de presentación y falta de atribución.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border border-amber-500/30 bg-slate-900/50 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
              <div className="text-amber-500 font-medium text-sm mb-4">NIVEL 02</div>
              <h3 className="text-xl font-bold text-white mb-4">Luma Estate OS Foundation</h3>
              <p className="text-slate-400 leading-relaxed flex-1">
                Implementación ágil con landings, formularios, CRM, pipeline, dashboard y backend operativo flexible para empezar a captar y medir sin esperar meses.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col">
              <div className="text-slate-500 font-medium text-sm mb-4">NIVEL 03</div>
              <h3 className="text-xl font-bold text-white mb-4">Luma Estate OS Enterprise</h3>
              <p className="text-slate-400 leading-relaxed flex-1">
                Evolución privada con base de datos propia, login, usuarios, roles, reportes avanzados, automatizaciones y despliegue dedicado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Perfil del Arquitecto */}
      <section className="py-24 px-6 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Diseñado por Marcos Hilario</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Marcos Hilario diseña infraestructura digital premium para negocios que necesitan convertir presencia, captación y seguimiento en una operación comercial medible. 
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Luma Estate OS es la vertical inmobiliaria de esa práctica: una arquitectura pensada para propiedades, campañas, leads, visitas, cierres y decisiones ejecutivas.
            </p>
            <a 
              href="https://marcos-portfolio-premium.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white border border-slate-700 px-6 py-3 rounded-sm hover:bg-slate-800 transition-colors"
            >
              Ver portafolio de Marcos Hilario <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white text-slate-950 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Deje de perder comisiones por falta de visibilidad.</h2>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Agende una auditoría ejecutiva. Analizaremos su ecosistema actual y diseñaremos el roadmap para su infraestructura comercial Luma.
          </p>
          <div className="pt-4">
            <Link href="/luma-estate-os/diagnostico" className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-sm font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20">
              Aplicar para Diagnóstico <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm text-slate-500 pt-4 font-medium">Solo para operaciones de alto patrimonio, desarrolladores y agencias C-Level.</p>
        </div>
      </section>

      {/* Footer */}
      <LumaFooter />
    </main>
  );
}