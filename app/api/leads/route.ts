import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, email, role } = body;

    if (!firstName || !email || !role) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID;

    if (!MAILCHIMP_API_KEY || !LIST_ID) {
      console.error('[leads] Missing Mailchimp env vars');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const DC = MAILCHIMP_API_KEY.split('-')[1];

    const res = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
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

    // Mailchimp returns 400 with title "Member Exists" for duplicate — treat as success
    if (!res.ok && data.title !== 'Member Exists') {
      console.error('[leads] Mailchimp error:', data);
      return NextResponse.json(
        { error: data.detail || 'Failed to subscribe. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[leads] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
