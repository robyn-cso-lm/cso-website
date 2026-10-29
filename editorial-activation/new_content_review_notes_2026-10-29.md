# New Knowledge Centre content, 29 Oct 2026

UPDATE: Robyn asked to publish everything, so all 62 new items are now `status: published` (the 60 below plus How to Find a Surrogate in Canada and Is Canadian Surrogacy Options Legit?). The checks below still apply and should be done soon.

## What was added

- 51 FAQs in `content/knowledge/faqs/`
- 9 articles in `content/knowledge/articles/`:
  - surrogacy-for-international-intended-parents-canada
  - how-to-become-an-egg-donor-in-canada
  - egg-donation-costs-in-canada
  - independent-vs-agency-surrogacy-canada
  - surrogacy-with-donor-sperm-or-donor-embryos-canada
  - questions-to-ask-a-surrogacy-agency-canada
  - do-i-need-an-egg-donor-a-surrogate-or-both
  - surrogacy-myths-and-facts-canada
  - can-i-be-a-surrogate-self-check-canada

## Edits to live content

- `surrogacy-cost-canada-2026`: agency fee section now lists the CSO tiers, three equal stages and the refund policy, and links to two new articles.
- `creating-families-through-surrogacy-with-canadian`: set to draft (it was a title-only fragment published by default).
- `becoming-a-surrogate-in-canada`: description no longer cut off mid-word.
- `app/knowledge-centre/page.tsx`: intro line rewritten, five "Placeholder" cards removed.

## Robyn, please check these before publishing

Facts I could not confirm from the repo, brand file or pricing.ts:

1. **Little Miracles prices** in `egg-donation-costs-in-canada` come from the brand file only. `lib/pricing.ts` says little-miracles.ca does not publish them. Confirm.
2. **Egg donor age and criteria** ("typically twenties to early thirties", cycle limits): confirm LM's actual rules.
3. **OHSS ~1%** is from the brand file, stated for Little Miracles donors.
4. **Existing egg article** `egg-donation-in-canada` says a donor egg cycle is $25,000 to $45,000+. That likely includes IVF, but it reads differently from the new article. Reconcile.
5. **Birth certificate / parentage FAQs** are deliberately general because provinces differ. The existing legal article says pre-birth orders are available in most provinces. A lawyer should review all items marked `legalReviewRequired: true`.
6. **Citizenship and travel** in the international article is general. Wording on US citizenship, DNA testing and time in Canada after birth needs your or a lawyer's check.
7. **Maternity benefits for surrogates** (FAQ): worded as "may be eligible". Confirm with Service Canada.
8. **OHIP / fertility funding** FAQ: worded generally.
9. **Camica** prices are from the brand file and match camica.ca as of Oct 2026. The Hybrid Pathway is not mentioned, as it is not offered.
10. **Shared-cost egg model** is mentioned in the costs article, from the brand file.
11. I did **not** name any lawyers.
12. **Not written yet:** a Quebec article. Quebec's surrogacy law changed recently and I did not want to guess. Needs a lawyer's input.

## To unpublish an item

Change its `status: published` back to `status: draft`.
