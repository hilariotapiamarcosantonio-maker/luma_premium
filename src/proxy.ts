import 'server-only';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import { getAuthorizedUser, UserRole } from './lib/auth/authorized-users';

export interface ProxyResult {
  session: {
    user: {
      email?: string | null;
      role: UserRole;
      sub: string;
    };
  };
  user: {
    email: string;
    role: UserRole;
  };
}

/**
 * Native Next.js 16 proxy middleware (replacing middleware.ts).
 * Runs on every request as a global first line of defense.
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Apply proxy redirect checks only to private admin pages
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/admin/api')) {
    const session = await auth();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const authorized = getAuthorizedUser(session.user.email);
    if (!authorized) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

/**
 * Optimistic route proxy barrier for admin Server Components.
 * Checks for session and allowlist approval, then returns user details.
 * Redirects to /admin/login on failure.
 */
export async function proxyAdmin(): Promise<ProxyResult> {
  const session = await auth();
  
  if (!session || !session.user || !session.user.email) {
    redirect('/admin/login');
  }

  const authorized = getAuthorizedUser(session.user.email);
  if (!authorized) {
    redirect('/admin/login');
  }

  return {
    session: session as ProxyResult['session'],
    user: authorized,
  };
}

