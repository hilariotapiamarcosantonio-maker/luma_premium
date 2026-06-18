import { proxyAdmin } from '@/proxy';
import { getCrmReadService } from '@/lib/crm/crm-read-service';
import { CrmLeadReadFiltersSchema } from '@/lib/crm/schemas';
import { getCountryLabel, getPlatformLabel, getChannelLabel, INDUSTRY_TAXONOMY } from '@/lib/crm/normalizers';
import { CRM_STATUS_LIST, CRM_STATUS_CONFIGS, CRM_PRIORITY_CONFIGS } from '@/lib/crm/crm-status-display';
import Link from 'next/link';
import { ChevronRight, Filter, Search, Globe, ChevronLeft, Layers } from 'lucide-react';
import MobileFiltersDrawer from '@/components/crm/MobileFiltersDrawer';
import { formatCrmDate } from '@/lib/crm/crm-date-display';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getOwnerDisplayName(email: string | null): string | null {
  if (!email) return null;
  const localPart = email.split('@')[0]?.trim();
  return localPart || null;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  // Enforces route check
  await proxyAdmin();

  // Next.js 16 searchParams resolution
  const rawParams = await searchParams;

  // Safe parsing parameters with Zod
  const filterParse = CrmLeadReadFiltersSchema.safeParse({
    status: typeof rawParams.status === 'string' ? rawParams.status : undefined,
    industry: typeof rawParams.industry === 'string' ? rawParams.industry : undefined,
    country: typeof rawParams.country === 'string' ? rawParams.country : undefined,
    locale: typeof rawParams.locale === 'string' ? rawParams.locale : undefined,
    investment_range: typeof rawParams.investment_range === 'string' ? rawParams.investment_range : undefined,
    utm_campaign: typeof rawParams.utm_campaign === 'string' ? rawParams.utm_campaign : undefined,
    platform: typeof rawParams.platform === 'string' ? rawParams.platform : undefined,
    channel: typeof rawParams.channel === 'string' ? rawParams.channel : undefined,
    date_from: typeof rawParams.date_from === 'string' ? rawParams.date_from : undefined,
    date_to: typeof rawParams.date_to === 'string' ? rawParams.date_to : undefined,
    page: typeof rawParams.page === 'string' ? rawParams.page : undefined,
    page_size: typeof rawParams.page_size === 'string' ? rawParams.page_size : undefined,
  });

  const activeFilters = filterParse.success ? filterParse.data : { page: 1, page_size: 25 };

  const readService = await getCrmReadService();
  const [paginatedResult, campaigns] = await Promise.all([
    readService.listLeads(activeFilters),
    readService.getSourceCampaignOptions(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-sm text-neutral-400">
          Listado de prospectos captados de formularios y canales Luma Premium.
        </p>
      </div>

      {/* Mobile Drawer trigger */}
      <MobileFiltersDrawer
        activeFilters={activeFilters}
        campaigns={campaigns}
      />

      {/* HTML native GET Filter Form (Desktop view) */}
      <form method="GET" action="/admin/leads" className="hidden md:block rounded-xl border border-neutral-800 bg-neutral-900/20 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 text-neutral-300 font-medium">
          <Filter className="h-4 w-4" />
          <span>Filtros de Búsqueda</span>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Estado</label>
            <select
              name="status"
              defaultValue={activeFilters.status || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              {CRM_STATUS_LIST.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Locale */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Idioma</label>
            <select
              name="locale"
              defaultValue={activeFilters.locale || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          {/* Country (Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">País</label>
            <select
              name="country"
              defaultValue={activeFilters.country || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              <option value="DO">República Dominicana</option>
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
              <option value="ES">España</option>
              <option value="CO">Colombia</option>
            </select>
          </div>

          {/* Investment Range (Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Presupuesto</label>
            <select
              name="investment_range"
              defaultValue={activeFilters.investment_range || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              <option value="US$1,500–3,000">US$1,500–3,000</option>
              <option value="US$3,000–5,000">US$3,000–5,000</option>
              <option value="US$5,000–10,000">US$5,000–10,000</option>
              <option value="US$10,000–20,000">US$10,000–20,000</option>
              <option value="US$20,000+">US$20,000+</option>
              <option value="legacy_review">US$1,500–5,000 (histórico)</option>
              <option value="Necesito diagnóstico antes de definirlo">Necesito diagnóstico antes de definirlo</option>
            </select>
          </div>

          {/* Platform (Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Plataforma</label>
            <select
              name="platform"
              defaultValue={activeFilters.platform || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              <option value="meta">Meta Ads / FB / IG</option>
              <option value="google">Google Ads / Organic</option>
              <option value="linkedin">LinkedIn Lead Gen</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="web">Web Luma Premium</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="referral">Referidos</option>
              <option value="outbound">Prospección Saliente</option>
              <option value="manual">Carga Manual</option>
              <option value="other">Otras plataformas</option>
            </select>
          </div>

          {/* Channel (Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Canal</label>
            <select
              name="channel"
              defaultValue={activeFilters.channel || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              <option value="paid_social">Social de Pago (Paid Social)</option>
              <option value="paid_search">Búsqueda de Pago (Paid Search)</option>
              <option value="organic_social">Social Orgánico</option>
              <option value="organic_search">Búsqueda Orgánica</option>
              <option value="direct">Directo / Web Direct</option>
              <option value="referral">Referidos / Boca a boca</option>
              <option value="partner">Partners</option>
              <option value="outbound">Outbound / Saliente</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>

          {/* Industry (Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Industria</label>
            <select
              name="industry"
              defaultValue={activeFilters.industry || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              {INDUSTRY_TAXONOMY.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign (Dropdown dynamically populated) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Campaña (UTM)</label>
            <select
              name="utm_campaign"
              defaultValue={activeFilters.utm_campaign || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Todos</option>
              {campaigns.map((camp) => (
                <option key={camp} value={camp}>
                  {camp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hidden inputs to preserve page on filter submit */}
        <input type="hidden" name="page" value="1" />

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/leads"
            className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            Limpiar Filtros
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
          >
            <Search className="h-4 w-4" />
            Aplicar Filtros
          </button>
        </div>
      </form>

      {/* Leads Grid/Table Container */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/20 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="divide-y divide-neutral-800 md:hidden">
          {paginatedResult.leads.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">No se encontraron leads.</div>
          ) : (
            paginatedResult.leads.map((lead) => {
              const ownerDisplayName = getOwnerDisplayName(lead.owner_email);
              const priorityLabel = lead.priority && CRM_PRIORITY_CONFIGS[lead.priority as 'low' | 'medium' | 'high']?.label;
              const nextActionDate = lead.next_action_at ? formatCrmDate(lead.next_action_at) : null;
              const nextActionType = lead.next_action_type?.trim();
              const nextActionLine = [nextActionType, nextActionDate].filter(Boolean).join(' · ');

              return (
                <div key={lead.id} className="p-4 space-y-3 hover:bg-neutral-900/20 transition-colors min-w-0 break-words">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-neutral-100 truncate">{lead.full_name || 'Sin nombre'}</h3>
                      <p className="text-xs text-neutral-400 truncate">{lead.company || 'Sin empresa'}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${CRM_STATUS_CONFIGS[lead.crm_status]?.badgeClass || 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>
                      {CRM_STATUS_CONFIGS[lead.crm_status]?.label || lead.crm_status}
                    </span>
                  </div>

                  {(priorityLabel || ownerDisplayName) && (
                    <div className="flex items-center gap-2 text-xs">
                      {priorityLabel && (
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${CRM_PRIORITY_CONFIGS[lead.priority as 'low' | 'medium' | 'high']?.badgeClass}`}>
                          {priorityLabel}
                        </span>
                      )}
                      {ownerDisplayName && (
                        <span className="text-[11px] text-neutral-400">
                          Resp: <span className="font-medium text-neutral-300">{ownerDisplayName}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {nextActionLine && (
                    <div className="text-[11px] text-neutral-400 bg-neutral-950/40 border border-neutral-800/60 rounded-lg p-2 font-mono flex items-center gap-1.5 min-w-0 break-words">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider shrink-0">Próxima acción:</span>
                      <span className="text-neutral-300 truncate">{nextActionLine}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-neutral-300 truncate">{getCountryLabel(lead.country) || 'País no especificado'}</span>
                      <span className="text-[11px] text-amber-500/80 font-medium truncate">
                        {lead.investment_range === 'legacy_review'
                          ? 'US$1,500–5,000 (histórico)'
                          : lead.investment_range || 'Presupuesto no especificado'}
                      </span>
                    </div>
                    <span className="text-[11px] shrink-0 font-mono">{new Date(lead.created_at).toLocaleDateString('es-ES')}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] text-neutral-300 font-semibold bg-neutral-900 border border-neutral-800 px-2 py-1 rounded truncate">
                      {getPlatformLabel(lead.platform)} • {getChannelLabel(lead.channel)}
                    </span>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="flex h-11 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-4 text-xs text-amber-500 font-semibold hover:bg-neutral-800 hover:text-amber-400 min-h-[44px]"
                      aria-label={`Abrir lead ${lead.full_name || 'sin nombre'}`}
                    >
                      Detalle <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-4 px-6">Nombre</th>
                <th className="py-4 px-6">Empresa</th>
                <th className="py-4 px-6">País</th>
                <th className="py-4 px-6">Atribución (Plataforma/Canal)</th>
                <th className="py-4 px-6 hidden xl:table-cell">Idioma</th>
                <th className="py-4 px-6">Industria</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Fecha</th>
                <th className="py-4 px-6 text-center sticky right-0 z-10 bg-neutral-950 border-l border-b border-neutral-800 whitespace-nowrap min-w-[100px]">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-sm">
              {paginatedResult.leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-500">
                    No se encontraron leads con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedResult.leads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-neutral-200 truncate max-w-[130px]">{lead.full_name || 'Sin nombre'}</td>
                    <td className="py-4 px-6 text-neutral-400 truncate max-w-[120px]">
                      {lead.company || 'Sin empresa'}
                    </td>
                    <td className="py-4 px-6 text-neutral-400 uppercase whitespace-nowrap">
                      <span className="lg:hidden">{lead.country}</span>
                      <span className="hidden lg:inline">{getCountryLabel(lead.country) || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      <span className="inline-flex flex-col">
                        <span className="font-semibold text-neutral-200 flex items-center gap-1 whitespace-nowrap">
                          <Layers className="h-3 w-3 text-amber-500" />
                          {getPlatformLabel(lead.platform)}
                        </span>
                        <span className="text-[10px] text-neutral-500 tracking-wide whitespace-nowrap">
                          {getChannelLabel(lead.channel)}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400 hidden xl:table-cell">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Globe className="h-3.5 w-3.5 text-neutral-500" />
                        {lead.locale === 'es' ? 'ES' : 'EN'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400 truncate max-w-[130px]">
                      {lead.industry || 'No especificada'}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CRM_STATUS_CONFIGS[lead.crm_status]?.badgeClass || 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>
                          {CRM_STATUS_CONFIGS[lead.crm_status]?.label || lead.crm_status}
                        </span>

                        {(() => {
                          const priorityLabel = lead.priority && CRM_PRIORITY_CONFIGS[lead.priority as 'low' | 'medium' | 'high']?.label;
                          const ownerDisplayName = getOwnerDisplayName(lead.owner_email);
                          const ownershipLine = [priorityLabel, ownerDisplayName].filter(Boolean).join(' · ');
                          return ownershipLine ? (
                            <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                              {ownershipLine}
                            </span>
                          ) : null;
                        })()}

                        {(() => {
                          const nextActionDate = lead.next_action_at ? formatCrmDate(lead.next_action_at) : null;
                          const nextActionType = lead.next_action_type?.trim();
                          const nextActionLine = [nextActionType, nextActionDate].filter(Boolean).join(' · ');
                          return nextActionLine ? (
                            <span className="text-[10px] text-neutral-500 font-mono whitespace-nowrap">
                              {nextActionLine}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-4 px-6 sticky right-0 z-10 bg-neutral-950 group-hover:bg-neutral-900 border-l border-b border-neutral-900 text-center transition-colors min-w-[100px] whitespace-nowrap">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                        aria-label={`Abrir lead ${lead.full_name || 'sin nombre'}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        {paginatedResult.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900/10 px-6 py-4">
            <span className="text-xs text-neutral-500">
              Página {paginatedResult.page} de {paginatedResult.totalPages} ({paginatedResult.totalCount} leads en total)
            </span>
            
            <div className="flex gap-2">
              {/* Previous page link */}
              {paginatedResult.page > 1 ? (
                <Link
                  href={{
                    pathname: '/admin/leads',
                    query: { ...activeFilters, page: paginatedResult.page - 1 } as Record<string, string | number | undefined>,
                  }}
                  className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  <ChevronLeft className="h-4.5 w-4.5" /> Anterior
                </Link>
              ) : (
                <span className="flex items-center gap-1 rounded-lg border border-neutral-900 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-700 cursor-not-allowed">
                  <ChevronLeft className="h-4.5 w-4.5" /> Anterior
                </span>
              )}

              {/* Next page link */}
              {paginatedResult.page < paginatedResult.totalPages ? (
                <Link
                  href={{
                    pathname: '/admin/leads',
                    query: { ...activeFilters, page: paginatedResult.page + 1 } as Record<string, string | number | undefined>,
                  }}
                  className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  Siguiente <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 rounded-lg border border-neutral-900 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-700 cursor-not-allowed">
                  Siguiente <ChevronRight className="h-4.5 w-4.5" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
