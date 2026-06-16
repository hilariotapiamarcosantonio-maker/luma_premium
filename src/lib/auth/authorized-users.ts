import 'server-only';

export type UserRole = 'admin' | 'sales';

export interface AuthorizedUser {
  email: string;
  role: UserRole;
}

/**
 * Normalizes an email address.
 * For the email received from Google, use only email.trim().toLowerCase().
 */
export function normalizeEmail(email: string | null | undefined): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Normalizes email lists from environment variables.
 * For each entry obtained from env vars:
 * - split using the separator ','
 * - apply trim()
 * - remove outer single or double quotes
 * - convert to lowercase
 * - remove empty entries
 * - deduplicate (Set)
 */
export function normalizeEnvEmails(envVal: string | null | undefined): Set<string> {
  if (!envVal) return new Set();

  const parts = envVal.split(',');
  const result = new Set<string>();

  for (const part of parts) {
    let trimmed = part.trim();

    // Remove outer single or double quotes
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      trimmed = trimmed.slice(1, -1);
    } else {
      if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
        trimmed = trimmed.slice(1);
      }
      if (trimmed.endsWith('"') || trimmed.endsWith("'")) {
        trimmed = trimmed.slice(0, -1);
      }
    }

    trimmed = trimmed.trim().toLowerCase();
    if (trimmed.length > 0) {
      result.add(trimmed);
    }
  }

  return result;
}

/**
 * Gets the allowlist of administrators from the environment.
 */
export function getAdminEmails(): Set<string> {
  const envVal = process.env.CRM_ADMIN_EMAILS || '';
  return normalizeEnvEmails(envVal);
}

/**
 * Gets the allowlist of sales agents from the environment.
 */
export function getSalesEmails(): Set<string> {
  const envVal = process.env.CRM_SALES_EMAILS || '';
  return normalizeEnvEmails(envVal);
}

/**
 * Safely masks an email for logging purposes without exposing PII.
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return 'none';
  const trimmed = email.trim();
  const parts = trimmed.split('@');
  if (parts.length !== 2) return 'invalid-email-format';
  const name = parts[0];
  const domain = parts[1];
  if (name.length <= 2) {
    return `${name.slice(0, 1)}*@${domain}`;
  }
  return `${name.slice(0, 2)}***@${domain}`;
}

/**
 * Checks if a given email is authorized and returns its role.
 * Safe for use only on the server. Does not log rejected emails or display them.
 */
export function getAuthorizedUser(email: string | null | undefined): AuthorizedUser | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const admins = getAdminEmails();
  if (admins.has(normalized)) {
    return { email: normalized, role: 'admin' };
  }

  const sales = getSalesEmails();
  if (sales.has(normalized)) {
    return { email: normalized, role: 'sales' };
  }

  return null;
}
