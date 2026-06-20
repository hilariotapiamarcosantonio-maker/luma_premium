'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createManualLeadAction } from '@/app/actions/crm-manual-leads';
import { CreateManualLeadSchema } from '@/lib/crm/manual-lead-schema';
import { INDUSTRY_TAXONOMY } from '@/lib/crm/normalizers';
import { Lock, Loader2, UserCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ManualLeadFormProps {
  currentUser: {
    email: string;
    role: 'admin' | 'sales';
  };
  salesEmails: string[];
}

export default function ManualLeadForm({ currentUser, salesEmails }: ManualLeadFormProps) {
  const router = useRouter();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('DO');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [industry, setIndustry] = useState('Otros');
  const [investmentRange, setInvestmentRange] = useState('Necesito diagnóstico antes de definirlo');
  const [captureChannel, setCaptureChannel] = useState('manual');
  const [campaign, setCampaign] = useState('manual');
  const [consentToContact, setConsentToContact] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState(
    currentUser.role === 'sales' ? currentUser.email : salesEmails[0] || ''
  );
  const [priority, setPriority] = useState('medium');
  const [initialNote, setInitialNote] = useState('');

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateLeadId, setDuplicateLeadId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setDuplicateLeadId(null);
    setFieldErrors({});

    const formData = {
      full_name: fullName,
      phone: phone || undefined,
      email: email || undefined,
      company: company || undefined,
      country,
      language,
      industry,
      investment_range: investmentRange,
      capture_channel: captureChannel,
      campaign,
      consent_to_contact: consentToContact,
      owner_email: currentUser.role === 'admin' ? ownerEmail : undefined,
      priority,
      initial_note: initialNote || undefined,
    };

    // Client-side Validation using schema
    const validation = CreateManualLeadSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0];
        if (path) {
          errors[path.toString()] = err.message;
        }
      });
      setFieldErrors(errors);
      setIsSubmitting(false);
      setErrorMessage('Por favor revisa los errores en el formulario.');
      return;
    }

    try {
      const response = await createManualLeadAction(formData);

      if (response.success && response.leadId) {
        setSuccess(true);
        router.push(`/admin/leads/${response.leadId}`);
      } else {
        if (response.error === 'DUPLICATE_LEAD' && response.existingLeadId) {
          setDuplicateLeadId(response.existingLeadId);
          setErrorMessage(response.message || 'Ya existe un lead con estos datos.');
        } else {
          setErrorMessage(response.message || 'Ocurrió un error al procesar el formulario.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Block */}
      {errorMessage && (
        <div className="rounded-lg border border-red-800 bg-red-950/20 p-4 text-sm text-red-400">
          <div className="flex gap-2.5 items-start">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
              {duplicateLeadId && (
                <p className="mt-1">
                  Puedes ver el lead existente aquí:{' '}
                  <Link
                    href={`/admin/leads/${duplicateLeadId}`}
                    className="font-bold underline text-amber-500 hover:text-amber-400"
                  >
                    Ver detalle del lead duplicado
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Block */}
      {success && (
        <div className="rounded-lg border border-green-800 bg-green-950/20 p-4 text-sm text-green-400">
          <div className="flex gap-2.5 items-center">
            <UserCheck className="h-5 w-5 shrink-0" />
            <span className="font-semibold">¡Lead creado exitosamente! Redirigiendo...</span>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Nombre Completo <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej. Juan Pérez"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          />
          {fieldErrors.full_name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder="juan.perez@example.com"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Teléfono / WhatsApp
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej. +1 (809) 555-0199"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Empresa
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ej. Luma Premium SRL"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            País
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          >
            <option value="DO">República Dominicana</option>
            <option value="US">Estados Unidos</option>
            <option value="MX">México</option>
            <option value="ES">España</option>
            <option value="CO">Colombia</option>
            <option value="OT">Otro</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Idioma
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Industria
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          >
            {INDUSTRY_TAXONOMY.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Investment Range */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Presupuesto
          </label>
          <select
            value={investmentRange}
            onChange={(e) => setInvestmentRange(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          >
            <option value="US$1,500–3,000">US$1,500–3,000</option>
            <option value="US$3,000–5,000">US$3,000–5,000</option>
            <option value="US$5,000–10,000">US$5,000–10,000</option>
            <option value="US$10,000–20,000">US$10,000–20,000</option>
            <option value="US$20,000+">US$20,000+</option>
            <option value="Necesito diagnóstico antes de definirlo">Necesito diagnóstico antes de definirlo</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Prioridad Inicial
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
          >
            <option value="low">Baja (Low)</option>
            <option value="medium">Media (Medium)</option>
            <option value="high">Alta (High)</option>
          </select>
        </div>

        {/* Capture Attribution Fields (Row collapsible or visible) */}
        <div className="md:col-span-2 border-t border-neutral-850 pt-4 mt-2">
          <h3 className="text-sm font-semibold text-neutral-300 mb-4">Atribución de Captura</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Canal de Captura
              </label>
              <input
                type="text"
                value={captureChannel}
                onChange={(e) => setCaptureChannel(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Campaña
              </label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Responsable (owner_email) */}
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Responsable del Lead <span className="text-amber-500">*</span>
          </label>
          {currentUser.role === 'admin' ? (
            <select
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500"
            >
              {salesEmails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-905 bg-neutral-900/60 px-3 py-2.5 text-sm text-neutral-400">
              <span className="truncate">{ownerEmail}</span>
              <Lock className="h-4 w-4 text-neutral-600 shrink-0 ml-2" />
            </div>
          )}
          {currentUser.role === 'sales' && (
            <p className="mt-1 text-[10px] text-neutral-500 font-medium">
              Forzado automáticamente por rol de Agente de Ventas
            </p>
          )}
        </div>

        {/* Consent To Contact */}
        <div className="flex items-center md:items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentToContact}
              onChange={(e) => setConsentToContact(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-xs text-neutral-400 font-medium">
              Consiente ser contactado por Luma Premium
            </span>
          </label>
        </div>

        {/* Initial Note */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Nota Inicial (Opcional)
          </label>
          <textarea
            value={initialNote}
            onChange={(e) => setInitialNote(e.target.value)}
            disabled={isSubmitting}
            rows={4}
            placeholder="Ingresa cualquier información adicional del lead..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-900/60 disabled:text-neutral-500 resize-y"
          />
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex justify-end gap-3 border-t border-neutral-800 pt-6 mt-8">
        <Link
          href="/admin/leads"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-neutral-800 px-4 text-sm font-semibold text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors min-h-[40px]"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <span>Agregar lead</span>
          )}
        </button>
      </div>
    </form>
  );
}
