const DEFAULT_IP_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/14435275/2n2lpoz/';

type IntendedParentPayload = {
  formType: string;
  firstName: string;
  email: string;
  phone?: string;
  role?: string;
  message?: string;
  sourcePath: string;
  sourceLabel: string;
  guideName?: string;
};

export async function sendIntendedParentLeadToZapier(payload: IntendedParentPayload) {
  const webhookUrl = process.env.ZAPIER_IP_WEBHOOK_URL || DEFAULT_IP_WEBHOOK_URL;

  try {
    const cleanPhone = payload.phone || '';
    const cleanRole = payload.role || 'Intended Parent';
    const cleanMessage = payload.message || '';
    const cleanGuideName = payload.guideName || '';

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: payload.formType,
        leadType: 'Intended Parent',
        firstName: payload.firstName,
        fullName: payload.firstName,
        email: payload.email,
        phone: cleanPhone,
        role: cleanRole,
        message: cleanMessage,
        guideName: cleanGuideName,
        source: 'canadiansurrogacyoptions.com',
        sourcePath: payload.sourcePath,
        sourceLabel: payload.sourceLabel,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const responseBody = await res.text().catch(() => '');
      console.error('[zapier] Intended parent webhook rejected.', {
        status: res.status,
        responseBody: responseBody.slice(0, 500),
        email: payload.email,
        sourceLabel: payload.sourceLabel,
      });
    }
  } catch (error) {
    console.error('[zapier] Intended parent webhook failed.', {
      error,
      email: payload.email,
      sourceLabel: payload.sourceLabel,
    });
  }
}
