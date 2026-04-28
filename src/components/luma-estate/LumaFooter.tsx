export default function LumaFooter() {
  return (
    <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950 text-center flex flex-col items-center justify-center font-sans">
      <div className="space-y-4">
        <div>
          <p className="text-slate-500 text-sm mb-1">
            Luma Estate OS es una vertical comercial de <strong className="text-slate-400 font-medium">Luma Premium</strong>.
          </p>
          <p className="text-slate-600 text-xs">
            Infraestructura Comercial Inmobiliaria
          </p>
        </div>
        
        <div className="w-12 h-px bg-slate-800 mx-auto"></div>
        
        <div>
          <p className="text-slate-600 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Marcos Hilario. Arquitectura Digital de Alto Rendimiento.
          </p>
        </div>
      </div>
    </footer>
  );
}
