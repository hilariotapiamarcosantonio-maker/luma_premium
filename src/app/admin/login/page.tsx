import { signIn } from '@/auth';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorType = params.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(12,25,50,0.4),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <ShieldCheck className="h-8 w-8 animate-pulse" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-100">
            LUMA <span className="text-amber-400">PREMIUM</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Panel de control administrativo privado (CRM)
          </p>
        </div>

        {errorType && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {errorType === 'AccessDenied' || errorType === 'Configuration'
              ? 'Acceso no autorizado. Tu cuenta no está en la lista de accesos autorizados.'
              : 'Ha ocurrido un error al iniciar sesión. Por favor, intenta de nuevo.'}
          </div>
        )}

        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/admin' });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 font-medium text-neutral-200 transition-all hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            {/* Google G logo svg */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.488 0 2.85.508 3.93 1.358l3.1-3.1C18.816 1.832 15.72.963 12.24.963c-6.1 0-11.04 4.94-11.04 11.037S6.14 23.037 12.24 23.037c5.807 0 10.686-4.148 10.686-11.037 0-.693-.06-1.353-.18-1.715H12.24Z"
              />
            </svg>
            Continuar con Google
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-500">
          Uso restringido a personal autorizado de Luma Premium. Se registran todos los accesos e intentos fallidos.
        </p>
      </div>
    </div>
  );
}
