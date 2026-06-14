'use client';

import { useEffect } from 'react';
import { trackStartApplication, trackSchedule } from '@/lib/track';

/**
 * Site-wide outbound-click conversion tracking. Mounted once in the root
 * layout. Uses a single delegated listener so server-rendered pages don't each
 * need to become client components just to track their CTAs.
 *
 * - Links into the application funnel (portal get-started / register) fire
 *   `InitiateCheckout` (Meta) + `begin_application` (GA4).
 * - Calendly links fire `Schedule` (Meta) + `schedule_call` (GA4).
 */
export default function ConversionTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';

      if (/portal\.canadiansurrogacyoptions\.com\/(get-started|register)/.test(href)) {
        trackStartApplication(window.location.pathname);
      } else if (href.includes('calendly.com')) {
        trackSchedule(window.location.pathname);
      }
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
