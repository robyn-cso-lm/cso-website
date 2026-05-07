import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { firstName, email } = await req.json();

    if (!firstName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;

    if (!API_KEY || !LIST_ID) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const DC = API_KEY.split('-')[1];
    const auth = Buffer.from(`anystring:${API_KEY}`).toString('base64');

    // Add/update subscriber
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
          tags: ['Surrogate Lead', 'Surrogate Guide Download'],
        }),
      }
    );

    const memberData = await memberRes.json();

    // If already subscribed, add the tag to their existing record
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
              { name: 'Surrogate Lead', status: 'active' },
              { name: 'Surrogate Guide Download', status: 'active' },
            ],
          }),
        }
      );
    } else if (!memberRes.ok) {
      console.error('[surrogate-guide] Mailchimp error:', memberData);
      return NextResponse.json(
        { error: 'Could not subscribe. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      pdfUrl: process.env.PDF_SURROGATE_URL || '/pdfs/surrogate-readiness.pdf',
    });
  } catch (err) {
    console.error('[surrogate-guide] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
