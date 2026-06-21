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
  promoBanner?: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  fallbackNote?: string;
}

export default function GuidePageTemplate({
  guide,
  stripeLink,
  promoBanner,
  fallbackHref = '/contact',
  fallbackLabel = 'Ask Robyn First',
  fallbackNote = 'Questions first? Book a free call or send a note.',
}: Props) {
  const { title, price, badge, hero, included, forWho, outcomeBody, testimonial } = guide;
  const hasCheckout = Boolean(stripeLink && stripeLink !== '#');
  const priceLabel = `Get the Guide - $${price}`;
  const primaryHref = hasCheckout ? stripeLink : fallbackHref;
  const primaryLabel = hasCheckout ? `${priceLabel} ->` : fallbackLabel;

  return (
    <main>
      {promoBanner && (
        <div className={styles.promoBanner}>
          <span>{promoBanner}</span>
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
          <h1 className={styles.headline}>{hero.headline}</h1>
          <p className={styles.subheading}>{hero.subheading}</p>
          <a href={primaryHref} className={styles.ctaHero}>
            {primaryLabel}
          </a>
          <p className={styles.heroSupport}>
            {hasCheckout ? 'Instant PDF download after checkout.' : fallbackNote}{' '}
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              Book a free call
            </a>
          </p>
          <p className={styles.badge}>{badge}</p>
        </div>
      </section>

      <section className={styles.included}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>What&apos;s inside</h2>
          <ul className={styles.includedList}>
            {included.map((item, i) => (
              <li key={i} className={styles.includedItem}>
                <span className={styles.check} aria-hidden="true">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a href={primaryHref} className={styles.ctaMid}>
            {primaryLabel}
          </a>
        </div>
      </section>

      <section className={styles.forWho}>
        <div className={styles.inner}>
          <div className={styles.twoCol}>
            <div>
              <h2 className={styles.sectionTitle}>This is for you if...</h2>
              <ul className={styles.forWhoList}>
                {forWho.map((item, i) => (
                  <li key={i} className={styles.forWhoItem}>
                    <span className={styles.dot} aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={styles.sectionTitle}>What you&apos;ll know after reading</h2>
              <div className={styles.outcomeBox}>
                <p className={styles.outcomeText}>{outcomeBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.testimonial}>
        <div className={styles.inner}>
          <blockquote className={styles.quote}>
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <p className={styles.attribution}>- {testimonial.author}</p>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.inner}>
          <p className={styles.finalEyebrow}>Ready?</p>
          <h2 className={styles.finalTitle}>{title}</h2>
          <p className={styles.finalSub}>
            {hasCheckout ? 'Instant download. No call required. No fluff.' : fallbackNote}
          </p>
          <a href={primaryHref} className={styles.ctaFinal}>
            {primaryLabel}
          </a>
          <p className={styles.finalNote}>
            Prefer to talk it through first?{' '}
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Book a free call
            </a>
            {' '}or email{' '}
            <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.emailLink}>
              robyn@canadiansurrogacyoptions.com
            </a>
          </p>
        </div>
      </section>

      <section className={styles.upsell}>
        <div className={styles.inner}>
          <p className={styles.upsellEyebrow}>Want to take the next step?</p>
          <p className={styles.upsellText}>
            Get a snapshot of the intended parent profiles currently working with CSO. A public gallery is coming soon. Take a look at what&apos;s already there.
          </p>
          <a
            href="https://portal.canadiansurrogacyoptions.com/profiles"
            className={styles.upsellCta}
          >
            Browse IP Profiles {'->'}
          </a>
        </div>
      </section>
    </main>
  );
}
