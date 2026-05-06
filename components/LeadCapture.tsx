'use client';

import { useState } from 'react';
import styles from './LeadCapture.module.css';

export default function LeadCapture() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !email || !role) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {success ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>💜</div>
            <h3 className={styles.successTitle}>You&rsquo;re on the list!</h3>
            <p className={styles.successText}>
              Thank you, {firstName}. We&rsquo;ll be in touch with resources and updates
              tailored just for you.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Stay connected with CSO</h2>
              <p className={styles.sub}>
                Get resources, real stories, and gentle guidance delivered to your inbox.
                No pressure, no spam. Just the information you need when you need it.
              </p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fields}>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={styles.input}
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">I am a&hellip;</option>
                  <option value="Intended Parent">Intended Parent</option>
                  <option value="Surrogate">Surrogate</option>
                  <option value="Egg Donor">Egg Donor</option>
                  <option value="Just curious">Just curious</option>
                </select>
                <button type="submit" disabled={loading} className={styles.btn}>
                  {loading ? 'Joining...' : 'Join the Community'}
                </button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
