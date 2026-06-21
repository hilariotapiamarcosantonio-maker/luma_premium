import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  ShoppingBag,
  Users,
  Smartphone,
  Package,
  Target,
  type LucideIcon,
} from 'lucide-react';

// "Dentro del sistema": mosaico de representaciones estilizadas de UI.
// No son capturas reales ni exponen datos: refuerzan visualmente que Luma
// construye operación (dashboard, pipeline, concierge, catálogo, etc.).

type Locale = 'es' | 'en';

type Tile = { icon: LucideIcon; label: { es: string; en: string }; span?: boolean };

const TILES: Tile[] = [
  { icon: LayoutDashboard, label: { es: 'Dashboard', en: 'Dashboard' }, span: true },
  { icon: Target, label: { es: 'Pipeline', en: 'Pipeline' } },
  { icon: MessageSquare, label: { es: 'Concierge', en: 'Concierge' } },
  { icon: ShoppingBag, label: { es: 'Catálogo', en: 'Catalog' } },
  { icon: Users, label: { es: 'Contactos', en: 'Contacts' } },
  { icon: Activity, label: { es: 'Seguimiento', en: 'Follow-up' } },
  { icon: Package, label: { es: 'Pedidos', en: 'Orders' } },
  { icon: Smartphone, label: { es: 'Vista móvil', en: 'Mobile view' } },
];

function MiniBars({ rows = 3 }: { rows?: number }) {
  const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-5/6', 'w-1/3'];
  return (
    <div className="mt-3 space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} className={`block h-2 rounded-full bg-slate-800 ${widths[i % widths.length]}`} />
      ))}
    </div>
  );
}

export default function SystemGallery({ locale = 'es' }: { locale?: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {TILES.map((tile) => (
        <div
          key={tile.label.en}
          className={`group flex flex-col rounded-xl border border-slate-800 bg-slate-900/30 p-4 transition-colors hover:border-amber-500/30 ${
            tile.span ? 'sm:col-span-2' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950">
              <tile.icon className="h-4 w-4 text-amber-500" />
            </span>
            <span className="text-xs font-semibold text-slate-200">{tile.label[locale]}</span>
          </div>
          <MiniBars rows={tile.span ? 4 : 3} />
        </div>
      ))}
    </div>
  );
}
