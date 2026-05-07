import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { firstName, email } = await req.json();

    if (!firstName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;

    if (!API_KEY || !LIST_ID) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const DC = API_KEY.split('-')[1];
    const auth = Buffer.from(`anystring:${API_KEY}`).toString('base64');

    const memberRes = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
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
    try { memberData = await memberRes.json(); } catch { /* non-JSON response from Mailchimp */ }

    if (!memberRes.ok && memberData.title === 'Member Exists') {
      const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
      await fetch(
        `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${hash}/tags`,
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
      return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      pdfUrl: process.env.PDF_IP_COST_GUIDE_URL || '/pdfs/canadian-surrogacy-cost-guide.pdf',
    });
  } catch (err) {
    console.error('[ip-cost-guide] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
