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
                href="https://www.facebook.com/CanadianSurrogacyOptionsInc"
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
                href="https://www.instagram.com/csofamily/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram @csofamily"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/canadiansurrogacyoptions/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram @canadiansurrogacyoptions"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@surrogacyca"
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

            <a
              href="https://www.google.com/preferences/source?q=canadiansurrogacyoptions.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.preferredSourceLink}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Prefer us on Google
            </a>
          </div>

          <div className={styles.columns}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>For Parents</h4>
              <ul className={styles.columnLinks}>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/intended-parents">Intended Parents</Link></li>
                <li><Link href="/programs">Our Programs</Link></li>
                <li><Link href="/families">Family Stories</Link></li>
                <li><Link href="/lgbtq-surrogacy">LGBTQ+ Surrogacy</Link></li>
                <li><Link href="/international">International Families</Link></li>
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
                <li><Link href="/surrogates">Apply to Be a Surrogate</Link></li>
                <li><Link href="/blog?category=Surrogates">Surrogate Resources</Link></li>
                <li><Link href="/programs#digital">Surrogate Readiness Guide</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Learn</h4>
              <ul className={styles.columnLinks}>
                <li><Link href="/knowledge-centre">Knowledge Centre</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/resources">Guides Shop</Link></li>
                <li><Link href="/cost-calculator">Cost Calculator</Link></li>
                <li><Link href="/trust">Why Trust CSO</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Contact</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <a href="tel:+18774014175">
                    1-877-401-4175 (call or text)
                  </a>
                </li>
                <li>
                  <a href="mailto:robyn@canadiansurrogacyoptions.com">
                    robyn@canadiansurrogacyoptions.com
                  </a>
                </li>
                <li>Cambridge, Ontario</li>
                <li>
                  <a href="https://calendly.com/cso-robyn" target="_blank" rel="noopener noreferrer">
                    Schedule a Call
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
            <Link href="/privacy">Privacy</Link> &nbsp;·&nbsp; <Link href="/terms">Terms</Link> &nbsp;·&nbsp; <Link href="/data-deletion">Data deletion</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
