'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  ShoppingBag,
  Users,
  Smartphone,
} from 'lucide-react';

type Locale = 'es' | 'en';

interface GalleryItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: { es: string; en: string };
  tag: { es: string; en: string };
  screenshotId: string;
  thumbnailPath: string;
  span?: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'crm-pipeline',
    icon: LayoutDashboard,
    label: { es: 'CRM OS — Pipeline', en: 'CRM OS — Pipeline' },
    tag: { es: 'Panel de equipo', en: 'Team panel' },
    screenshotId: 'real-estate-crm-os-desktop',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_real_estete_os_crm_-_demo.webp',
    span: true,
  },
  {
    id: 'real-estate-catalog',
    icon: ShoppingBag,
    label: { es: 'Real Estate OS — Catálogo', en: 'Real Estate OS — Catalog' },
    tag: { es: 'Vista general', en: 'General view' },
    screenshotId: 'real-estate-os-desktop',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_desktop.webp',
  },
  {
    id: 'real-estate-mobile',
    icon: Smartphone,
    label: { es: 'Real Estate OS — Móvil', en: 'Real Estate OS — Mobile' },
    tag: { es: 'Vista móvil', en: 'Mobile view' },
    screenshotId: 'real-estate-os-mobile',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_vista_del_rio_movil.webp',
  },
  {
    id: 'concierge-chat',
    icon: MessageSquare,
    label: { es: 'Concierge OS — Chat AI', en: 'Concierge OS — AI Chat' },
    tag: { es: 'Detalle', en: 'Detail' },
    screenshotId: 'real-estate-concierge-os-desktop',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/real_estate_concierge_os_-_demo.webp',
  },
  {
    id: 'commerce-storefront',
    icon: ShoppingBag,
    label: { es: 'Commerce OS — Tienda', en: 'Commerce OS — Storefront' },
    tag: { es: 'Vista general', en: 'General view' },
    screenshotId: 'commerce-os-desktop',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_commerce_os_-_demo.webp',
  },
  {
    id: 'beauty-spa-citas',
    icon: Activity,
    label: { es: 'Beauty Spa OS — Citas', en: 'Beauty Spa OS — Schedule' },
    tag: { es: 'Panel de equipo', en: 'Team panel' },
    screenshotId: 'beauty-spa-os-desktop',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_desktop.webp',
  },
  {
    id: 'beauty-spa-mobile',
    icon: Smartphone,
    label: { es: 'Beauty Spa OS — Reserva', en: 'Beauty Spa OS — Mobile Booking' },
    tag: { es: 'Vista móvil', en: 'Mobile view' },
    screenshotId: 'beauty-spa-os-mobile',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/luma_beauty_spa_movil.webp',
  },
  {
    id: 'suvoga-courses',
    icon: Users,
    label: { es: 'Suvoga Academy — Cursos', en: 'Suvoga Academy — Courses' },
    tag: { es: 'Vista general', en: 'General view' },
    screenshotId: 'suvoga-os-academy-desktop',
    thumbnailPath: '/images/marketing/screenshots/optimized/thumb/suvoga_os_academy.webp',
  },
];

export default function SystemGallery({
  locale = 'es',
  onScreenshotClick,
}: {
  locale?: Locale;
  onScreenshotClick?: (id: string) => void;
}) {
  const isEn = locale === 'en';

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {GALLERY_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-5 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-0.5 ${
            item.span ? 'sm:col-span-2' : ''
          }`}
        >
          {/* Tile Header */}
          <div className="flex items-center justify-between gap-2.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 group-hover:border-amber-500/40 transition-colors">
                <item.icon className="h-4 w-4 text-amber-500" />
              </span>
              <span className="text-xs font-bold text-white leading-tight">{item.label[locale]}</span>
            </div>
            
            {/* Tag Badge */}
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900/50 text-slate-400">
              {item.tag[locale]}
            </span>
          </div>

          {/* Screenshot container */}
          <div className="flex-1 text-[10px] text-slate-400 font-sans mt-2">
            <button
              onClick={() => onScreenshotClick && onScreenshotClick(item.screenshotId)}
              disabled={!onScreenshotClick}
              aria-label={isEn ? `Expand ${item.label[locale]}` : `Ampliar ${item.label[locale]}`}
              className="relative h-28 w-full overflow-hidden rounded border border-slate-800/80 bg-slate-950/80 shadow-inner group-hover:border-amber-500/20 transition-colors cursor-zoom-in block"
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.thumbnailPath}
                  alt={item.label[locale]}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 250px, 350px"
                  className="object-cover object-top brightness-[1.03] contrast-[1.02] transition-all duration-300 group-hover:brightness-110"
                />
                {onScreenshotClick && (
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-amber-500 text-slate-950 font-bold text-[8px] px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
                      {isEn ? 'View larger' : 'Ampliar'}
                    </span>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
