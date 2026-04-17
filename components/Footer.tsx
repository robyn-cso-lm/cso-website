import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>CSO</div>
            <p className={styles.tagline}>From hope to heartbeat to home.</p>
            <div className={styles.socials}>
              <a
                href="https://facebook.com/canadiansurrogacyoptions"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/canadiansurrogacyoptions"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@canadiansurrogacyoptions"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.columns}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>For Parents</h4>
              <ul className={styles.columnLinks}>
                <li><Link href="/programs">Our Programs</Link></li>
                <li><Link href="/programs#concierge">Concierge Experience</Link></li>
                <li><Link href="/blog?category=Intended+Parents">Parent Stories</Link></li>
                <li>
                  <a href="https://calendly.com/cso-robyn" target="_blank" rel="noopener noreferrer">
                    Book a Free Call
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>For Surrogates</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <a href="https://becomeasurrogate.ca" target="_blank" rel="noopener noreferrer">
                    Apply to Be a Surrogate
                  </a>
                </li>
                <li><Link href="/blog?category=Surrogates">Surrogate Resources</Link></li>
                <li><Link href="/programs#digital">Surrogate Readiness Guide</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Contact</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <a href="tel:+16045551234">
                    (604) 555-1234
                  </a>
                </li>
                <li>
                  <a href="mailto:info@canadiansurrogacyoptions.com">
                    info@canadiansurrogacyoptions.com
                  </a>
                </li>
                <li>
                  <a href="https://calendly.com/cso-robyn" target="_blank" rel="noopener noreferrer">
                    Schedule a Call
                  </a>
                </li>
                <li>
                  <a href="sms:+16045551234">
                    Send a Text
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Canadian Surrogacy Options. All rights reserved.
          </p>
          <p className={styles.legal}>
            Canada&rsquo;s first surrogacy agency, founded 1992.
          </p>
        </div>
      </div>
    </footer>
  );
}
