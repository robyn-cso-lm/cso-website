import { googleReviews, reviewsByName } from '@/lib/reviews';
import styles from './ReviewCards.module.css';

type ReviewCardsProps = {
  /**
   * Reviewer names to show, in order. Omit to show all of them.
   * Passed from MDX as a comma-separated string: names="Erin M, Caity Herman".
   */
  names?: string;
  /** Optional line above the cards. */
  heading?: string;
};

/**
 * Renders public Google reviews as cards inside a blog post or page.
 *
 * Reviews come from lib/reviews.ts and are rendered verbatim with the name the
 * reviewer published under. There is deliberately no prop for passing custom
 * quote text: every review shown on the site has to be a real, attributable,
 * published one, and routing them all through the shared module keeps that
 * true.
 */
export default function ReviewCards({ names, heading }: ReviewCardsProps) {
  const list = names
    ? reviewsByName(...names.split(',').map(n => n.trim()))
    : googleReviews;

  if (list.length === 0) return null;

  return (
    <aside className={styles.wrap}>
      {heading && <p className={styles.heading}>{heading}</p>}
      <div className={styles.grid}>
        {list.map(r => (
          <figure key={r.name} className={styles.card}>
            <div className={styles.stars} aria-label="5 out of 5 stars">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <blockquote className={styles.quote}>{r.quote}</blockquote>
            <figcaption className={styles.attribution}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.meta}>{r.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </aside>
  );
}
