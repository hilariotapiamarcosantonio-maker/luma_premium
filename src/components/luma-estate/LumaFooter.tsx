export default function LumaFooter() {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-slate-950 text-center flex flex-col items-center justify-center font-sans">
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
          <p className="text-sm tracking-wide">
            <span className="text-white font-semibold">&copy; {new Date().getFullYear()} Marcos Hilario.</span>{' '}
            <span className="text-white/70">Arquitectura Digital de Alto Rendimiento.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
