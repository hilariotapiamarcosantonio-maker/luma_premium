"use client";

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronLeft, Check, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/site';

type Locale = 'es' | 'en';

type Industry =
  | 'real-estate'
  | 'commerce'
  | 'beauty-spa'
  | 'education'
  | 'professional-services'
  | 'local-services'
  | 'finance'
  | 'hospitality'
  | 'health'
  | 'tech-saas'
  | 'other'
  | '';

type NonEmptyIndustry = Exclude<Industry, ''>;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  preferredLanguage: Locale;
  role: string;
  industry: Industry;
  industryDetail: string;
  teamSize: string;
  leadVolume: string;
  acquisitionChannels: string;
  advertisingStatus: string;
  currentTools: string[];
  mainBottleneck: string;
  desiredOutcome: string;
  solutionInterest: string;
  timeline: string;
  investmentRange: string;
  consentContact: boolean;
  _website: string;
}

const INDUSTRY_VALUES: NonEmptyIndustry[] = [
  'real-estate',
  'commerce',
  'beauty-spa',
  'education',
  'professional-services',
  'local-services',
  'finance',
  'hospitality',
  'health',
  'tech-saas',
  'other',
];

const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-sm px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700';

const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider';

const COUNTRIES = {
  es: [
    ['DO', 'República Dominicana'],
    ['US', 'Estados Unidos'],
    ['MX', 'México'],
    ['CO', 'Colombia'],
    ['PR', 'Puerto Rico'],
    ['PA', 'Panamá'],
    ['GT', 'Guatemala'],
    ['EC', 'Ecuador'],
    ['PE', 'Perú'],
    ['AR', 'Argentina'],
    ['CL', 'Chile'],
    ['ES', 'España'],
    ['other', 'Otro'],
  ],
  en: [
    ['DO', 'Dominican Republic'],
    ['US', 'United States'],
    ['MX', 'Mexico'],
    ['CO', 'Colombia'],
    ['PR', 'Puerto Rico'],
    ['PA', 'Panama'],
    ['GT', 'Guatemala'],
    ['EC', 'Ecuador'],
    ['PE', 'Peru'],
    ['AR', 'Argentina'],
    ['CL', 'Chile'],
    ['ES', 'Spain'],
    ['other', 'Other'],
  ],
} satisfies Record<Locale, [string, string][]>;

const FORM_COPY = {
  es: {
    stepOf: (current: number, total: number) => `Paso ${current} de ${total}`,
    errors: {
      fullName: 'El nombre es obligatorio.',
      email: 'Ingrese un correo válido.',
      phone: 'Ingrese un teléfono o WhatsApp válido.',
      country: 'Seleccione un país.',
      role: 'El cargo o función es obligatorio.',
      industry: 'Seleccione su sector.',
      teamSize: 'Seleccione el tamaño del equipo.',
      advertisingStatus: 'Indique si invierte en publicidad.',
      mainBottleneck: 'Describa la principal dificultad.',
      investmentRange: 'Seleccione un rango de inversión.',
      consent: 'Debe aceptar el consentimiento de contacto.',
      generic: 'Error al procesar. Intente nuevamente.',
      connection: 'Error de conexión. Por favor intente nuevamente.',
    },
    profileTitle: 'Perfil ejecutivo',
    profileDescription: 'Información básica para preparar su evaluación.',
    labels: {
      fullName: 'Nombre completo *',
      email: 'Correo de trabajo *',
      phone: 'WhatsApp / Teléfono *',
      company: 'Empresa o marca',
      country: 'País *',
      role: 'Cargo o función *',
      preferredLanguage: 'Idioma preferido',
      industry: 'Sector o industria *',
      teamSize: 'Tamaño del equipo *',
      leadVolume: 'Volumen de leads o clientes al mes',
      acquisitionChannels: 'Canales de captación principales',
      advertisingStatus: '¿Invierten actualmente en publicidad? *',
      currentTools: 'Sistemas que utilizan actualmente (seleccione todos los que apliquen)',
      mainBottleneck: 'Principal dificultad comercial *',
      desiredOutcome: 'Resultado que desea conseguir',
      solutionInterest: 'Solución de interés',
      timeline: 'Plazo estimado para implementar',
      investmentRange: 'Capacidad aproximada de inversión para implementación *',
    },
    placeholders: {
      fullName: 'Juan Pérez',
      email: 'juan@empresa.com',
      phone: '+1 809 000 0000',
      company: 'Nombre de su empresa',
      role: 'Ej. Director, CEO, Fundador',
      acquisitionChannels: 'Meta Ads, Google, referidos, orgánico...',
      mainBottleneck:
        'Ej: Generamos leads pero no logramos contactarlos a tiempo. El seguimiento es manual y se pierden oportunidades...',
      desiredOutcome:
        'Ej: Quiero un sistema que capte, responda automáticamente y lleve registro de cada oportunidad.',
    },
    select: {
      country: 'Seleccione un país',
      industry: 'Seleccione su sector',
      generic: 'Seleccione',
      leadVolume: 'Aproximado',
      solutionInterest: 'Seleccione una opción',
      investmentRange: 'Seleccione un rango',
    },
    operationTitle: 'Su operación',
    operationDescription: 'Cuéntenos sobre su negocio para preparar la evaluación correcta.',
    objectiveTitle: 'Objetivo comercial',
    objectiveDescription: 'Cuéntenos qué resultado busca y evaluaremos juntos si podemos ayudarle.',
    investmentNote: 'Estos rangos son para calificar la implementación, no el diagnóstico inicial.',
    consent:
      'Autorizo a Luma Premium a contactarme para presentar la evaluación de mi operación. No comparto información con terceros.',
    back: 'Anterior',
    continue: 'Continuar',
    submitting: 'Enviando...',
    submit: 'Solicitar evaluación ejecutiva',
    whatsapp: 'Prefiero hablar directamente por WhatsApp',
    whatsappMessage: 'Hola, quiero solicitar una evaluación comercial con Luma Premium.',
    industries: [
      ['real-estate', 'Inmobiliaria / construcción'],
      ['commerce', 'Comercio / e-commerce'],
      ['beauty-spa', 'Beauty / spa / estética'],
      ['education', 'Educación / academia / coaching'],
      ['professional-services', 'Servicios profesionales'],
      ['local-services', 'Servicios locales premium'],
      ['finance', 'Finanzas / préstamos'],
      ['hospitality', 'Hospitalidad / turismo'],
      ['health', 'Salud / clínica'],
      ['tech-saas', 'Tecnología / SaaS'],
      ['other', 'Otro'],
    ],
    industryDynamic: {
      'real-estate': ['¿Cuántas propiedades o proyectos administra?', 'Ej. 5-20 propiedades activas'],
      commerce: ['¿Cuántos productos o pedidos gestiona mensualmente?', 'Ej. 200+ pedidos/mes'],
      'beauty-spa': ['¿Cuántas citas, especialistas o ubicaciones gestiona?', 'Ej. 3 sedes, 8 especialistas'],
      education: ['¿Cuántos programas, estudiantes o prospectos gestiona?', 'Ej. 2 programas, 150 alumnos'],
      'professional-services': ['¿Cuántas consultas u oportunidades recibe al mes?', 'Ej. 30-50 prospectos/mes'],
      'local-services': ['¿Cuántos clientes o solicitudes maneja mensualmente?', 'Ej. 80 solicitudes/mes'],
      finance: ['¿Cuántas solicitudes de préstamo o consultas recibe?', 'Ej. 40 solicitudes/mes'],
      hospitality: ['¿Cuántas propiedades, habitaciones o reservas gestiona?', 'Ej. 1 hotel, 30 habitaciones'],
      health: ['¿Cuántas consultas o pacientes atiende mensualmente?', 'Ej. 200 citas/mes'],
      'tech-saas': ['¿Cuántos usuarios, clientes o leads gestiona?', 'Ej. 500 usuarios activos'],
      other: ['Describe brevemente el tipo de operación.', 'Describe tu negocio'],
    },
    tools: [
      ['crm', 'CRM propio o de terceros'],
      ['website', 'Página web'],
      ['whatsapp', 'WhatsApp Business'],
      ['sheets', 'Hojas de cálculo'],
      ['calendar', 'Agenda digital'],
      ['custom', 'Sistema propio'],
      ['none', 'Sin sistema integrado'],
    ],
    teamSizes: ['Solo (emprendedor)', '2-5 personas', '6-15 personas', '16-50 personas', 'Más de 50 personas'],
    leadVolumes: ['Menos de 20', '20-50', '50-200', 'Más de 200'],
    advertisingStatuses: [
      'Sí, constantemente',
      'Sí, esporádicamente',
      'No, todo es orgánico/referidos',
      'Comenzando a invertir',
    ],
    solutions: [
      'Diagnóstico comercial',
      'Sitio o experiencia digital premium',
      'CRM comercial',
      'Concierge inteligente',
      'Automatización de seguimiento',
      'Commerce OS',
      'Real Estate OS',
      'Beauty Spa OS',
      'Sistema personalizado',
      'No sé todavía; necesito recomendación',
    ],
    timelines: ['Inmediato (este mes)', '1-3 meses', '3-6 meses', 'Más de 6 meses', 'Todavía evaluando'],
    investmentRanges: [
      'US$5,000 - US$10,000',
      'US$10,000 - US$25,000',
      'US$25,000 - US$50,000',
      'US$50,000+',
      'Necesito diagnóstico antes de definirlo',
    ],
  },
  en: {
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
    errors: {
      fullName: 'Full name is required.',
      email: 'Enter a valid email address.',
      phone: 'Enter a valid phone or WhatsApp number.',
      country: 'Select a country.',
      role: 'Role or function is required.',
      industry: 'Select your industry.',
      teamSize: 'Select your team size.',
      advertisingStatus: 'Tell us whether you currently invest in ads.',
      mainBottleneck: 'Describe the main commercial bottleneck.',
      investmentRange: 'Select an investment range.',
      consent: 'You must accept the contact consent.',
      generic: 'Something went wrong. Please try again.',
      connection: 'Connection error. Please try again.',
    },
    profileTitle: 'Executive profile',
    profileDescription: 'Basic information to prepare your assessment.',
    labels: {
      fullName: 'Full name *',
      email: 'Work email *',
      phone: 'WhatsApp / Phone *',
      company: 'Company or brand',
      country: 'Country *',
      role: 'Role or function *',
      preferredLanguage: 'Preferred language',
      industry: 'Industry *',
      teamSize: 'Team size *',
      leadVolume: 'Monthly lead or customer volume',
      acquisitionChannels: 'Main acquisition channels',
      advertisingStatus: 'Do you currently invest in advertising? *',
      currentTools: 'Systems you currently use (select all that apply)',
      mainBottleneck: 'Main commercial bottleneck *',
      desiredOutcome: 'Desired outcome',
      solutionInterest: 'Solution of interest',
      timeline: 'Estimated implementation timeline',
      investmentRange: 'Approximate implementation investment capacity *',
    },
    placeholders: {
      fullName: 'John Smith',
      email: 'john@company.com',
      phone: '+1 809 000 0000',
      company: 'Your company name',
      role: 'E.g. Director, CEO, Founder',
      acquisitionChannels: 'Meta Ads, Google, referrals, organic...',
      mainBottleneck:
        'Example: We generate leads but do not contact them fast enough. Follow-up is manual and opportunities get lost...',
      desiredOutcome:
        'Example: I want a system that captures, responds automatically, and tracks every opportunity.',
    },
    select: {
      country: 'Select a country',
      industry: 'Select your industry',
      generic: 'Select',
      leadVolume: 'Approximate',
      solutionInterest: 'Select an option',
      investmentRange: 'Select a range',
    },
    operationTitle: 'Your operation',
    operationDescription: 'Tell us about your business so we can prepare the right assessment.',
    objectiveTitle: 'Commercial objective',
    objectiveDescription: 'Tell us what outcome you want and we will assess whether we can help.',
    investmentNote: 'These ranges qualify the implementation, not the initial assessment.',
    consent:
      'I authorize Luma Premium to contact me to present the assessment of my operation. I do not share information with third parties.',
    back: 'Back',
    continue: 'Continue',
    submitting: 'Sending...',
    submit: 'Request executive assessment',
    whatsapp: 'I prefer to talk directly on WhatsApp',
    whatsappMessage: 'Hello, I want to request a commercial assessment with Luma Premium.',
    industries: [
      ['real-estate', 'Real estate / construction'],
      ['commerce', 'Commerce / e-commerce'],
      ['beauty-spa', 'Beauty / spa / aesthetics'],
      ['education', 'Education / academy / coaching'],
      ['professional-services', 'Professional services'],
      ['local-services', 'Premium local services'],
      ['finance', 'Finance / lending'],
      ['hospitality', 'Hospitality / tourism'],
      ['health', 'Health / clinic'],
      ['tech-saas', 'Technology / SaaS'],
      ['other', 'Other'],
    ],
    industryDynamic: {
      'real-estate': ['How many properties or projects do you manage?', 'E.g. 5-20 active properties'],
      commerce: ['How many products or orders do you manage monthly?', 'E.g. 200+ orders/month'],
      'beauty-spa': ['How many appointments, specialists, or locations do you manage?', 'E.g. 3 locations, 8 specialists'],
      education: ['How many programs, students, or prospects do you manage?', 'E.g. 2 programs, 150 students'],
      'professional-services': ['How many consultations or opportunities do you receive monthly?', 'E.g. 30-50 prospects/month'],
      'local-services': ['How many customers or requests do you manage monthly?', 'E.g. 80 requests/month'],
      finance: ['How many loan applications or consultations do you receive?', 'E.g. 40 applications/month'],
      hospitality: ['How many properties, rooms, or bookings do you manage?', 'E.g. 1 hotel, 30 rooms'],
      health: ['How many consultations or patients do you handle monthly?', 'E.g. 200 appointments/month'],
      'tech-saas': ['How many users, customers, or leads do you manage?', 'E.g. 500 active users'],
      other: ['Briefly describe your type of operation.', 'Describe your business'],
    },
    tools: [
      ['crm', 'First-party or third-party CRM'],
      ['website', 'Website'],
      ['whatsapp', 'WhatsApp Business'],
      ['sheets', 'Spreadsheets'],
      ['calendar', 'Digital calendar'],
      ['custom', 'Custom system'],
      ['none', 'No integrated system'],
    ],
    teamSizes: ['Solo founder', '2-5 people', '6-15 people', '16-50 people', 'More than 50 people'],
    leadVolumes: ['Less than 20', '20-50', '50-200', 'More than 200'],
    advertisingStatuses: [
      'Yes, consistently',
      'Yes, occasionally',
      'No, everything is organic/referrals',
      'Starting to invest',
    ],
    solutions: [
      'Commercial assessment',
      'Premium site or digital experience',
      'Commercial CRM',
      'Intelligent concierge',
      'Follow-up automation',
      'Commerce OS',
      'Real Estate OS',
      'Beauty Spa OS',
      'Custom system',
      'Not sure yet; I need a recommendation',
    ],
    timelines: ['Immediate (this month)', '1-3 months', '3-6 months', 'More than 6 months', 'Still evaluating'],
    investmentRanges: [
      'US$5,000 - US$10,000',
      'US$10,000 - US$25,000',
      'US$25,000 - US$50,000',
      'US$50,000+',
      'I need an assessment before defining it',
    ],
  },
} satisfies Record<Locale, {
  stepOf: (current: number, total: number) => string;
  errors: Record<string, string>;
  profileTitle: string;
  profileDescription: string;
  labels: Record<string, string>;
  placeholders: Record<string, string>;
  select: Record<string, string>;
  operationTitle: string;
  operationDescription: string;
  objectiveTitle: string;
  objectiveDescription: string;
  investmentNote: string;
  consent: string;
  back: string;
  continue: string;
  submitting: string;
  submit: string;
  whatsapp: string;
  whatsappMessage: string;
  industries: [NonEmptyIndustry, string][];
  industryDynamic: Record<NonEmptyIndustry, [string, string]>;
  tools: [string, string][];
  teamSizes: string[];
  leadVolumes: string[];
  advertisingStatuses: string[];
  solutions: string[];
  timelines: string[];
  investmentRanges: string[];
}>;

function isIndustry(value: string | null): value is NonEmptyIndustry {
  return !!value && INDUSTRY_VALUES.includes(value as NonEmptyIndustry);
}

function createEmpty(locale: Locale, industry: Industry): FormData {
  return {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    preferredLanguage: locale,
    role: '',
    industry,
    industryDetail: '',
    teamSize: '',
    leadVolume: '',
    acquisitionChannels: '',
    advertisingStatus: '',
    currentTools: [],
    mainBottleneck: '',
    desiredOutcome: '',
    solutionInterest: '',
    timeline: '',
    investmentRange: '',
    consentContact: false,
    _website: '',
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 20;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function StepIndicator({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              i < current
                ? 'bg-amber-500 text-slate-950'
                : i === current
                  ? 'border-2 border-amber-500 text-amber-500'
                  : 'border border-slate-700 text-slate-600'
            }`}
          >
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-10 transition-all ${i < current ? 'bg-amber-500' : 'bg-slate-800'}`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs text-slate-500">{label}</span>
    </div>
  );
}

export default function DiagnosticoMaestroForm({ locale = 'es' }: { locale?: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = FORM_COPY[locale];
  const requestedIndustry = searchParams.get('industry');
  const initialIndustry: Industry = isIndustry(requestedIndustry) ? requestedIndustry : '';

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(() => createEmpty(locale, initialIndustry || ''));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [stepError, setStepError] = useState('');
  const submitLockRef = useRef(false);

  function set(field: keyof FormData, value: string | boolean | string[]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleTool(val: string) {
    setForm((f) => {
      if (val === 'none') {
        return { ...f, currentTools: f.currentTools.includes('none') ? [] : ['none'] };
      }
      const tools = f.currentTools.includes(val)
        ? f.currentTools.filter((t) => t !== val)
        : [...f.currentTools, val];
      return { ...f, currentTools: tools.filter((t) => t !== 'none') };
    });
  }

  function validateStep(s: number): string | null {
    if (s === 0) {
      if (!form.fullName.trim()) return copy.errors.fullName;
      if (!isValidEmail(form.email.trim())) return copy.errors.email;
      if (!isValidPhone(form.phone.trim())) return copy.errors.phone;
      if (!form.country.trim()) return copy.errors.country;
      if (!form.role.trim()) return copy.errors.role;
    }
    if (s === 1) {
      if (!form.industry) return copy.errors.industry;
      if (!form.teamSize) return copy.errors.teamSize;
      if (!form.advertisingStatus) return copy.errors.advertisingStatus;
    }
    if (s === 2) {
      if (!form.mainBottleneck.trim()) return copy.errors.mainBottleneck;
      if (!form.investmentRange) return copy.errors.investmentRange;
      if (!form.consentContact) return copy.errors.consent;
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError('');
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStepError('');
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitLockRef.current) return;

    const err = validateStep(2);
    if (err) {
      setStepError(err);
      return;
    }
    if (form._website) return;

    submitLockRef.current = true;
    setSubmitting(true);
    setSubmitError('');

    try {
      const source = searchParams.get('source') || (locale === 'en' ? 'assessment' : 'diagnostico');
      const payload = {
        schema_version: '2',
        locale: form.preferredLanguage,
        full_name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        country: form.country,
        industry: form.industry,
        industry_detail: form.industryDetail.trim(),
        team_size: form.teamSize,
        lead_volume: form.leadVolume,
        acquisition_channels: form.acquisitionChannels.trim(),
        advertising_status: form.advertisingStatus,
        current_tools: form.currentTools.join(', '),
        main_bottleneck: form.mainBottleneck.trim(),
        desired_outcome: form.desiredOutcome.trim(),
        solution_interest: form.solutionInterest,
        timeline: form.timeline,
        investment_range: form.investmentRange,
        consent_contact: form.consentContact,
        source,
        page_origin: window.location.href,
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_content: searchParams.get('utm_content') || '',
        utm_term: searchParams.get('utm_term') || '',
        _website: form._website,
      };

      const res = await fetch('/api/luma-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(locale === 'en' ? '/en/assessment/thank-you' : '/diagnostico/gracias');
        return;
      }

      const json = await res.json();
      setSubmitError(json.error || copy.errors.generic);
      submitLockRef.current = false;
      setSubmitting(false);
    } catch {
      setSubmitError(copy.errors.connection);
      submitLockRef.current = false;
      setSubmitting(false);
    }
  }

  const dynField = form.industry ? copy.industryDynamic[form.industry] : null;

  return (
    <div id="assessment-form" className="scroll-mt-24">
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12">
        <StepIndicator current={step} total={3} label={copy.stepOf(step + 1, 3)} />

        {stepError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm mb-6">
            {stepError}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{copy.profileTitle}</h2>
              <p className="text-slate-500 text-sm">{copy.profileDescription}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label={copy.labels.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  className={inputClass}
                  placeholder={copy.placeholders.fullName}
                  maxLength={120}
                />
              </Field>
              <Field label={copy.labels.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={inputClass}
                  placeholder={copy.placeholders.email}
                  maxLength={200}
                />
              </Field>
              <Field label={copy.labels.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={inputClass}
                  placeholder={copy.placeholders.phone}
                  maxLength={30}
                />
              </Field>
              <Field label={copy.labels.company}>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  className={inputClass}
                  placeholder={copy.placeholders.company}
                  maxLength={150}
                />
              </Field>
              <Field label={copy.labels.country}>
                <select
                  value={form.country}
                  onChange={(e) => set('country', e.target.value)}
                  className={inputClass}
                >
                  <option value="">{copy.select.country}</option>
                  {COUNTRIES[locale].map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <Field label={copy.labels.role}>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                  className={inputClass}
                  placeholder={copy.placeholders.role}
                  maxLength={100}
                />
              </Field>
            </div>

            <Field label={copy.labels.preferredLanguage}>
              <div className="flex gap-3">
                {[
                  { value: 'es' as const, label: 'Español' },
                  { value: 'en' as const, label: 'English' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('preferredLanguage', opt.value)}
                    className={`px-5 py-2.5 rounded-sm text-sm font-medium border transition-all ${
                      form.preferredLanguage === opt.value
                        ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            <input
              type="text"
              name="_website"
              value={form._website}
              onChange={(e) => set('_website', e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{copy.operationTitle}</h2>
              <p className="text-slate-500 text-sm">{copy.operationDescription}</p>
            </div>

            <Field label={copy.labels.industry}>
              <select
                value={form.industry}
                onChange={(e) => set('industry', e.target.value as Industry)}
                className={inputClass}
              >
                <option value="">{copy.select.industry}</option>
                {copy.industries.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>

            {form.industry && dynField && (
              <Field label={dynField[0]}>
                <input
                  type="text"
                  value={form.industryDetail}
                  onChange={(e) => set('industryDetail', e.target.value)}
                  className={inputClass}
                  placeholder={dynField[1]}
                  maxLength={300}
                />
              </Field>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <Field label={copy.labels.teamSize}>
                <select
                  value={form.teamSize}
                  onChange={(e) => set('teamSize', e.target.value)}
                  className={inputClass}
                >
                  <option value="">{copy.select.generic}</option>
                  {copy.teamSizes.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </Field>
              <Field label={copy.labels.leadVolume}>
                <select
                  value={form.leadVolume}
                  onChange={(e) => set('leadVolume', e.target.value)}
                  className={inputClass}
                >
                  <option value="">{copy.select.leadVolume}</option>
                  {copy.leadVolumes.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={copy.labels.acquisitionChannels}>
              <input
                type="text"
                value={form.acquisitionChannels}
                onChange={(e) => set('acquisitionChannels', e.target.value)}
                className={inputClass}
                placeholder={copy.placeholders.acquisitionChannels}
                maxLength={300}
              />
            </Field>

            <Field label={copy.labels.advertisingStatus}>
              <select
                value={form.advertisingStatus}
                onChange={(e) => set('advertisingStatus', e.target.value)}
                className={inputClass}
              >
                <option value="">{copy.select.generic}</option>
                {copy.advertisingStatuses.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </Field>

            <Field label={copy.labels.currentTools}>
              <div className="flex flex-wrap gap-2 mt-1">
                {copy.tools.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleTool(value)}
                    className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all ${
                      form.currentTools.includes(value)
                        ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{copy.objectiveTitle}</h2>
              <p className="text-slate-500 text-sm">{copy.objectiveDescription}</p>
            </div>

            <Field label={copy.labels.mainBottleneck}>
              <textarea
                value={form.mainBottleneck}
                onChange={(e) => set('mainBottleneck', e.target.value)}
                className={`${inputClass} h-28 resize-none`}
                placeholder={copy.placeholders.mainBottleneck}
                maxLength={1000}
              />
            </Field>

            <Field label={copy.labels.desiredOutcome}>
              <textarea
                value={form.desiredOutcome}
                onChange={(e) => set('desiredOutcome', e.target.value)}
                className={`${inputClass} h-24 resize-none`}
                placeholder={copy.placeholders.desiredOutcome}
                maxLength={800}
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label={copy.labels.solutionInterest}>
                <select
                  value={form.solutionInterest}
                  onChange={(e) => set('solutionInterest', e.target.value)}
                  className={inputClass}
                >
                  <option value="">{copy.select.solutionInterest}</option>
                  {copy.solutions.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </Field>
              <Field label={copy.labels.timeline}>
                <select
                  value={form.timeline}
                  onChange={(e) => set('timeline', e.target.value)}
                  className={inputClass}
                >
                  <option value="">{copy.select.generic}</option>
                  {copy.timelines.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={copy.labels.investmentRange}>
              <select
                value={form.investmentRange}
                onChange={(e) => set('investmentRange', e.target.value)}
                className={inputClass}
              >
                <option value="">{copy.select.investmentRange}</option>
                {copy.investmentRanges.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
              <p className="text-xs text-slate-600 mt-1.5">{copy.investmentNote}</p>
            </Field>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.consentContact}
                onChange={(e) => set('consentContact', e.target.checked)}
                className="sr-only"
              />
              <span
                className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                  form.consentContact
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'
                }`}
                aria-hidden="true"
              >
                {form.consentContact && <Check className="w-3 h-3 text-slate-950" />}
              </span>
              <span className="text-sm text-slate-400 leading-relaxed">
                {copy.consent} <span className="text-slate-600">*</span>
              </span>
            </label>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm">
                {submitError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={back}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm border border-slate-700 text-slate-300 hover:bg-slate-900 transition-colors text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> {copy.back}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
              >
                {submitting ? copy.submitting : copy.submit}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={whatsappLink(copy.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              {copy.whatsapp}
            </a>
          </form>
        )}

        {step < 2 && (
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm border border-slate-700 text-slate-300 hover:bg-slate-900 transition-colors text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> {copy.back}
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors text-sm shadow-lg shadow-white/5"
            >
              {copy.continue} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
