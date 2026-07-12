type PortalLead = {
  type: 'ip' | 'surrogate' | 'donor';
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  source: string;
  sourceUrl?: string;
  rawPayload?: Record<string, unknown>;
};

const PORTAL_LEAD_URL = 'https://cso-lm-portal-production.up.railway.app/api/public/website-lead';

// Never block a completed website form if the CRM handoff is temporarily down.
// The existing Graph email and Mailchimp paths remain available while this is
// being proven in production.
export async function capturePortalLead(lead: PortalLead): Promise<void> {
  const secret = process.env.CSO_PORTAL_LEAD_CAPTURE_SECRET;
  if (!secret) {
    console.warn('[portal-lead] CSO_PORTAL_LEAD_CAPTURE_SECRET is not configured; CRM handoff skipped.');
    return;
  }
  try {
    const response = await fetch(PORTAL_LEAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cso-lead-capture-secret': secret,
      },
      body: JSON.stringify({
        type: lead.type,
        email: lead.email,
        first_name: lead.firstName,
        last_name: lead.lastName || null,
        phone: lead.phone || null,
        source: lead.source,
        source_url: lead.sourceUrl || null,
        raw_payload: lead.rawPayload || {},
      }),
    });
    if (!response.ok) {
      console.error('[portal-lead] CRM handoff failed.', { status: response.status, source: lead.source });
    }
  } catch (error) {
    console.error('[portal-lead] CRM handoff error.', { source: lead.source, error });
  }
}
