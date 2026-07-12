import Stripe from 'stripe';
import PurchasePixelClient from './PurchasePixelClient';

interface Props {
  sessionId: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Map price IDs to guide info
const PRICE_TO_GUIDE: Record<
  string,
  { slug: string; title: string; price: number }
> = {
  [process.env.STRIPE_PRICE_STARTER || '']: {
    slug: 'is-surrogacy-right',
    title: 'Is Surrogacy Right For Me?',
    price: 27,
  },
  [process.env.STRIPE_PRICE_ROADMAP || '']: {
    slug: 'canadian-surrogacy-roadmap',
    title: 'The Canadian Surrogacy Roadmap',
    price: 97,
  },
  [process.env.STRIPE_PRICE_INDIE || '']: {
    slug: 'independent-journey-checklist',
    title: 'Independent Journey Checklist',
    price: 87,
  },
  [process.env.STRIPE_PRICE_PROFILE || '']: {
    slug: 'ip-profile-template',
    title: 'IP Profile Template Pack',
    price: 47,
  },
};

export default async function PurchasePixelTracker({ sessionId }: Props) {
  try {
    // Fetch the Stripe session with expanded line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price'],
    });

    // Only fire a Purchase event for sessions that actually completed payment.
    if (session.payment_status !== 'paid') {
      return null;
    }

    if (!session.line_items?.data || session.line_items.data.length === 0) {
      return null;
    }

    // Get the first item (guides typically have one item per checkout)
    const firstItem = session.line_items.data[0];
    const priceId = firstItem.price?.id;

    if (!priceId) {
      return null;
    }

    const guideInfo = PRICE_TO_GUIDE[priceId];

    if (!guideInfo) {
      return null;
    }

    // Calculate the amount (Stripe amounts are in cents for most currencies)
    const amount = (firstItem.amount_total || 0) / 100;

    return (
      <PurchasePixelClient
        sessionId={sessionId}
        guideSlug={guideInfo.slug}
        guideTitle={guideInfo.title}
        amount={amount}
        currency="CAD"
      />
    );
  } catch (error) {
    console.error('[PurchasePixelTracker] Error fetching session:', error);
    return null;
  }
}
