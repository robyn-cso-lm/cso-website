'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './GuidesStrip.module.css';

export default function GuidesStrip() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ip-cost-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.strip}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Free resources</p>
        <h2 className={styles.heading}>
          Our guides are yours &mdash; no strings attached.
        </h2>
        <p className={styles.sub}>
          We made these specifically for intended parents and surrogates. They&rsquo;re free
          to download and free to share. We&rsquo;re happy to put the right information in
          anyone&rsquo;s hands.
        </p>
        <div className={styles.links}>
          <Link href="/intended-parents" className={styles.guideLink}>
            📄 IP Program Overview
          </Link>
          <Link href="/intended-parents#refund-policy" className={styles.guideLink}>
            📄 Refund &amp; Protection Policy
          </Link>
          <Link href="/surrogates" className={styles.guideLink}>
            📄 Surrogate Readiness Guide
          </Link>
          <Link href="/programs" className={styles.guideLink}>
            📄 All-Inclusive Packages
          </Link>
        </div>
        <div className={styles.emailCapture}>
          <p className={styles.emailLabel}>
            Or get the Canadian Surrogacy Cost Guide sent to your inbox:
          </p>
          {success ? (
            <p className={styles.formSuccess}>
              Sent! Check your inbox &mdash; and feel free to share with anyone who needs it.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className={styles.emailForm} noValidate>
              <input
                className={styles.emailInput}
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                className={styles.emailInput}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading} className={styles.emailBtn}>
                {loading ? 'Sending...' : 'Send Me the Guide'}
              </button>
            </form>
          )}
          {error && <p className={styles.formError}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
