/**
 * Server-side reCAPTCHA v3 verification.
 * Returns true if the token is valid and score >= 0.5.
 * Returns true (bypass) if RECAPTCHA_SECRET_KEY is not set.
 */
export async function verifyRecaptcha(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('[recaptcha] Missing RECAPTCHA_SECRET_KEY, allowing request through.');
    return true;
  }

  if (!token) {
    console.warn('[recaptcha] Missing captcha token.');
    return false;
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    const passed = data.success === true && (data.score ?? 1) >= 0.5;

    if (!passed) {
      console.warn('[recaptcha] Verification failed.', {
        success: data.success,
        score: data.score ?? null,
        action: data.action ?? null,
        hostname: data.hostname ?? null,
        errors: data['error-codes'] ?? [],
      });
    }

    return passed;
  } catch (err) {
    console.error('[recaptcha] Verification error:', err);
    return false;
  }
}
