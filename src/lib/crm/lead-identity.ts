import 'server-only';
import { createHash } from 'crypto';

interface LeadIdentityInput {
  schema_version: string;
  created_at: string;
  locale: string;
  email: string;
  phone: string;
  company: string;
}

/**
 * Normalizes email by trimming and converting to lowercase.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalizes phone by extracting only numeric digits.
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Normalizes company name by trimming and converting to lowercase.
 */
function normalizeCompany(company: string): string {
  return company.trim().toLowerCase();
}

/**
 * Generates a stable deterministic fingerprint using sha256.
 * Format is lp_<first_16_characters_of_hash>.
 *
 * NOTE FOR FUTURE PHASES:
 * When 'Luma CRM Leads' is implemented, this identity fingerprint will be persisted
 * as an immutable 'lead_id' reference.
 */
export function generateLeadId(input: LeadIdentityInput): string {
  const normEmail = normalizeEmail(input.email);
  const normPhone = normalizePhone(input.phone);
  const normCompany = normalizeCompany(input.company);

  const rawString =
    (input.schema_version || '') +
    (input.created_at || '') +
    (input.locale || '') +
    normEmail +
    normPhone +
    normCompany;

  const hash = createHash('sha256').update(rawString).digest('hex');

  // Return the friendly, safe URL identifier prefix + 24 chars of short hash
  return `lp_${hash.slice(0, 24)}`;
}

/**
 * Validates that a string matches the strict lead_id format: lp_<24 hexadecimal characters>.
 */
export function isValidLeadId(leadId: string | null | undefined): boolean {
  if (!leadId) return false;
  return /^lp_[a-f0-9]{24}$/.test(leadId);
}

