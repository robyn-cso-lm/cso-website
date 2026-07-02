// Helper functions for Meta Pixel tracking
// These wrap the global fbq function with proper type safety

export function trackViewContent(
  contentName: string,
  contentIds: string[],
  value: number,
  currency: string = 'CAD'
) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'ViewContent', {
      content_name: contentName,
      content_ids: contentIds,
      value,
      currency,
    });
  }
}

export function trackInitiateCheckout(
  contentName: string,
  contentIds: string[],
  value: number,
  currency: string = 'CAD'
) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      content_name: contentName,
      content_ids: contentIds,
      value,
      currency,
    });
  }
}

export function trackPurchase(
  contentName: string,
  contentIds: string[],
  value: number,
  currency: string = 'CAD',
  eventId?: string
) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const params: any = {
      content_name: contentName,
      content_ids: contentIds,
      value,
      currency,
    };
    if (eventId) {
      params.event_id = eventId;
    }
    (window as any).fbq('track', 'Purchase', params);
  }
}

// Helper to get slug from pathname
export function getGuideSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/guides\/([a-z-]+)/);
  return match ? match[1] : null;
}

// Guide data mapping
export const GUIDE_DATA: Record<
  string,
  { title: string; price: number; contentIds: string[] }
> = {
  'is-surrogacy-right': {
    title: 'Is Surrogacy Right For Me?',
    price: 27,
    contentIds: ['is-surrogacy-right'],
  },
  'canadian-surrogacy-roadmap': {
    title: 'The Canadian Surrogacy Roadmap',
    price: 97,
    contentIds: ['canadian-surrogacy-roadmap'],
  },
  'ip-profile-template': {
    title: 'IP Profile Template Pack',
    price: 67,
    contentIds: ['ip-profile-template'],
  },
  'surrogate-readiness': {
    title: 'Surrogate Readiness Guide',
    price: 47,
    contentIds: ['surrogate-readiness'],
  },
};
