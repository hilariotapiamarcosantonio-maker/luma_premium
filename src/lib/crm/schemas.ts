import { z } from 'zod';

export const LeadFiltersSchema = z.object({
  status: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  locale: z.enum(['es', 'en']).optional(),
  investment_range: z.string().optional(),
  utm_campaign: z.string().optional(),
  platform: z.string().optional(),
  channel: z.string().optional(),
  date_from: z.string().optional(), // ISO string date
  date_to: z.string().optional(),   // ISO string date
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(25),
});

/**
 * Maps to the exactly A:AC columns structure of Luma Leads V2.
 */
export const SheetRowSchema = z.object({
  schema_version: z.string().default('2'),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid ISO created_at date',
  }),
  locale: z.enum(['es', 'en']).default('es'),
  country: z.string().default(''),
  full_name: z.string().default(''),
  email: z.string().email().or(z.literal('')).default(''),
  phone: z.string().default(''),
  company: z.string().default(''),
  role: z.string().default(''),
  industry: z.string().default(''),
  industry_detail: z.string().default(''),
  team_size: z.string().default(''),
  lead_volume: z.string().default(''),
  acquisition_channels: z.string().default(''),
  advertising_status: z.string().default(''),
  current_tools: z.string().default(''),
  main_bottleneck: z.string().default(''),
  desired_outcome: z.string().default(''),
  solution_interest: z.string().default(''),
  timeline: z.string().default(''),
  investment_range: z.string().default(''),
  source: z.string().default(''),
  page_origin: z.string().default(''),
  utm_source: z.string().default(''),
  utm_medium: z.string().default(''),
  utm_campaign: z.string().default(''),
  utm_content: z.string().default(''),
  utm_term: z.string().default(''),
  status: z.string().default('nuevo'),
});
