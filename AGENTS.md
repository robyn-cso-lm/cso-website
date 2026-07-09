# AGENTS.md — cso-website

Marketing website for Canadian Surrogacy Options (canadiansurrogacyoptions.com).

## Source of truth (read first)
For voice, pricing, brand colors/fonts, and company facts, read the `cso-brain` repo (`C:\Users\robyn\cso-brain`): `CLAUDE.md`, `/voice/`, `/pricing/`, and `BRAND_KIT.md`. Do not hardcode pricing or invent brand colors; pull them from there. This repo also has its own `CLAUDE.md` with site-specific notes.

## Stack & deploy
- Next.js, hosted on Netlify.
- Deploys from the `main` branch, NOT `master` (any "default branch: master" note is stale).
- Meta Pixel `1533454933710050` is installed. Lead events matter for ad optimization; do not remove or rename tracking calls without checking `lib/meta-pixel.ts` and the ads context first.

## Rules that never bend
- No em dashes in any site copy.
- Brand voice: warm, big-sister, lead with the visitor's situation, close with Calendly (https://calendly.com/cso-robyn).
- Never reference anyone on the DO NOT CONTACT list in cso-brain/CLAUDE.md.
