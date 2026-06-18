import styles from './GuidePageTemplate.module.css';

export interface GuideData {
  title: string;
  price: number;
  badge: string;
  hero: {
    headline: string;
    subheading: string;
  };
  included: string[];
  forWho: string[];
  outcomeBody: string;
  testimonial: {
    quote: string;
    author: string;
  };
}

interface Props {
  guide: GuideData;
  stripeLink: string;
}

export default function GuidePageTemplate({ guide, stripeLink }: Props) {
  const { title, price, badge, hero, included, forWho, outcomeBody, testimonial } = guide;
  const priceLabel = `Get the Guide — $${price}`;

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
          <h1 className={styles.headline}>{hero.headline}</h1>
          <p className={styles.subheading}>{hero.subheading}</p>
          <a href={stripeLink} className={styles.ctaHero}>
            {priceLabel} →
          </a>
          <p className={styles.badge}>{badge}</p>
        </div>
      </section>

      {/* What's Included */}
      <section className={styles.included}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>What&rsquo;s inside</h2>
          <ul className={styles.includedList}>
            {included.map((item, i) => (
              <li key={i} className={styles.includedItem}>
                <span className={styles.check} aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a href={stripeLink} className={styles.ctaMid}>
            {priceLabel} →
          </a>
        </div>
      </section>

      {/* For Who + Outcome */}
      <section className={styles.forWho}>
        <div className={styles.inner}>
          <div className={styles.twoCol}>
            <div>
              <h2 className={styles.sectionTitle}>This is for you if&hellip;</h2>
              <ul className={styles.forWhoList}>
                {forWho.map((item, i) => (
                  <li key={i} className={styles.forWhoItem}>
                    <span className={styles.dot} aria-hidden="true">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={styles.sectionTitle}>What you&rsquo;ll know after reading</h2>
              <div className={styles.outcomeBox}>
                <p className={styles.outcomeText}>{outcomeBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className={styles.testimonial}>
        <div className={styles.inner}>
          <blockquote className={styles.quote}>
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <p className={styles.attribution}>— {testimonial.author}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.inner}>
          <p className={styles.finalEyebrow}>Ready?</p>
          <h2 className={styles.finalTitle}>{title}</h2>
          <p className={styles.finalSub}>Instant download. No call required. No fluff.</p>
          <a href={stripeLink} className={styles.ctaFinal}>
            {priceLabel} →
          </a>
          <p className={styles.finalNote}>
            Questions?{' '}
            <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.emailLink}>
              robyn@canadiansurrogacyoptions.com
            </a>
          </p>
        </div>
      </section>

      {/* Portal Upsell Teaser */}
      <section className={styles.upsell}>
        <div className={styles.inner}>
          <p className={styles.upsellEyebrow}>Want to take the next step?</p>
          <p className={styles.upsellText}>
            Our IP Gallery connects intended parents with screened, ready-to-match surrogates—browse real profiles before committing to anything.
          </p>
          <a
            href="https://portal.canadiansurrogacyoptions.com/gallery"
            className={styles.upsellCta}
          >
            Explore the Gallery →
          </a>
        </div>
      </section>
    </main>
  );
}
