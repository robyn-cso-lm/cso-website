'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>CSO</span>
          <span className={styles.logoDivider}>|</span>
          <span className={styles.logoText}>Canadian Surrogacy Options Since 1992</span>
        </Link>

        <ul className={styles.links}>
          <li>
            <Link
              href="/about"
              className={`${styles.link} ${isActive('/about') ? styles.active : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/intended-parents"
              className={`${styles.link} ${isActive('/intended-parents') ? styles.active : ''}`}
            >
              Intended Parents
            </Link>
          </li>
          <li>
            <Link
              href="/programs"
              className={`${styles.link} ${isActive('/programs') ? styles.active : ''}`}
            >
              Programs
            </Link>
          </li>
          <li>
            <Link
              href="/surrogates"
              className={`${styles.link} ${isActive('/surrogates') ? styles.active : ''}`}
            >
              Become a Surrogate
            </Link>
          </li>
          <li>
            <a
              href="https://portal.canadiansurrogacyoptions.com/profiles"
              className={styles.link}
            >
              Waiting Families
            </a>
          </li>
          <li>
            <Link
              href="/resources"
              className={`${styles.link} ${isActive('/resources') ? styles.active : ''}`}
            >
              Resources
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className={`${styles.link} ${isActive('/blog') ? styles.active : ''}`}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`${styles.link} ${isActive('/contact') ? styles.active : ''}`}
            >
              Contact
            </Link>
          </li>
          <li>
            <a
              href="https://portal.canadiansurrogacyoptions.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.clientLogin}
            >
              Client Login
            </a>
          </li>
          <li>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaLink}
            >
              Book a Call
            </a>
          </li>
        </ul>

        <button
          className={styles.mobileToggle}
          aria-label="Toggle menu"
          onClick={() => {
            const nav = document.getElementById('mobile-menu');
            if (nav) nav.classList.toggle(styles.open);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={styles.mobileMenu}>
        <Link href="/about" className={styles.mobileLink}>About</Link>
        <Link href="/intended-parents" className={styles.mobileLink}>Intended Parents</Link>
        <Link href="/programs" className={styles.mobileLink}>Programs</Link>
        <Link href="/surrogates" className={styles.mobileLink}>Become a Surrogate</Link>
        <a href="https://portal.canadiansurrogacyoptions.com/profiles" className={styles.mobileLink}>Waiting Families</a>
        <Link href="/resources" className={styles.mobileLink}>Resources</Link>
        <Link href="/blog" className={styles.mobileLink}>Blog</Link>
        <Link href="/contact" className={styles.mobileLink}>Contact</Link>
        <a
          href="https://portal.canadiansurrogacyoptions.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileLink}
        >
          Client Login
        </a>
        <a
          href="https://calendly.com/cso-robyn"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileCta}
        >
          Book a Call
        </a>
      </div>
    </nav>
  );
}
