import type { Metadata } from 'next';
import styles from './contact.module.css';
import ContactForm from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Canadian Surrogacy Options',
  description: 'Reach out to Robyn and the CSO team. Call, text, email, or book a free consultation. Cambridge, Ontario. We answer every message personally.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Get in Touch</p>
          <h1 className={styles.heroTitle}>We&rsquo;re real people.<br />We actually respond.</h1>
          <p className={styles.heroSub}>
            No bots, no forms that go nowhere. When you reach out, Robyn or a member of our
            small team personally responds. Usually the same day.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className={styles.options}>
        <div className={styles.optionsInner}>
          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>📞</div>
            <h2 className={styles.optionTitle}>Call or Text</h2>
            <p className={styles.optionDesc}>
              Prefer to talk? Call or text us directly. Robyn picks up when she can,
              and always texts back.
            </p>
            <a href="tel:+18774014175" className={styles.optionLink}>
              1-877-401-4175
            </a>
            <a href="sms:+18774014175" className={styles.optionSecondary}>
              Send a text instead
            </a>
          </div>

          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>✉️</div>
            <h2 className={styles.optionTitle}>Email Robyn</h2>
            <p className={styles.optionDesc}>
              Have questions you&rsquo;d rather put in writing? Email us and expect a
              personal reply &mdash; not an auto-responder.
            </p>
            <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.optionLink}>
              robyn@canadiansurrogacyoptions.com
            </a>
          </div>

          <div className={styles.optionCard}>
            <div className={styles.optionIcon}>📅</div>
            <h2 className={styles.optionTitle}>Book a Free Call</h2>
            <p className={styles.optionDesc}>
              Ready to talk through your situation? Book a free 30-minute consultation
              with Robyn at a time that works for you.
            </p>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.optionLink}
            >
              Choose a time on Calendly
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>
          <div className={styles.formIntro}>
            <p className={styles.eyebrow}>Send a Message</p>
            <h2 className={styles.formTitle}>Not ready to call? That&rsquo;s okay.</h2>
            <p className={styles.formSub}>
              Fill in a few details and Robyn will reach out personally. No pressure,
              no sales pitch — just a real reply from a real person.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Location + hours */}
      <section className={styles.details}>
        <div className={styles.detailsInner}>
          <div className={styles.detailBlock}>
            <h3 className={styles.detailTitle}>Where we are</h3>
            <p className={styles.detailText}>
              Cambridge, Ontario, Canada
            </p>
            <p className={styles.detailNote}>
              We serve families across all of Canada and work with international intended parents.
            </p>
          </div>
          <div className={styles.detailBlock}>
            <h3 className={styles.detailTitle}>Response times</h3>
            <p className={styles.detailText}>Same day, most days.</p>
            <p className={styles.detailNote}>
              If you reach out on a weekend or holiday, expect a reply the next business morning.
              We never leave you hanging.
            </p>
          </div>
          <div className={styles.detailBlock}>
            <h3 className={styles.detailTitle}>No silly questions</h3>
            <p className={styles.detailText}>Seriously. None.</p>
            <p className={styles.detailNote}>
              Whether you&rsquo;re just curious, early in your research, or ready to start &mdash;
              every question is welcome. We&rsquo;ve heard them all and love them all.
            </p>
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className={styles.reassure}>
        <div className={styles.reassureInner}>
          <blockquote className={styles.reassureQuote}>
            &ldquo;She&rsquo;s not a figurehead. She picks up the phone. She texts back. She shows up.&rdquo;
          </blockquote>
          <p className={styles.reassureSub}>What our families say about working with Robyn.</p>
        </div>
      </section>
    </>
  );
}
