# "A Clearer Way to Begin" Facebook ads: cost quiz

Two ads, one per page, both pointing at the cost quiz. Copy is ready to paste into Ads Manager.

| File | What it is |
|------|-----------|
| `cso-feed-1080x1350.png` | CSO creative, 4:5 (Facebook and Instagram feed) |
| `cso-square-1080x1080.png` | CSO creative, 1:1 |
| `camica-feed-1080x1350.png` | Camica creative, 4:5 |
| `camica-square-1080x1080.png` | Camica creative, 1:1 |
| `creative-cso.html`, `creative-camica.html` | Editable sources for the four PNGs |

Use 4:5 as the main placement and 1:1 as the fallback. Let Meta crop the 4:5 for Stories, or ask for a 9:16 version.

---

## Links (paste exactly, the tracking is built in)

**CSO ad:**
```
https://canadiansurrogacyoptions.com/surrogacy-costs?utm_source=facebook&utm_medium=paid_social&utm_campaign=clearer_way_to_begin&utm_content=cso_cost_quiz
```

**Camica ad** (a fully Camica-branded teal page, starts on the U.S. pathway):
```
https://canadiansurrogacyoptions.com/camica/costs?utm_source=facebook&utm_medium=paid_social&utm_campaign=clearer_way_to_begin&utm_content=camica_cost_quiz
```
The Camica page hides the CSO nav, footer and chat bubble, uses Camica's colours and fonts, and its buttons go to the Camica portal and the Camica consult calendar. The leads are tagged `Camica` in Mailchimp. If you can add a redirect on camica.ca (for example `camica.ca/costs`), use that as the ad's display link and point it at the URL above.

Every lead who finishes the quiz and asks for the written next step arrives with these `utm_` values in Robyn's notification email, the Zapier payload and the portal CRM, so you can see which ad and which creative produced a lead (and later, a first payment). Change `utm_content` per creative or per audience, for example `cso_cost_quiz_4x5_a`.

---

## CSO ad (Facebook: Canadian Surrogacy Options page)

**Primary text, option A (recommended)**
> The first thing everyone asks me is about money, so we built the answer into the website.
>
> Seven quick questions, and you see every cost: what you pay us, what you pay your surrogate, clinic and lawyers, and what you don't. Our fee is paid in three stages, not all upfront. No call needed.
>
> I grew up in this field. I'd rather you see the real numbers than wonder.

**Primary text, option B (shorter)**
> What does surrogacy in Canada actually cost? Take the 2-minute quiz and see every line, with our fee paid in three stages. No call, no pressure.

**Primary text, option C (story)**
> "How much is this going to cost?" is the question I hear on every single call. So instead of making you book one to find out, we put it online. Answer seven questions, get an honest, itemized range, and decide what's next on your own time.

**Headline:** What will surrogacy actually cost?
**Alternate headlines:** See every cost, up front / Our fee is paid in three stages
**Description:** Seven questions. No call needed.
**Button:** Learn More (or Get Quote)
**Display link:** canadiansurrogacyoptions.com

## Camica ad (Facebook: Camica page)

**Primary text, option A (recommended)**
> Thinking about surrogacy in the U.S.? Start with the part everyone worries about.
>
> Take our 2-minute quiz and see an honest range for your family: agency fee, surrogate compensation, medical, legal and escrow, each on its own line. No call needed.
>
> Camica is a family business with 34 years of surrogacy behind it. You'll know my name, and I'll know yours.

**Primary text, option B (shorter)**
> What does U.S. surrogacy actually cost? Two minutes, seven questions, every cost itemized. No call needed.

**Do not run a Hybrid Pathway angle.** The Hybrid is currently not offered (the quiz shows it struck through). Bring it back in `lib/pricing.ts` first.

**Headline:** What does U.S. surrogacy actually cost?
**Alternate headlines:** Honest costs, itemized / A clearer way to begin
**Description:** Seven questions. No call needed.
**Button:** Learn More (or Get Quote)
**Display link:** camica.ca (or canadiansurrogacyoptions.com)

---

## Before you publish

1. **Prices on the destination page must be current.** The quiz reads `lib/pricing.ts`. The agency prices were confirmed against the live sites on 2026-10-06. The three-stage split (equal thirds) and the Little Miracles figures were confirmed by Robyn on 2026-10-06.
2. **The Camica ad has its own teal page** (`/camica/costs`), so Camica traffic never sees CSO purple. It is hosted on the CSO domain, because camica.ca is a separate site.
3. **Meta ad policy:** don't add copy that implies you know a person's health or family situation ("Struggling with infertility?"). Everything above talks about families and costs, not about the viewer. Surrogacy ads are allowed but can get extra review, so submit a day or two before you need them live.
4. **Pixel and events:** the quiz fires `CostQuizComplete` when someone sees their estimate and `Lead` when they ask for the written next step. Optimize the campaign for `Lead`, not for clicks, and don't judge it on cost per click.
5. **Set up retargeting** for people who finished the quiz but didn't leave their email. They have already told you their situation.

## Suggested starting audiences
- **CSO:** Canada, women and men 28 to 45, interests such as fertility, IVF and family building. Layer a lookalike of past leads once there are 100 or more.
- **Camica:** Canada and U.S., same ages. Keep Canadian and U.S. audiences in separate ad sets so results don't blur.
- Start small and equal ($15 to $25 a day per ad) for a week, then move the budget toward whichever one produces completed quizzes that become written next steps.

## Re-rendering the creatives
Open the HTML in Edge or Chrome with `#feed` (1080x1350) or `#square` (1080x1080) on the end of the URL, or run Edge headless:

```
msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=12000 --screenshot=out.png "file:///path/creative-cso.html#feed"
```

---

# Surrogate recruitment ad (Facebook and Instagram)

Creatives: `surrogate-feed-1080x1350.png` (4:5), `surrogate-square-1080x1080.png` (1:1). Source: `creative-surrogate.html`.

**Link** (the screening quiz, with tracking):
```
https://canadiansurrogacyoptions.com/qualify?utm_source=facebook&utm_medium=paid_social&utm_campaign=surrogate_screen&utm_content=surrogate_check_a
```

**Primary text, option A (recommended)**
> Could you help a family begin? 💜
>
> Take our private 2-minute check. You'll get an honest answer about whether surrogacy could be right for you, what the journey involves, and how every eligible expense is reimbursed. No call needed.
>
> I grew up in this field, and the women who do this are the heart of everything we do.

**Primary text, option B (support angle)**
> You would never do this alone. Every surrogate with Canadian Surrogacy Options has a support coordinator from day one, a community of women who truly get it, her own lawyer paid for by the intended parents, and a team that stays involved. Curious if it could be right for you? Take the private 2-minute check.

**Primary text, option C (short)**
> Wondering if you could be a surrogate? Two minutes, private, no pressure.

**Headline:** Could you help a family begin?
**Alternate headlines:** A private 2-minute check / You would never do this alone
**Description:** Private. No call needed to apply.
**Button:** Learn More (or Apply Now)

## Rules for this ad (important)
- **Never offer payment.** Canadian surrogacy is altruistic under the Assisted Human Reproduction Act. Say "reimbursed", never "earn", "get paid", "compensation" or dollar amounts for surrogates. The old Qualify page line "(most journeys: $45,000+)" is a reimbursement total, but in an ad it reads like pay, so keep dollar figures out of the ad.
- **Don't speak to personal attributes.** Avoid "Are you a woman who...?" or anything about health, money worries or age aimed at the viewer. "Could you help a family begin?" is fine.
- **Keep surrogate and intended-parent ads in separate ad sets and never mix the messages.**
- Surrogate and fertility ads can get extra review. Submit a day or two before you need them live.

## What the funnel does now
1. The ad goes to `/qualify`, the 8-question check.
2. When she leaves her email, she is emailed her result and exactly what happens next (automatically), and the team gets a heads-up marked **[GREEN]**, **[YELLOW]** or **[RED]** so you know who to call first.
3. She starts the full application (the Jotform on `/surrogates#apply`).
4. When she submits, Jotform sends her to `/surrogates/thank-you`, which records a completed application for ad tracking.

## One setting you need to change in Jotform
So completed applications are counted, set Jotform's thank-you page to redirect to:
`https://canadiansurrogacyoptions.com/surrogates/thank-you`
(Jotform: open the form, **Settings**, **Thank You Page**, choose **Redirect to an external link**, paste the address, save.)

## Optimize for
Optimize the campaign for **Lead** (the quiz) at first, and switch to **Submit Application** once you have about 50 completed applications. Judge it on completed applications and surrogates who pass screening, not on cost per click.
