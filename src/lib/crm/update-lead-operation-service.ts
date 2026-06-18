import 'server-only';

import { getAuthorizedUser } from '@/lib/auth/authorized-users';
import { getCrmOperationsRepository } from '@/lib/crm/operations-repository-factory';
import { getCrmRepository } from '@/lib/crm/repository';
import { UpdateOperationObjectSchema, refineUpdateOperation } from './operations-schemas';
import { CrmLeadOperation } from './operations-types';

// Build the strict schema reusing the base object schema and refinement
const StrictUpdateActionSchema = UpdateOperationObjectSchema.strict().superRefine(refineUpdateOperation);

export interface ActionResponse {
  success: boolean;
  error?: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'CONCURRENCY_ERROR' | 'LEAD_NOT_FOUND' | 'INTERNAL_ERROR';
  operation?: CrmLeadOperation;
}

export interface MinimalSession {
  user?: {
    email?: string | null;
    role?: string | null;
    sub?: string;
  } | null;
}

/**
 * Executes the core lead operation update logic.
 * Accepts session explicitly. Contains all authorization, validation, concurrency, and persistence logic.
 * Safely maps errors to standard codes and avoids exposing internal exception details.
 */
export async function executeUpdateLeadOperation(
  rawInput: unknown,
  session: MinimalSession | null
): Promise<ActionResponse> {
  try {
    // 1. Authenticate session
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: 'UNAUTHENTICATED' };
    }

    // 2. Resolve authorized user and role
    const user = getAuthorizedUser(session.user.email);
    if (!user) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 3. Zod Input Validation using the strict schema
    const parseResult = StrictUpdateActionSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return { success: false, error: 'VALIDATION_ERROR' };
    }

    const input = parseResult.data;
    const leadId = input.lead_id;

    // 4. Verify that lead exists in original leads sheet Luma Leads V2
    const leadRepo = await getCrmRepository();
    const lead = await leadRepo.getLeadById(leadId);
    if (!lead) {
      return { success: false, error: 'LEAD_NOT_FOUND' };
    }

    // 5. Retrieve current operation state to apply auth checks and concurrency checks
    const opsRepo = await getCrmOperationsRepository();
    const currentOp = await opsRepo.getOperationByLeadId(leadId);
    const currentVersion = currentOp ? currentOp.version : 0;
    const currentOwner = currentOp ? currentOp.owner_email : null;

    // 6. Authorization Policy Checks
    if (user.role === 'sales') {
      const normalizedUserEmail = user.email.toLowerCase().trim();
      const normalizedCurrentOwner = currentOwner ? currentOwner.toLowerCase().trim() : null;

      // Sales can only edit if assigned to them (cannot edit unassigned or other agents' leads)
      if (normalizedCurrentOwner !== normalizedUserEmail) {
        return { success: false, error: 'UNAUTHORIZED' };
      }

      // Sales cannot change owner_email
      if (input.owner_email !== undefined) {
        const normalizedInputOwner = input.owner_email ? input.owner_email.toLowerCase().trim() : null;
        if (normalizedInputOwner !== normalizedCurrentOwner) {
          return { success: false, error: 'UNAUTHORIZED' };
        }
      }
    } else if (user.role === 'admin') {
      // Admin Rules: Can edit any lead and freely assign/change/remove owner_email
    } else {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 7. Concurrency Check (expected_version must match current database version)
    if (input.expected_version !== currentVersion) {
      return { success: false, error: 'CONCURRENCY_ERROR' };
    }

    // 8. Validate the effective status and lost_reason
    const hasLostReason = typeof rawInput === 'object' && rawInput !== null && 'lost_reason' in rawInput;

    const effectiveStatus =
      input.crm_status ??
      currentOp?.crm_status ??
      'new';

    const effectiveLostReason =
      input.crm_status !== undefined && input.crm_status !== 'lost'
        ? null
        : hasLostReason
          ? input.lost_reason
          : currentOp?.lost_reason ?? null;

    if (effectiveStatus === 'lost' && (!effectiveLostReason || effectiveLostReason.trim().length === 0)) {
      return { success: false, error: 'VALIDATION_ERROR' };
    }

    // 9. Handle lost_reason state transition cleanup:
    // If crm_status is present and is NOT 'lost', ensure lost_reason is cleared to null.
    const finalLostReason = input.crm_status !== undefined && input.crm_status !== 'lost'
      ? null
      : hasLostReason
        ? input.lost_reason
        : undefined;

    // 9. Execute repository write operation
    const operation = await opsRepo.upsertOperation({
      lead_id: input.lead_id,
      crm_status: input.crm_status,
      owner_email: input.owner_email,
      priority: input.priority,
      next_action_type: input.next_action_type,
      next_action_at: input.next_action_at,
      last_contact_at: input.last_contact_at,
      lost_reason: finalLostReason,
      expected_version: input.expected_version,
    }, user.email);

    return { success: true, operation };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg === 'CONCURRENCY_ERROR') {
      return { success: false, error: 'CONCURRENCY_ERROR' };
    }
    return { success: false, error: 'INTERNAL_ERROR' };
  }
}
