import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { sendIntendedParentLeadToZapier } from '@/lib/zapier';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const referer = req.headers.get('referer') || '';
    const sourcePath = referer ? new URL(referer).pathname + new URL(referer).search + new URL(referer).hash : '/qualify';
    const body = await req.json();
    const { firstName, email, phone, role, captchaToken, website, sourceLabel } = body;
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

    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!mailchimpApiKey || !listId) {
      console.error('[leads] Missing Mailchimp env vars');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const dc = mailchimpApiKey.split('-')[1];

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
            FNAME: firstName,
            MMERGE3: role,
          },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok && data.title !== 'Member Exists') {
      console.error('[leads] Mailchimp error:', data);
      return NextResponse.json(
        { error: data.detail || 'Failed to subscribe. Please try again.' },
        { status: 400 }
      );
    }

    console.log('[leads] Mailchimp accepted.', { email, role, status: res.status, memberExists: data.title === 'Member Exists' });

    await sendMail(
      'robyn@canadiansurrogacyoptions.com',
      `New ${role} lead - ${firstName}`,
      `<p>New lead from the website:</p>
       <ul>
         <li><strong>Name:</strong> ${firstName}</li>
         <li><strong>Email:</strong> ${email}</li>
         ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
         <li><strong>Role:</strong> ${role}</li>
         <li><strong>Source:</strong> ${normalizedSourceLabel}</li>
         <li><strong>Page:</strong> ${sourcePath}</li>
       </ul>`
    );

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
