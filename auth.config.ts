import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  pages: { signIn: '/portal/login' },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
