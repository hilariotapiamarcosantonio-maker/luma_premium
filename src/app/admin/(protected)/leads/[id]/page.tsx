import { proxyAdmin } from '@/proxy';
import { getCrmRepository } from '@/lib/crm/repository';
import { getCountryLabel } from '@/lib/crm/normalizers';
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
  // Enforces auth proxy
  await proxyAdmin();

  const resolvedParams = await params;
  const leadId = resolvedParams.id;

  const repository = await getCrmRepository();
  const lead = await repository.getLeadById(leadId);

  if (!lead) {
    notFound();
  }

  const waLink = getWhatsAppLink(lead.phone);
  const mailLink = lead.email ? `mailto:${lead.email.trim()}` : null;

  return (
    <div className="space-y-6">
      {/* Top Navigation Back Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a leads
        </Link>
        <span className="text-xs text-neutral-500 font-mono select-all">
          ID: {lead.id}
        </span>
      </div>

      {/* Main Profile Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Summary & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-xs font-semibold text-amber-500 uppercase tracking-wider">
                {lead.status}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
                {lead.full_name || 'Sin nombre'}
              </h1>
              <p className="text-sm text-neutral-400 font-medium">
                {lead.role || 'Cargo no especificado'} en <span className="text-neutral-200">{lead.company || 'Empresa no especificada'}</span>
              </p>
            </div>

            {/* Quick Contact Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-300 transition-all hover:bg-neutral-800 hover:text-white"
                >
                  <Mail className="h-4.5 w-4.5" /> Enviar Correo
                </a>
              ) : (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-900/50 bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-neutral-600 cursor-not-allowed"
                >
                  <Mail className="h-4.5 w-4.5" /> Correo No Disponible
                </button>
              )}
            </div>

            {/* Context Fields */}
            <div className="space-y-3 pt-6 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                  <span>País: <span className="text-neutral-200 uppercase font-medium">{getCountryLabel(lead.country)}</span></span>
                </div>
                {lead.raw_country !== lead.country && (
                  <span className="text-[10px] text-neutral-500 ml-5">Original recibido: &ldquo;{lead.raw_country || '—'}&rdquo;</span>
                )}
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

        {/* Right Side: Detailed Questionnaire Responses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Diagnostics & Bottlenecks */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
              <FileText className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Respuestas del Diagnóstico</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Industry */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Industria</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.industry || 'No especificada'}</p>
                {lead.raw_industry !== lead.industry && (
                  <span className="text-[10px] text-neutral-500 block">Original recibido: &ldquo;{lead.raw_industry || '—'}&rdquo;</span>
                )}
                {lead.industry_detail && (
                  <p className="mt-1 text-xs text-neutral-400 italic">&ldquo;{lead.industry_detail}&rdquo;</p>
                )}
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tamaño de Equipo</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.team_size || 'No especificado'}</p>
              </div>

              {/* Lead Volume */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Volumen Mensual de Leads</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.lead_volume || 'No especificado'}</p>
              </div>

              {/* Ad Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Inversión Publicitaria</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.advertising_status || 'No especificada'}</p>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Canales de Adquisición</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.acquisition_channels || 'No especificados'}</p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Rango de Inversión</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">
                  {lead.investment_range === 'legacy_review' 
                    ? 'US$1,500–5,000 (histórico)' 
                    : lead.investment_range || 'No especificado'}
                </p>
                {lead.raw_investment_range !== lead.investment_range && (
                  <span className="text-[10px] text-neutral-500 block">Original recibido: &ldquo;{lead.raw_investment_range || '—'}&rdquo;</span>
                )}
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Plazo Deseado</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.timeline || 'No especificado'}</p>
              </div>

              {/* Solutions */}
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Solución de Interés</label>
                <p className="mt-1 text-sm text-neutral-200 font-medium">{lead.solution_interest || 'No especificada'}</p>
              </div>
            </div>

            {/* Bottleneck Full-width */}
            <div className="pt-4 border-t border-neutral-800/60">
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cuello de Botella Principal</label>
              <p className="mt-2 text-sm text-neutral-200 bg-neutral-950/40 border border-neutral-900 p-4 rounded-lg leading-relaxed">
                {lead.main_bottleneck || 'No especificado'}
              </p>
            </div>

            {/* Desired Outcome Full-width */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">Resultado Deseado</label>
              <p className="mt-2 text-sm text-neutral-200 bg-neutral-950/40 border border-neutral-900 p-4 rounded-lg leading-relaxed">
                {lead.desired_outcome || 'No especificado'}
              </p>
            </div>
          </div>

          {/* Section: Atribución Omnicanal */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
              <Cpu className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Atribución Omnicanal</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <span className="text-neutral-500 font-semibold block text-xs uppercase tracking-wider mb-2">Atribución Normalizada</span>
                <div className="space-y-3 bg-neutral-950/20 p-4 border border-neutral-900 rounded-lg">
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider block">Plataforma</span>
                    <span className="text-amber-400 font-semibold capitalize text-sm">{lead.platform}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase tracking-wider block">Canal Comercial</span>
                    <span className="text-neutral-200 font-medium uppercase text-xs tracking-wider">{lead.channel.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 font-semibold block text-xs uppercase tracking-wider mb-2">Origen Recibido</span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-neutral-400 block font-medium">Source</span>
                    <span className="text-neutral-300 font-mono break-all">{lead.raw_source || lead.source || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-medium">UTM Source</span>
                    <span className="text-neutral-300 font-mono">{lead.raw_utm_source || lead.utm_source || '—'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-medium">UTM Medium</span>
                    <span className="text-neutral-300 font-mono">{lead.raw_utm_medium || lead.utm_medium || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs pt-4 border-t border-neutral-800/60">
              <div>
                <span className="text-neutral-500 font-semibold block uppercase tracking-wider mb-1">Campaña (UTM)</span>
                <span className="text-neutral-300 font-mono">{lead.raw_utm_campaign || lead.utm_campaign || '—'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block uppercase tracking-wider mb-1">Contenido (UTM)</span>
                <span className="text-neutral-300 font-mono">{lead.utm_content || '—'}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-semibold block uppercase tracking-wider mb-1">Landing / Página Origen</span>
                <span className="text-neutral-300 font-mono break-all">{lead.raw_page_origin || lead.page_origin || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
