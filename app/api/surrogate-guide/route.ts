import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { subscribeAndTag } from '@/lib/mailchimp';
import { capturePortalLead } from '@/lib/portalLead';
import { makeSignedDownloadUrl } from '@/lib/signedDownload';

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

    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    await Promise.allSettled([
      subscribeAndTag({
        email,
        firstName,
        tags: ['Surrogate Lead', 'Surrogate Guide Download'],
        context: 'surrogate-guide',
      }).catch((err) => {
        console.error('[surrogate-guide] Mailchimp error:', err);
      }),
      sendMail(
        'robyn@canadiansurrogacyoptions.com',
        `New Surrogate Guide download - ${firstName}`,
        `<p><strong>${firstName}</strong> (${email}) downloaded the Surrogate Readiness Guide.</p><p>Added to Mailchimp with tags: Surrogate Lead, Surrogate Guide Download.</p>`
      ).catch((err) => {
        console.error('[surrogate-guide] mail error:', err);
      }),
    ]);

    await capturePortalLead({
      type: 'surrogate', email, firstName, source: 'website_surrogate_readiness_guide',
      sourceUrl: '/surrogates', rawPayload: { offer: 'Surrogate Readiness Guide' },
    });

    console.log('[surrogate-guide] Submission completed.', { email });

    return NextResponse.json({
      success: true,
      pdfUrl: makeSignedDownloadUrl('surrogate-readiness'),
    });
  } catch (err) {
    console.error('[surrogate-guide] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
