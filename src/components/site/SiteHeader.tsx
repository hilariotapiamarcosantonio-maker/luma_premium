'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PRIMARY_CTA, SITE } from '@/lib/site';
import LangSwitcher from './LangSwitcher';

// Header madre de Luma Premium. Sticky, con menú móvil.
export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity"
          onClick={() => setOpen(false)}
        >
          {SITE.brandMark.lead}
          <span className="text-slate-500 font-light">{SITE.brandMark.tail}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <LangSwitcher />
          <Link
            href={PRIMARY_CTA.href}
            className="bg-white text-slate-950 px-5 py-2.5 rounded-sm font-medium hover:bg-slate-200 transition-colors"
          >
            {PRIMARY_CTA.label}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-slate-300 hover:text-white transition-colors"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-md px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white transition-colors text-base"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={PRIMARY_CTA.href}
            onClick={() => setOpen(false)}
            className="block text-center bg-white text-slate-950 px-5 py-3 rounded-sm font-medium hover:bg-slate-200 transition-colors"
          >
            {PRIMARY_CTA.label}
          </Link>
          <div className="pt-2">
            <LangSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
