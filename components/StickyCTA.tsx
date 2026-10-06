'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './StickyCTA.module.css';

/** How far down the page before the button appears, so it never competes with the hero's own CTAs. */
const SHOW_AFTER_PX = 520;

export default function StickyCTA() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Step aside once the footer is on screen; it has its own contact details.
    const footer = document.querySelector('footer');
    let observer: IntersectionObserver | undefined;
    if (footer && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
      observer.observe(footer);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, [pathname]);

  // The cost quiz is a no-call funnel, and /private-inquiry has its own form.
  if (pathname === '/private-inquiry' || pathname === '/surrogacy-costs') return null;

  const visible = pastHero && !footerInView;

  return (
    <a
      href="https://calendly.com/cso-robyn"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.cta} ${visible ? styles.visible : ''}`}
      aria-label="Book a free call with Robyn"
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
    >
      Book a Free Call
    </a>
  );
}
