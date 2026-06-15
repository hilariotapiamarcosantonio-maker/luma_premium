'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface User {
  email: string;
  role: string;
}

interface MobileNavigationProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export default function MobileNavigation({ user, onSignOut }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useBodyScrollLock(isOpen);

  // Close drawer when pathname changes (user navigated)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Handle ESC key press to close drawer
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

  // Focus management: when opening, focus close button. When closing, return focus to trigger.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 backdrop-blur-md md:hidden select-none">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <span>LUMA</span>
            <span className="text-amber-500 text-xs border border-amber-500/20 bg-amber-500/10 px-1 py-0.5 rounded">CRM</span>
          </Link>
        </div>

        <button
          ref={triggerRef}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar-menu"
          aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            triggerRef.current?.focus();
          }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Side Drawer Panel */}
      <div
        id="mobile-sidebar-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de administración móvil"
        className={`fixed inset-y-0 right-0 z-50 flex w-72 transform flex-col border-l border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Drawer Header with Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-850 px-6">
          <span className="font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <span>LUMA</span>
            <span className="text-amber-500 text-[10px] border border-amber-500/20 bg-amber-500/10 px-1 py-0.5 rounded">CRM</span>
          </span>
          <button
            ref={closeButtonRef}
            onClick={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Cerrar panel de navegación"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-semibold transition-colors ${
              pathname === '/admin'
                ? 'bg-neutral-900 text-white border-l-2 border-amber-500'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 text-neutral-400" />
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-semibold transition-colors ${
              pathname.startsWith('/admin/leads')
                ? 'bg-neutral-900 text-white border-l-2 border-amber-500'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Users className="h-5 w-5 text-neutral-400" />
            Leads
          </Link>
        </nav>

        {/* User Info & Logout Button */}
        <div className="border-t border-neutral-900 p-4 bg-neutral-900/10">
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-sm font-bold text-amber-500 uppercase">
              {user.email.slice(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-neutral-300">{user.email}</span>
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">{user.role}</span>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsOpen(false);
              await onSignOut();
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-950/20 bg-red-950/10 px-4 py-3.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-950/25 active:bg-red-950/40 min-h-[44px]"
            >
              <LogOut className="h-4.5 w-4.5" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
