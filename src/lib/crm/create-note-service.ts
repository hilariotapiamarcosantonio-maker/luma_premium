import 'server-only';

import { getAuthorizedUser } from '@/lib/auth/authorized-users';
import { getCrmOperationsRepository } from '@/lib/crm/operations-repository-factory';
import { getCrmRepository } from '@/lib/crm/repository';
import { CreateNoteSchema } from './operations-schemas';
import { CrmLeadNote } from './operations-types';

// Reuses the same base schema the repository itself validates against —
// .strict() here only rejects unexpected extra fields at the Server Action
// boundary, mirroring update-lead-operation-service.ts's pattern.
const StrictCreateNoteSchema = CreateNoteSchema.strict();

export interface CreateNoteActionResponse {
  success: boolean;
  error?: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'LEAD_NOT_FOUND' | 'INTERNAL_ERROR';
  note?: CrmLeadNote;
  fieldErrors?: Record<string, string>;
}

export interface MinimalSession {
  user?: {
    email?: string | null;
    role?: string | null;
    sub?: string;
  } | null;
}

/**
 * Executes note creation for a lead. Mirrors executeUpdateLeadOperation's
 * authentication/authorization/validation structure exactly, with one
 * deliberate difference: a Sales user acting on a lead they do not own gets
 * LEAD_NOT_FOUND (not UNAUTHORIZED) — a foreign lead must look identical to
 * one that doesn't exist, matching how the lead detail page already turns a
 * ForbiddenError into notFound() for the read path.
 */
export async function executeCreateNote(
  rawInput: unknown,
  session: MinimalSession | null
): Promise<CreateNoteActionResponse> {
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

    // 3. Zod input validation
    const parseResult = StrictCreateNoteSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parseResult.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      return { success: false, error: 'VALIDATION_ERROR', fieldErrors };
    }

    const input = parseResult.data;
    const leadId = input.lead_id;

    // 4. Verify the lead exists in Luma Leads V2 or ManualLeads (accepts both lp_ and lm_ IDs,
    // already enforced by LeadIdSchema inside CreateNoteSchema).
    const leadRepo = await getCrmRepository();
    let leadExists = Boolean(await leadRepo.getLeadById(leadId));
    if (!leadExists) {
      const { getManualLeadsRepository } = await import('./manual-leads-repository');
      const manualLeadsRepo = await getManualLeadsRepository();
      leadExists = Boolean(await manualLeadsRepo.getManualLeadById(leadId));
    }
    if (!leadExists) {
      return { success: false, error: 'LEAD_NOT_FOUND' };
    }

    // 5. Authorization: Admin can note any visible lead; Sales only their own.
    // A Sales user pointed at a lead they don't own gets the same response as
    // a missing lead — never confirming the lead exists.
    if (user.role === 'sales') {
      const opsRepo = await getCrmOperationsRepository();
      const currentOp = await opsRepo.getOperationByLeadId(leadId);
      const ownerEmail = currentOp ? currentOp.owner_email : null;
      const normalizedUserEmail = user.email.toLowerCase().trim();
      const normalizedOwner = ownerEmail ? ownerEmail.toLowerCase().trim() : null;
      if (normalizedOwner !== normalizedUserEmail) {
        return { success: false, error: 'LEAD_NOT_FOUND' };
      }
    } else if (user.role !== 'admin') {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    // 6. Persist via the existing repository method — creates the LeadNotes row
    // and the add_note ActivityLog entry (already truncates to 50 chars there).
    const opsRepo = await getCrmOperationsRepository();
    const note = await opsRepo.createNote({ lead_id: leadId, body: input.body }, user.email);

    return { success: true, note };
  } catch {
    return { success: false, error: 'INTERNAL_ERROR' };
  }
}
