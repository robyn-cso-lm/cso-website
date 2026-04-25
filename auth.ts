import NextAuth from 'next-auth';
import Email from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/graphMail';

const ALLOWED_DOMAIN = 'canadiansurrogacyoptions.com';

function buildMagicLinkEmail(url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #f5f0f9; font-family: Arial, sans-serif; }
    .wrapper { max-width: 480px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(61,26,110,0.1); }
    .header { background: #3D1A6E; padding: 32px 40px; text-align: center; }
    .header-eyebrow { color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; }
    .header-title { color: #fff; font-size: 24px; font-weight: 300; margin: 0; font-family: Georgia, serif; font-style: italic; }
    .body { padding: 36px 40px; text-align: center; }
    .text { font-size: 15px; color: #4A3560; line-height: 1.7; margin-bottom: 28px; }
    .btn { display: inline-block; padding: 16px 40px; background: #3D1A6E; color: #fff !important; font-size: 15px; font-weight: 600; border-radius: 100px; text-decoration: none; }
    .expiry { margin-top: 20px; font-size: 12px; color: #9B7FC7; }
    .footer { padding: 20px 40px; background: #FDFAF7; border-top: 1px solid #E8E0F5; text-align: center; }
    .footer-text { font-size: 11px; color: #9B7FC7; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="header-eyebrow">Canadian Surrogacy Options</p>
      <h1 class="header-title">Staff Portal Sign-In</h1>
    </div>
    <div class="body">
      <p class="text">Click the button below to sign in to the CSO Staff Portal. No password needed.</p>
      <a href="${url}" class="btn">Sign In to Portal &rarr;</a>
      <p class="expiry">This link expires in 24 hours and can only be used once.</p>
    </div>
    <div class="footer">
      <p class="footer-text">If you didn&rsquo;t request this, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Email({
      // Dummy server satisfies NextAuth's nodemailer validation;
      // actual delivery is handled by sendVerificationRequest via Microsoft Graph.
      server: { host: 'localhost', port: 25, auth: { user: '', pass: '' } },
      from: 'noreply@canadiansurrogacyoptions.com',
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await sendMail(email, 'Sign in to CSO Staff Portal', buildMagicLinkEmail(url));
      },
    }),
  ],
  session: { strategy: 'database' },
  pages: { signIn: '/portal/login' },
  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? '';
      if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) return false;
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        (session.user as typeof session.user & { role: string }).role =
          (user as typeof user & { role?: string }).role ?? 'coordinator';
      }
      return session;
    },
  },
});
