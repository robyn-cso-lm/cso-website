import type { Metadata } from 'next';
import styles from './thank-you.module.css';

export const metadata: Metadata = {
  title: 'Thank You | Canadian Surrogacy Options',
  description: 'Your guide is on its way.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main>
      {/* Confirmation */}
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
          <h1 className={styles.title}>Your guide is on its way.</h1>
          <p className={styles.subtitle}>
            Check your inbox—we just sent you a download link. The email comes from{' '}
            <strong>robyn@canadiansurrogacyoptions.com</strong>. If you don&rsquo;t see it in a
            few minutes, check your spam folder.
          </p>
        </div>
      </section>

      {/* Personal note */}
      <section className={styles.note}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>A note from Robyn</h2>
          <p className={styles.noteText}>
            I&rsquo;ve been in surrogacy for over 30 years. I wrote these guides because I kept
            seeing the same thing—people coming to their first agency call with no frame of
            reference, getting overwhelmed, or ending up in the wrong situation for their
            circumstances.
          </p>
          <p className={styles.noteText}>
            If questions come up as you read, I&rsquo;m genuinely happy to answer them. Just
            reply to the email. No pitch, no pressure.
          </p>
          <p className={styles.noteSig}>— Robyn Price, Executive Director</p>
        </div>
      </section>

      {/* Portal Upsell */}
      <section className={styles.upsell}>
        <div className={styles.inner}>
          <p className={styles.upsellEyebrow}>Ready to take the next step?</p>
          <h2 className={styles.upsellTitle}>Browse our IP Gallery</h2>
          <p className={styles.upsellText}>
            The CSO gallery connects intended parents with screened, ready-to-match surrogates.
            It&rsquo;s one of the only places in Canada where you can browse real profiles before
            committing to an agency—free to explore.
          </p>
          <a
            href="https://portal.canadiansurrogacyoptions.com/gallery"
            className={styles.upsellCta}
          >
            Explore the Gallery →
          </a>
          <p className={styles.upsellNote}>Free to browse. No commitment required.</p>
        </div>
      </section>

      {/* Other guides */}
      <section className={styles.moreGuides}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Other guides</h2>
          <div className={styles.guidesGrid}>
            <a href="/guides/is-surrogacy-right" className={styles.guideCard}>
              <p className={styles.guideTitle}>Is Surrogacy Right For Me?</p>
              <p className={styles.guidePrice}>$27</p>
            </a>
            <a href="/guides/ip-profile-template" className={styles.guideCard}>
              <p className={styles.guideTitle}>IP Profile Template Pack</p>
              <p className={styles.guidePrice}>$67</p>
            </a>
            <a href="/guides/surrogate-readiness" className={styles.guideCard}>
              <p className={styles.guideTitle}>Surrogate Readiness Guide</p>
              <p className={styles.guidePrice}>$47</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
