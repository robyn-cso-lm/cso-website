# CSO Website — Claude Context

> Read this at the start of every session. Full context for working on canadiansurrogacyoptions.com without re-briefing.

---

## Stack & Deployment

| Layer | Detail |
|-------|--------|
| Framework | **Next.js 14** (App Router, TypeScript, Tailwind CSS v3) |
| Deployed on | **Netlify** via `@netlify/plugin-nextjs` |
| Database | **Neon** (serverless Postgres) — via Prisma ORM. `DATABASE_URL` set in Netlify env only (not in local `.env.local`) |
| Auth | NextAuth v5 beta (`next-auth@^5.0.0-beta.31`) — uses `AUTH_SECRET`, NOT `NEXTAUTH_SECRET` |
| Content | MDX files for blog/resources — `mdxRs: false` (JS compiler, don't switch to Rust) |
| Email | Microsoft Graph via `lib/graphMail.ts` — sends from `robyn@canadiansurrogacyoptions.com` |
| Repo | `robyn-cso-lm/cso-website` (private GitHub), default branch: `master` |

**Production URL:** https://canadiansurrogacyoptions.com

---

## Key Env Vars

| Var | Where set | Notes |
|-----|-----------|-------|
| `DATABASE_URL` | Netlify only | Not in local .env.local — site DB features fail locally without it |
| `AZURE_TENANT_ID` / `AZURE_CLIENT_ID` / `AZURE_CLIENT_SECRET` | Netlify | Needed for MS Graph email (graphMail.ts) |
| `AUTH_SECRET` | Netlify | NextAuth v5 — different from v4's NEXTAUTH_SECRET |
| `MAILCHIMP_API_KEY` | .env.local + Netlify | Server us15, list ID `4554baefc6` |
| `MAILCHIMP_LIST_ID` | .env.local + Netlify | `4554baefc6` |
| `STRIPE_SECRET_KEY` | .env.local (LIVE KEY) + Netlify | ⚠️ Live Stripe key in local file — never commit .env.local |
| `NEXT_PUBLIC_GA_ID` | Netlify | Currently blank — GA not yet active |
| `RECAPTCHA_SECRET_KEY` | Netlify | Needed for all form routes — will silently fail if missing locally |
| `NEXT_PUBLIC_SITE_URL` | Netlify | `https://canadiansurrogacyoptions.com` |

---

## Pages (App Router structure)

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/about` | About page |
| `/surrogates` | Surrogate info |
| `/intended-parents` | IP info |
| `/programs` | Programs / pricing |
| `/families` | Family stories |
| `/lgbtq-surrogacy` | LGBTQ+ specific page |
| `/international` | International surrogacy |
| `/blog` | Blog (MDX files) |
| `/resources` | Resources |
| `/faq` | FAQ |
| `/contact` | Contact form |
| `/cost-calculator` | IP cost calculator tool |
| `/private-inquiry` | Concierge/private inquiry |
| `/welcome` | Post-conversion landing |
| `/portal` | Internal portal (auth-gated, Prisma-backed) |

**⚠️ WordPress redirects:** `next.config.mjs` has ~20 permanent redirects from old WordPress URLs (e.g., `/aboutourteam/*`, `/ips`, `/become-a-surrogate`). Do NOT remove these — they preserve Google-indexed URLs.

---

## API Routes

| Route | Purpose | Email notification? |
|-------|---------|-------------------|
| `app/api/contact` | Main contact form | ✅ Sends to Robyn via graphMail |
| `app/api/leads` | General lead capture | ✅ Sends to Robyn via graphMail |
| `app/api/ip-cost-guide` | IP cost guide lead magnet | ✅ Sends to Robyn via graphMail |
| `app/api/surrogate-guide` | Surrogate guide lead magnet | ✅ Sends to Robyn via graphMail |
| `app/api/concierge-inquiry` | Private/concierge inquiry | ✅ Sends to Robyn via graphMail |
| `app/api/stripe-webhook` | Stripe payment webhooks | — |
| `app/api/portal/*` | Portal surrogate/IP/donor CRUD | — |

All form routes use **reCAPTCHA v3** (threshold 0.5) + **honeypot field** for spam. The `website` body field is the honeypot — if it has a value, silently return success.

**Email pattern:** All notification emails use `lib/graphMail.ts` → `sendMail(to, subject, html)`. Always wrap in try/catch so mail failure doesn't fail the API response.

---

## External Services

| Service | Notes |
|---------|-------|
| **Microsoft Graph** | Email send via O365. Creds: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` |
| **Mailchimp** | Lead lists. API key + list ID in env. Tags used: `Contact Form`, `IP Lead`, `Cost Guide Download`, `Surrogate Lead`, etc. |
| **Stripe** | Payments for programs. 4 product links in env vars. `SURROGATE_LINK` intentionally blank. |
| **NextAuth v5** | Portal auth. Uses `AUTH_SECRET`. Prisma adapter. Still beta — API differs from v4. |
| **reCAPTCHA v3** | All public forms. Key in Netlify env only. |
| **Neon / Prisma** | Portal data (surrogates, IPs, donors). Schema in `prisma/` folder. |

---

## lib/ Files

| File | Purpose |
|------|---------|
| `lib/graphMail.ts` | Send email via MS Graph — `sendMail(to, subject, html, from?)` |
| `lib/recaptcha.ts` | Server-side reCAPTCHA v3 verify — returns true if score ≥ 0.5 |
| `lib/prisma.ts` | Prisma client singleton |
| `lib/mdx.ts` | MDX content loader for blog/resources |
| `lib/portal/pdf.ts` | PDF generation for portal |
| `lib/portal/profiles.ts` | Profile data helpers |

---

## Common Tasks

### Adding or editing a page
Pages are in `app/[route]/page.tsx`. Tailwind CSS for styling. No external CSS framework — check `tailwind.config.ts` for custom colours/fonts.

### Adding a blog post
Create an MDX file in the blog content directory. Check `lib/mdx.ts` for the expected frontmatter fields (likely: `title`, `date`, `slug`, `excerpt`, `author`).

### Changing a form
Form routes are in `app/api/`. All use the pattern: honeypot check → reCAPTCHA verify → validate fields → Mailchimp add → sendMail notification → return success.

### Deploying
Push to `master` branch → Netlify auto-deploys. No build command needed beyond `git push`.

### Running locally
```bash
cd client  # this is the Next.js root
npm install
npm run dev  # starts on localhost:3000
```
Note: DB features won't work locally without `DATABASE_URL`. Email won't work without Azure creds.

---

## Known Gotchas

- **`.env.local` has live Stripe keys** — never commit it. Already in `.gitignore`.
- **NextAuth v5 beta** — uses `AUTH_SECRET` not `NEXTAUTH_SECRET`. Config is in `auth.ts` not `pages/api/auth`.
- **MDX uses JS compiler** (`mdxRs: false`) — don't change this; it will break content parsing.
- **`DATABASE_URL` not in local env** — Prisma/portal features only work in Netlify preview or production.
- **reCAPTCHA key missing locally** — `lib/recaptcha.ts` returns `true` (bypass) when key is absent, so forms work in dev without it.
- **WordPress redirect debt** — ~20 permanent redirects in `next.config.mjs`. Keep them forever.
- **Netlify plugin** requires `netlify.toml` at project root. Don't delete it.
