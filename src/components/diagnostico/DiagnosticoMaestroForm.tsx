"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronLeft, Check, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/site';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface FormData {
  // Step 1 — Profile
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  preferredLanguage: string;
  role: string;
  // Step 2 — Operation
  industry: Industry;
  industryDetail: string;
  teamSize: string;
  leadVolume: string;
  acquisitionChannels: string;
  advertisingStatus: string;
  currentTools: string[];
  // Step 3 — Objective
  mainBottleneck: string;
  desiredOutcome: string;
  solutionInterest: string;
  timeline: string;
  investmentRange: string;
  consentContact: boolean;
  // Honeypot
  _website: string;
}

const EMPTY: FormData = {
  fullName: '', email: '', phone: '', company: '', country: '',
  preferredLanguage: 'es', role: '',
  industry: '', industryDetail: '', teamSize: '', leadVolume: '',
  acquisitionChannels: '', advertisingStatus: '', currentTools: [],
  mainBottleneck: '', desiredOutcome: '', solutionInterest: '',
  timeline: '', investmentRange: '', consentContact: false,
  _website: '',
};

// ─── Industry config ──────────────────────────────────────────────────────────

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'real-estate',           label: 'Inmobiliaria / construcción' },
  { value: 'commerce',              label: 'Comercio / e-commerce' },
  { value: 'beauty-spa',            label: 'Beauty / spa / estética' },
  { value: 'education',             label: 'Educación / academia / coaching' },
  { value: 'professional-services', label: 'Servicios profesionales' },
  { value: 'local-services',        label: 'Servicios locales premium' },
  { value: 'finance',               label: 'Finanzas / préstamos' },
  { value: 'hospitality',           label: 'Hospitalidad / turismo' },
  { value: 'health',                label: 'Salud / clínica' },
  { value: 'tech-saas',             label: 'Tecnología / SaaS' },
  { value: 'other',                 label: 'Otro' },
];

const INDUSTRY_DYNAMIC: Record<Industry, { label: string; placeholder: string; type: 'select' | 'text' }> = {
  'real-estate':           { label: '¿Cuántas propiedades o proyectos administra?',       placeholder: 'Ej. 5–20 propiedades activas', type: 'text' },
  'commerce':              { label: '¿Cuántos productos o pedidos gestiona mensualmente?', placeholder: 'Ej. 200+ pedidos/mes',         type: 'text' },
  'beauty-spa':            { label: '¿Cuántas citas, especialistas o ubicaciones gestiona?', placeholder: 'Ej. 3 sedes, 8 especialistas', type: 'text' },
  'education':             { label: '¿Cuántos programas, estudiantes o prospectos gestiona?', placeholder: 'Ej. 2 programas, 150 alumnos', type: 'text' },
  'professional-services': { label: '¿Cuántas consultas u oportunidades recibe al mes?',  placeholder: 'Ej. 30–50 prospectos/mes',     type: 'text' },
  'local-services':        { label: '¿Cuántos clientes o solicitudes maneja mensualmente?', placeholder: 'Ej. 80 solicitudes/mes',      type: 'text' },
  'finance':               { label: '¿Cuántas solicitudes de préstamo o consultas recibe?', placeholder: 'Ej. 40 solicitudes/mes',      type: 'text' },
  'hospitality':           { label: '¿Cuántas propiedades, habitaciones o reservas gestiona?', placeholder: 'Ej. 1 hotel, 30 habitaciones', type: 'text' },
  'health':                { label: '¿Cuántas consultas o pacientes atiende mensualmente?', placeholder: 'Ej. 200 citas/mes',            type: 'text' },
  'tech-saas':             { label: '¿Cuántos usuarios, clientes o leads gestiona?',       placeholder: 'Ej. 500 usuarios activos',      type: 'text' },
  'other':                 { label: 'Describe brevemente el tipo de operación.',           placeholder: 'Describe tu negocio',           type: 'text' },
  '':                      { label: '', placeholder: '', type: 'text' },
};

const TOOLS = [
  { value: 'crm',        label: 'CRM propio o de terceros' },
  { value: 'website',    label: 'Página web' },
  { value: 'whatsapp',   label: 'WhatsApp Business' },
  { value: 'sheets',     label: 'Hojas de cálculo' },
  { value: 'calendar',   label: 'Agenda digital' },
  { value: 'custom',     label: 'Sistema propio' },
  { value: 'none',       label: 'Sin sistema integrado' },
];

const SOLUTIONS_OPTIONS = [
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
];

const INVESTMENT_RANGES_INTL = [
  'US$5,000 – US$10,000',
  'US$10,000 – US$25,000',
  'US$25,000 – US$50,000',
  'US$50,000+',
  'Necesito diagnóstico antes de definirlo',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-sm px-4 py-3.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-700';

const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
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
      <span className="ml-2 text-xs text-slate-500">Paso {current + 1} de {total}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DiagnosticoMaestroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(() => ({
    ...EMPTY,
    industry: (searchParams.get('industry') as Industry) || '',
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function set(field: keyof FormData, value: string | boolean | string[]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleTool(val: string) {
    setForm((f) => {
      const tools = f.currentTools.includes(val)
        ? f.currentTools.filter((t) => t !== val)
        : [...f.currentTools, val];
      // "none" is mutually exclusive
      if (val === 'none') return { ...f, currentTools: f.currentTools.includes('none') ? [] : ['none'] };
      return { ...f, currentTools: tools.filter((t) => t !== 'none') };
    });
  }

  function validateStep(s: number): string | null {
    if (s === 0) {
      if (!form.fullName.trim()) return 'El nombre es obligatorio.';
      if (!form.email.trim() || !form.email.includes('@')) return 'Ingrese un correo válido.';
      if (!form.phone.trim()) return 'El teléfono o WhatsApp es obligatorio.';
      if (!form.country.trim()) return 'Seleccione un país.';
      if (!form.role.trim()) return 'El cargo o función es obligatorio.';
    }
    if (s === 1) {
      if (!form.industry) return 'Seleccione su sector.';
      if (!form.teamSize) return 'Seleccione el tamaño del equipo.';
      if (!form.advertisingStatus) return 'Indique si invierte en publicidad.';
    }
    if (s === 2) {
      if (!form.mainBottleneck.trim()) return 'Describa la principal dificultad.';
      if (!form.investmentRange) return 'Seleccione un rango de inversión.';
      if (!form.consentContact) return 'Debe aceptar el consentimiento de contacto.';
    }
    return null;
  }

  const [stepError, setStepError] = useState('');

  function next() {
    const err = validateStep(step);
    if (err) { setStepError(err); return; }
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
    const err = validateStep(2);
    if (err) { setStepError(err); return; }
    if (form._website) return; // honeypot
    setSubmitting(true);
    setSubmitError('');
    try {
      const source = searchParams.get('source') || 'diagnostico';
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
        source,
        page_origin: window.location.href,
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
        utm_content: searchParams.get('utm_content') || '',
        utm_term: searchParams.get('utm_term') || '',
      };
      const res = await fetch('/api/luma-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push('/diagnostico/gracias');
      } else {
        const json = await res.json();
        setSubmitError(json.error || 'Error al procesar. Intente nuevamente.');
        setSubmitting(false);
      }
    } catch {
      setSubmitError('Error de conexión. Por favor intente nuevamente.');
      setSubmitting(false);
    }
  }

  const dynField = form.industry ? INDUSTRY_DYNAMIC[form.industry] : null;

  return (
    <div id="assessment-form" className="scroll-mt-24">
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 md:p-12">
        <StepIndicator current={step} total={3} />

        {stepError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm mb-6">
            {stepError}
          </div>
        )}

        {/* ── STEP 0: Profile ── */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Perfil ejecutivo</h2>
              <p className="text-slate-500 text-sm">Información básica para preparar su evaluación.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Nombre completo *">
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  className={inputClass}
                  placeholder="Juan Pérez"
                  maxLength={120}
                />
              </Field>
              <Field label="Correo de trabajo *">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={inputClass}
                  placeholder="juan@empresa.com"
                  maxLength={200}
                />
              </Field>
              <Field label="WhatsApp / Teléfono *">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={inputClass}
                  placeholder="+1 809 000 0000"
                  maxLength={30}
                />
              </Field>
              <Field label="Empresa o marca">
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  className={inputClass}
                  placeholder="Nombre de su empresa"
                  maxLength={150}
                />
              </Field>
              <Field label="País *">
                <select
                  value={form.country}
                  onChange={(e) => set('country', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccione un país</option>
                  <option value="DO">República Dominicana</option>
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                  <option value="CO">Colombia</option>
                  <option value="PR">Puerto Rico</option>
                  <option value="PA">Panamá</option>
                  <option value="GT">Guatemala</option>
                  <option value="EC">Ecuador</option>
                  <option value="PE">Perú</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="ES">España</option>
                  <option value="other">Otro</option>
                </select>
              </Field>
              <Field label="Cargo o función *">
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                  className={inputClass}
                  placeholder="Ej. Director, CEO, Fundador"
                  maxLength={100}
                />
              </Field>
            </div>
            <Field label="Idioma preferido">
              <div className="flex gap-3">
                {[
                  { value: 'es', label: 'Español' },
                  { value: 'en', label: 'English' },
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
            {/* Honeypot */}
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

        {/* ── STEP 1: Operation ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Su operación</h2>
              <p className="text-slate-500 text-sm">Cuéntenos sobre su negocio para preparar la evaluación correcta.</p>
            </div>
            <Field label="Sector o industria *">
              <select
                value={form.industry}
                onChange={(e) => set('industry', e.target.value as Industry)}
                className={inputClass}
              >
                <option value="">Seleccione su sector</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </Field>

            {/* Dynamic field per industry */}
            {form.industry && dynField && (
              <Field label={dynField.label}>
                <input
                  type="text"
                  value={form.industryDetail}
                  onChange={(e) => set('industryDetail', e.target.value)}
                  className={inputClass}
                  placeholder={dynField.placeholder}
                  maxLength={300}
                />
              </Field>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Tamaño del equipo *">
                <select
                  value={form.teamSize}
                  onChange={(e) => set('teamSize', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccione</option>
                  <option value="Solo (emprendedor)">Solo (emprendedor)</option>
                  <option value="2–5 personas">2–5 personas</option>
                  <option value="6–15 personas">6–15 personas</option>
                  <option value="16–50 personas">16–50 personas</option>
                  <option value="Más de 50 personas">Más de 50 personas</option>
                </select>
              </Field>
              <Field label="Volumen de leads o clientes al mes">
                <select
                  value={form.leadVolume}
                  onChange={(e) => set('leadVolume', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Aproximado</option>
                  <option value="Menos de 20">Menos de 20</option>
                  <option value="20–50">20–50</option>
                  <option value="50–200">50–200</option>
                  <option value="Más de 200">Más de 200</option>
                </select>
              </Field>
            </div>

            <Field label="Canales de captación principales">
              <input
                type="text"
                value={form.acquisitionChannels}
                onChange={(e) => set('acquisitionChannels', e.target.value)}
                className={inputClass}
                placeholder="Meta Ads, Google, referidos, orgánico..."
                maxLength={300}
              />
            </Field>

            <Field label="¿Invierten actualmente en publicidad? *">
              <select
                value={form.advertisingStatus}
                onChange={(e) => set('advertisingStatus', e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccione</option>
                <option value="Sí, constantemente">Sí, constantemente</option>
                <option value="Sí, esporádicamente">Sí, esporádicamente</option>
                <option value="No, todo es orgánico/referidos">No, todo es orgánico/referidos</option>
                <option value="Comenzando a invertir">Comenzando a invertir</option>
              </select>
            </Field>

            <Field label="Sistemas que utilizan actualmente (seleccione todos los que apliquen)">
              <div className="flex flex-wrap gap-2 mt-1">
                {TOOLS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => toggleTool(t.value)}
                    className={`px-4 py-2 rounded-sm text-xs font-medium border transition-all ${
                      form.currentTools.includes(t.value)
                        ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── STEP 2: Objective ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Objetivo comercial</h2>
              <p className="text-slate-500 text-sm">Cuéntenos qué resultado busca y evaluaremos juntos si podemos ayudarle.</p>
            </div>

            <Field label="Principal dificultad comercial *">
              <textarea
                value={form.mainBottleneck}
                onChange={(e) => set('mainBottleneck', e.target.value)}
                className={`${inputClass} h-28 resize-none`}
                placeholder="Ej: Generamos leads pero no logramos contactarlos a tiempo. El seguimiento es manual y se pierden oportunidades..."
                maxLength={1000}
              />
            </Field>

            <Field label="Resultado que desea conseguir">
              <textarea
                value={form.desiredOutcome}
                onChange={(e) => set('desiredOutcome', e.target.value)}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Ej: Quiero un sistema que capte, responda automáticamente y lleve registro de cada oportunidad."
                maxLength={800}
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Solución de interés">
                <select
                  value={form.solutionInterest}
                  onChange={(e) => set('solutionInterest', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccione una opción</option>
                  {SOLUTIONS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Plazo estimado para implementar">
                <select
                  value={form.timeline}
                  onChange={(e) => set('timeline', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleccione</option>
                  <option value="Inmediato (este mes)">Inmediato (este mes)</option>
                  <option value="1–3 meses">1–3 meses</option>
                  <option value="3–6 meses">3–6 meses</option>
                  <option value="Más de 6 meses">Más de 6 meses</option>
                  <option value="Todavía evaluando">Todavía evaluando</option>
                </select>
              </Field>
            </div>

            <Field label="Capacidad aproximada de inversión para implementación *">
              <select
                value={form.investmentRange}
                onChange={(e) => set('investmentRange', e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccione un rango</option>
                {INVESTMENT_RANGES_INTL.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <p className="text-xs text-slate-600 mt-1.5">
                Estos rangos son para calificar la implementación, no el diagnóstico inicial.
              </p>
            </Field>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                  form.consentContact
                    ? 'border-amber-500 bg-amber-500'
                    : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'
                }`}
                onClick={() => set('consentContact', !form.consentContact)}
              >
                {form.consentContact && <Check className="w-3 h-3 text-slate-950" />}
              </div>
              <span className="text-sm text-slate-400 leading-relaxed">
                Autorizo a Luma Premium a contactarme para presentar la evaluación de mi operación.
                No comparto información con terceros.{' '}
                <span className="text-slate-600">*</span>
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
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
              >
                {submitting ? 'Enviando...' : 'Solicitar evaluación ejecutiva'}
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={whatsappLink('Hola, quiero solicitar una evaluación comercial con Luma Premium.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              Prefiero hablar directamente por WhatsApp
            </a>
          </form>
        )}

        {/* ── Navigation (steps 0 and 1) ── */}
        {step < 2 && (
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm border border-slate-700 text-slate-300 hover:bg-slate-900 transition-colors text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-sm font-semibold hover:bg-slate-200 transition-colors text-sm shadow-lg shadow-white/5"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
