'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/meta-pixel';

interface Props {
  guideTitle: string;
  guideSlug: string;
  guidePrice: number;
}

export default function GuidePixelTracker({ guideTitle, guideSlug, guidePrice }: Props) {
  useEffect(() => {
    // Fire ViewContent event once on mount
    trackViewContent(guideTitle, [guideSlug], guidePrice, 'CAD');
  }, [guideTitle, guideSlug, guidePrice]);

  return null;
}
