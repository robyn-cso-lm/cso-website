'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

type Step = 'form' | 'sent';

export default function LoginPage() {
  const [email,   setEmail]   = useState('');
  const [step,    setStep]    = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('@canadiansurrogacyoptions.com')) {
      setError('Please use your @canadiansurrogacyoptions.com email address.');
      return;
    }

    setLoading(true);
    await signIn('email', { email: email.toLowerCase(), redirect: false });
    setLoading(false);
    setStep('sent');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lavender">
            Canadian Surrogacy Options
          </p>
          <h1 className="mt-2 font-serif text-3xl text-deep-purple">Staff Portal</h1>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-lavender-light bg-white p-8 shadow-sm">
            <p className="mb-5 text-sm text-text-secondary">
              Enter your CSO email address and we&rsquo;ll send you a sign-in link — no password needed.
            </p>

            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lavender">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@canadiansurrogacyoptions.com"
                className="w-full rounded-lg border border-lavender-light bg-cream px-4 py-2.5 text-sm text-text-primary placeholder-lavender focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
              />
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-deep-purple py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Sending link…' : 'Send Sign-In Link'}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-lavender-light bg-white p-8 shadow-sm text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender-light text-2xl">
                ✉
              </div>
            </div>
            <h2 className="mb-2 font-serif text-xl text-deep-purple">Check your email</h2>
            <p className="text-sm text-text-secondary">
              We sent a sign-in link to <strong>{email}</strong>. Click the link in that email to access the portal.
            </p>
            <p className="mt-4 text-xs text-lavender">
              The link expires in 24 hours. Check your spam folder if you don&rsquo;t see it.
            </p>
            <button
              onClick={() => setStep('form')}
              className="mt-6 text-xs text-mid-purple hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-lavender">
          Staff access only &mdash; @canadiansurrogacyoptions.com addresses only.
        </p>
      </div>
    </div>
  );
}
