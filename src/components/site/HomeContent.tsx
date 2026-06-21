import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Megaphone,
  Filter,
  Target,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import SolutionCard from './SolutionCard';
import HomeCasesList from './HomeCasesList';
import CTASection from './CTASection';
import PremiumBadge from './PremiumBadge';
import HeroComposition from './HeroComposition';
import CommercialFlowBand from './CommercialFlowBand';
import EcosystemLayers from './EcosystemLayers';
import IndustriesSection from './IndustriesSection';
import { MotionSection, MotionStagger, MotionItem } from './Motion';
import HomeScreenshotShowcase from './HomeScreenshotShowcase';
import { SOLUTIONS } from '@/lib/solutions';
import { CASES, EN_CASES } from '@/lib/cases';

type Locale = 'es' | 'en';

const TEXTS = {
  es: {
    heroKicker: 'Firma de arquitectura comercial digital',
    heroTitle: 'Sistemas comerciales',
    heroTitleSpan: 'para vender con autoridad.',
    heroSub: 'Sistemas comerciales digitales para negocios premium que necesitan captar, responder, organizar y convertir oportunidades con más autoridad, seguimiento y control.',
    ctaPrimary: 'Solicitar evaluación',
    ctaSecondary: 'Ver soluciones',
    
    promesa: 'Luma Premium no es una agencia digital. Es una firma que diseña la infraestructura comercial con la que un negocio premium capta, responde, organiza y convierte.',
    
    probBadge: 'El problema',
    probTitle: 'Presencia digital fuerte, operación comercial desordenada.',
    probSub: 'Muchos negocios premium ya invierten en marca y publicidad, pero su operación comercial vive en chats sueltos, hojas de cálculo y seguimiento improvisado. La demanda existe; lo que falta es el sistema.',
    probCards: [
      'Leads que llegan y se enfrían sin respuesta a tiempo.',
      'No se sabe qué campaña generó qué venta.',
      'El seguimiento depende de la memoria de cada persona.',
      'La marca se ve premium, pero la venta se siente amateur.',
    ],
    
    whatBadge: 'Qué hace Luma Premium',
    whatTitle: 'Diseñamos el sistema, no solo la página.',
    whatSub: 'Cada solución es una arquitectura comercial completa: presentación, captación, respuesta, organización y conversión, conectadas en un mismo flujo.',
    
    pillar1Title: '1. Captar con autoridad',
    pillar1Desc: 'Presentación premium y rutas comerciales que atraen al perfil correcto desde cada campaña.',
    pillar1Label: 'Captar',
    p1AdLabel: 'Sponsored',
    p1AdTitle: 'Villa Esmeralda - Punta Cana',
    p1AdBody: 'Rutas comerciales segmentadas para inversores y segunda vivienda.',
    p1AdBtn: 'Ver proyecto',
    
    pillar2Title: '2. Responder y organizar',
    pillar2Desc: 'Concierge, seguimiento y un centro de control donde ningún prospecto se pierde.',
    pillar2Label: 'Responder',
    p2ChatQ: '¿Prefiere financiamiento o pago al contado?',
    p2ChatA: 'Contado, busco retorno inmediato.',
    p2ChatTag: 'Intención: Inversor • Cash Buyer',
    
    pillar3Title: '3. Convertir con control',
    pillar3Desc: 'Trazabilidad de punta a punta: menos improvisación, decisiones con datos reales.',
    pillar3Label: 'Convertir',
    p3ConvLabel: 'Tasa Conversión',
    p3ConvVal: '14.8%',
    p3LeadsLabel: 'Leads Atendidos',
    p3LeadsVal: '100%',
    p3AttribLabel: 'Atribución Campañas',
    p3AttribVal: '76% ROI',
    
    flowBadge: 'El flujo',
    flowTitle: 'De la captación a la operación, en un solo sistema.',
    flowSub: 'Cada etapa alimenta a la siguiente. No es una página suelta: es un flujo comercial conectado donde nada se pierde por el camino.',
    
    solBadge: 'Líneas de solución',
    solTitle: 'Un sistema por nicho, no una landing genérica.',
    solSub: 'Cada línea resuelve un dolor comercial concreto y tiene su propia ruta de venta.',
    solSeeAll: 'Ver todas las soluciones',
    
    ecoBadge: 'Ecosistema Luma Premium',
    ecoTitle: 'No construimos piezas sueltas. Diseñamos ecosistemas comerciales por vertical.',
    ecoDesc1: 'Captación, respuesta, seguimiento y conversión en un mismo ecosistema. Cada capa sostiene una consecuencia comercial: de la presencia digital al control comercial.',
    ecoDesc2: 'Cada negocio premium necesita su propia arquitectura comercial.',
    
    metBadge: 'Método',
    metTitle: 'Un proceso consultivo que justifica una implementación seria.',
    metSub: 'Diagnóstico, arquitectura, diseño, implementación, entrega y optimización. No improvisamos: diseñamos antes de construir.',
    metSeeFull: 'Ver el método completo',
    metSteps: [
      'Diagnóstico comercial',
      'Arquitectura de solución',
      'Diseño de experiencia',
      'Implementación y entrega',
    ],
    
    casesBadge: 'Casos y demos',
    casesTitle: 'Sistemas reales, no maquetas.',
    casesSub: 'Referencias autorizadas para ver la arquitectura Luma en funcionamiento. Haga clic en la captura para ampliar.',
    casesSeeAll: 'Ver todos los casos',
    
    finalCtaTitle: 'Solicite una evaluación comercial digital.',
    finalCtaSub: 'Analizamos su captación, seguimiento y conversión actual, y le recomendamos el sistema correcto para vender con más autoridad y control.',
    finalCtaFoot: 'Para negocios premium que ya venden o quieren vender mejor.',
  },
  en: {
    heroKicker: 'Commercial Digital Architecture Firm',
    heroTitle: 'Commercial systems',
    heroTitleSpan: 'to sell with authority.',
    heroSub: 'Connected commercial systems for premium businesses built to capture, qualify, and convert opportunities with more authority, follow-up, and control.',
    ctaPrimary: 'Request assessment',
    ctaSecondary: 'View solutions',
    
    promesa: 'Luma Premium is not a digital agency. It is a firm that designs the commercial infrastructure with which a premium business captures, responds, organizes, and converts.',
    
    probBadge: 'The problem',
    probTitle: 'Strong digital presence, disorganized sales operations.',
    probSub: 'Many premium businesses already invest in brand and advertising, but their sales operations live in scattered chats, spreadsheets, and improvised follow-ups. Demand exists; what is missing is the system.',
    probCards: [
      'Leads arrive and go cold without a timely response.',
      'Unknown which campaign generated which sale.',
      'Follow-up depends on each person\'s memory.',
      'The brand looks premium, but sales feel amateur.',
    ],
    
    whatBadge: 'What Luma Premium does',
    whatTitle: 'We design the system, not just the website.',
    whatSub: 'Each solution is a complete commercial architecture: presentation, capture, response, organization, and conversion, connected in a single flow.',
    
    pillar1Title: '1. Capture with authority',
    pillar1Desc: 'Premium digital presence that positions, qualifies, and converts before the first call.',
    pillar1Label: 'Capture',
    p1AdLabel: 'Sponsored',
    p1AdTitle: 'Villa Esmeralda - Punta Cana',
    p1AdBody: 'Segmented commercial routes for investors and second homes.',
    p1AdBtn: 'View project',
    
    pillar2Title: '2. Respond & organize',
    pillar2Desc: 'Intelligent concierge that handles inquiries with speed, consistency, and commercial authority.',
    pillar2Label: 'Respond',
    p2ChatQ: 'Do you prefer financing or cash payment?',
    p2ChatA: 'Cash, looking for immediate returns.',
    p2ChatTag: 'Intent: Investor • Cash Buyer',
    
    pillar3Title: '3. Convert with control',
    pillar3Desc: 'End-to-end traceability: less improvisation, decisions based on real data.',
    pillar3Label: 'Convert',
    p3ConvLabel: 'Conversion Rate',
    p3ConvVal: '14.8%',
    p3LeadsLabel: 'Leads Handled',
    p3LeadsVal: '100%',
    p3AttribLabel: 'Campaign Attribution',
    p3AttribVal: '76% ROI',
    
    flowBadge: 'The flow',
    flowTitle: 'From capture to operation, in one single system.',
    flowSub: 'Each stage feeds the next. Not a standalone page: it is a connected commercial flow where nothing is lost along the way.',
    
    solBadge: 'Solution lines',
    solTitle: 'One system per niche, not a generic landing page.',
    solSub: 'Each line solves a specific commercial pain point and has its own sales route.',
    solSeeAll: 'View all solutions',
    
    ecoBadge: 'Luma Premium Ecosystem',
    ecoTitle: 'We do not build separate parts. We design commercial ecosystems by vertical.',
    ecoDesc1: 'Capture, response, follow-up, and conversion in the same ecosystem. Each layer supports a commercial consequence: from digital presence to commercial control.',
    ecoDesc2: 'Every premium business needs its own commercial architecture.',
    
    metBadge: 'Method',
    metTitle: 'A consultative process that justifies a serious implementation.',
    metSub: 'Assessment, architecture, design, implementation, handoff, and optimization. We do not improvise: we design before we build.',
    metSeeFull: 'View full method',
    metSteps: [
      'Commercial assessment',
      'Solution architecture',
      'Experience design',
      'Implementation & delivery',
    ],
    
    casesBadge: 'Cases & references',
    casesTitle: 'Real systems. Not mockups.',
    casesSub: 'Authorized references to see the Luma architecture in action. Click on any screenshot to expand.',
    casesSeeAll: 'View all cases',
    
    finalCtaTitle: 'Request a commercial digital assessment.',
    finalCtaSub: 'We analyze your current capture, follow-up, and conversion, and recommend the right system for your business to sell with authority and control.',
    finalCtaFoot: 'For premium businesses that already sell or want to sell better.',
  },
} as const;

export default function HomeContent({ locale = 'es' }: { locale?: Locale }) {
  const t = TEXTS[locale];
  const isEn = locale === 'en';
  const solutions = SOLUTIONS.slice(0, 3);
  const cases = isEn ? EN_CASES.slice(0, 3) : CASES.slice(0, 3);

  const diagHref = isEn ? '/en/assessment' : '/diagnostico';
  const solHref = isEn ? '/en/solutions' : '/soluciones';
  const metHref = isEn ? '/en/method' : '/metodo';
  const casesHref = isEn ? '/en/cases' : '/casos';

  return (
    <HomeScreenshotShowcase locale={locale}>
      {/* 1 · Hero */}
      <section className="relative pt-32 pb-16 md:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_rgba(37,99,235,0.06),_rgba(30,41,59,0.35),_transparent_70%)] -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[40%_60%] gap-12 lg:gap-8 items-center">
          {/* Copy Column */}
          <div className="text-center lg:text-left space-y-6">
            <PremiumBadge pulse tone="amber" className="mx-auto lg:mx-0">
              {t.heroKicker}
            </PremiumBadge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7.5xl font-bold text-white tracking-tight leading-[1.05]">
              {t.heroTitle} <br className="hidden sm:inline lg:hidden" />
              <span className="text-slate-400 font-light">{t.heroTitleSpan}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t.heroSub}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
              <Link
                href={diagHref}
                className="w-full sm:w-auto bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                {t.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={solHref}
                className="w-full sm:w-auto px-8 py-4 rounded-sm font-medium text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Interactive Screen Showcase Column */}
          <div className="relative pb-6 lg:pb-0 w-full max-w-xl md:max-w-3xl lg:max-w-none mx-auto">
            <HeroComposition locale={locale} />
          </div>
        </div>
      </section>

      {/* 2 · Promesa / Frase guía (Alternated background: Graphite石油) */}
      <section className="py-16 px-6 border-y border-slate-800/40 bg-slate-900/10">
        <MotionSection className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white leading-snug">
            {t.promesa}
          </h2>
        </MotionSection>
      </section>

      {/* 3 · El problema */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <MotionSection>
            <SectionHeading
              badge={t.probBadge}
              title={t.probTitle}
              subtitle={t.probSub}
            />
          </MotionSection>
          <MotionStagger className="grid sm:grid-cols-2 gap-4">
            {t.probCards.map((item) => (
              <MotionItem
                key={item}
                className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/10 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/[0.01] transition-all duration-300"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mb-4" />
                <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* 4 · Qué hace Luma Premium (Pilares) - Alternated Background: Deep Petroleum */}
      <section className="py-20 md:py-24 px-6 border-y border-slate-900/60 bg-slate-900/20 bg-gradient-to-b from-slate-900/10 to-blue-950/5 relative">
        {/* Background ambient lighting layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_center,_rgba(16,185,129,0.02),_transparent_80%)] -z-10" />
        <div className="max-w-7xl mx-auto">
          <MotionSection>
            <SectionHeading
              center
              badge={t.whatBadge}
              title={t.whatTitle}
              subtitle={t.whatSub}
              className="mb-16"
            />
          </MotionSection>
          
          <div className="relative">
            {/* Visual desktop horizontal connector lines */}
            <div className="hidden lg:block absolute top-[135px] inset-x-[15%] h-px border-t border-dashed border-slate-800 -z-10" />
            
            <MotionStagger className="grid lg:grid-cols-3 gap-8 relative z-10">
              {/* Pilar 1: Captar (Amber Theme) */}
              <MotionItem className="flex flex-col p-8 rounded-2xl border border-slate-800/80 bg-slate-950/70 h-full justify-between overflow-hidden relative group hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/[0.02] transition-all duration-300">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors" />
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/15 bg-amber-500/5 group-hover:border-amber-500/40 transition-colors">
                      <Megaphone className="w-5 h-5 text-amber-500" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-500/60 uppercase tracking-widest">{t.pillar1Label}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{t.pillar1Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.pillar1Desc}
                  </p>
                </div>
                {/* Visual Ad UI fragment */}
                <div className="mt-4 rounded-xl border border-slate-850 bg-slate-900/30 p-4 text-[10px] space-y-2.5 transition-colors group-hover:border-slate-800">
                  <div className="flex items-center gap-2 border-b border-slate-800/50 pb-2">
                    <span className="h-5 w-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-[8px]">L</span>
                    <div>
                      <span className="block font-semibold text-white leading-none">Luma Estate OS</span>
                      <span className="text-[7px] text-slate-500">{t.p1AdLabel}</span>
                    </div>
                  </div>
                  <div className="rounded border border-slate-850 bg-slate-950/60 p-2.5 text-slate-400">
                    <span className="block font-medium text-white mb-1">{t.p1AdTitle}</span>
                    <span className="block text-[8px] leading-tight text-slate-500">{t.p1AdBody}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/40 p-2 rounded">
                    <span className="text-[8px] font-mono text-slate-500 truncate max-w-[120px]">luma-estate.com/punta-cana</span>
                    <span className="bg-white text-slate-950 px-2 py-0.5 rounded-sm font-semibold text-[8px]">{t.p1AdBtn}</span>
                  </div>
                </div>
              </MotionItem>

              {/* Pilar 2: Responder (Teal/Emerald Theme) */}
              <MotionItem className="flex flex-col p-8 rounded-2xl border border-slate-800/80 bg-slate-950/70 h-full justify-between overflow-hidden relative group hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/[0.02] transition-all duration-300">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/5 group-hover:border-emerald-500/40 transition-colors">
                      <Filter className="w-5 h-5 text-emerald-400" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400/60 uppercase tracking-widest">{t.pillar2Label}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{t.pillar2Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.pillar2Desc}
                  </p>
                </div>
                {/* Visual Chat UI fragment */}
                <div className="mt-4 rounded-xl border border-slate-850 bg-slate-900/30 p-4 text-[10px] space-y-2.5 transition-colors group-hover:border-slate-800">
                  <div className="space-y-2 max-h-[105px] overflow-hidden">
                    <div className="max-w-[85%] rounded bg-slate-950/80 border border-slate-850 p-2 text-slate-300 leading-snug">
                      {t.p2ChatQ}
                    </div>
                    <div className="ml-auto max-w-[85%] rounded bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-400 leading-snug">
                      {t.p2ChatA}
                    </div>
                    <div className="flex items-center gap-1.5 justify-center py-1 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[8px] font-semibold">
                      <span>{t.p2ChatTag}</span>
                    </div>
                  </div>
                </div>
              </MotionItem>

              {/* Pilar 3: Convertir (Indigo/Blue Theme) */}
              <MotionItem className="flex flex-col p-8 rounded-2xl border border-slate-800/80 bg-slate-950/70 h-full justify-between overflow-hidden relative group hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.02] transition-all duration-300">
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors" />
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/15 bg-indigo-500/5 group-hover:border-indigo-500/40 transition-colors">
                      <Target className="w-5 h-5 text-indigo-400" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-indigo-400/60 uppercase tracking-widest">{t.pillar3Label}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{t.pillar3Title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.pillar3Desc}
                  </p>
                </div>
                {/* Visual Chart UI fragment */}
                <div className="mt-4 rounded-xl border border-slate-850 bg-slate-900/30 p-4 text-[10px] space-y-2.5 transition-colors group-hover:border-slate-800">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-950/60 rounded border border-slate-850 p-2">
                      <span className="block text-[7px] text-slate-500 uppercase font-mono tracking-wider">{t.p3ConvLabel}</span>
                      <span className="block font-bold text-emerald-400 text-[11px] mt-0.5">{t.p3ConvVal}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded border border-slate-850 p-2">
                      <span className="block text-[7px] text-slate-500 uppercase font-mono tracking-wider">{t.p3LeadsLabel}</span>
                      <span className="block font-bold text-white text-[11px] mt-0.5">{t.p3LeadsVal}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[7px] text-slate-500 font-mono">
                      <span>{t.p3AttribLabel}</span>
                      <span className="text-slate-300">{t.p3AttribVal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded overflow-hidden">
                      <div className="h-full w-[76%] bg-amber-500 rounded" />
                    </div>
                  </div>
                </div>
              </MotionItem>
            </MotionStagger>
          </div>
        </div>
      </section>

      {/* 5 · Flujo comercial conectado (Background: Graphite) */}
      <section className="py-20 md:py-24 px-6 border-b border-slate-900/60 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="mb-10 max-w-2xl">
            <SectionHeading
              badge={t.flowBadge}
              title={t.flowTitle}
              subtitle={t.flowSub}
            />
          </MotionSection>
          <MotionSection delay={0.1}>
            <CommercialFlowBand locale={locale} />
          </MotionSection>
        </div>
      </section>

      {/* 6 · Soluciones */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <SectionHeading
              badge={t.solBadge}
              title={t.solTitle}
              subtitle={t.solSub}
            />
            <Link
              href={solHref}
              className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 transition-colors whitespace-nowrap text-sm"
            >
              {t.solSeeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </MotionSection>
          <MotionStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <MotionItem key={s.slug} className="h-full">
                <SolutionCard solution={s} locale={locale} />
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* 7 · Sectores atendidos */}
      <IndustriesSection locale={locale} />

      {/* 8 · Ecosistema Luma Premium (Background: Petroleum) */}
      <section className="py-20 md:py-24 px-6 border-y border-slate-900 bg-slate-900/20 bg-gradient-to-b from-slate-900/10 to-blue-950/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_center,_rgba(59,130,246,0.02),_transparent_80%)] -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionSection className="space-y-6">
            <PremiumBadge>{t.ecoBadge}</PremiumBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              {t.ecoTitle}
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              {t.ecoDesc1}
            </p>
            <p className="text-slate-300 font-medium text-sm sm:text-base border-l-2 border-amber-500/60 pl-4 py-1">
              {t.ecoDesc2}
            </p>
          </MotionSection>
          <MotionSection delay={0.1}>
            <EcosystemLayers />
          </MotionSection>
        </div>
      </section>

      {/* 9 · Método (Background: Graphite) */}
      <section className="py-20 md:py-24 px-6 border-b border-slate-900/60 bg-slate-900/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <MotionSection>
            <SectionHeading
              badge={t.metBadge}
              title={t.metTitle}
              subtitle={t.metSub}
            />
          </MotionSection>
          <MotionStagger className="space-y-4">
            {t.metSteps.map((step, i) => (
              <MotionItem
                key={step}
                className="flex items-center gap-4 p-5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-colors"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/40 text-amber-500 text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-300 font-medium text-sm sm:text-base">{step}</span>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
        <div className="max-w-7xl mx-auto mt-8 lg:text-right">
          <Link
            href={metHref}
            className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 transition-colors text-sm"
          >
            {t.metSeeFull} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10 · Casos destacados */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <SectionHeading
              badge={t.casesBadge}
              title={t.casesTitle}
              subtitle={t.casesSub}
            />
            <Link
              href={casesHref}
              className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 transition-colors whitespace-nowrap text-sm"
            >
              {t.casesSeeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </MotionSection>
          
          <HomeCasesList cases={cases} locale={locale} />
        </div>
      </section>

      {/* 11 · CTA final */}
      <CTASection
        title={t.finalCtaTitle}
        subtitle={t.finalCtaSub}
        primary={{ label: t.ctaPrimary, href: diagHref }}
        secondary={{ label: t.ctaSecondary, href: solHref }}
        footnote={t.finalCtaFoot}
      />
    </HomeScreenshotShowcase>
  );
}
