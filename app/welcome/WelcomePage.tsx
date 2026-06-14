'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './welcome.module.css';

export default function WelcomePage() {
  const [firstName, setFirstName]   = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [role, setRole]             = useState('');
  const [message, setMessage]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, phone, role, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Canadian Surrogacy Options — Since 1992</p>
          <h1 className={styles.heroTitle}>
            Welcome. You&rsquo;re in the right place.
          </h1>
          <p className={styles.heroSub}>
            Canada&rsquo;s first surrogacy agency has helped over 2,500 families
            start, grow, and complete their journey. Tell us where you are and
            we&rsquo;ll take it from here.
          </p>
        </div>
      </section>

      {/* ── Path cards ─────────────────────────────────────────────────────── */}
      <section className={styles.paths}>
        <div className={styles.pathsInner}>
          <Link href="/intended-parents" className={styles.pathCard}>
            <div className={styles.pathIcon}>👨‍👩‍👧</div>
            <h2 className={styles.pathTitle}>I&rsquo;m Looking to Build My Family</h2>
            <p className={styles.pathDesc}>
              Learn how surrogacy and egg donation work in Canada, what it costs,
              and how CSO guides you every step of the way.
            </p>
            <span className={styles.pathCta}>Explore Intended Parent Options →</span>
          </Link>

          <Link href="/surrogates" className={styles.pathCard}>
            <div className={styles.pathIcon}>💜</div>
            <h2 className={styles.pathTitle}>I Want to Be a Surrogate</h2>
            <p className={styles.pathDesc}>
              Find out if surrogacy is right for you, what the process looks like,
              and how CSO supports gestational carriers from application to birth.
            </p>
            <span className={styles.pathCta}>Learn About Becoming a Surrogate →</span>
          </Link>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────────────────── */}
      <section className={styles.trust}>
        <div className={styles.trustInner}>
          <div className={styles.trustStat}>
            <span className={styles.trustNum}>34+</span>
            <span className={styles.trustLabel}>Years in business</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustStat}>
            <span className={styles.trustNum}>2,500+</span>
            <span className={styles.trustLabel}>Families helped</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustStat}>
            <span className={styles.trustNum}>Canada&rsquo;s first</span>
            <span className={styles.trustLabel}>Surrogacy agency, founded 1992</span>
          </div>
        </div>
      </section>

      {/* ── Contact form ───────────────────────────────────────────────────── */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>
          <div className={styles.formIntro}>
            <p className={styles.eyebrowDark}>Reach Out Directly</p>
            <h2 className={styles.formTitle}>Not sure which path is yours yet?</h2>
            <p className={styles.formSub}>
              Send us a note and Robyn or a team member will reply personally —
              usually the same day. No bots, no auto-responders.
            </p>
            <div className={styles.directLinks}>
              <a href="tel:+18774014175" className={styles.directLink}>
                📞 1-877-401-4175
              </a>
              <a
                href="https://calendly.com/cso-robyn"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directLink}
              >
                📅 Book a free call
              </a>
            </div>
          </div>

          <div className={styles.formWrap}>
            {done ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>💜</div>
                <h3 className={styles.successTitle}>Got it, {firstName}.</h3>
                <p className={styles.successText}>
                  Robyn or a team member will reach out personally — usually the same day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      First name <span className={styles.req}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Email <span className={styles.req}>*</span>
                    </label>
                    <input
                      type="email"
                      className={styles.input}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Phone <span className={styles.opt}>(optional)</span>
                    </label>
                    <input
                      type="tel"
                      className={styles.input}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      I am a <span className={styles.req}>*</span>
                    </label>
                    <select
                      className={styles.select}
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select one...</option>
                      <option value="Intended Parent">Intended Parent</option>
                      <option value="Surrogate">Potential Surrogate</option>
                      <option value="Egg Donor">Potential Egg Donor</option>
                      <option value="Other">Just exploring / Other</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    What brings you here? <span className={styles.req}>*</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us a little about where you are in your journey. There are no wrong answers."
                    rows={4}
                    required
                  />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" disabled={loading} className={styles.btn}>
                  {loading ? 'Sending…' : 'Send My Message'}
                </button>

                <p className={styles.privacy}>
                  We never share your information. Robyn reads every message personally.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
