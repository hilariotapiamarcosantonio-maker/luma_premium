import { proxyAdmin } from '@/proxy';
import { getCrmRepository } from '@/lib/crm/repository';
import { getCountryLabel, getPlatformLabel, getChannelLabel } from '@/lib/crm/normalizers';
import Link from 'next/link';
import { 
  Users, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Tag, 
  Clock,
  ArrowRight,
  ChevronRight,
  Layers,
  Globe
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Enforces session check
  await proxyAdmin();

  const repository = await getCrmRepository();
  const metrics = await repository.getDashboardMetrics();

  const phonePercentage = metrics.totalLeads > 0 
    ? ((metrics.leadsWithPhone / metrics.totalLeads) * 100).toFixed(0) 
    : '0';

  const budgetPercentage = metrics.totalLeads > 0 
    ? ((metrics.leadsWithBudget / metrics.totalLeads) * 100).toFixed(0) 
    : '0';

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-neutral-400">
            Resumen de captación de prospectos y analíticas generales.
          </p>
        </div>
        <div className="text-xs text-neutral-500">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Total Leads</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{metrics.totalLeads}</span>
          </div>
        </div>

        {/* Leads con Teléfono */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Leads con Teléfono</span>
            <Phone className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-emerald-400">{metrics.leadsWithPhone}</span>
            <span className="text-xs text-neutral-400">({phonePercentage}%)</span>
          </div>
        </div>

        {/* Leads con Presupuesto Definido */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Presupuesto Definido</span>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-blue-400">{metrics.leadsWithBudget}</span>
            <span className="text-xs text-neutral-400">({budgetPercentage}%)</span>
          </div>
        </div>

        {/* Campañas Detectadas */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Campañas Detectadas</span>
            <Tag className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{metrics.byCampaign.length}</span>
          </div>
        </div>
      </div>

      {/* Main Aggregates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Leads por Plataforma */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <Layers className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Por Plataforma</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {metrics.byPlatform.map((item) => (
              <li key={item.platform} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{getPlatformLabel(item.platform)}</span>
                <span className="font-semibold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Leads por Canal */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <Globe className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Por Canal</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {metrics.byChannel.map((item) => (
              <li key={item.channel} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400 text-xs">
                  {getChannelLabel(item.channel)}
                </span>
                <span className="font-semibold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Country Distribution */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <MapPin className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Por País</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {metrics.byCountry.map((item) => (
              <li key={item.country} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{getCountryLabel(item.country)}</span>
                <span className="font-semibold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Industry Distribution */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <Briefcase className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Por Industria</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {metrics.byIndustry.map((item) => (
              <li key={item.industry} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400 truncate max-w-[200px]" title={item.industry}>
                  {item.industry}
                </span>
                <span className="font-semibold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Investment Distribution */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Por Presupuesto</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {metrics.byInvestmentRange.map((item) => (
              <li key={item.range} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">
                  {item.range === 'legacy_review' ? 'Revisión Histórica (1k-5k)' : item.range}
                </span>
                <span className="font-semibold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Campaign Distribution */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800">
            <Tag className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Por Campaña (UTM)</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {metrics.byCampaign.length === 0 ? (
              <p className="text-xs text-neutral-500">Ninguna campaña UTM activa registrada.</p>
            ) : (
              metrics.byCampaign.map((item) => (
                <li key={item.campaign} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400 truncate max-w-[200px]" title={item.campaign}>
                    {item.campaign}
                  </span>
                  <span className="font-semibold bg-neutral-800 px-2 py-0.5 rounded text-xs">
                    {item.count}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Recent Leads Section */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Leads Recientes</h2>
          </div>
          <Link 
            href="/admin/leads" 
            className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-medium"
          >
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">País</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {metrics.recentLeads.map((lead) => (
                <tr key={lead.id} className="text-sm hover:bg-neutral-900/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-neutral-200">{lead.full_name || 'Sin nombre'}</td>
                  <td className="py-3 px-4 text-neutral-400">{lead.company || 'Sin empresa'}</td>
                  <td className="py-3 px-4 text-neutral-400 uppercase">{getCountryLabel(lead.country) || 'N/A'}</td>
                  <td className="py-3 px-4 text-neutral-400">
                    {new Date(lead.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link 
                      href={`/admin/leads/${lead.id}`} 
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
