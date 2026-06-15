import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getAuthorizedUser } from './lib/auth/authorized-users';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Using stateless JWT sessions
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'google') {
        return false;
      }

      // Profile details returned by Google
      const email = profile?.email;
      const emailVerified = profile?.email_verified;

      // Ensure the email is verified by Google
      if (!emailVerified) {
        return false;
      }

      // Check allowlist
      const authUser = getAuthorizedUser(email);
      if (!authUser) {
        // Return false to deny login; email is not logged for security/privacy reasons
        return false;
      }

      return true;
    },

    async jwt({ token, profile, account }) {
      if (profile && account) {
        const authUser = getAuthorizedUser(profile.email);
        if (authUser) {
          token.role = authUser.role;
        }
        token.sub = account.providerAccountId; // google user sub ID
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as 'admin' | 'sales') || 'sales';
        session.user.sub = token.sub || '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login', // Redirect auth errors back to login
  },
});
