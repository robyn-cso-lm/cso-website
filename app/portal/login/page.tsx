'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router   = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid username or password.');
    } else {
      router.push('/portal');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lavender">Canadian Surrogacy Options</p>
          <h1 className="mt-2 font-serif text-3xl text-deep-purple">Staff Portal</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-lavender-light bg-white p-8 shadow-sm">
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lavender">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-lg border border-lavender-light bg-cream px-4 py-2.5 text-sm text-text-primary placeholder-lavender focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
              placeholder="e.g. rana"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-lavender">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-lavender-light bg-cream px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-mid-purple/40"
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-lavender">
          Staff access only. Contact Robyn to reset your password.
        </p>
      </div>
    </div>
  );
}
