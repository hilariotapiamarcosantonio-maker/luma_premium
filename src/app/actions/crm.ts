'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { executeUpdateLeadOperation } from '@/lib/crm/update-lead-operation-service';
import { executeCreateNote } from '@/lib/crm/create-note-service';
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

export interface NoteClientDto {
  body: string;
  author: string;
  createdAt: string;
}

export type CreateNoteClientResult =
  | {
      success: true;
      note: NoteClientDto;
    }
  | {
      success: false;
      error: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'LEAD_NOT_FOUND' | 'INTERNAL_ERROR';
      fieldErrors?: Record<string, string>;
    };

/**
 * Server Action to securely add a note to a lead. Only safe fields (body,
 * author, date) are returned to the client — never the note id, lead_id, or
 * any other internal identifier.
 */
export async function createNoteAction(rawInput: unknown): Promise<CreateNoteClientResult> {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: 'UNAUTHENTICATED' };
  }

  const result = await executeCreateNote(rawInput, session);

  if (result.success && result.note) {
    revalidatePath(`/admin/leads/${result.note.lead_id}`);
    return {
      success: true,
      note: {
        body: result.note.body,
        author: result.note.created_by,
        createdAt: result.note.created_at,
      },
    };
  }

  return {
    success: false,
    error: result.error ?? 'INTERNAL_ERROR',
    fieldErrors: result.fieldErrors,
  };
}
