import type { Metadata } from 'next';
import Link from 'next/link';
import ConciergeForm from './ConciergeForm';
import styles from './concierge.module.css';

export const metadata: Metadata = {
  title: 'Private Inquiry | Canadian Surrogacy Options',
  description: 'Private concierge surrogacy experience with Robyn Price. By invitation only.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateInquiryPage() {
  return (
    <div className={styles.page}>
      {/* Custom Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <span className={styles.navLogo}>CSO | Canadian Surrogacy Options</span>
          <Link href="/programs" className={styles.navBack}>
            &larr; Back to Programs
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Private &amp; By Invitation</p>
          <h1 className={styles.heroH1}>
            The<br />
            <em className={styles.heroItalic}>Concierge</em><br />
            Experience
          </h1>
          <div className={styles.heroRule} />
          <p className={styles.heroIntro}>
            For families who require something beyond what any standard program can provide.
            This is a fully bespoke arrangement built around your specific circumstances,
            timeline, and needs.
          </p>
          <p className={styles.heroNote}>
            This is not a standard program. It is a fully bespoke service.
          </p>
        </div>
      </section>

      {/* What This Is */}
      <section className={styles.whatSection}>
        <div className={styles.whatInner}>
          <h2 className={styles.sectionTitle}>What This Is</h2>
          <div className={styles.whatGrid}>
            <div className={styles.whatItem}>
              <p>
                The Concierge Experience is for families whose circumstances require a level of
                discretion, coordination, and personal attention that cannot be templated.
              </p>
            </div>
            <div className={styles.whatItem}>
              <p>
                Robyn Price works personally with a very limited number of Concierge families
                per year. If you are accepted, your journey is her priority.
              </p>
            </div>
            <div className={styles.whatItem}>
              <p>
                Pricing is determined after a private consultation and is structured around your
                specific journey. There is no published fee schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className={styles.pillarsSection}>
        <div className={styles.pillarsInner}>
          <h2 className={styles.sectionTitle}>What You Can Expect</h2>
          <div className={styles.pillarsGrid}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>🔒</div>
              <h3 className={styles.pillarTitle}>Complete Discretion</h3>
              <p className={styles.pillarText}>
                Your inquiry, your identity, and your journey are held in strict confidence.
                No digital footprint, no shared case files.
              </p>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>👤</div>
              <h3 className={styles.pillarTitle}>Robyn, Personally</h3>
              <p className={styles.pillarText}>
                Not a case manager. Not a coordinator. Robyn Price is your point of contact
                from first inquiry to birth announcement.
              </p>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>🌍</div>
              <h3 className={styles.pillarTitle}>Cross-Border Expertise</h3>
              <p className={styles.pillarText}>
                International families, complex legal jurisdictions, and cross-border logistics
                are handled with care and deep experience.
              </p>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>⚖️</div>
              <h3 className={styles.pillarTitle}>Legal &amp; Medical Coordination</h3>
              <p className={styles.pillarText}>
                We coordinate directly with your legal and medical teams, or recommend the
                specialists best suited to your situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discretion Box */}
      <section className={styles.discretionSection}>
        <div className={styles.discretionInner}>
          <div className={styles.discretionBox}>
            <h3 className={styles.discretionTitle}>A Note on Privacy</h3>
            <p className={styles.discretionText}>
              This inquiry form is not stored in any public-facing system. Your submission goes
              directly and only to Robyn&rsquo;s private inbox. It will not be shared with anyone,
              assigned to a case manager, or logged in a CRM. If we are not the right fit for
              your needs, Robyn will tell you so privately and point you in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className={styles.formSection} id="inquiry">
        <div className={styles.formInner}>
          <h2 className={styles.sectionTitle}>Submit a Private Inquiry</h2>
          <p className={styles.formIntro}>
            Tell Robyn a little about your situation. She reads every inquiry personally and
            responds within 48 hours.
          </p>
          <ConciergeForm />
        </div>
      </section>

      {/* Footer Note */}
      <footer className={styles.footerNote}>
        <p>
          This page is private and not indexed by search engines. &copy; {new Date().getFullYear()} Canadian Surrogacy Options.
        </p>
      </footer>
    </div>
  );
}
