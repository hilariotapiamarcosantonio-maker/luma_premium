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

// Mini-gráfico de barras (acentos de color tipo dashboard real).
function MiniChart() {
  const bars = ['h-3', 'h-5', 'h-4', 'h-6', 'h-3', 'h-5'];
  return (
    <div className="mt-3 flex items-end gap-1.5">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-full rounded-sm ${h} ${i % 3 === 0 ? 'bg-amber-500/70' : i % 3 === 1 ? 'bg-sky-400/50' : 'bg-emerald-400/50'}`}
        />
      ))}
    </div>
  );
}

function MiniRows({ rows = 3 }: { rows?: number }) {
  const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-5/6'];
  return (
    <div className="mt-3 space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-amber-500' : 'bg-slate-600'}`} />
          <span className={`block h-2 rounded-full bg-slate-700 ${widths[i % widths.length]}`} />
        </span>
      ))}
    </div>
  );
}

export default function SystemGallery({ locale = 'es' }: { locale?: Locale }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {TILES.map((tile, idx) => (
        <div
          key={tile.label.en}
          className={`group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-4 transition-colors hover:border-amber-500/40 ${
            tile.span ? 'sm:col-span-2' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950">
              <tile.icon className="h-4 w-4 text-amber-500" />
            </span>
            <span className="text-xs font-semibold text-slate-100">{tile.label[locale]}</span>
          </div>
          {idx % 3 === 0 ? <MiniChart /> : <MiniRows rows={tile.span ? 4 : 3} />}
        </div>
      ))}
    </div>
  );
}
