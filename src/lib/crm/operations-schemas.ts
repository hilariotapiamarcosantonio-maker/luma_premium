import { z } from 'zod';

export const CrmStatusEnum = z.enum([
  'new',
  'contacted',
  'qualified',
  'meeting_scheduled',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
  'nurture'
]);

export const CrmPriorityEnum = z.enum(['low', 'medium', 'high']);

export const LeadIdSchema = z.string().regex(/^lp_[a-f0-9]{24}$/, 'Formato de Lead ID inválido');

export const ActorEmailSchema = z.preprocess(
  (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
  z.string().email('Email de actor inválido')
);

// Base object schema shared between repository validation and Server Action validation
export const UpdateOperationObjectSchema = z.object({
  lead_id: LeadIdSchema,
  crm_status: CrmStatusEnum.optional(),
  owner_email: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
    z.string().email('Email de propietario inválido').nullable().optional()
  ),
  priority: CrmPriorityEnum.optional(),
  next_action_type: z.string().nullable().optional(),
  next_action_at: z.string().datetime({ message: 'Fecha next_action_at inválida' }).nullable().optional(),
  last_contact_at: z.string().datetime({ message: 'Fecha last_contact_at inválida' }).nullable().optional(),
  lost_reason: z.string().nullable().optional().transform((val) => {
    if (val === undefined) return undefined;
    return val && val.trim().length > 0 ? val.trim() : null;
  }),
  expected_version: z.number().int().nonnegative(),
});

// Shared refinement function to avoid duplicating business logic for lost_reason validation
export const refineOperationStatus = (
  data: { crm_status?: string; lost_reason?: string | null },
  ctx: z.RefinementCtx
) => {
  if (data.crm_status === 'lost') {
    if (!data.lost_reason || data.lost_reason.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lost_reason'],
        message: 'lost_reason es obligatorio cuando el estado es lost',
      });
    }
  } else {
    if (data.lost_reason !== undefined && data.lost_reason !== null && data.lost_reason.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lost_reason'],
        message: 'lost_reason solo puede enviarse cuando crm_status es lost',
      });
    }
  }
};

export const UpdateOperationSchema = UpdateOperationObjectSchema.superRefine(refineOperationStatus);

export const CreateNoteSchema = z.object({
  lead_id: LeadIdSchema,
  body: z.string()
    .trim()
    .min(1, 'La nota debe tener al menos 1 carácter')
    .max(2000, 'La nota no puede exceder los 2000 caracteres'),
});
