import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';

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

    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!mailchimpApiKey || !listId) {
      console.error('[guide-email-capture] Missing Mailchimp env vars');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const dc = mailchimpApiKey.split('-')[1];

    // Add or update subscriber in Mailchimp
    const res = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${mailchimpApiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName || '',
          },
          tags: ['Guide Interest'],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok && data.title !== 'Member Exists') {
      console.error('[guide-email-capture] Mailchimp error:', data);
      return NextResponse.json(
        { error: data.detail || 'Failed to subscribe. Please try again.' },
        { status: 400 }
      );
    }

    console.log('[guide-email-capture] Mailchimp accepted.', {
      email,
      guideName,
      status: res.status,
      memberExists: data.title === 'Member Exists',
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
