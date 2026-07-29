import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { sendIntendedParentLeadToZapier } from '@/lib/zapier';
import { subscribeAndTag } from '@/lib/mailchimp';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const referer = req.headers.get('referer') || '';
    const sourcePath = referer ? new URL(referer).pathname + new URL(referer).search + new URL(referer).hash : '/qualify';
    const body = await req.json();
    const { firstName, email, phone, role, captchaToken, website, sourceLabel, quizAnswers } = body;
    const answerList: string[] = Array.isArray(quizAnswers)
      ? quizAnswers.filter((a: unknown) => typeof a === 'string').slice(0, 20).map((a: string) => a.slice(0, 300))
      : [];
    const normalizedSourceLabel =
      typeof sourceLabel === 'string' && sourceLabel.trim().length > 0
        ? sourceLabel.trim()
        : 'Website lead form';

    console.log('[leads] Submission received.', {
      email,
      role,
      sourceLabel: normalizedSourceLabel,
      sourcePath,
      hasCaptchaToken: Boolean(captchaToken),
      honeypotFilled: Boolean(website),
    });

    if (website) {
      console.warn('[leads] Honeypot triggered.');
      return NextResponse.json({ success: true });
    }

    if (!await verifyRecaptcha(captchaToken)) {
      console.warn('[leads] reCAPTCHA failed.', { email, role });
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    if (!firstName || !email || !role) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_LIST_ID) {
      console.error('[leads] Missing Mailchimp env vars');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // This route previously applied no tags at all, so every /qualify quiz lead
    // landed in the audience untagged and could not enter any journey.
    await subscribeAndTag({
      email,
      firstName,
      mergeFields: { MMERGE3: role },
      tags: [role, 'Website Quiz'],
      context: 'leads',
    });

    const esc = (v: unknown) =>
      String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    try {
      await sendMail(
        'robyn@canadiansurrogacyoptions.com',
        `New ${role} lead - ${firstName}`,
        `<p>New lead from the website:</p>
         <ul>
           <li><strong>Name:</strong> ${esc(firstName)}</li>
           <li><strong>Email:</strong> ${esc(email)}</li>
           ${phone ? `<li><strong>Phone:</strong> ${esc(phone)}</li>` : ''}
           <li><strong>Role:</strong> ${esc(role)}</li>
           <li><strong>Source:</strong> ${esc(normalizedSourceLabel)}</li>
           <li><strong>Page:</strong> ${esc(sourcePath)}</li>
         </ul>
         ${answerList.length ? `<p><strong>Their quiz answers:</strong></p><ul>${answerList.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}`
      );
    } catch (mailErr) {
      console.error('[leads] Notification email failed (lead still captured).', { email, error: mailErr });
    }

    if (role === 'Intended Parent') {
      await sendIntendedParentLeadToZapier({
        formType: 'Lead Form',
        firstName,
        email,
        role,
        phone,
        sourcePath,
        sourceLabel: normalizedSourceLabel,
      });
    }

    console.log('[leads] Submission completed.', { email, role });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[leads] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
