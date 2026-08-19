import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Data Deletion Instructions',
  description: 'How to request deletion of personal information held by Canadian Surrogacy Options.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/data-deletion' },
};

export default function DataDeletionPage() {
  return <>
    <section className={styles.hero}><div className={styles.heroInner}>
      <p className={styles.eyebrow}>Your information, your choice</p>
      <h1 className={styles.title}>Data Deletion Instructions</h1>
      <p className={styles.updated}>Last updated August 19, 2026</p>
    </div></section>
    <main className={styles.content}>
      <p>You may ask Canadian Surrogacy Options Inc. to delete personal information associated with a website inquiry, Meta lead form, Facebook or Instagram interaction, portal account, or other contact with us.</p>

      <h2>How to submit a request</h2>
      <ol>
        <li>Email <a href="mailto:robyn@canadiansurrogacyoptions.com?subject=Data%20Deletion%20Request">robyn@canadiansurrogacyoptions.com</a> with the subject line <strong>Data Deletion Request</strong>.</li>
        <li>Include the name and email address or telephone number you used when contacting us.</li>
        <li>Tell us which account, inquiry, form, or communication the request relates to.</li>
        <li>Do not email medical records, identification documents, passwords, or other unnecessary sensitive information.</li>
      </ol>

      <h2>What happens next</h2>
      <p>We will acknowledge the request, take reasonable steps to verify that it comes from you or an authorized representative, locate the relevant records, and explain the result. We may ask for limited additional information if we cannot safely match the request to a record.</p>

      <h2>Information we may retain</h2>
      <p>Some information may be retained where permitted or required for legal, accounting, fraud-prevention, security, dispute, professional, consent, or recordkeeping purposes. When full deletion is not appropriate, we may restrict use, remove information from active systems, or retain only the minimum required record. We will explain any material limitation that applies to your request.</p>

      <h2>Facebook and Instagram</h2>
      <p>This process covers information CSO received through Meta products. To delete information held directly by Facebook or Instagram, use the privacy and account controls provided by Meta for the relevant account.</p>

      <h2>Questions</h2>
      <p>For questions about deletion or other privacy choices, read our <a href="/privacy">Privacy Policy</a> or contact <a href="mailto:robyn@canadiansurrogacyoptions.com">robyn@canadiansurrogacyoptions.com</a>.</p>
    </main>
  </>;
}
