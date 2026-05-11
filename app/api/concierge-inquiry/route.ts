import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/graphMail';
import { verifyRecaptcha } from '@/lib/recaptcha';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, country, message, contactMethod, captchaToken, website } = body;

    // Honeypot
    if (website) return NextResponse.json({ success: true });

    // reCAPTCHA v3
    if (!await verifyRecaptcha(captchaToken)) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    if (!firstName || !lastName || !email || !message || !country) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const safeFirst         = escapeHtml(String(firstName));
    const safeLast          = escapeHtml(String(lastName));
    const safeEmail         = escapeHtml(String(email));
    const safePhone         = phone ? escapeHtml(String(phone)) : '';
    const safeCountry       = escapeHtml(String(country));
    const safeContactMethod = contactMethod ? escapeHtml(String(contactMethod)) : '';
    const safeMessage       = escapeHtml(String(message)).replace(/\n/g, '<br/>');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #f5f0f9; font-family: 'DM Sans', Arial, sans-serif; }
    .wrapper { max-width: 640px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(61,26,110,0.1); }
    .header { background: #3D1A6E; padding: 32px 40px; }
    .header-label { color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px; }
    .header-title { color: #fff; font-size: 24px; font-weight: 600; margin: 0; font-family: Georgia, serif; }
    .urgent-badge { display: inline-block; margin-top: 12px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 100px; padding: 4px 14px; color: #fff; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
    .body { padding: 36px 40px; }
    .intro { font-size: 15px; color: #4A3560; line-height: 1.7; margin-bottom: 28px; }
    .field { margin-bottom: 20px; }
    .field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #1C0F2E; line-height: 1.55; }
    .message-box { background: #f8f5fc; border-left: 3px solid #6B3FA0; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-top: 4px; }
    .divider { height: 1px; background: rgba(155,127,199,0.15); margin: 24px 0; }
    .footer { padding: 24px 40px; background: #FDFAF7; border-top: 1px solid rgba(155,127,199,0.1); }
    .footer-text { font-size: 13px; color: #9B7FC7; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="header-label">Private Inquiry &mdash; Urgent &amp; Confidential</p>
      <h1 class="header-title">New Concierge Inquiry</h1>
      <span class="urgent-badge">Private</span>
    </div>
    <div class="body">
      <p class="intro">
        A new private inquiry has been submitted through the Concierge page. This message
        is for your eyes only, Robyn.
      </p>
      <div class="field">
        <p class="field-label">Name</p>
        <p class="field-value">${safeFirst} ${safeLast}</p>
      </div>
      <div class="field">
        <p class="field-label">Email</p>
        <p class="field-value"><a href="mailto:${safeEmail}" style="color:#6B3FA0;">${safeEmail}</a></p>
      </div>
      ${safePhone ? `
      <div class="field">
        <p class="field-label">Phone</p>
        <p class="field-value">${safePhone}</p>
      </div>` : ''}
      <div class="field">
        <p class="field-label">Country / Region</p>
        <p class="field-value">${safeCountry}</p>
      </div>
      ${safeContactMethod ? `
      <div class="field">
        <p class="field-label">Preferred Contact Method</p>
        <p class="field-value">${safeContactMethod}</p>
      </div>` : ''}
      <div class="divider"></div>
      <div class="field">
        <p class="field-label">Their Message</p>
        <div class="message-box">
          <p class="field-value">${safeMessage}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="footer-text">
        This inquiry was submitted via the private concierge inquiry form at
        canadiansurrogacyoptions.com/private-inquiry. The submitter has been told you will
        respond within 48 hours.
      </p>
    </div>
  </div>
</body>
</html>`;

    await sendMail(
      'robyn@canadiansurrogacyoptions.com',
      `[PRIVATE INQUIRY] Concierge Request from ${safeFirst} ${safeLast}`,
      html
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[concierge-inquiry] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send inquiry. Please try again or email robyn@canadiansurrogacyoptions.com directly.' },
      { status: 500 }
    );
  }
}
