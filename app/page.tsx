import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';
import GuidesStrip from '@/components/GuidesStrip';
import ClinicStrip from '@/components/ClinicStrip';

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

      {/* Refund Banner */}
      <div className={styles.refundBanner}>
        <span className={styles.refundBannerBadge}>New</span>
        <p className={styles.refundBannerText}>
          <strong>Our refund policy is now public.</strong>{' '}
          85% back in Phase 1. Free pause anytime. Because life doesn&rsquo;t pause for a 24-month journey.
        </p>
        <Link href="/intended-parents#refund-policy" className={styles.refundBannerLink}>
          Read the full policy &rarr;
        </Link>
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Canadian Surrogacy Options</p>
          <h1 className={styles.heroH1}>
            From hope to heartbeat<br />to home.
          </h1>
          <p className={styles.heroTagline}>The family you&rsquo;re building is already real.</p>
          <p className={styles.heroSub}>
            We&rsquo;ve been walking families through surrogacy in Canada since 1992. Legal,
            altruistic, and fully supported, from the first call to the day you bring
            your baby home.
          </p>
          <div className={styles.heroCTAs}>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroCTAPrimary}
            >
              Book a Free Call with Robyn
            </a>
            <a
              href="https://portal.canadiansurrogacyoptions.com/register"
              className={styles.heroCTAGhost}
            >
              Begin Your Application
            </a>
          </div>
          <div className={styles.heroStatStrip}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNum}>1992</div>
              <div className={styles.heroStatLabel}>In operation since</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNum}>30+</div>
              <div className={styles.heroStatLabel}>Years of experience</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNum}>2,500+</div>
              <div className={styles.heroStatLabel}>Families built</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatNum}>#1</div>
              <div className={styles.heroStatLabel}>Canada&rsquo;s first agency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className={styles.paths}>
        <div className={styles.pathsInner}>
          <p className={styles.pathsEyebrow}>Where are you in your journey?</p>
          <h2 className={styles.pathsHeading}>
            We&rsquo;re here for both sides<br />of this equation.
          </h2>
          <div className={styles.pathsGrid}>
            <div className={`${styles.pathCard} ${styles.pathCardFeatured}`}>
              <div className={styles.pathNum}>01</div>
              <h3 className={styles.pathTitle}>Intended Parents</h3>
              <p className={styles.pathBody}>
                You want to build a family through surrogacy. We match you with a screened,
                committed surrogate, and walk with you through every medical, legal,
                and emotional step of the journey.
              </p>
              <Link href="/intended-parents" className={styles.btnPath}>
                Explore Programs &rarr;
              </Link>
            </div>
            <div className={styles.pathCard}>
              <div className={styles.pathNum}>02</div>
              <h3 className={styles.pathTitle}>Become a Surrogate</h3>
              <p className={styles.pathBody}>
                You want to help a family that can&rsquo;t do it alone. We screen carefully,
                support fully, and make sure you are valued at every step. This is one of the
                most meaningful things a person can do.
              </p>
              <Link href="/surrogates" className={styles.btnPath}>
                Learn More &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why CSO trust strip */}
      <section className={styles.whyCso}>
        <div className={styles.whyCsoInner}>
          <p className={styles.whyCsoEyebrow}>Why Canadian Surrogacy Options</p>
          <div className={styles.whyCsoGrid}>
            {[
              "Canada's first surrogacy agency · Founded 1992",
              "2,500+ families built",
              "Only agency with a published refund policy",
              "Three-stage payment — not everything upfront",
              "Matches built on connection, not algorithms",
              "30+ years of magic sparks",
            ].map(item => (
              <div key={item} className={styles.whyCsoPill}>
                <span className={styles.whyCsoPillDot} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinics trust strip */}
      <ClinicStrip />

      {/* Guides Strip */}
      <GuidesStrip />

      {/* Contact nudge */}
      <section className={styles.contactNudge}>
        <div className={styles.contactNudgeInner}>
          <div className={styles.contactNudgeText}>
            <p className={styles.contactNudgeHeading}>A real conversation. No scripts.</p>
            <p className={styles.contactNudgeSub}>Robyn or a member of the team replies personally. Usually the same day.</p>
          </div>
          <div className={styles.contactNudgeActions}>
            <a href="tel:+18774014175" className={styles.contactNudgeLink}>📞 1-877-401-4175</a>
            <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.contactNudgeLink}>✉️ robyn@canadiansurrogacyoptions.com</a>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactNudgeBtn}
            >
              Book a Free Call
            </a>
            <Link href="/contact" className={styles.contactNudgeBtn}>Send a Message &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Refund Feature */}
      <section className={styles.refundFeature}>
        <div className={styles.refundFeatureInner}>
          <div className={styles.refundFeatureLeft}>
            <div className={styles.refundFeatureBadge}>
              <span className={styles.refundFeatureBadgeDot} />
              <span className={styles.refundFeatureBadgeText}>Now public</span>
            </div>
            <h2 className={styles.refundFeatureHeading}>
              We protect your investment<br /><em>at every phase.</em>
            </h2>
            <p className={styles.refundFeatureBody}>
              Most surrogacy agencies bury their refund policy, or don&rsquo;t have one.
              We put ours in writing because we believe you deserve to know exactly what happens
              if life gets hard before you sign anything. Job loss. Health changes. Cold feet.
              Real fear. We work with all of it.
            </p>
            <Link href="/intended-parents#refund-policy" className={styles.btnRefundCta}>
              Read Our Full Refund Policy
            </Link>
          </div>
          <div className={styles.refundFeatureRight}>
            <div className={styles.refundPhasePill}>
              <div className={styles.pillNum}>01</div>
              <div className={styles.pillContent}>
                <p className={styles.pillLabel}>Phase 1: Intake</p>
                <p className={styles.pillOffer}>85% refund or free pause</p>
                <p className={styles.pillDetail}>
                  Before active matching begins. We help, not pressure.
                </p>
              </div>
            </div>
            <div className={styles.refundPhasePill}>
              <div className={styles.pillNum}>02</div>
              <div className={styles.pillContent}>
                <p className={styles.pillLabel}>Phase 2: Matching</p>
                <p className={styles.pillOffer}>Free pause anytime, or sliding scale refund</p>
                <p className={styles.pillDetail}>
                  Keep your spot. Resume when you&rsquo;re ready. No extra fees.
                </p>
              </div>
            </div>
            <div className={styles.refundPhasePill}>
              <div className={styles.pillNum}>03</div>
              <div className={styles.pillContent}>
                <p className={styles.pillLabel}>Phase 3: Post-match</p>
                <p className={styles.pillOffer}>Full support with flexibility for real hardship</p>
                <p className={styles.pillDetail}>
                  Three parties are committed. We still show up for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Robyn */}
      <section className={styles.robynSection}>
        <div className={styles.robynInner}>
          <p className={styles.robynQuote}>
            &ldquo;I grew up in this field. My mother founded Canadian Surrogacy Options in 1992.
            I took over after she passed in 2019, and I have continued her work with everything I have.&rdquo;
          </p>
          <p className={styles.robynBody}>
            If you are here, it is because you want to be parents, or because you want to help
            someone become one. That is the whole reason we exist. There is no intake team, no junior
            coordinator. You talk to Robyn. You get honest answers.
          </p>
          <div className={styles.robynSig}>
            Robyn Price
            <span>Executive Director, Canadian Surrogacy Options</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaH2}>Ready when <em>you</em> are.</h2>
        <p className={styles.finalCtaP}>
          Your application takes about 10 minutes. It&rsquo;s the first step toward something
          that could change everything.
        </p>
        <div className={styles.finalCtaActions}>
          <a
            href="https://portal.canadiansurrogacyoptions.com/register"
            className={styles.btnCtaPrimary}
          >
            Begin Your Application
          </a>
          <a
            href="https://calendly.com/cso-robyn"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnCtaSecondary}
          >
            Book a call with Robyn instead
          </a>
        </div>
      </section>
    </>
  );
}
