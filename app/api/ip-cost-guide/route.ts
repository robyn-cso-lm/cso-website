import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { subscribeAndTag } from '@/lib/mailchimp';
import { sendIntendedParentLeadToZapier } from '@/lib/zapier';
import { capturePortalLead } from '@/lib/portalLead';

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

    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    await Promise.allSettled([
      subscribeAndTag({
        email,
        firstName,
        tags: ['IP Lead', 'Cost Guide Download'],
        context: 'ip-cost-guide',
      }).catch((err) => {
        console.error('[ip-cost-guide] Mailchimp error:', err);
      }),
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

    await capturePortalLead({
      type: 'ip', email, firstName, source: 'website_ip_cost_guide', sourceUrl: sourcePath,
      rawPayload: { offer: 'Canadian Surrogacy Cost Guide' },
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
