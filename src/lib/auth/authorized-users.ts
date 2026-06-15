import 'server-only';

export type UserRole = 'admin' | 'sales';

export interface AuthorizedUser {
  email: string;
  role: UserRole;
}

/**
 * Normalizes an email address.
 */
export function normalizeEmail(email: string | null | undefined): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Gets the allowlist of administrators from the environment.
 */
function getAdminEmails(): Set<string> {
  const envVal = process.env.CRM_ADMIN_EMAILS || '';
  return new Set(
    envVal
      .split(',')
      .map(normalizeEmail)
      .filter((email) => email.length > 0)
  );
}

/**
 * Gets the allowlist of sales agents from the environment.
 */
function getSalesEmails(): Set<string> {
  const envVal = process.env.CRM_SALES_EMAILS || '';
  return new Set(
    envVal
      .split(',')
      .map(normalizeEmail)
      .filter((email) => email.length > 0)
  );
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
