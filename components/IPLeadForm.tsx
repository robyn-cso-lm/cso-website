'use client';

import { useState } from 'react';
import styles from './SurrogateLeadForm.module.css';

export default function IPLeadForm() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
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
      setPdfUrl(data.pdfUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (pdfUrl) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>💜</div>
        <h3 className={styles.successTitle}>Your guide is ready, {firstName}!</h3>
        <p className={styles.successText}>
          We&rsquo;ve sent it to your inbox too. If you have questions after reading,
          a free call with Robyn is just one click away.
        </p>
        <a href={pdfUrl} download className={styles.downloadBtn}>
          Download the Cost Guide →
        </a>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.badge}>Free Download</div>
      <h2 className={styles.title}>Get the Canadian Surrogacy Cost Guide</h2>
      <p className={styles.sub}>
        What surrogacy actually costs in Canada in 2025 — the full breakdown nobody publishes.
        Real numbers. No pressure. No obligation.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? 'Sending...' : 'Send Me the Free Guide'}
        </button>
        <p className={styles.privacy}>No spam. Unsubscribe any time.</p>
      </form>
    </div>
  );
}
