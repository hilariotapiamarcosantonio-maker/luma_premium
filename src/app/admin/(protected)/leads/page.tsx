import { proxyAdmin } from '@/proxy';
import { getCrmRepository } from '@/lib/crm/repository';
import { LeadFiltersSchema } from '@/lib/crm/schemas';
import Link from 'next/link';
import { ChevronRight, Filter, Search, Globe, ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  // Enforces route check
  await proxyAdmin();

  // Next.js 16 searchParams resolution
  const rawParams = await searchParams;

  // Safe parsing parameters with Zod
  const filterParse = LeadFiltersSchema.safeParse({
    status: typeof rawParams.status === 'string' ? rawParams.status : undefined,
    industry: typeof rawParams.industry === 'string' ? rawParams.industry : undefined,
    country: typeof rawParams.country === 'string' ? rawParams.country : undefined,
    locale: typeof rawParams.locale === 'string' ? rawParams.locale : undefined,
    investment_range: typeof rawParams.investment_range === 'string' ? rawParams.investment_range : undefined,
    utm_campaign: typeof rawParams.utm_campaign === 'string' ? rawParams.utm_campaign : undefined,
    date_from: typeof rawParams.date_from === 'string' ? rawParams.date_from : undefined,
    date_to: typeof rawParams.date_to === 'string' ? rawParams.date_to : undefined,
    page: typeof rawParams.page === 'string' ? rawParams.page : undefined,
    page_size: typeof rawParams.page_size === 'string' ? rawParams.page_size : undefined,
  });

  const activeFilters = filterParse.success ? filterParse.data : { page: 1, page_size: 25 };

  const repository = await getCrmRepository();
  const paginatedResult = await repository.listLeads(activeFilters);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-sm text-neutral-400">
          Listado de prospectos captados de formularios Luma Premium.
        </p>
      </div>

      {/* HTML native GET Filter Form */}
      <form method="GET" action="/admin/leads" className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-5 space-y-4">
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
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Todos</option>
              <option value="nuevo">Nuevo</option>
              <option value="por_contactar">Por contactar</option>
              <option value="contactado">Contactado</option>
            </select>
          </div>

          {/* Locale */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Idioma</label>
            <select
              name="locale"
              defaultValue={activeFilters.locale || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Todos</option>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">País</label>
            <input
              type="text"
              name="country"
              placeholder="Ej: MX, ES, US"
              defaultValue={activeFilters.country || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Investment Range */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Presupuesto</label>
            <select
              name="investment_range"
              defaultValue={activeFilters.investment_range || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Todos</option>
              <option value="1k-5k">1k-5k</option>
              <option value="5k-10k">5k-10k</option>
              <option value="10k-25k">10k-25k</option>
              <option value="25k+">25k+</option>
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
            paginatedResult.leads.map((lead) => (
              <div key={lead.id} className="p-4 space-y-2 hover:bg-neutral-900/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-100">{lead.full_name || 'Sin nombre'}</h3>
                    <p className="text-xs text-neutral-400">{lead.company || 'Sin empresa'}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-amber-500 uppercase">
                    {lead.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span className="uppercase">{lead.country || 'N/A'}</span>
                    <span>•</span>
                    <span>{lead.locale === 'es' ? 'ES' : 'EN'}</span>
                  </div>
                  <span>{new Date(lead.created_at).toLocaleDateString('es-ES')}</span>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center gap-1.5 text-xs text-amber-500 font-medium hover:underline"
                  >
                    Detalle <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
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
                <th className="py-4 px-6">Idioma</th>
                <th className="py-4 px-6">Industria</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Fecha</th>
                <th className="py-4 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-sm">
              {paginatedResult.leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No se encontraron leads con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedResult.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-neutral-200">{lead.full_name || 'Sin nombre'}</td>
                    <td className="py-4 px-6 text-neutral-400 truncate max-w-[150px]" title={lead.company}>
                      {lead.company || 'Sin empresa'}
                    </td>
                    <td className="py-4 px-6 text-neutral-400 uppercase">{lead.country || 'N/A'}</td>
                    <td className="py-4 px-6 text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-neutral-500" />
                        {lead.locale === 'es' ? 'ES' : 'EN'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400 truncate max-w-[180px]" title={lead.industry}>
                      {lead.industry || 'No especificada'}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      <span className="inline-flex items-center rounded-full bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 text-xs font-medium text-amber-500 capitalize">
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {new Date(lead.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                        title="Ver detalle del lead"
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
