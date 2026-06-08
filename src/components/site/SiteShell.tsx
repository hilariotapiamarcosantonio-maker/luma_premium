import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

// Shell madre: header sticky + main oscuro + footer.
// Reutilizado por todas las rutas públicas de la web madre.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
