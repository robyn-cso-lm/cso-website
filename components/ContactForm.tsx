'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

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

  if (done) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>💜</div>
        <h3 className={styles.successTitle}>Message received, {firstName}.</h3>
        <p className={styles.successText}>
          Robyn or a member of the team will be in touch personally, usually the same day.
          No auto-responders. A real reply.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>First name <span className={styles.req}>*</span></label>
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
            <label className={styles.label}>Email <span className={styles.req}>*</span></label>
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
            <label className={styles.label}>Phone <span className={styles.opt}>(optional)</span></label>
            <input
              type="tel"
              className={styles.input}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Your phone number"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>I am a <span className={styles.req}>*</span></label>
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
          <label className={styles.label}>Tell us a little about your situation <span className={styles.req}>*</span></label>
          <textarea
            className={styles.textarea}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Where are you in your journey? What questions do you have? There are no wrong answers here."
            rows={5}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? 'Sending...' : 'Send My Message'}
        </button>

        <p className={styles.privacy}>
          We will never share your information. Robyn reads every message personally.
        </p>
      </form>
    </div>
  );
}
