// Meta Conversions API helper for server-side purchase tracking
import crypto from 'crypto';

interface CAPIEventData {
  event_name: 'Purchase';
  event_time: number;
  event_id: string;
  event_source_url: string;
  user_data?: {
    em?: string; // hashed email
    ph?: string; // hashed phone
    ge?: string; // hashed gender
  };
  custom_data?: {
    value: number;
    currency: string;
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
  };
}

// Hash email for Meta
function hashEmail(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

/**
 * Send Purchase event to Meta Conversions API
 * This provides server-side conversion tracking for better iOS privacy support
 */
export async function sendMetaConversionEvent(
  pixelId: string,
  accessToken: string,
  {
    sessionId,
    email,
    value,
    currency,
    contentIds,
    contentName,
  }: {
    sessionId: string;
    email?: string;
    value: number;
    currency: string;
    contentIds?: string[];
    contentName?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!accessToken || !pixelId) {
      console.warn('[meta-capi] Missing accessToken or pixelId');
      return { success: false, error: 'Missing configuration' };
    }

    const eventTime = Math.floor(Date.now() / 1000);

    const userData: CAPIEventData['user_data'] = {};
    if (email) {
      userData.em = hashEmail(email);
    }

    const eventData: CAPIEventData = {
      event_name: 'Purchase',
      event_time: eventTime,
      event_id: sessionId, // Use session ID for deduplication
      event_source_url: 'https://canadiansurrogacyoptions.com/guides/thank-you',
      user_data: userData,
      custom_data: {
        value,
        currency,
        content_ids: contentIds || [],
        content_name: contentName,
        content_type: 'product',
      },
    };

    const url = `https://graph.facebook.com/v21.0/${pixelId}/events`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[meta-capi] CAPI request failed: ${response.status}`,
        errorText
      );
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const result = await response.json();
    console.log(
      `[meta-capi] Purchase event sent successfully for session ${sessionId}`
    );
    return { success: true };
  } catch (err) {
    console.error('[meta-capi] Error sending conversion event:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
