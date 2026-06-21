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
          </div>          {/* Custom Module UI Mockups utilizing real screenshots */}
          <div className="flex-1 text-[10px] text-slate-400 font-sans mt-2">
            {tile.id === 'dashboard' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_real_estete_os_crm_-_demo.webp"
                  alt="CRM Dashboard Preview"
                  className="w-full h-full object-cover object-top brightness-[1.03] contrast-[1.02]"
                />
              </div>
            )}

            {tile.id === 'pipeline' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_real_estete_os_crm_-_demo.webp"
                  alt="CRM Sales Pipeline Preview"
                  className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
                  style={{ objectPosition: 'center 40%' }}
                />
              </div>
            )}

            {tile.id === 'concierge' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/real_estate_concierge_os_-_demo.webp"
                  alt="Concierge Chat Assist Preview"
                  className="w-full h-full object-cover object-top brightness-[1.03] contrast-[1.02]"
                />
              </div>
            )}

            {tile.id === 'catalog' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_vista_del_rio_desktop.webp"
                  alt="Properties Catalog Preview"
                  className="w-full h-full object-cover object-top brightness-[1.03] contrast-[1.02]"
                />
              </div>
            )}

            {tile.id === 'contacts' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_real_estete_os_crm_-_demo.webp"
                  alt="CRM Contacts List Preview"
                  className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
                  style={{ objectPosition: 'center 75%' }}
                />
              </div>
            )}

            {tile.id === 'followup' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_real_estete_os_crm_-_demo.webp"
                  alt="CRM Tasks & Followups"
                  className="w-full h-full object-cover brightness-[1.03] contrast-[1.02]"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
            )}

            {tile.id === 'orders' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_commerce_os_-_demo.webp"
                  alt="Commerce OS Orders Preview"
                  className="w-full h-full object-cover object-top brightness-[1.03] contrast-[1.02]"
                />
              </div>
            )}

            {tile.id === 'mobile' && (
              <div className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors">
                <img
                  src="/images/marketing/screenshots/optimized/luma_beauty_spa_movil.webp"
                  alt="Mobile Booking View Preview"
                  className="w-full h-full object-cover object-top brightness-[1.03] contrast-[1.02]"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

