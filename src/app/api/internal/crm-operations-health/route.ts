// Node.js runtime required — googleapis and google-auth-library use Node APIs.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAuthorizedUser } from '@/lib/auth/authorized-users';
import { getCrmOperationsRepository } from '@/lib/crm/operations-repository-factory';

export async function GET() {
  // Only available in Vercel Preview environment
  if (process.env.VERCEL_ENV !== 'preview') {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Require Auth.js session
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Require Admin role
  const authorized = getAuthorizedUser(session.user.email);
  if (!authorized || authorized.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const repo = await getCrmOperationsRepository();
    const mode = process.env.CRM_OPERATIONS_MODE || 'mock';

    // Verify repository is instantiated in sheets mode
    if (mode !== 'sheets' || repo.constructor.name !== 'GoogleSheetsOperationsRepository') {
      return NextResponse.json({
        ok: false,
        mode,
        error: `Expected mode to be sheets, got ${mode} (${repo.constructor.name})`
      }, { status: 400 });
    }

    // listOperations executes ensureValidated() internally
    // checking for: OIDC/WIF validation, sheets accessibility, existence of all 3 tabs, and exact headers
    const operations = await repo.listOperations({});

    return NextResponse.json({
      ok: true,
      mode: 'sheets',
      schema: 'valid',
      operationsCount: operations.length
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[crm-operations-health] diagnostic error:', err);
    return NextResponse.json({
      ok: false,
      mode: process.env.CRM_OPERATIONS_MODE || 'unknown',
      error: errorMsg
    }, { status: 500 });
  }
}
