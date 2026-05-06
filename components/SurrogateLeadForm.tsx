'use client';

import { useState } from 'react';
import styles from './SurrogateLeadForm.module.css';

export default function SurrogateLeadForm() {
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
      const res = await fetch('/api/surrogate-guide', {
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
          We&rsquo;ve also added you to our surrogate community list, and you&rsquo;ll hear from us
          with resources and updates.
        </p>
        <a
          href={pdfUrl}
          download
          className={styles.downloadBtn}
        >
          Download Your Free Guide →
        </a>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.badge}>Free Download</div>
      <h2 className={styles.title}>Get the Surrogate Readiness Guide</h2>
      <p className={styles.sub}>
        Everything you need to know before applying: eligibility, the screening process,
        reimbursement explained, and how to talk to your family about it.
        No cost. No obligation. Just information.
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
