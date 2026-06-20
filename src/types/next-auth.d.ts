import { DefaultSession } from 'next-auth';
import { UserRole } from '../lib/auth/authorized-users';

declare module 'next-auth' {
  interface Session {
    user: {
      role: UserRole;
      sub: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    sub?: string;
  }
}
