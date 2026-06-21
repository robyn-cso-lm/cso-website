import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { firstName, email, captchaToken, website } = await req.json();
    console.log('[surrogate-guide] Submission received.', { email, hasCaptchaToken: Boolean(captchaToken), honeypotFilled: Boolean(website) });

    if (website) {
      console.warn('[surrogate-guide] Honeypot triggered.');
      return NextResponse.json({
        success: true,
        pdfUrl: process.env.PDF_SURROGATE_URL || '/pdfs/surrogate-readiness.pdf',
      });
    }

    if (!await verifyRecaptcha(captchaToken)) {
      console.warn('[surrogate-guide] reCAPTCHA failed.', { email });
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    if (!firstName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!apiKey || !listId) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const dc = apiKey.split('-')[1];
    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

    await Promise.allSettled([
      (async () => {
        const memberRes = await fetch(
          `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: email,
              status: 'subscribed',
              merge_fields: { FNAME: firstName },
              tags: ['Surrogate Lead', 'Surrogate Guide Download'],
            }),
          }
        );

        let memberData: Record<string, unknown> = {};
        try {
          memberData = await memberRes.json();
        } catch {
          // Ignore non-JSON Mailchimp responses.
        }

        if (!memberRes.ok && memberData.title === 'Member Exists') {
          const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
          await fetch(
            `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}/tags`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tags: [
                  { name: 'Surrogate Lead', status: 'active' },
                  { name: 'Surrogate Guide Download', status: 'active' },
                ],
              }),
            }
          );
        } else if (!memberRes.ok) {
          console.error('[surrogate-guide] Mailchimp error:', memberData);
        } else {
          console.log('[surrogate-guide] Mailchimp subscribe accepted.', { email, status: memberRes.status });
        }
      })(),
      sendMail(
        'robyn@canadiansurrogacyoptions.com',
        `New Surrogate Guide download - ${firstName}`,
        `<p><strong>${firstName}</strong> (${email}) downloaded the Surrogate Readiness Guide.</p><p>Added to Mailchimp with tags: Surrogate Lead, Surrogate Guide Download.</p>`
      ).catch((err) => {
        console.error('[surrogate-guide] mail error:', err);
      }),
    ]);

    console.log('[surrogate-guide] Submission completed.', { email });

    return NextResponse.json({
      success: true,
      pdfUrl: process.env.PDF_SURROGATE_URL || '/pdfs/surrogate-readiness.pdf',
    });
  } catch (err) {
    console.error('[surrogate-guide] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
