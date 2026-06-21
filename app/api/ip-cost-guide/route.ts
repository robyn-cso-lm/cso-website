import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { sendIntendedParentLeadToZapier } from '@/lib/zapier';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const referer = req.headers.get('referer') || '';
    const sourcePath = referer ? new URL(referer).pathname + new URL(referer).search + new URL(referer).hash : '/intended-parents#cost-guide';
    const { firstName, email, captchaToken, website } = await req.json();
    console.log('[ip-cost-guide] Submission received.', { email, hasCaptchaToken: Boolean(captchaToken), honeypotFilled: Boolean(website) });

    if (website) {
      console.warn('[ip-cost-guide] Honeypot triggered.');
      return NextResponse.json({
        success: true,
        pdfUrl: process.env.PDF_IP_COST_GUIDE_URL || '/pdfs/canadian-surrogacy-cost-guide.pdf',
      });
    }

    if (!await verifyRecaptcha(captchaToken)) {
      console.warn('[ip-cost-guide] reCAPTCHA failed.', { email });
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
              tags: ['IP Lead', 'Cost Guide Download'],
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
                  { name: 'IP Lead', status: 'active' },
                  { name: 'Cost Guide Download', status: 'active' },
                ],
              }),
            }
          );
        } else if (!memberRes.ok) {
          console.error('[ip-cost-guide] Mailchimp error:', memberData);
        } else {
          console.log('[ip-cost-guide] Mailchimp subscribe accepted.', { email, status: memberRes.status });
        }
      })(),
      sendMail(
        'robyn@canadiansurrogacyoptions.com',
        `New IP Cost Guide download - ${firstName}`,
        `<p><strong>${firstName}</strong> (${email}) downloaded the IP Cost Guide.</p><p>Added to Mailchimp with tags: IP Lead, Cost Guide Download.</p>`
      ).catch((err) => {
        console.error('[ip-cost-guide] mail error:', err);
      }),
    ]);

    await sendIntendedParentLeadToZapier({
      formType: 'IP Cost Guide',
      firstName,
      email,
      role: 'Intended Parent',
      sourcePath,
      sourceLabel: 'IP Cost Guide Download',
      guideName: 'Canadian Surrogacy Cost Guide',
    });

    console.log('[ip-cost-guide] Submission completed.', { email });

    return NextResponse.json({
      success: true,
      pdfUrl: process.env.PDF_IP_COST_GUIDE_URL || '/pdfs/canadian-surrogacy-cost-guide.pdf',
    });
  } catch (err) {
    console.error('[ip-cost-guide] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
