import { z } from 'zod';

export const CreateManualLeadSchema = z.object({
  full_name: z.string().trim().min(2, 'El nombre completo debe tener al menos 2 caracteres'),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('El correo electrónico no es válido').or(z.literal('')).optional(),
  company: z.string().trim().optional(),
  country: z.string().trim().optional(),
  language: z.enum(['es', 'en']).default('es'),
  industry: z.string().trim().optional(),
  investment_range: z.string().trim().optional(),
  capture_channel: z.string().trim().default('manual'),
  campaign: z.string().trim().default('manual'),
  consent_to_contact: z.boolean().default(false),
  owner_email: z.string().trim().optional(),
  priority: z.string().trim().optional(),
  initial_note: z.string().trim().optional(),
}).refine(data => {
  const hasPhone = data.phone && data.phone.trim().length > 0;
  const hasEmail = data.email && data.email.trim().length > 0;
  return hasPhone || hasEmail;
}, {
  message: 'Debe ingresar al menos un número de teléfono o un correo electrónico',
  path: ['email'],
});

export type CreateManualLeadInput = z.infer<typeof CreateManualLeadSchema>;

export interface CreateManualLeadResponse {
  success: boolean;
  leadId?: string;
  error?: 'UNAUTHENTICATED' | 'UNAUTHORIZED' | 'VALIDATION_ERROR' | 'DUPLICATE_LEAD' | 'INTERNAL_ERROR';
  existingLeadId?: string;
  message?: string;
}
