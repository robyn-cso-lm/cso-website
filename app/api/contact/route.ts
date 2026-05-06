import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { firstName, email, phone, role, message } = await req.json();

    if (!firstName || !email || !message || !role) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

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
        const memberData = await memberRes.json();
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
      <h1 class="header-title">New message from ${firstName}</h1>
      <span class="badge">${role}</span>
    </div>
    <div class="body">
      <div class="field">
        <p class="field-label">Name</p>
        <p class="field-value">${firstName}</p>
      </div>
      <div class="field">
        <p class="field-label">Email</p>
        <p class="field-value"><a href="mailto:${email}" style="color:#6B3FA0;">${email}</a></p>
      </div>
      ${phone ? `
      <div class="field">
        <p class="field-label">Phone</p>
        <p class="field-value">${phone}</p>
      </div>` : ''}
      <div class="divider"></div>
      <div class="field">
        <p class="field-label">Their Message</p>
        <div class="message-box">
          <p class="field-value">${message.replace(/\n/g, '<br/>')}</p>
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
