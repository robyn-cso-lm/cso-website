'use client';

import { useState, useEffect } from 'react';
import styles from './GuideEmailCapture.module.css';

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
  if (!SITE_KEY || !(window as any).grecaptcha) return null;
  try { return await (window as any).grecaptcha.execute(SITE_KEY, { action }); } catch { return null; }
}

interface Props {
  guideName: string;
}

export default function GuideEmailCapture({ guideName }: Props) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { loadRecaptcha(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const captchaToken = await getToken('guide_email_capture');
      const response = await fetch('/api/guide-email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          guideName,
          captchaToken,
          website: '', // honeypot field
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Thanks! Check your inbox for more information.',
        });
        setEmail('');
        setFirstName('');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to submit. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h3 className={styles.title}>Want to stay updated?</h3>
          <p className={styles.description}>
            Get news about new guides, surrogacy insights, and special offers—straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            {/* Honeypot field */}
            <input
              type="hidden"
              name="website"
              value=""
              aria-hidden="true"
            />

            <button
              type="submit"
              disabled={isLoading || !email}
              className={styles.button}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {message && (
            <p className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </p>
          )}

          <p className={styles.note}>
            We respect your inbox. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
