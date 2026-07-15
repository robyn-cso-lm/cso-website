import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendMail } from '@/lib/graphMail';
import { sendMetaConversionEvent } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Warn at module load time if any price env vars are missing
const REQUIRED_PRICE_VARS = [
  'STRIPE_PRICE_STARTER',
  'STRIPE_PRICE_ROADMAP',
  'STRIPE_PRICE_INDIE',
  'STRIPE_PRICE_PROFILE',
  'STRIPE_PRICE_SURROGATE',
];
for (const v of REQUIRED_PRICE_VARS) {
  if (!process.env[v]) {
    console.warn(`[stripe-webhook] Missing env var ${v} — webhook PDF delivery will fail for this product`);
  }
}

// Map Stripe price IDs to product info + PDF URLs
function getProductInfo(priceId: string): {
  name: string;
  pdfUrl: string;
  slug: string;
  price: number;
} | null {
  const map: Record<
    string,
    { name: string; pdfUrl: string; slug: string; price: number }
  > = {
    [process.env.STRIPE_PRICE_STARTER || '__missing__']: {
      name: 'Is Surrogacy Right For Me?',
      pdfUrl: process.env.PDF_STARTER_URL || '/pdfs/is-surrogacy-right-for-me.pdf',
      slug: 'is-surrogacy-right',
      price: 27,
    },
    [process.env.STRIPE_PRICE_ROADMAP || '__missing2__']: {
      name: 'The Canadian Surrogacy Roadmap',
      pdfUrl: process.env.PDF_ROADMAP_URL || '/pdfs/roadmap.pdf',
      slug: 'canadian-surrogacy-roadmap',
      price: 97,
    },
    [process.env.STRIPE_PRICE_INDIE || '__missing3__']: {
      name: 'Independent Journey Checklist',
      pdfUrl: process.env.PDF_INDIE_URL || '/pdfs/indie-checklist.pdf',
      slug: 'independent-journey-checklist',
      price: 87,
    },
    [process.env.STRIPE_PRICE_PROFILE || '__missing5__']: {
      name: 'IP Profile Template Pack',
      pdfUrl: process.env.PDF_PROFILE_URL || '/pdfs/ip-profile-template.pdf',
      slug: 'ip-profile-template',
      price: 47,
    },
    [process.env.STRIPE_PRICE_SURROGATE || '__missing6__']: {
      name: 'Surrogate Readiness Guide',
      pdfUrl: process.env.PDF_SURROGATE_URL || '/pdfs/surrogate-readiness.pdf',
      slug: 'surrogate-readiness',
      price: 47,
    },
  };
  return map[priceId] || null;
}

function buildDeliveryEmail(customerName: string, productName: string, pdfUrl: string): string {
  const isAbsolute = pdfUrl.startsWith('http');
  const fullPdfUrl = isAbsolute ? pdfUrl : `https://canadiansurrogacyoptions.com${pdfUrl}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #f5f0f9; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(61,26,110,0.1); }
    .header { background: #3D1A6E; padding: 36px 40px; text-align: center; }
    .header-eyebrow { color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 12px; }
    .header-title { color: #fff; font-size: 28px; font-weight: 300; margin: 0; font-family: Georgia, serif; font-style: italic; }
    .body { padding: 40px; }
    .greeting { font-size: 17px; color: #1C0F2E; margin-bottom: 16px; }
    .text { font-size: 15px; color: #4A3560; line-height: 1.7; margin-bottom: 20px; }
    .product-box { background: #E8E0F5; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; }
    .product-name { font-size: 18px; font-weight: 600; color: #3D1A6E; margin-bottom: 4px; }
    .product-sub { font-size: 14px; color: #6B3FA0; }
    .btn-wrap { text-align: center; margin-bottom: 32px; }
    .btn { display: inline-block; padding: 16px 40px; background: #3D1A6E; color: #fff; font-size: 16px; font-weight: 600; border-radius: 100px; text-decoration: none; }
    .note { font-size: 13px; color: #9B7FC7; text-align: center; margin-bottom: 28px; }
    .sig { font-size: 15px; color: #4A3560; line-height: 1.7; border-top: 1px solid #E8E0F5; padding-top: 24px; }
    .sig strong { color: #3D1A6E; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="header-eyebrow">Canadian Surrogacy Options</p>
      <h1 class="header-title">Your guide is ready</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${customerName},</p>
      <p class="text">
        Thank you so much for your purchase. We put a lot of care into creating these guides,
        and I hope this one gives you exactly the clarity and confidence you were looking for.
      </p>
      <div class="product-box">
        <p class="product-name">${productName}</p>
        <p class="product-sub">PDF download &mdash; ready to save, print, or share</p>
      </div>
      <div class="btn-wrap">
        <a href="${fullPdfUrl}" class="btn">Download Your Guide &rarr;</a>
      </div>
      <p class="note">
        This link is for your personal use. If you have any trouble downloading, just reply
        to this email and we&rsquo;ll sort it out.
      </p>
      <div class="sig">
        <p>With warmth,</p>
        <p><strong>Robyn Price</strong><br/>Executive Director, Canadian Surrogacy Options<br/>
        <a href="mailto:robyn@canadiansurrogacyoptions.com" style="color:#6B3FA0;">robyn@canadiansurrogacyoptions.com</a>
        </p>
        <p style="margin-top:12px; font-size:13px; color:#9B7FC7;">
          If you have questions about your surrogacy journey, I&rsquo;m always happy to
          <a href="https://calendly.com/cso-robyn" style="color:#6B3FA0;">book a free call</a>.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: `Webhook verification failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name || 'Friend';

    if (!customerEmail) {
      console.warn('[stripe-webhook] No customer email found in session:', session.id);
      return NextResponse.json({ received: true });
    }

    try {
      // Expand line items to get price IDs
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price'],
      });

      const lineItems = fullSession.line_items?.data || [];

      for (const item of lineItems) {
        const priceId = item.price?.id;
        if (!priceId) continue;

        const product = getProductInfo(priceId);
        if (!product) {
          console.error('[stripe-webhook] Unknown price ID — PDF not delivered:', priceId, 'session:', session.id);
          // Notify admin so no customer is left without their PDF
          try {
            await sendMail(
              'robyn@canadiansurrogacyoptions.com',
              `[ACTION REQUIRED] Stripe: unrecognised price ID — customer did not receive PDF`,
              `<p>A customer completed checkout but their PDF could not be delivered because the price ID is not mapped.</p>
               <p><strong>Price ID:</strong> ${priceId}</p>
               <p><strong>Session ID:</strong> ${session.id}</p>
               <p><strong>Customer email:</strong> ${customerEmail}</p>
               <p>Please update STRIPE_PRICE_* environment variables or manually send the customer their file.</p>`
            );
          } catch (mailErr) {
            console.error('[stripe-webhook] Failed to send admin alert:', mailErr);
          }
          continue;
        }

        const html = buildDeliveryEmail(customerName, product.name, product.pdfUrl);

        await sendMail(
          customerEmail,
          `Your CSO Guide: ${product.name}`,
          html
        );

        console.log(`[stripe-webhook] PDF delivery email sent to ${customerEmail} for "${product.name}"`);

        // Send Purchase event to Meta Conversions API
        // Wrap in try/catch so failures don't prevent PDF delivery
        if (process.env.META_CAPI_ACCESS_TOKEN && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
          try {
            const amount = (item.amount_total || 0) / 100; // Convert from cents
            const capiResult = await sendMetaConversionEvent(
              process.env.NEXT_PUBLIC_META_PIXEL_ID,
              process.env.META_CAPI_ACCESS_TOKEN,
              {
                sessionId: session.id,
                email: customerEmail,
                value: amount,
                currency: 'CAD',
                contentIds: [product.slug],
                contentName: product.name,
              }
            );

            if (capiResult.success) {
              console.log(
                `[stripe-webhook] Meta CAPI Purchase event sent for session ${session.id}`
              );
            } else {
              console.warn(
                `[stripe-webhook] Meta CAPI Purchase event failed: ${capiResult.error}`
              );
            }
          } catch (capiErr) {
            console.error('[stripe-webhook] Error sending Meta CAPI event:', capiErr);
            // Don't fail the webhook for CAPI errors
          }
        }
      }
    } catch (err: unknown) {
      console.error('[stripe-webhook] Error processing session:', err);
      // Return 200 so Stripe doesn't retry — error logged for investigation
    }
  }

  return NextResponse.json({ received: true });
}
