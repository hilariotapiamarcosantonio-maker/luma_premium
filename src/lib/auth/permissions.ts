import 'server-only';

import { getAuthorizedUser, UserRole } from './authorized-users';

export class UnauthorizedError extends Error {
  constructor(message = 'Acceso no autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Permisos insuficientes para esta operación') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Validates that a user is authenticated and authorized, returning their email and role.
 * Throws an UnauthorizedError if they are not authenticated.
 */
export function assertAuthorized(sessionUser: { email?: string | null } | undefined): { email: string; role: UserRole } {
  if (!sessionUser || !sessionUser.email) {
    throw new UnauthorizedError();
  }

  const authUser = getAuthorizedUser(sessionUser.email);
  if (!authUser) {
    throw new UnauthorizedError();
  }

  return authUser;
}

/**
 * Validates that a user has the 'admin' role.
 * Throws ForbiddenError if the role is not 'admin'.
 */
export function assertAdmin(sessionUser: { email?: string | null } | undefined): { email: string; role: 'admin' } {
  const user = assertAuthorized(sessionUser);
  if (user.role !== 'admin') {
    throw new ForbiddenError();
  }
  return user as { email: string; role: 'admin' };
}
