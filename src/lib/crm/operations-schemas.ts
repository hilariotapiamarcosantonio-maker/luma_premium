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

export const UpdateOperationSchema = z.object({
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
  lost_reason: z.string().nullable().optional().transform((val) => (val && val.trim().length > 0 ? val.trim() : null)),
  expected_version: z.number().int().positive(),
  updated_by: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
    z.string().email('Email de actualizador inválido')
  ),
}).superRefine((data, ctx) => {
  if (data.crm_status === 'lost') {
    if (!data.lost_reason || data.lost_reason.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lost_reason'],
        message: 'lost_reason es obligatorio cuando el estado es lost',
      });
    }
  } else if (data.crm_status) {
    if (data.lost_reason !== undefined && data.lost_reason !== null && data.lost_reason.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lost_reason'],
        message: 'lost_reason debe estar vacío cuando el estado no es lost',
      });
    }
  }
});

export const CreateNoteSchema = z.object({
  lead_id: LeadIdSchema,
  body: z.string()
    .min(1, 'La nota debe tener al menos 1 carácter')
    .max(2000, 'La nota no puede exceder los 2000 caracteres')
    .transform((val) => val.trim()),
  created_by: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
    z.string().email('Email de autor inválido')
  ),
});
