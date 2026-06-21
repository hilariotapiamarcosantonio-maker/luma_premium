import Image from 'next/image';
import {
  Building2,
  ShoppingBag,
  Sparkles,
  GraduationCap,
  Briefcase,
  Users,
  type LucideIcon,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { MotionSection, MotionStagger, MotionItem } from './Motion';
import { INDUSTRIES } from '@/data/marketing-images';

const ICONS: Record<string, LucideIcon> = {
  Building2,
  ShoppingBag,
  Sparkles,
  GraduationCap,
  Briefcase,
  Users,
};

const COPY = {
  es: {
    badge: 'Sectores atendidos',
    title: 'Una arquitectura comercial que se adapta a tu negocio.',
    subtitle:
      'Luma Premium diseña sistemas por vertical. Estos son los sectores donde la arquitectura encaja con mayor fuerza.',
  },
  en: {
    badge: 'Industries served',
    title: 'A commercial architecture that adapts to your business.',
    subtitle:
      'Luma Premium designs systems per vertical. These are the industries where the architecture fits best.',
  },
} as const;

// Bloque "Sectores atendidos / Industries served". Server component con next/image.
export default function IndustriesSection({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const t = COPY[locale];
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <MotionSection className="mb-14">
          <SectionHeading center badge={t.badge} title={t.title} subtitle={t.subtitle} />
        </MotionSection>

        <MotionStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map((ind) => {
            const IconCmp = ICONS[ind.icon] ?? Building2;
            return (
              <MotionItem key={ind.id} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 transition-colors hover:border-slate-700">
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={ind.image.src}
                      alt={ind.image.alt[locale]}
                      width={ind.image.width}
                      height={ind.image.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-36 w-full object-cover opacity-75 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <span className="absolute bottom-3 left-4 inline-flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/80">
                        <IconCmp className="h-4 w-4 text-amber-500" />
                      </span>
                      <span className="text-sm font-semibold text-white">{ind.label[locale]}</span>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm leading-relaxed text-slate-400">
                      {ind.description[locale]}
                    </p>
                  </div>
                </div>
              </MotionItem>
            );
          })}
        </MotionStagger>

        <p className="mt-8 text-center text-xs text-slate-600">
          {locale === 'en'
            ? 'Not every system is fully built for every industry yet. We confirm scope in the assessment.'
            : 'No todos los sistemas están terminados para cada sector todavía. Confirmamos el alcance en el diagnóstico.'}
        </p>
      </div>
    </section>
  );
}
