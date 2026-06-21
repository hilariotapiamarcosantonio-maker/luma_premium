import type { Metadata } from 'next';
import { Stethoscope, Layers, Sparkles, Boxes, GraduationCap, LineChart } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PremiumBadge from '@/components/site/PremiumBadge';
import MethodJourney, { type MethodPhase } from '@/components/site/MethodJourney';
import EditorialFigure from '@/components/site/EditorialFigure';
import { MotionSection } from '@/components/site/Motion';
import CTASection from '@/components/site/CTASection';
import { EDITORIAL_IMAGES } from '@/data/marketing-images';

export const metadata: Metadata = {
  title: 'Método',
  description:
    'El método consultivo de Luma Premium: diagnóstico, arquitectura, diseño, implementación, entrega y optimización. Diseñamos antes de construir.',
  openGraph: {
    title: 'Método | Luma Premium',
    description: 'Un proceso consultivo que justifica una implementación seria.',
    type: 'website',
  },
};

const PHASES: MethodPhase[] = [
  {
    icon: Stethoscope,
    title: 'Diagnóstico comercial',
    description:
      'Entendemos su operación: cómo capta, responde, organiza y convierte hoy. Identificamos fugas y oportunidades antes de proponer nada.',
    deliverable: 'Lectura ejecutiva de la operación',
    result: 'Claridad sobre dónde se pierde demanda',
  },
  {
    icon: Layers,
    title: 'Arquitectura de solución',
    description:
      'Diseñamos el sistema sobre el papel: rutas comerciales, captación, seguimiento y control. Definimos qué se construye y por qué.',
    deliverable: 'Mapa del sistema y alcance',
    result: 'Un plan claro antes de invertir',
  },
  {
    icon: Sparkles,
    title: 'Diseño de experiencia',
    description:
      'Traducimos la arquitectura a una experiencia premium, coherente con la marca y pensada para vender con autoridad.',
    deliverable: 'Diseño de interfaz y mensajes',
    result: 'Una marca que se percibe seria',
  },
  {
    icon: Boxes,
    title: 'Implementación',
    description:
      'Construimos el sistema de forma ágil y segura, conectando captación, organización y conversión en un mismo flujo.',
    deliverable: 'Sistema funcionando y conectado',
    result: 'Operación lista para vender',
  },
  {
    icon: GraduationCap,
    title: 'Entrega y entrenamiento',
    description:
      'Entregamos el sistema funcionando y preparamos a su equipo para operarlo con criterio, no por improvisación.',
    deliverable: 'Entrega y capacitación del equipo',
    result: 'Equipo autónomo con el sistema',
  },
  {
    icon: LineChart,
    title: 'Optimización y mantenimiento',
    description:
      'Acompañamos la evolución: medimos, ajustamos y escalamos la infraestructura a medida que crece la operación.',
    deliverable: 'Métricas y mejoras por ciclo',
    result: 'Una operación que mejora sola',
  },
];

export default function MetodoPage() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <PremiumBadge tone="amber" className="mx-auto lg:mx-0">
              Método de trabajo
            </PremiumBadge>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Diseñamos antes de construir.
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Un proceso consultivo de seis fases que convierte una inversión seria
              en una operación comercial medible. Menos improvisación, más
              trazabilidad.
            </p>
          </div>
          <EditorialFigure
            image={EDITORIAL_IMAGES.method}
            locale="es"
            priority
            aspect="aspect-[16/10]"
            caption="Arquitectura antes que construcción"
          />
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <MotionSection>
            <MethodJourney
              phases={PHASES}
              labels={{ deliverable: 'Entregable', result: 'Resultado' }}
            />
          </MotionSection>
        </div>
      </section>

      <section className="py-20 px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white leading-snug">
            Por eso una implementación Luma Premium no se cotiza como una página
            web. Se cotiza como{' '}
            <span className="text-amber-500">infraestructura comercial</span>.
          </h2>
        </div>
      </section>

      <CTASection
        title="Empiece por el diagnóstico."
        subtitle="La primera fase del método es entender su operación. Solicite su evaluación comercial digital."
        primary={{ label: 'Solicitar evaluación', href: '/diagnostico' }}
        secondary={{ label: 'Ver soluciones', href: '/soluciones' }}
      />
    </SiteShell>
  );
}
