'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { executeUpdateLeadOperation, ActionResponse } from '@/lib/crm/update-lead-operation-service';

/**
 * Server Action to securely update CRM operations for a lead.
 * Real implementation only fetches session with auth() and forwards to executeUpdateLeadOperation.
 * Revalidates Next.js router cache paths upon successful execution.
 */
export async function updateLeadOperationAction(
  rawInput: unknown
): Promise<ActionResponse> {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: 'UNAUTHENTICATED' };
  }

  const result = await executeUpdateLeadOperation(rawInput, session);

  if (result.success && result.operation) {
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${result.operation.lead_id}`);
  }

  return result;
}
