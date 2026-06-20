'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { executeUpdateLeadOperation } from '@/lib/crm/update-lead-operation-service';
import { toLeadOperationClientDto } from '@/lib/crm/operations-dto';
import type { LeadOperationClientDto } from '@/lib/crm/operations-dto';

export type UpdateLeadOperationClientResult =
  | {
      success: true;
      operation: LeadOperationClientDto;
    }
  | {
      success: false;
      error:
        | 'UNAUTHENTICATED'
        | 'UNAUTHORIZED'
        | 'VALIDATION_ERROR'
        | 'CONCURRENCY_ERROR'
        | 'LEAD_NOT_FOUND'
        | 'INTERNAL_ERROR';
      fieldErrors?: Record<string, string>;
    };

/**
 * Server Action to securely update CRM operations for a lead.
 * Real implementation only fetches session with auth() and forwards to executeUpdateLeadOperation.
 * Revalidates Next.js router cache paths upon successful execution.
 */
export async function updateLeadOperationAction(
  rawInput: unknown
): Promise<UpdateLeadOperationClientResult> {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: 'UNAUTHENTICATED' };
  }

  const result = await executeUpdateLeadOperation(rawInput, session);

  if (result.success && result.operation) {
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${result.operation.lead_id}`);
    return {
      success: true,
      operation: toLeadOperationClientDto(result.operation),
    };
  }

  return {
    success: false,
    error: result.error ?? 'INTERNAL_ERROR',
    fieldErrors: result.fieldErrors,
  };
}
