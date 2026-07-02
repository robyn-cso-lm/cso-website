'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/meta-pixel';

interface Props {
  sessionId: string;
  guideSlug: string;
  guideTitle: string;
  amount: number;
  currency: string;
}

export default function PurchasePixelClient({
  sessionId,
  guideSlug,
  guideTitle,
  amount,
  currency,
}: Props) {
  useEffect(() => {
    // Guard against duplicate firing on page refresh using sessionStorage
    // Key includes sessionId to ensure it's unique per purchase
    const dedupeKey = `meta_purchase_tracked_${sessionId}`;

    if (!sessionStorage.getItem(dedupeKey)) {
      try {
        trackPurchase(guideTitle, [guideSlug], amount, currency, sessionId);
        sessionStorage.setItem(dedupeKey, 'true');
      } catch (err) {
        // Silently fail if pixel tracking fails
        console.error('[PurchasePixelClient] Pixel tracking error:', err);
      }
    }
  }, [sessionId, guideSlug, guideTitle, amount, currency]);

  return null;
}
