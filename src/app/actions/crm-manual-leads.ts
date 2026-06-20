'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { executeCreateManualLead } from '@/lib/crm/create-manual-lead-service';
import type { CreateManualLeadResponse } from '@/lib/crm/manual-lead-schema';

/**
 * Server Action to securely create a manual lead.
 * Authenticates, forwards request to executeCreateManualLead, and revalidates cache.
 */
export async function createManualLeadAction(
  rawInput: unknown
): Promise<CreateManualLeadResponse> {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: 'UNAUTHENTICATED' };
  }

  const result = await executeCreateManualLead(rawInput, session);

  if (result.success && result.leadId) {
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${result.leadId}`);
  }

  return result;
}
