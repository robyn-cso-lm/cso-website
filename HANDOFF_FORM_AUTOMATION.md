# CSO Handoff Doc — Form Automation + Homepage Redesign
**Date:** 2026-05-06  
**For:** New Claude session  
**Context:** Picking up from a session that ran out of tokens

---

## What Was Just Completed (This Session)

The homepage of **canadiansurrogacyoptions.com** was fully redesigned to match the reference static HTML at:
`C:/Users/robyn/cso-portal/.claude/worktrees/zealous-mayer-4479b0/client/public/index.html`

### Files changed and pushed to `cso-website` master (commit `a05825d`):
- `app/page.tsx` — Complete rewrite. New sections:
  1. Refund Banner (black/gold bar, links to `/intended-parents#refund-policy`)
  2. Hero — "The family you're building is already real." + stat strip
  3. Paths — Numbered cards (01 IP featured dark purple, 02 Surrogate white)
  4. GuidesStrip — Lavender bg, pill links, email capture
  5. Refund Feature — Dark black two-column with phase pills
  6. Robyn Section — Large italic quote + signature
  7. Final CTA — "Ready when you are." + application + Calendly links
- `app/page.module.css` — Complete rewrite to match above
- `components/GuidesStrip.tsx` — New client component (email capture → `/api/ip-cost-guide`)
- `components/GuidesStrip.module.css` — Styles for guides strip

**Netlify auto-deploys from master — should be live within 2 minutes of push.**

---

## Two Separate Repos — DO NOT CONFUSE

| Repo | Path | Deploys to | Branch |
|------|------|-----------|--------|
| **cso-website** | `C:/Users/robyn/cso-website` | canadiansurrogacyoptions.com (Netlify) | `master` |
| **cso-portal** | `C:/Users/robyn/cso-portal` | portal.canadiansurrogacyoptions.com (Railway/Netlify) | `main` |

The static HTML files in `cso-portal/.claude/worktrees/*/client/public/` are **portal files only** — they do NOT affect the public website.

---

## The Form Automation Task (Needs to Be Done Next)

Robyn received a setup guide for connecting website forms → email + Mailchimp via Zapier. Here's the breakdown of what Claude can do vs what Robyn must do herself.

### What Robyn Must Do Herself (Requires Her Accounts)
1. **Create a Zapier account** at https://zapier.com and get a webhook URL
2. **Create the 3 Zapier Zaps** (instructions below — Claude can guide her step by step)
3. **Connect her Gmail account** in Zapier (requires her login)
4. **Connect her Mailchimp account** in Zapier (requires her login)
5. **Copy the webhook URL** from Zapier and give it to Claude

### What Claude Can Do Without Robyn (Once She Has the Webhook URL)

1. **Update the contact form API route** — `app/api/contact/route.ts` already exists. Claude can add Zapier webhook forwarding to it so all contact form submissions go to Zapier automatically.

2. **Update the IP cost guide API route** — `app/api/ip-cost-guide/route.ts` can be updated to also forward to Zapier.

3. **Update the surrogate guide API route** — Same for `app/api/surrogate-guide/route.ts`.

4. **Verify form IDs and structure** are consistent across all pages.

5. **No `cso-form-integration.js` script needed** — The Next.js site already uses API routes (not a generic JS script). Claude should NOT add the `cso-form-integration.js` approach — that's for static HTML sites. The Next.js API routes are the right place to add Zapier forwarding.

---

## Current Form Infrastructure (Already Built in cso-website)

| Form | Location | API Route | What it does today |
|------|----------|-----------|-------------------|
| Contact form | `/contact` | `/api/contact` | Sends email via Mailchimp/SMTP |
| IP Cost Guide | Homepage (GuidesStrip) | `/api/ip-cost-guide` | Sends PDF + Mailchimp tag |
| Surrogate Guide | (LeadMagnets component) | `/api/surrogate-guide` | Sends PDF + Mailchimp tag |

---

## Exact Steps for the New Session

### Step 1 — Ask Robyn for the Zapier webhook URL
She needs to:
1. Go to https://zapier.com/app/editor/
2. Create a new Zap → Trigger: **Webhooks by Zapier** → **Catch Hook**
3. Copy the webhook URL (looks like `https://hooks.zapier.com/hooks/catch/12345678/abcde/`)
4. Paste it here in chat

### Step 2 — Claude updates the 3 API routes
Once Claude has the webhook URL, update each route to add a `fetch()` call to Zapier after the existing logic:

```typescript
// Add this to each route after existing logic succeeds:
if (process.env.ZAPIER_WEBHOOK_URL) {
  await fetch(process.env.ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formType: 'Contact Form', // or 'IP Cost Guide', 'Surrogate Guide'
      firstName,
      email,
      phone: phone || '',
      message: message || '',
      source: 'canadiansurrogacyoptions.com',
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {}); // fire-and-forget, don't block response
}
```

### Step 3 — Add env var
Add `ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...` to:
- `.env.local` (local dev)
- Netlify environment variables (production)

### Step 4 — Robyn sets up Zapier Zaps (3 of them)
Claude can walk her through each one. The 3 Zaps are:
1. **Webhook → Gmail** (sends email to robyn@canadiansurrogacyoptions.com)
2. **Webhook → Mailchimp** (adds contact to "2026 Leads" audience)
3. **Webhook → Gmail** (sends confirmation to the person who submitted)

---

## Other Pending Items (from Earlier Sessions)

- **Font inconsistency**: DM Sans (homepage/about/programs/contact) vs Jost (intended-parents/surrogates/faq etc.) — offered to standardize to DM Sans, awaiting confirmation
- **Karyn Handour email**: Row 181 in IP Lead Tracker has `karyn.handour@gmaii.com` — possible typo (gmaii vs gmail), needs Robyn to verify in Calendly
- **Sofia Leal Rodrigues**: Email was truncated in Calendly — needs Robyn to pull full email

---

## Key Links & Info

- **Live website:** https://canadiansurrogacyoptions.com
- **Portal:** https://portal.canadiansurrogacyoptions.com
- **cso-website GitHub:** `robyn-cso-lm/cso-website` (master branch)
- **Robyn's email:** robyn@canadiansurrogacyoptions.com
- **Calendly:** https://calendly.com/cso-robyn
- **IP Lead Tracker Google Sheet:** https://docs.google.com/spreadsheets/d/184gkzw5TUZAoLW7zHcXIjdA5-AQiBKf-oY0cYzpl6ws/edit
- **Mailchimp audience:** "2026 Leads"
