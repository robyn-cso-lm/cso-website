import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { subscribeAndTag } from '@/lib/mailchimp';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface GuideEmailRequest {
  email: string;
  firstName?: string;
  guideName?: string;
  captchaToken?: string;
  website?: string; // honeypot
}

export async function POST(req: NextRequest) {
  try {
    const body: GuideEmailRequest = await req.json();
    const { email, firstName, guideName, captchaToken, website } = body;

    console.log('[guide-email-capture] Submission received.', {
      email,
      guideName,
      hasCaptchaToken: Boolean(captchaToken),
      honeypotFilled: Boolean(website),
    });

    // Honeypot check
    if (website) {
      console.warn('[guide-email-capture] Honeypot triggered.');
      return NextResponse.json({ success: true });
    }

    // reCAPTCHA verification
    if (!await verifyRecaptcha(captchaToken)) {
      console.warn('[guide-email-capture] reCAPTCHA failed.', { email, guideName });
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 400 }
      );
    }

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      console.error('[guide-email-capture] Missing Mailchimp env vars');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // Previously this route tagged inline on create and had no fallback, so an
    // existing subscriber never picked up 'Guide Interest' at all.
    await subscribeAndTag({
      email,
      firstName: firstName || undefined,
      tags: ['Guide Interest'],
      context: 'guide-email-capture',
    });

    console.log('[guide-email-capture] Mailchimp accepted.', {
      email,
      guideName,
    });

    // Send notification to Robyn
    try {
      await sendMail(
        'robyn@canadiansurrogacyoptions.com',
        `Guide interest from ${firstName || 'visitor'}: ${guideName || 'Unknown guide'}`,
        `<p>Someone expressed interest in your guides:</p>
         <ul>
           ${firstName ? `<li><strong>Name:</strong> ${firstName}</li>` : ''}
           <li><strong>Email:</strong> ${email}</li>
           ${guideName ? `<li><strong>Guide:</strong> ${guideName}</li>` : ''}
           <li><strong>Source:</strong> Guide email capture</li>
         </ul>
         <p>They've been added to your Mailchimp list and tagged with "Guide Interest".</p>`
      );
    } catch (mailErr) {
      console.error('[guide-email-capture] Failed to send admin notification:', mailErr);
      // Don't fail the response if email notification fails
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[guide-email-capture] Error:', err);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
