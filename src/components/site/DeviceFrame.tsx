// Marcos de dispositivo (browser / móvil) en CSS puro para mockups de producto.
// Server component, sin JS de cliente. Representan UI de forma estilizada
// (no son capturas reales ni afirman datos de clientes).

export function BrowserFrame({
  label = 'sistema.luma',
  children,
  className = '',
  noPadding = false,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-black/50 ${className}`}
    >
      {/* Barra del navegador */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-900/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="ml-3 hidden flex-1 truncate rounded-md border border-slate-800 bg-slate-950/70 px-3 py-1 text-[10px] font-mono text-slate-500 sm:block">
          {label}
        </span>
      </div>
      <div className={noPadding ? '' : 'p-4 sm:p-5'}>{children}</div>
    </div>
  );
}

export function PhoneFrame({
  children,
  className = '',
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[2rem] border-[6px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 ${className}`}
    >
      {/* Notch */}
      <div className="flex items-center justify-center bg-slate-900/60 py-2">
        <span className="h-1.5 w-16 rounded-full bg-slate-700" />
      </div>
      <div className={noPadding ? '' : 'p-3'}>{children}</div>
    </div>
  );
}
