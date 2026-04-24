import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.staffUser.findUnique({
          where: { username: credentials.username as string },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.displayName, email: user.username };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/portal/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as typeof session.user & { id: string }).id = token.id as string;
      }
      return session;
    },
  },
});
