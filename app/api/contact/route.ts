import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MSG_LEN = 5000;

// ── Rate limiting (in-memory, resets on redeploy — good enough for serverless) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── Looks like random gibberish: no spaces, mixed case, >10 chars ──
function looksLikeGibberish(str: string): boolean {
  if (str.length < 10) return false;
  if (/\s/.test(str)) return false; // has spaces = probably real
  // high ratio of random-looking char transitions
  const upper = (str.match(/[A-Z]/g) || []).length;
  const lower = (str.match(/[a-z]/g) || []).length;
  if (upper > 2 && lower > 2 && Math.abs(upper - lower) < str.length * 0.4) return true;
  return false;
}

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
    const { firstName, email, phone, role, message, website } = await req.json();

    // Honeypot — bots fill this, humans don't see it
    if (website) {
      return NextResponse.json({ success: true }); // silent pass to fool bots
    }

    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
    }

    if (!firstName || !email || !message || !role) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (message.length > MAX_MSG_LEN) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }

    // Reject gibberish names/messages
    if (looksLikeGibberish(firstName) || looksLikeGibberish(message)) {
      return NextResponse.json({ success: true }); // silent pass
    }

    const safeName    = escapeHtml(String(firstName));
    const safeEmail   = escapeHtml(String(email));
    const safePhone   = phone ? escapeHtml(String(phone)) : '';
    const safeRole    = escapeHtml(String(role));
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, '<br/>');

    // Add to Mailchimp with "Contact Form" tag
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;

    if (API_KEY && LIST_ID) {
      const DC = API_KEY.split('-')[1];
      const auth = Buffer.from(`anystring:${API_KEY}`).toString('base64');

      const memberRes = await fetch(
        `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
        {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: { FNAME: firstName, PHONE: phone || '' },
            tags: ['Contact Form', role],
          }),
        }
      );

      if (!memberRes.ok) {
        let memberData: Record<string, unknown> = {};
        try { memberData = await memberRes.json(); } catch { /* non-JSON response, ignore */ }

        if (memberData.title === 'Member Exists') {
          const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
          await fetch(
            `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}/tags`,
            {
              method: 'POST',
              headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tags: [
                  { name: 'Contact Form', status: 'active' },
                  { name: role, status: 'active' },
                ],
              }),
            }
          );
        } else {
          console.error('[contact] Mailchimp error:', memberData);
        }
      }
    }

    // Send notification email to Robyn
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #f5f0f9; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(61,26,110,0.1); }
    .header { background: #3D1A6E; padding: 28px 36px; }
    .header-label { color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; }
    .header-title { color: #fff; font-size: 22px; font-weight: 600; margin: 0; }
    .badge { display: inline-block; margin-top: 10px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 100px; padding: 3px 12px; color: #fff; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 18px; }
    .field-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 3px; }
    .field-value { font-size: 15px; color: #1C0F2E; line-height: 1.5; }
    .message-box { background: #f8f5fc; border-left: 3px solid #6B3FA0; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-top: 4px; }
    .divider { height: 1px; background: rgba(155,127,199,0.15); margin: 20px 0; }
    .footer { padding: 20px 36px; background: #FDFAF7; border-top: 1px solid rgba(155,127,199,0.1); }
    .footer-text { font-size: 12px; color: #9B7FC7; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="header-label">Website Contact Form</p>
      <h1 class="header-title">New message from ${safeName}</h1>
      <span class="badge">${safeRole}</span>
    </div>
    <div class="body">
      <div class="field">
        <p class="field-label">Name</p>
        <p class="field-value">${safeName}</p>
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
      <div class="divider"></div>
      <div class="field">
        <p class="field-label">Their Message</p>
        <div class="message-box">
          <p class="field-value">${safeMessage}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p class="footer-text">Submitted via the contact form at canadiansurrogacyoptions.com/contact</p>
    </div>
  </div>
</body>
</html>`;

    await fetch('https://hooks.zapier.com/hooks/catch/14435275/4y2es5o/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        email,
        phone: phone || '',
        role,
        message,
        html,
        source: 'website_contact_form',
        timestamp: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email robyn@canadiansurrogacyoptions.com directly.' },
      { status: 500 }
    );
  }
}
