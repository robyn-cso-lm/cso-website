'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackLead } from '@/lib/track';
import styles from './ExitIntentPopup.module.css';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const STORAGE_KEY = 'cso_exit_popup_v1';

const IP_PATHS = ['/intended-parents', '/programs'];
const SURROGATE_PATHS = ['/surrogates'];

type Variant = 'ip' | 'surrogate' | null;

function loadRecaptcha() {
  if (!SITE_KEY || typeof document === 'undefined') return;
  if (document.getElementById('recaptcha-script')) return;
  const s = document.createElement('script');
  s.id = 'recaptcha-script';
  s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  s.async = true;
  document.head.appendChild(s);
}

async function getToken(action: string): Promise<string | null> {
  if (!SITE_KEY || typeof window === 'undefined') return null;
  const g = (window as Window & { grecaptcha?: { execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
  if (!g) return null;
  try { return await g.execute(SITE_KEY, { action }); } catch { return null; }
}

const COPY = {
  ip: {
    pretitle: 'Before you go',
    title: 'The numbers are in here.',
    sub: 'The Canadian Surrogacy Cost Guide breaks down what surrogacy actually costs in 2026, what\'s included, and the questions every intended parent should ask before choosing an agency.',
    cta: 'Send me the cost guide',
    successTitle: (name: string) => `Your guide is ready, ${name}!`,
    successSub: 'Check your inbox — and book a free call with Robyn when you\'re ready to talk.',
    downloadLabel: 'Download the Cost Guide →',
  },
  surrogate: {
    pretitle: 'Not sure if you qualify?',
    title: 'Find out in 10 minutes.',
    sub: 'The Surrogate Readiness Guide walks you through who\'s eligible, what the process looks like from match to birth, and what surrogates say they wish they\'d known.',
    cta: 'Send me the readiness guide',
    successTitle: (name: string) => `Your guide is on its way, ${name}!`,
    successSub: 'No pressure, no commitment. Just honest answers about what the journey really looks like.',
    downloadLabel: 'Download the Readiness Guide →',
  },
};

export default function ExitIntentPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const variant: Variant = IP_PATHS.some(p => pathname.startsWith(p))
    ? 'ip'
    : SURROGATE_PATHS.some(p => pathname.startsWith(p))
    ? 'surrogate'
    : null;

  const trigger = useCallback(() => {
    if (triggered || !variant) return;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY)) return;
    setTriggered(true);
    setTimeout(() => setOpen(true), 800);
  }, [triggered, variant]);

  useEffect(() => {
    if (!variant) return;
    loadRecaptcha();

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) trigger();
    };
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= 0.6) trigger();
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [variant, trigger]);

  // Reset when navigating to a new page
  useEffect(() => {
    setOpen(false);
    setTriggered(false);
    setPdfUrl('');
    setFirstName('');
    setEmail('');
    setError('');
  }, [pathname]);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!variant) return;
    setLoading(true);
    setError('');
    const action = variant === 'ip' ? 'ip_cost_guide_popup' : 'surrogate_guide_popup';
    const endpoint = variant === 'ip' ? '/api/ip-cost-guide' : '/api/surrogate-guide';
    const captchaToken = await getToken(action);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, captchaToken, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setPdfUrl(data.pdfUrl);
      sessionStorage.setItem(STORAGE_KEY, '1');
      trackLead({ type: variant === 'ip' ? 'Intended Parent' : 'Surrogate', source: 'exit_intent' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!open || !variant) return null;

  const copy = COPY[variant];

  return (
    <>
      <div className={styles.overlay} onClick={dismiss} aria-hidden="true" />
      <div
        className={styles.popup}
        role="dialog"
        aria-modal="true"
        aria-label="Get your free guide"
      >
        <button className={styles.close} onClick={dismiss} aria-label="Close popup">
          ×
        </button>

        {pdfUrl ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>💜</div>
            <h3 className={styles.successTitle}>{copy.successTitle(firstName)}</h3>
            <p className={styles.successSub}>{copy.successSub}</p>
            <a href={pdfUrl} download className={styles.downloadBtn}>
              {copy.downloadLabel}
            </a>
          </div>
        ) : (
          <>
            <p className={styles.pretitle}>{copy.pretitle}</p>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.sub}>{copy.sub}</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
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
                {loading ? 'Sending...' : copy.cta}
              </button>
              <p className={styles.privacy}>
                No spam. Unsubscribe any time. Guiding families since 1992.
              </p>
            </form>
            <button className={styles.dismiss} onClick={dismiss}>
              No thanks, I&apos;ll find it on my own
            </button>
          </>
        )}
      </div>
    </>
  );
}
