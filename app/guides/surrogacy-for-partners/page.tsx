import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './partner-guide.module.css';

export const metadata: Metadata = {
  title: 'A Surrogacy Guide for Partners | Canadian Surrogacy Options',
  description:
    'A free, honest guide to screening, agreements, appointments, family life and supporting your partner through a Canadian surrogacy journey.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/guides/surrogacy-for-partners',
  },
  openGraph: {
    title: 'Surrogacy Is a Family Decision',
    description:
      'What partners should know before the first appointment. Download the free guide from Canadian Surrogacy Options.',
    url: 'https://canadiansurrogacyoptions.com/guides/surrogacy-for-partners',
    images: ['/images/guides/surrogacy-guide-for-partners-cso.png'],
  },
};

const TOPICS = [
  'How partners are involved in screening and the surrogacy agreement',
  'What appointments, medications and pregnancy can mean at home',
  'How reimbursements work under Canada\'s altruistic model',
  'Practical ways to support her while looking after yourself too',
  'Six conversations to have together before you say yes',
];

export default function SurrogacyForPartnersPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>A free guide for surrogate households</p>
            <h1>Surrogacy is a family decision</h1>
            <p className={styles.deck}>
              Your partner wants to become a surrogate. This is the honest version of what that
              can mean for you, your relationship and life at home.
            </p>
            <div className={styles.actions}>
              <a className={styles.primary} href="/downloads/cso-surrogacy-guide-for-partners.pdf">
                Download the free PDF
              </a>
              <Link className={styles.secondary} href="/knowledge-centre/surrogacy-guide-for-partners">
                Read it online
              </Link>
            </div>
          </div>
          <img
            className={styles.cover}
            src="/images/guides/surrogacy-guide-for-partners-cso.png"
            alt="Surrogacy is a family decision. A guide for partners from Canadian Surrogacy Options."
          />
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.narrow}>
          <p className={styles.kicker}>Inside the guide</p>
          <h2>Know what you are both saying yes to</h2>
          <p>
            Partners are not watching from the sidelines. They are part of the appointments,
            agreements, practical planning and emotional life of the journey. This guide helps
            you talk about all of it before the first appointment.
          </p>
          <ul>
            {TOPICS.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
          <p className={styles.note}>
            This guide is general information, not legal or medical advice. Your lawyer and
            fertility clinic are the right people for questions about your own situation.
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.narrow}>
          <p className={styles.kicker}>Partners are always welcome</p>
          <h2>Want to talk it through together?</h2>
          <p>
            Book a free call with Robyn. Bring your questions, your worries and the things you are
            still working out.
          </p>
          <a className={styles.primary} href="https://calendly.com/cso-robyn">
            Book a free call
          </a>
        </div>
      </section>
    </main>
  );
}
