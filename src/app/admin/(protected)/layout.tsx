import { proxyAdmin } from '@/proxy';
import { signOut } from '@/auth';
import Link from 'next/link';
import { 
  Users, 
  LayoutDashboard, 
  LogOut
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforces proxy protection at layout level
  const { user } = await proxyAdmin();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Background visual glow */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_60%_80%_at_100%_20%,rgba(12,25,50,0.2),rgba(255,255,255,0))] pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-neutral-800 bg-neutral-900/40 backdrop-blur-xl md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-neutral-800 px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="text-neutral-100">LUMA</span>
            <span className="text-amber-500 text-xs px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10">CRM</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4 text-neutral-400" />
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <Users className="h-4 w-4 text-neutral-400" />
            Leads
          </Link>
        </nav>

        {/* User profile & logout section */}
        <div className="border-t border-neutral-800 p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-xs font-bold text-amber-500 uppercase">
              {user.email.slice(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs text-neutral-400">{user.email}</span>
              <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0 w-full">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="font-bold tracking-tight text-neutral-100">
              LUMA <span className="text-amber-500 text-xs border border-amber-500/20 bg-amber-500/10 px-1 py-0.5 rounded">CRM</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs text-neutral-400 hover:text-white">Dashboard</Link>
            <Link href="/admin/leads" className="text-xs text-neutral-400 hover:text-white">Leads</Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
              }}
            >
              <button type="submit" className="text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Content Body */}
        <main className="relative z-10 flex-1 px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
