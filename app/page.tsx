import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import LeadMagnets from '@/components/LeadMagnets';

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
  telephone: '+18774014175',
  email: 'robyn@canadiansurrogacyoptions.com',
  foundingDate: '1992',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cambridge',
    addressRegion: 'ON',
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
        {/* Family silhouettes — background layer */}
        <svg
          className={styles.silhouettes}
          viewBox="0 0 1440 150"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
        >
          {/* Single woman — far left */}
          <g fill="white" transform="translate(180, 20)">
            <circle cx="0" cy="18" r="13"/>
            <rect x="-9" y="34" width="18" height="22" rx="9"/>
            <path d="M-10,56 L-24,116 L24,116 L10,56 Z"/>
          </g>

          {/* Two men */}
          <g fill="white" transform="translate(440, 20)">
            <circle cx="-22" cy="18" r="14"/>
            <rect x="-34" y="35" width="24" height="40" rx="12"/>
            <rect x="-34" y="72" width="10" height="42" rx="5"/>
            <rect x="-20" y="72" width="10" height="42" rx="5"/>
            <circle cx="22" cy="18" r="14"/>
            <rect x="10" y="35" width="24" height="40" rx="12"/>
            <rect x="10" y="72" width="10" height="42" rx="5"/>
            <rect x="24" y="72" width="10" height="42" rx="5"/>
          </g>

          {/* Hetero couple — centre */}
          <g fill="white" transform="translate(720, 20)">
            {/* Man (slightly taller) */}
            <circle cx="-24" cy="15" r="14"/>
            <rect x="-36" y="32" width="24" height="42" rx="12"/>
            <rect x="-36" y="71" width="10" height="45" rx="5"/>
            <rect x="-22" y="71" width="10" height="45" rx="5"/>
            {/* Woman */}
            <circle cx="24" cy="20" r="12"/>
            <rect x="14" y="35" width="18" height="22" rx="9"/>
            <path d="M13,57 L0,116 L48,116 L35,57 Z"/>
          </g>

          {/* Two women */}
          <g fill="white" transform="translate(1000, 20)">
            <circle cx="-22" cy="20" r="12"/>
            <rect x="-32" y="35" width="18" height="22" rx="9"/>
            <path d="M-33,57 L-46,116 L-8,116 L-21,57 Z"/>
            <circle cx="22" cy="20" r="12"/>
            <rect x="12" y="35" width="18" height="22" rx="9"/>
            <path d="M11,57 L-2,116 L46,116 L33,57 Z"/>
          </g>

          {/* Single man — far right */}
          <g fill="white" transform="translate(1260, 20)">
            <circle cx="0" cy="18" r="14"/>
            <rect x="-12" y="35" width="24" height="40" rx="12"/>
            <rect x="-12" y="72" width="10" height="42" rx="5"/>
            <rect x="4" y="72" width="10" height="42" rx="5"/>
          </g>
        </svg>

        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Canada&rsquo;s First Surrogacy Agency &middot; Since 1992</div>
          <h1 className={styles.heroH1}>From hope to heartbeat to home.</h1>
          <p className={styles.heroSub}>
            For over 30 years, we&rsquo;ve walked alongside families and surrogates on one of
            life&rsquo;s most meaningful journeys. Every family structure welcome &mdash;
            LGBTQ+ inclusive, single parents, and couples.
          </p>
          <div className={styles.heroCTAs}>
            <Link href="/programs" className={styles.heroCTAPrimary}>
              Start Your Journey
            </Link>
            <Link href="/contact" className={styles.heroCTASecondary}>
              Get in Touch
            </Link>
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
              <span className={styles.metricNum}>Cambridge, ON</span>
              <span className={styles.metricLabel}>100% Canadian</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnets */}
      <LeadMagnets />

      {/* Two Paths */}
      <section className={styles.paths}>
        <div className={styles.pathsInner}>
          <h2 className={styles.sectionTitle}>How can we help you?</h2>
          <div className={styles.pathCards}>
            <div className={styles.pathCard}>
              <div className={styles.pathIcon}>👶</div>
              <h3 className={styles.pathTitle}>I Want to Become a Parent</h3>
              <p className={styles.pathText}>
                You&rsquo;ve been through so much to get here. We see you. Whether you&rsquo;re facing
                infertility, are part of the LGBTQ+ community, or simply need a different path to
                parenthood, we&rsquo;re here to walk beside you every step of the way.
              </p>
              <ul className={styles.pathFeatures}>
                <li>Surrogate matching from our screened pool</li>
                <li>Legal and medical coordination</li>
                <li>Journey support from first call to birth</li>
              </ul>
              <a
                href="mailto:robyn@canadiansurrogacyoptions.com"
                className={styles.pathCTA}
              >
                Start the Conversation
              </a>
            </div>

            <div className={`${styles.pathCard} ${styles.pathCardAlt}`}>
              <div className={styles.pathIcon}>💜</div>
              <h3 className={styles.pathTitle}>I Want to Become a Surrogate</h3>
              <p className={styles.pathText}>
                You have an extraordinary gift to give. Surrogacy is one of the most profound acts
                of love and generosity a person can offer another family. If you&rsquo;ve felt the
                pull to help someone else experience parenthood, we&rsquo;d love to hear from you.
              </p>
              <ul className={styles.pathFeatures}>
                <li>Full support throughout your journey</li>
                <li>Fair, transparent reimbursement</li>
                <li>Compassionate matching process</li>
              </ul>
              <Link href="/surrogates" className={`${styles.pathCTA} ${styles.pathCTAOutline}`}>
                Apply to Be a Surrogate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className={styles.quote}>
        <div className={styles.quoteInner}>
          <div className={styles.quoteContent}>
            <svg className={styles.quoteMarks} width="48" height="36" viewBox="0 0 54 36" fill="none">
              <path d="M0 36V22.5C0 15 2.5 9.5 7.5 6S18 1.5 24 0l3 4.5C22.5 6 18.5 8.5 15.5 12S11.5 19.5 12 24H18V36H0ZM30 36V22.5C30 15 32.5 9.5 37.5 6S48 1.5 54 0l3 4.5C52.5 6 48.5 8.5 45.5 12S41.5 19.5 42 24H48V36H30Z" fill="currentColor" opacity="0.3" />
            </svg>
            <blockquote className={styles.quoteText}>
              I grew up in this field. My mother founded this agency when I was four years old.
              She spent years preparing me, trusting me, handing me the pieces of something she
              had built from love. I&rsquo;ve spent my entire life watching families be born &mdash;
              not just babies, but families. Every match, every birth, every phone call from a
              parent holding their child for the first time. It is an honour to carry this legacy forward.
            </blockquote>
            <cite className={styles.quoteCite}>
              <strong>Robyn Price</strong>
              <span>Executive Director, Canadian Surrogacy Options</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.storyText}>
            <p className={styles.storyEyebrow}>Our Legacy</p>
            <h2 className={styles.storyTitle}>Canada&rsquo;s very first surrogacy agency.</h2>
            <p className={styles.storyBody}>
              Canadian Surrogacy Options was founded in 1992 by Joanne Wright, making us Canada&rsquo;s
              very first surrogacy agency. For over three decades, we&rsquo;ve been at the heart of
              family-building in this country, long before surrogacy was widely understood or accepted.
            </p>
            <p className={styles.storyBody}>
              Today, under Robyn&rsquo;s leadership, we continue that legacy with the same values:
              compassion, transparency, and unwavering support. We&rsquo;re not a corporation. We&rsquo;re
              a small, dedicated team who believe that every family deserves to exist, and every
              surrogate deserves to be honoured for the gift she gives.
            </p>
            <p className={styles.storyBody}>
              We guide you with experience you can trust, support you can feel, and a community
              that will hold you through every moment of the journey.
            </p>
            <div className={styles.storyCTAs}>
              <a href="https://calendly.com/cso-robyn" target="_blank" rel="noopener noreferrer" className={styles.storyCTA}>
                Book a Free Call
              </a>
              <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.storyCTASecondary}>
                Or email Robyn directly
              </a>
            </div>
          </div>
          <div className={styles.storyStats}>
            <div className={styles.storyStat}>
              <span className={styles.storyStatNum}>1992</span>
              <span className={styles.storyStatLabel}>Year Founded</span>
            </div>
            <div className={styles.storyStat}>
              <span className={styles.storyStatNum}>2,500+</span>
              <span className={styles.storyStatLabel}>Families Built</span>
            </div>
            <div className={styles.storyStat}>
              <span className={styles.storyStatNum}>30+</span>
              <span className={styles.storyStatLabel}>Years of Experience</span>
            </div>
            <div className={styles.storyStat}>
              <span className={styles.storyStatNum}>#1</span>
              <span className={styles.storyStatLabel}>Canada&rsquo;s First Agency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className={styles.contact}>
        <div className={styles.contactInner}>
          <h2 className={styles.contactTitle}>Ready to take the first step?</h2>
          <p className={styles.contactSub}>
            We&rsquo;re here when you are. Reach out however feels most comfortable.
          </p>
          <div className={styles.contactOptions}>
            <a href="tel:+18774014175" className={styles.contactOption}>
              <span className={styles.contactOptionIcon}>📞</span>
              <span className={styles.contactOptionLabel}>Call Us</span>
              <span className={styles.contactOptionValue}>1-877-401-4175</span>
            </a>
            <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.contactOption}>
              <span className={styles.contactOptionIcon}>✉️</span>
              <span className={styles.contactOptionLabel}>Email Robyn</span>
              <span className={styles.contactOptionValue}>robyn@canadiansurrogacyoptions.com</span>
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
            <a href="sms:+18774014175" className={styles.contactOption}>
              <span className={styles.contactOptionIcon}>💬</span>
              <span className={styles.contactOptionLabel}>Text Robyn</span>
              <span className={styles.contactOptionValue}>1-877-401-4175</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
