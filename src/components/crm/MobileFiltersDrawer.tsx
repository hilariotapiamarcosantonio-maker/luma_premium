'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Filter, X, Search } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { INDUSTRY_TAXONOMY } from '@/lib/crm/normalizers';

interface MobileFiltersDrawerProps {
  activeFilters: Record<string, string | number | undefined>;
  campaigns: { campaign: string; count: number }[];
}

export default function MobileFiltersDrawer({ activeFilters, campaigns }: MobileFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when drawer is open
  useBodyScrollLock(isOpen);

  // Count active filters (excluding page and page_size)
  const activeCount = Object.entries(activeFilters).reduce((count, [key, value]) => {
    if (key === 'page' || key === 'page_size') return count;
    return value ? count + 1 : count;
  }, 0);

  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus close button on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  return (
    <div className="md:hidden select-none">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
        aria-label="Abrir panel de filtros de leads"
      >
        <span className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-amber-500" />
          <span>Filtros de Búsqueda</span>
        </span>
        {activeCount > 0 && (
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-neutral-950">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            triggerRef.current?.focus();
          }}
          className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de leads"
        className={`fixed inset-y-0 right-0 z-50 flex w-80 transform flex-col border-l border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-850 px-6">
          <span className="flex items-center gap-2 font-bold tracking-tight text-neutral-200">
            <Filter className="h-4 w-4 text-amber-500" />
            <span>Filtros ({activeCount})</span>
          </span>
          <button
            ref={closeButtonRef}
            onClick={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Cerrar panel de filtros"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Form Scroll Area */}
        <form
          method="GET"
          action="/admin/leads"
          onSubmit={() => setIsOpen(false)}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
        >
          {/* Hidden inputs to preserve page_size and reset page to 1 */}
          <input type="hidden" name="page" value="1" />
          {activeFilters.page_size && (
            <input type="hidden" name="page_size" value={activeFilters.page_size} />
          )}

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Estado</label>
            <select
              name="status"
              defaultValue={activeFilters.status || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
            >
              <option value="">Todos</option>
              <option value="nuevo">Nuevo</option>
              <option value="por_contactar">Por contactar</option>
              <option value="contactado">Contactado</option>
            </select>
          </div>

          {/* Locale */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Idioma</label>
            <select
              name="locale"
              defaultValue={activeFilters.locale || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
            >
              <option value="">Todos</option>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">País</label>
            <select
              name="country"
              defaultValue={activeFilters.country || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
            >
              <option value="">Todos</option>
              <option value="DO">República Dominicana</option>
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
              <option value="ES">España</option>
              <option value="CO">Colombia</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Presupuesto</label>
            <select
              name="investment_range"
              defaultValue={activeFilters.investment_range || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
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

          {/* Platform */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Plataforma</label>
            <select
              name="platform"
              defaultValue={activeFilters.platform || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
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

          {/* Channel */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Canal</label>
            <select
              name="channel"
              defaultValue={activeFilters.channel || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
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

          {/* Industry */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Industria</label>
            <select
              name="industry"
              defaultValue={activeFilters.industry || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
            >
              <option value="">Todos</option>
              {INDUSTRY_TAXONOMY.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Campaña (UTM)</label>
            <select
              name="utm_campaign"
              defaultValue={activeFilters.utm_campaign || ''}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-base text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium min-h-[44px]"
            >
              <option value="">Todos</option>
              {campaigns.map((item) => (
                <option key={item.campaign} value={item.campaign}>
                  {item.campaign}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons inside Drawer */}
          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3.5 text-base font-bold text-neutral-950 hover:bg-amber-400 min-h-[44px]"
            >
              <Search className="h-4.5 w-4.5" />
              Aplicar Filtros
            </button>
            <Link
              href="/admin/leads"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3.5 text-base font-semibold text-neutral-400 hover:bg-neutral-850 hover:text-white min-h-[44px]"
            >
              Limpiar Filtros
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
