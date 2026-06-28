import { proxyAdmin } from '@/proxy';
import { getCrmReadService } from '@/lib/crm/crm-read-service';
import { getCrmOperationsRepository } from '@/lib/crm/operations-repository-factory';
import { ForbiddenError } from '@/lib/auth/permissions';
import { getSalesEmails } from '@/lib/auth/authorized-users';
import { toLeadOperationClientDto } from '@/lib/crm/operations-dto';
import LeadOperationEditor from '@/components/crm/LeadOperationEditor';
import LeadNotesPanel from '@/components/crm/LeadNotesPanel';
import { getCountryLabel, getPlatformLabel, getChannelLabel } from '@/lib/crm/normalizers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Cpu,
  FileText
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Normalizes a phone number to only digits to build a safe WhatsApp link.
 */
function getWhatsAppLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return null; // Too short to be a valid international number
  return `https://wa.me/${digits}`;
}

export default async function LeadDetailPage({ params }: PageProps) {
  // Enforces auth proxy and retrieves session user details
  const authInfo = await proxyAdmin();
  const currentUser = authInfo.user;

  const resolvedParams = await params;
  const leadId = resolvedParams.id;

  const readService = await getCrmReadService();
  // getLeadById enforces lead-level permissions: Sales may only access leads they own.
  // A ForbiddenError is surfaced as "not found" so foreign leads never reveal their existence.
  let lead;
  try {
    lead = await readService.getLeadById(leadId, currentUser);
  } catch (err) {
    if (err instanceof ForbiddenError) {
      notFound();
    }
    throw err;
  }

  if (!lead) {
    notFound();
  }

  // Retrieve current operation state
  const opsRepo = await getCrmOperationsRepository();
  const currentOp = await opsRepo.getOperationByLeadId(leadId);
  const clientOperation = currentOp ? toLeadOperationClientDto(currentOp) : null;

  // Retrieve notes for this lead. Reached only after the lead-access check above passed,
  // so Sales can never read notes from leads they do not own. Works for both manual (lm_)
  // and web (lp_) leads. Only safe fields (content, author, date) are exposed to the view;
  // internal identifiers/metadata (id, lead_id, updated_at) are intentionally dropped.
  const rawNotes = await opsRepo.listNotes(leadId);
  const notes = rawNotes.map((n) => ({
    author: n.created_by,
    createdAt: n.created_at,
    body: n.body,
  }));

  // Compute permissions on the server
  const currentUserEmail = currentUser.email.toLowerCase().trim();
  const currentUserRole = currentUser.role;
  const currentOwner = currentOp?.owner_email?.toLowerCase().trim() || null;

  const canEdit = currentUserRole === 'admin' || (currentUserRole === 'sales' && currentOwner === currentUserEmail);
  const salesEmails = currentUserRole === 'admin' ? Array.from(getSalesEmails()) : [];

  const waLink = getWhatsAppLink(lead.phone);
  const mailLink = lead.email ? `mailto:${lead.email.trim()}` : null;

  return (
    <div className="space-y-6 pb-28 md:pb-6">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="inline-flex h-11 items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a leads
        </Link>
        <span className="text-xs text-neutral-500 font-mono select-all">
          ID: {lead.id}
        </span>
      </div>

      {/* Main Profile Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Summary & Desktop Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400 font-medium">Estado de captura:</span>
                <span className="inline-flex items-center rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 font-semibold text-amber-500 uppercase tracking-wider">
                  {lead.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-100 break-words">
                {lead.full_name || 'Sin nombre'}
              </h1>
              <p className="text-sm text-neutral-400 font-medium break-words">
                {lead.role || 'Cargo no especificado'} en <span className="text-neutral-200">{lead.company || 'Empresa no especificada'}</span>
              </p>
            </div>

            {/* Desktop-only Contact Actions */}
            <div className="hidden md:flex flex-col gap-3 pt-4 border-t border-neutral-800">
              {waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
                >
                  <MessageSquare className="h-4.5 w-4.5" /> Abrir WhatsApp
                </a>
              ) : (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-500 cursor-not-allowed border border-neutral-800"
                  title="Teléfono no disponible o inválido"
                >
                  <MessageSquare className="h-4.5 w-4.5" /> WhatsApp No Disponible
                </button>
              )}

              {mailLink ? (
                <a
                  href={mailLink}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all hover:bg-neutral-850 hover:text-white"
                >
                  <Mail className="h-4.5 w-4.5" /> Enviar Correo
                </a>
              ) : (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-900/50 bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-neutral-650 cursor-not-allowed"
                >
                  <Mail className="h-4.5 w-4.5" /> Correo No Disponible
                </button>
              )}
            </div>

            {/* Basic Info Fields */}
            <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                  <span>País: <span className="text-neutral-200 uppercase font-medium">{getCountryLabel(lead.country)}</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-neutral-500" />
                <span>Idioma: <span className="text-neutral-200 uppercase">{lead.locale === 'es' ? 'Español' : 'Inglés'}</span></span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                <span>Creado: <span className="text-neutral-200">{new Date(lead.created_at).toLocaleString('es-ES')}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Questionnaire & Data Sections */}
        <div className="lg:col-span-2 space-y-6">
          <LeadOperationEditor
            leadId={leadId}
            currentOperation={clientOperation}
            currentUserRole={currentUserRole}
            currentUserEmail={currentUserEmail}
            salesEmails={salesEmails}
            canEdit={canEdit}
          />

          {/* Card: Notas del Lead */}
          <LeadNotesPanel leadId={leadId} initialNotes={notes} canEdit={canEdit} />

          {/* Card 1: Ficha Operativa (Datos Normalizados) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
              <Cpu className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Ficha Operativa (Datos Normalizados)</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Industria Categorizada</span>
                <span className="text-neutral-200 font-semibold block mt-1">{lead.industry || 'No especificada'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Rango de Inversión (Normalizado)</span>
                <span className="text-amber-400 font-semibold block mt-1">
                  {lead.investment_range === 'legacy_review'
                    ? 'US$1,500–5,000 (histórico)'
                    : lead.investment_range || 'No especificado'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Plataforma Omnicanal</span>
                <span className="text-neutral-200 font-semibold block mt-1">{getPlatformLabel(lead.platform)}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Canal Comercial</span>
                <span className="text-neutral-200 font-semibold block mt-1">{getChannelLabel(lead.channel)}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Respuestas del Diagnóstico (Cualitativo) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
              <FileText className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Respuestas del Diagnóstico</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Industry Detail */}
              {lead.industry_detail && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Detalle de Industria Declarado</label>
                  <p className="mt-1 text-sm text-neutral-200 font-medium break-words italic">&ldquo;{lead.industry_detail}&rdquo;</p>
                </div>
              )}

              {/* Team Size */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Tamaño de Equipo</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.team_size || 'No especificado'}</p>
              </div>

              {/* Lead Volume */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Volumen Mensual de Leads</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.lead_volume || 'No especificado'}</p>
              </div>

              {/* Ad Status */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Inversión Publicitaria</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium break-words">{lead.advertising_status || 'No especificada'}</p>
              </div>

              {/* Current Tools */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Herramientas Actuales</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium break-words">{lead.current_tools || 'No especificado'}</p>
              </div>

              {/* Channels */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Canales de Adquisición Declarados</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium break-words">{lead.acquisition_channels || 'No especificados'}</p>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Plazo Deseado</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.timeline || 'No especificado'}</p>
              </div>

              {/* Solutions */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Solución de Interés</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium break-words">{lead.solution_interest || 'No especificada'}</p>
              </div>
            </div>

            {/* Bottleneck Full-width */}
            <div className="pt-4 border-t border-neutral-800/60">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Cuello de Botella Principal</label>
              <p className="mt-2 text-sm text-neutral-200 bg-neutral-950/40 border border-neutral-900 p-4 rounded-lg leading-relaxed break-words">
                {lead.main_bottleneck || 'No especificado'}
              </p>
            </div>

            {/* Desired Outcome Full-width */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Resultado Deseado</label>
              <p className="mt-2 text-sm text-neutral-200 bg-neutral-950/40 border border-neutral-900 p-4 rounded-lg leading-relaxed break-words">
                {lead.desired_outcome || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Card 3: Datos Crudos de Origen (Raw Sheets Audit) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
              <Cpu className="h-4 w-4 text-neutral-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-450">Datos Originales Recibidos (Sheets)</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 text-xs text-neutral-400">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">Industry (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_industry || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">Investment Range (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_investment_range || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">Country (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_country || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">UTM Source (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_utm_source || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">UTM Medium (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_utm_medium || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">UTM Campaign (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_utm_campaign || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">Source (Raw)</span>
                <span className="font-mono text-neutral-300 block mt-1 break-words">{lead.raw_source || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-500">Landing / Page Origin (Raw)</span>
                {lead.raw_page_origin ? (
                  <a
                    href={lead.raw_page_origin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline font-mono text-xs break-all block mt-1 max-w-full"
                  >
                    {lead.raw_page_origin}
                  </a>
                ) : (
                  <span className="font-mono text-neutral-300 block mt-1">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar (Mobile only) */}
      {(waLink || mailLink) && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-800 bg-neutral-950/90 backdrop-blur-md flex gap-3 px-4 pt-3 md:hidden select-none"
          style={{
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
          }}
        >
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-base font-bold text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700 min-h-[44px]"
            >
              <MessageSquare className="h-5 w-5" /> WhatsApp
            </a>
          )}
          {mailLink && (
            <a
              href={mailLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-base font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white active:bg-neutral-850 min-h-[44px]"
            >
              <Mail className="h-5 w-5" /> Enviar Correo
            </a>
          )}
        </div>
      )}
    </div>
  );
}
