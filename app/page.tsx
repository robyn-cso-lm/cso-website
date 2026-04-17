import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import LeadCapture from '@/components/LeadCapture';

export const metadata: Metadata = {
  title: 'Canadian Surrogacy Options | Canada\'s First Surrogacy Agency Since 1992',
  description: 'Canada\'s first surrogacy agency since 1992. We\'ve helped over 2,500 families through gestational surrogacy. Compassionate, expert guidance from your first question to bringing your baby home.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com',
  },
  openGraph: {
    title: 'Canadian Surrogacy Options | Canada\'s First Surrogacy Agency Since 1992',
    description: 'Canada\'s first surrogacy agency since 1992. Over 2,500 families helped.',
    url: 'https://canadiansurrogacyoptions.com',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Canadian Surrogacy Options',
  description: 'Canada\'s first surrogacy agency, founded 1992. Helping families through gestational surrogacy.',
  url: 'https://canadiansurrogacyoptions.com',
  telephone: '+16045551234',
  email: 'info@canadiansurrogacyoptions.com',
  foundingDate: '1992',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CA',
  },
  sameAs: [
    'https://facebook.com/canadiansurrogacyoptions',
    'https://instagram.com/canadiansurrogacyoptions',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Canada&rsquo;s First Surrogacy Agency</div>
          <h1 className={styles.heroH1}>From hope to heartbeat to home.</h1>
          <p className={styles.heroSub}>
            For over 30 years, we&rsquo;ve walked alongside families and surrogates on one of
            life&rsquo;s most meaningful journeys. We know this path because we&rsquo;ve built it &mdash;
            together, one family at a time.
          </p>
          <div className={styles.heroCTAs}>
            <Link href="/programs" className={styles.heroCTAPrimary}>
              Start Your Journey
            </Link>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroCTASecondary}
            >
              Book a Free Consultation
            </a>
          </div>
          <div className={styles.heroMetrics}>
            <div className={styles.metric}>
              <span className={styles.metricNum}>2,500+</span>
              <span className={styles.metricLabel}>Families</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metric}>
              <span className={styles.metricNum}>Founded 1992</span>
              <span className={styles.metricLabel}>Canada&rsquo;s First Agency</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metric}>
              <span className={styles.metricNum}>100%</span>
              <span className={styles.metricLabel}>Canadian</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <LeadCapture />

      {/* Two Paths */}
      <section className={styles.paths}>
        <div className={styles.pathsInner}>
          <h2 className={styles.sectionTitle}>How can we help you?</h2>
          <div className={styles.pathCards}>
            <div className={styles.pathCard}>
              <div className={styles.pathIcon}>👶</div>
              <h3 className={styles.pathTitle}>Become a Parent</h3>
              <p className={styles.pathText}>
                Whether you&rsquo;re just beginning to explore surrogacy or you&rsquo;re ready to start your
                journey, we&rsquo;re here to guide you every step of the way. Our programs are designed
                for all family structures &mdash; LGBTQ+ inclusive, single parents, and couples.
              </p>
              <ul className={styles.pathFeatures}>
                <li>Surrogate matching from our screened pool</li>
                <li>Legal and medical coordination</li>
                <li>Journey support from first call to birth</li>
              </ul>
              <a
                href="mailto:info@canadiansurrogacyoptions.com"
                className={styles.pathCTA}
              >
                Start the Conversation
              </a>
            </div>

            <div className={`${styles.pathCard} ${styles.pathCardAlt}`}>
              <div className={styles.pathIcon}>💜</div>
              <h3 className={styles.pathTitle}>Become a Surrogate</h3>
              <p className={styles.pathText}>
                Surrogacy is one of the most profound gifts one person can give another. If you&rsquo;re
                curious about becoming a surrogate in Canada, we&rsquo;ll walk you through what to
                expect, from eligibility to matching to your journey.
              </p>
              <ul className={styles.pathFeatures}>
                <li>Full support throughout your journey</li>
                <li>Fair, transparent reimbursement</li>
                <li>Compassionate matching process</li>
              </ul>
              <a
                href="https://becomeasurrogate.ca"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.pathCTA} ${styles.pathCTAOutline}`}
              >
                Apply to Be a Surrogate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className={styles.quote}>
        <div className={styles.quoteInner}>
          <div className={styles.quoteContent}>
            <svg className={styles.quoteMarks} width="48" height="36" viewBox="0 0 48 36" fill="none">
              <path d="M0 36V22.5C0 15 2.5 9.5 7.5 6S18 1.5 24 0l3 4.5C22.5 6 18.5 8.5 15.5 12S11.5 19.5 12 24H18V36H0ZM30 36V22.5C30 15 32.5 9.5 37.5 6S48 1.5 54 0l3 4.5C52.5 6 48.5 8.5 45.5 12S41.5 19.5 42 24H48V36H30Z" fill="currentColor" opacity="0.3" />
            </svg>
            <blockquote className={styles.quoteText}>
              I grew up in this field. My mother founded this agency when I was four years old,
              and I&rsquo;ve spent my entire life watching families be born &mdash; not just babies,
              but families. Every match, every birth, every phone call from a parent holding their
              child for the first time &mdash; this is why we do this work. It is an honour to
              carry this legacy forward.
            </blockquote>
            <cite className={styles.quoteCite}>
              <strong>Robyn Price</strong>
              <span>Executive Director, Canadian Surrogacy Options</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className={styles.contact}>
        <div className={styles.contactInner}>
          <h2 className={styles.contactTitle}>Ready to take the first step?</h2>
          <p className={styles.contactSub}>
            There are no silly questions. Reach out however feels right for you.
          </p>
          <div className={styles.contactOptions}>
            <a href="tel:+16045551234" className={styles.contactOption}>
              <span className={styles.contactOptionIcon}>📞</span>
              <span className={styles.contactOptionLabel}>Call Us</span>
              <span className={styles.contactOptionValue}>(604) 555-1234</span>
            </a>
            <a href="mailto:info@canadiansurrogacyoptions.com" className={styles.contactOption}>
              <span className={styles.contactOptionIcon}>✉️</span>
              <span className={styles.contactOptionLabel}>Email Us</span>
              <span className={styles.contactOptionValue}>info@canadiansurrogacyoptions.com</span>
            </a>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactOption}
            >
              <span className={styles.contactOptionIcon}>📅</span>
              <span className={styles.contactOptionLabel}>Book a Call</span>
              <span className={styles.contactOptionValue}>Free 30-min with Robyn</span>
            </a>
            <a href="sms:+16045551234" className={styles.contactOption}>
              <span className={styles.contactOptionIcon}>💬</span>
              <span className={styles.contactOptionLabel}>Text Us</span>
              <span className={styles.contactOptionValue}>(604) 555-1234</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
