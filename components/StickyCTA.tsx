'use client';

import { usePathname } from 'next/navigation';
import styles from './StickyCTA.module.css';

export default function StickyCTA() {
  const pathname = usePathname();

  if (pathname === '/private-inquiry') return null;

  return (
    <a
      href="https://calendly.com/cso-robyn"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.cta}
      aria-label="Book a free call with Robyn"
    >
      Book a Free Call
    </a>
  );
}
