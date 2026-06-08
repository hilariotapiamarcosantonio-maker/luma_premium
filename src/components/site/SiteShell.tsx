import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import PremiumBackground from './PremiumBackground';
import StickyMobileCTA from './StickyMobileCTA';

// Shell madre: fondo premium global + header sticky + main + footer + CTA móvil.
// Reutilizado por todas las rutas públicas de la web madre.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-slate-300 selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      <PremiumBackground />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <StickyMobileCTA />
    </div>
  );
}
