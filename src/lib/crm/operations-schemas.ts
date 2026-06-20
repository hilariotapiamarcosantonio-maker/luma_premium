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

// Accepts both web leads (lp_) and manually-created leads (lm_), each followed by 24 hex chars.
export const LeadIdSchema = z.string().regex(/^l[pm]_[a-f0-9]{24}$/, 'Formato de Lead ID inválido');

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
  next_action_at: z.string().nullable().optional(),
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

// Refinement for next action type, date, and time consistency
export const refineNextActionFields = (
  data: { next_action_type?: string | null; next_action_at?: string | null },
  ctx: z.RefinementCtx
) => {
  const type = data.next_action_type ? data.next_action_type.trim() : '';
  const at = data.next_action_at ? data.next_action_at.trim() : '';

  if (!type && !at) {
    return;
  }

  if (type && !at) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['next_action_at'],
      message: 'Selecciona la fecha de la próxima acción.',
    });
    return;
  }

  if (at && !type) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['next_action_type'],
      message: 'Selecciona el tipo de próxima acción.',
    });
    return;
  }

  if (at) {
    const timestamp = Date.parse(at);
    if (isNaN(timestamp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['next_action_at'],
        message: 'Selecciona la fecha de la próxima acción.',
      });
      return;
    }

    const hasTime = /\d{2}:\d{2}/.test(at);
    if (!hasTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['next_action_at'],
        message: 'Selecciona una hora para completar la próxima acción.',
      });
      return;
    }

    const isoCheck = z.string().datetime().safeParse(at);
    if (!isoCheck.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['next_action_at'],
        message: 'Selecciona la fecha de la próxima acción.',
      });
      return;
    }
  }
};

// Refinement for last_contact_at: it may be BEFORE the lead creation (the contact could have
// happened before registering the lead in the CRM), but it must never be in the FUTURE.
// A small skew tolerance avoids false negatives from client/server clock differences and the
// "Marcar ahora" shortcut.
export const refineLastContactNotFuture = (
  data: { last_contact_at?: string | null },
  ctx: z.RefinementCtx
) => {
  const at = data.last_contact_at ? data.last_contact_at.trim() : '';
  if (!at) return;

  const timestamp = Date.parse(at);
  if (isNaN(timestamp)) {
    // Format is already enforced by z.string().datetime(); guard defensively.
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['last_contact_at'],
      message: 'Fecha de último contacto inválida.',
    });
    return;
  }

  const SKEW_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
  if (timestamp > Date.now() + SKEW_TOLERANCE_MS) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['last_contact_at'],
      message: 'El último contacto no puede ser una fecha futura.',
    });
  }
};

// Combined update refinement
export const refineUpdateOperation = (
  data: {
    crm_status?: string;
    lost_reason?: string | null;
    next_action_type?: string | null;
    next_action_at?: string | null;
    last_contact_at?: string | null;
  },
  ctx: z.RefinementCtx
) => {
  refineOperationStatus(data, ctx);
  refineNextActionFields(data, ctx);
  refineLastContactNotFuture(data, ctx);
};

export const UpdateOperationSchema = UpdateOperationObjectSchema.superRefine(refineUpdateOperation);

export const CreateNoteSchema = z.object({
  lead_id: LeadIdSchema,
  body: z.string()
    .trim()
    .min(1, 'La nota debe tener al menos 1 carácter')
    .max(2000, 'La nota no puede exceder los 2000 caracteres'),
});
