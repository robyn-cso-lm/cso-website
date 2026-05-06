'use client';

import { useState } from 'react';
import styles from './concierge.module.css';

export default function ConciergeForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    contactMethod: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/concierge-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed. Please try again.');
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.formSuccess}>
        <p className={styles.formSuccessIcon}>✦</p>
        <h3 className={styles.formSuccessTitle}>Inquiry Received</h3>
        <p className={styles.formSuccessText}>
          Thank you. Robyn will review your inquiry personally and respond within 48 hours
          to the email address you provided. Please check your inbox, and your spam folder,
          just in case.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="First name"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="Last name"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Private Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Best Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={styles.input}
            placeholder="+1 (___) ___-____"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Country / Region</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className={styles.select}
          required
        >
          <option value="">Select a country or region</option>
          <option value="Canada">Canada</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="European Union">European Union</option>
          <option value="Middle East">Middle East</option>
          <option value="Asia">Asia</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>How can Robyn help you?</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className={styles.textarea}
          required
          placeholder="Please share as much or as little as you are comfortable sharing at this stage. There are no wrong answers."
          rows={6}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Preferred contact method</label>
        <select
          name="contactMethod"
          value={form.contactMethod}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select a preference</option>
          <option value="Email">Email</option>
          <option value="Phone call">Phone call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Signal">Signal</option>
          <option value="No preference">No preference</option>
        </select>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'Submitting...' : 'Submit Private Inquiry'}
      </button>

      <p className={styles.formLegal}>
        Your inquiry is private and will not be shared with anyone beyond Robyn Price.
      </p>
    </form>
  );
}
