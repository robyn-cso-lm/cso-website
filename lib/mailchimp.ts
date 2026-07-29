import crypto from 'crypto';

type SubscribeArgs = {
  email: string;
  firstName?: string;
  lastName?: string;
  mergeFields?: Record<string, string>;
  tags: string[];
  /** Log prefix, e.g. 'surrogate-guide'. */
  context: string;
};

// Mailchimp journeys that trigger on "contact tagged" only fire on a tag EVENT
// against an existing member. Tags passed inline on the member create/upsert
// call are stored on the contact but never raise that event, so the contact is
// tagged and silently skips the journey. That is why Surrogate Lead Nurture
// sent 0 emails in 81 days while 13 contacts carried its trigger tag.
//
// So: always upsert the member first, then apply tags in a second call.
// Never pass tags inline.
export async function subscribeAndTag({
  email,
  firstName,
  lastName,
  mergeFields,
  tags,
  context,
}: SubscribeArgs): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.error(`[${context}] Mailchimp is not configured; subscribe skipped.`, { email });
    return;
  }

  const dc = apiKey.split('-')[1];
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`;

  const headers = {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
  };

  const merge: Record<string, string> = { ...mergeFields };
  if (firstName) merge.FNAME = firstName;
  if (lastName) merge.LNAME = lastName;

  // PUT is idempotent and covers both new and existing contacts, which removes
  // the old "Member Exists" branch entirely. status_if_new (not status) means an
  // existing unsubscribed contact is never silently resubscribed.
  const memberRes = await fetch(base, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
      ...(Object.keys(merge).length ? { merge_fields: merge } : {}),
    }),
  });

  if (!memberRes.ok) {
    let detail: unknown = {};
    try {
      detail = await memberRes.json();
    } catch {
      // Ignore non-JSON Mailchimp responses.
    }
    console.error(`[${context}] Mailchimp upsert failed; tags not applied.`, {
      email,
      status: memberRes.status,
      detail,
    });
    return;
  }

  const tagRes = await fetch(`${base}/tags`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      tags: tags.map((name) => ({ name, status: 'active' })),
    }),
  });

  if (!tagRes.ok) {
    let detail: unknown = {};
    try {
      detail = await tagRes.json();
    } catch {
      // Ignore non-JSON Mailchimp responses.
    }
    console.error(`[${context}] Mailchimp tagging failed; journey will not fire.`, {
      email,
      tags,
      status: tagRes.status,
      detail,
    });
    return;
  }

  console.log(`[${context}] Mailchimp subscribe + tag accepted.`, { email, tags });
}
