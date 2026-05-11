'use client';

import { useState, useEffect } from 'react';
import styles from './SurrogateLeadForm.module.css';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function loadRecaptcha() {
  if (!SITE_KEY || document.getElementById('recaptcha-script')) return;
  const s = document.createElement('script');
  s.id = 'recaptcha-script';
  s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  s.async = true;
  document.head.appendChild(s);
}

async function getToken(action: string): Promise<string | null> {
  if (!SITE_KEY || !window.grecaptcha) return null;
  try { return await window.grecaptcha.execute(SITE_KEY, { action }); } catch { return null; }
}

export default function IPLeadForm() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  useEffect(() => { loadRecaptcha(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const captchaToken = await getToken('ip_cost_guide');
    try {
      const res = await fetch('/api/ip-cost-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, captchaToken, website }),
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
        What surrogacy actually costs in Canada in 2025. The full breakdown nobody publishes.
        Real numbers. No pressure. No obligation.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Honeypot */}
        <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          tabIndex={-1} autoComplete="off" aria-hidden="true" />
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
