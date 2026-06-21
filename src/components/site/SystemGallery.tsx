import React from 'react';
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  ShoppingBag,
  Users,
  Smartphone,
  Package,
  Target,
  TrendingUp,
  ListTodo,
  FileCheck,
} from 'lucide-react';

type Locale = 'es' | 'en';

type TileType = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: { es: string; en: string };
  span?: boolean;
};

const TILES: TileType[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: { es: 'Dashboard', en: 'Dashboard' }, span: true },
  { id: 'pipeline', icon: Target, label: { es: 'Pipeline', en: 'Pipeline' } },
  { id: 'concierge', icon: MessageSquare, label: { es: 'Concierge AI', en: 'Concierge AI' } },
  { id: 'catalog', icon: ShoppingBag, label: { es: 'Catálogo', en: 'Catalog' } },
  { id: 'contacts', icon: Users, label: { es: 'Contactos', en: 'Contacts' } },
  { id: 'followup', icon: Activity, label: { es: 'Seguimiento', en: 'Follow-up' } },
  { id: 'orders', icon: Package, label: { es: 'Pedidos', en: 'Orders' } },
  { id: 'mobile', icon: Smartphone, label: { es: 'Vista móvil', en: 'Mobile view' } },
];

export default function SystemGallery({ locale = 'es' }: { locale?: Locale }) {
  const isEn = locale === 'en';

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {TILES.map((tile) => (
        <div
          key={tile.id}
          className={`group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-5 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-0.5 ${
            tile.span ? 'sm:col-span-2' : ''
          }`}
        >
          {/* Tile Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 group-hover:border-amber-500/40 transition-colors">
              <tile.icon className="h-4 w-4 text-amber-500" />
            </span>
            <span className="text-xs font-bold text-white">{tile.label[locale]}</span>
          </div>

          {/* Custom Module UI Mockups */}
          <div className="flex-1 text-[10px] text-slate-400 font-sans">
            {tile.id === 'dashboard' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded border border-slate-850 bg-slate-950/40 p-2 space-y-1">
                  <span className="block text-[8px] text-slate-500 uppercase">Conversion</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white text-xs">14.8%</span>
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  </div>
                </div>
                <div className="rounded border border-slate-850 bg-slate-950/40 p-2 space-y-1">
                  <span className="block text-[8px] text-slate-500 uppercase">Response Rate</span>
                  <span className="block font-bold text-white text-xs">98.2%</span>
                </div>
                <div className="hidden sm:block rounded border border-slate-850 bg-slate-950/40 p-2 space-y-1">
                  <span className="block text-[8px] text-slate-500 uppercase">Ad ROI</span>
                  <span className="block font-bold text-white text-xs">84%</span>
                </div>
              </div>
            )}

            {tile.id === 'pipeline' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[7px] text-slate-500 font-mono">
                  <span>Sales Stages</span>
                  <span className="text-amber-500">ACTIVE</span>
                </div>
                <div className="rounded border border-slate-850 bg-slate-950/50 p-1.5">
                  <span className="block font-semibold text-white leading-none">A. Mendez</span>
                  <span className="block text-[8px] text-slate-500 mt-0.5">Vista del Río</span>
                </div>
              </div>
            )}

            {tile.id === 'concierge' && (
              <div className="space-y-1.5">
                <div className="rounded bg-slate-950/70 border border-slate-850 p-1.5 text-slate-300">
                  {isEn ? 'Qualified: Investor' : 'Calificado: Inversor'}
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded overflow-hidden">
                  <div className="h-full w-[80%] bg-emerald-500" />
                </div>
              </div>
            )}

            {tile.id === 'catalog' && (
              <div className="flex gap-2">
                <div className="flex-1 rounded border border-slate-850 bg-slate-950/50 p-1.5 text-center">
                  <span className="block font-bold text-white">€240</span>
                </div>
                <div className="flex-1 rounded border border-slate-850 bg-slate-950/50 p-1.5 text-center">
                  <span className="block font-bold text-white">€480</span>
                </div>
              </div>
            )}

            {tile.id === 'contacts' && (
              <div className="space-y-1">
                {['Alejandro M.', 'Elena V.', 'Carlos M.'].map((name, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-850 pb-0.5">
                    <span className="text-white font-medium">{name}</span>
                    <span className="text-[8px] text-slate-500">Lead</span>
                  </div>
                ))}
              </div>
            )}

            {tile.id === 'followup' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ListTodo className="h-3 w-3 text-slate-500" />
                  <span className="text-[9px] line-through text-slate-500">{isEn ? 'Schedule call' : 'Llamar prospecto'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ListTodo className="h-3 w-3 text-amber-500" />
                  <span className="text-[9px] text-slate-300">{isEn ? 'Send proposal' : 'Enviar cotización'}</span>
                </div>
              </div>
            )}

            {tile.id === 'orders' && (
              <div className="flex justify-between items-center rounded border border-emerald-500/20 bg-emerald-500/[0.03] p-2 text-emerald-400">
                <span className="font-semibold">{isEn ? 'Order #2041' : 'Pedido #2041'}</span>
                <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-500/20 px-1 rounded">
                  <FileCheck className="h-2.5 w-2.5" /> {isEn ? 'Success' : 'Completado'}
                </span>
              </div>
            )}

            {tile.id === 'mobile' && (
              <div className="rounded border border-slate-850 bg-slate-950/50 p-1.5 flex justify-between items-center">
                <span>App Concierge</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

