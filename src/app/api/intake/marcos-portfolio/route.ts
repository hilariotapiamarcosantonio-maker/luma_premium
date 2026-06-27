// Node.js runtime required — googleapis and google-auth-library use Node APIs.
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { appendLumaLeadV2, isDuplicateLumaLeadV2, classifyGcpFailure } from '@/lib/google-sheets';
import { createSubmissionClaimStore } from '@/lib/luma-leads-validation';
import {
  isValidIngestSecret,
  validateAndMapMarcosPortfolioPayload,
  resolveMarcosPortfolioSubmission,
  type MarcosPortfolioPayload,
} from '@/lib/marcos-portfolio-intake';

// Independent claim-guard instance — not shared with /api/luma-leads. The
// Sheets-based duplicate check remains the authoritative, cross-endpoint
// defense; this in-memory guard only narrows the race window for rapid
// repeat calls hitting the same warm instance of THIS route.
const submissionClaims = createSubmissionClaimStore();
const SUBMISSION_CLAIM_TTL_MS = 20_000;

export async function POST(request: Request) {
  const providedSecret = request.headers.get('x-luma-ingest-secret');
  if (!isValidIngestSecret(providedSecret, process.env.PORTFOLIO_INGEST_SECRET)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  let body: MarcosPortfolioPayload;
  try {
    body = (await request.json()) as MarcosPortfolioPayload;
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const result = validateAndMapMarcosPortfolioPayload(body);

  if (result.fakeSuccess) {
    return NextResponse.json({ success: true });
  }
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const { outcome } = await resolveMarcosPortfolioSubmission(result.lead, {
      claims: submissionClaims,
      now: Date.now(),
      ttlMs: SUBMISSION_CLAIM_TTL_MS,
      isDuplicate: isDuplicateLumaLeadV2,
      append: appendLumaLeadV2,
    });

    if (outcome !== 'created') {
      console.log('[intake-marcos-portfolio]', { event: outcome });
    }

    return NextResponse.json({ success: true, message: 'Solicitud recibida.' });
  } catch (error) {
    const failure = classifyGcpFailure(error);
    console.error('[intake-marcos-portfolio]', { stage: failure.stage, code: failure.code });
    return NextResponse.json({ error: 'Servicio no disponible. Intente de nuevo más tarde.' }, { status: 503 });
  }
}
