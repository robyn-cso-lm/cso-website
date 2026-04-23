'use client';

import { useState } from 'react';
import styles from './LeadMagnets.module.css';

function GuideForm({
  endpoint,
  guideTitle,
  guideDesc,
  btnLabel,
  downloadLabel,
  successNote,
}: {
  endpoint: string;
  guideTitle: string;
  guideDesc: string;
  btnLabel: string;
  downloadLabel: string;
  successNote: string;
}) {
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
      const res = await fetch(endpoint, {
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
      <div className={styles.successState}>
        <div className={styles.successHeart}>💜</div>
        <p className={styles.successName}>Your guide is ready, {firstName}.</p>
        <p className={styles.successNote}>{successNote}</p>
        <a href={pdfUrl} download className={styles.downloadBtn}>
          {downloadLabel}
        </a>
      </div>
    );
  }

  return (
    <>
      <p className={styles.cardDesc}>{guideDesc}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? 'Sending...' : btnLabel}
        </button>
        <p className={styles.privacy}>No spam. Unsubscribe any time.</p>
      </form>
    </>
  );
}

export default function LeadMagnets() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Free Resources</p>
          <h2 className={styles.title}>Want to learn more before reaching out?</h2>
          <p className={styles.sub}>
            We have put together honest, detailed guides for both families and surrogates.
            Enter your name and email and we will send yours right away.
          </p>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardBadge}>For Intended Parents</div>
            <h3 className={styles.cardTitle}>The Canadian Surrogacy Cost Guide</h3>
            <GuideForm
              endpoint="/api/ip-cost-guide"
              guideTitle="IP Cost Guide"
              guideDesc="What surrogacy actually costs in Canada in 2025. The full breakdown, real numbers, and what drives the range in your specific situation. No pressure, no obligation."
              btnLabel="Send Me the Cost Guide"
              downloadLabel="Download the Cost Guide"
              successNote="Check your inbox too. When you are ready to talk through the numbers, a free call with Robyn is just one click away."
            />
          </div>

          <div className={`${styles.card} ${styles.cardAlt}`}>
            <div className={`${styles.cardBadge} ${styles.cardBadgeAlt}`}>For Surrogates</div>
            <h3 className={styles.cardTitle}>The Surrogate Readiness Guide</h3>
            <GuideForm
              endpoint="/api/surrogate-guide"
              guideTitle="Surrogate Guide"
              guideDesc="What surrogacy actually involves, what we look for in a surrogate, and what the journey looks like from application to birth. Straightforward and honest."
              btnLabel="Send Me the Surrogate Guide"
              downloadLabel="Download the Surrogate Guide"
              successNote="Check your inbox too. We would love to hear from you when you are ready."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
