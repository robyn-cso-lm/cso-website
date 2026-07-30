'use client';

import { useEffect } from 'react';

/**
 * Scroll reveal for elements carrying .reveal or .reveal-stagger.
 *
 * Mounted once in the root layout. It sets data-reveal="on" on <html> before
 * observing, which is what activates the hidden starting state in
 * design-system.css. Without JS the attribute is never set, so content stays
 * visible instead of being permanently transparent.
 *
 * Elements already in view on first paint are revealed immediately, so
 * above-the-fold content never waits on a scroll that may not come.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const targets = document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger');
    if (targets.length === 0) return;

    // Mark anything already on screen as visible BEFORE switching the hiding
    // CSS on. This effect runs after first paint, so flipping the attribute
    // first would briefly hide above-the-fold content and flicker it back in.
    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });

    root.setAttribute('data-reveal', 'on');

    // No IntersectionObserver (very old browsers): show everything.
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // reveal once, never re-hide
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
