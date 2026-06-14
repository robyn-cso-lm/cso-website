/**
 * Lightweight conversion tracking.
 *
 * Fires events to the Meta Pixel and Google (GA4 / Google Ads) tags that are
 * loaded in app/layout.tsx. Every call is a no-op on the server and is safely
 * guarded when a tag is blocked (ad blockers) or not yet loaded, so these are
 * safe to call from anywhere.
 *
 * In GA4, mark `generate_lead`, `begin_application`, and `schedule_call` as
 * key events (conversions) and import them into Google Ads — that's how the
 * Google Ads tag (AW-467681165) optimizes against them without a per-event
 * conversion label hardcoded here.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

type LeadInfo = {
  /** Audience, e.g. "Intended Parent" | "Surrogate" | "Egg Donor" | "Other" */
  type?: string;
  /** Where on the site the lead originated, e.g. "contact_form" */
  source?: string;
};

/** A captured lead — form submission. Maps to Meta's standard `Lead` event. */
export function trackLead({ type, source }: LeadInfo = {}): void {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Lead', { content_category: type, content_name: source });
  window.gtag?.('event', 'generate_lead', { lead_type: type, lead_source: source });
}

/** Clicked into the application funnel (portal get-started / register). */
export function trackStartApplication(source?: string): void {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'InitiateCheckout', { content_name: source });
  window.gtag?.('event', 'begin_application', { source });
}

/** Clicked through to book a call (Calendly). */
export function trackSchedule(source?: string): void {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'Schedule', { content_name: source });
  window.gtag?.('event', 'schedule_call', { source });
}
