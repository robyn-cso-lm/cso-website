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
          From hope to heartbeat to home.
        </h2>
        <p className={styles.sub}>
          Whether you&rsquo;re building a family or helping one grow, we made these guides
          for you. Free to download, free to share.
        </p>
        <div className={styles.guideCards}>
          <Link href="/intended-parents" className={styles.guideCard}>
            <span className={styles.guideCardLabel}>For Intended Parents</span>
            <span className={styles.guideCardTitle}>IP Program Overview</span>
            <span className={styles.guideCardDesc}>Programs, process, and what to expect from start to finish.</span>
            <span className={styles.guideCardCta}>Read the guide &rarr;</span>
          </Link>
          <Link href="/surrogates" className={styles.guideCard}>
            <span className={styles.guideCardLabel}>For Surrogates</span>
            <span className={styles.guideCardTitle}>Surrogate Readiness Guide</span>
            <span className={styles.guideCardDesc}>Everything you need to know before applying, including eligibility and screening.</span>
            <span className={styles.guideCardCta}>Read the guide &rarr;</span>
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/intended-parents#refund-policy" className={styles.guideLink}>
            📄 Refund &amp; Protection Policy
          </Link>
        </div>
        <div className={styles.emailCapture}>
          <p className={styles.emailLabel}>
            Or get the Canadian Surrogacy Cost Guide sent to your inbox:
          </p>
          {success ? (
            <p className={styles.formSuccess}>
              Sent! Check your inbox, and feel free to share with anyone who needs it.
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
