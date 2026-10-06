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

**Camica ad** (skips question 1 and goes straight to the U.S. pathway):
```
https://canadiansurrogacyoptions.com/surrogacy-costs?route=us&utm_source=facebook&utm_medium=paid_social&utm_campaign=clearer_way_to_begin&utm_content=camica_cost_quiz
```

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

**Primary text, option C (Hybrid angle, for Canadian audiences)**
> Waiting in Canada and wondering if there's a faster way? Our Hybrid Pathway has a Florida surrogate travel to Ontario for the birth, so your baby is born in Canada. See what it could cost for your family in two minutes.

**Headline:** What does U.S. surrogacy actually cost?
**Alternate headlines:** Honest costs, itemized / A clearer way to begin
**Description:** Seven questions. No call needed.
**Button:** Learn More (or Get Quote)
**Display link:** camica.ca (or canadiansurrogacyoptions.com)

For option C, point the same Camica link at Canadian audiences and change `route=us` to nothing, so the quiz can show the Hybrid card to Canadian residents.

---

## Before you publish

1. **Prices on the destination page must be current.** The quiz reads `lib/pricing.ts`. The agency prices were confirmed against the live sites on 2026-10-06. The three-stage payment amounts and the Little Miracles figures still need Robyn's confirmation (see the PR checklist).
2. **The Camica ad lands on a CSO-branded page.** Camica shows as "our U.S. brand" in the results, but the page is purple, not teal. If Camica click-through or trust drops, the fix is a teal "Camica" skin of the quiz.
3. **Meta ad policy:** don't add copy that implies you know a person's health or family situation ("Struggling with infertility?"). Everything above talks about families and costs, not about the viewer. Surrogacy ads are allowed but can get extra review, so submit a day or two before you need them live.
4. **Pixel and events:** the quiz fires `CostQuizComplete` when someone sees their estimate and `Lead` when they ask for the written next step. Optimize the campaign for `Lead`, not for clicks, and don't judge it on cost per click.
5. **Set up retargeting** for people who finished the quiz but didn't leave their email. They have already told you their situation.

## Suggested starting audiences
- **CSO:** Canada, women and men 28 to 45, interests such as fertility, IVF and family building. Layer a lookalike of past leads once there are 100 or more.
- **Camica:** Canada and U.S., same ages. Run Camica option C to Canadian audiences and options A or B to U.S. audiences separately so results don't blur.
- Start small and equal ($15 to $25 a day per ad) for a week, then move the budget toward whichever one produces completed quizzes that become written next steps.

## Re-rendering the creatives
Open the HTML in Edge or Chrome with `#feed` (1080x1350) or `#square` (1080x1080) on the end of the URL, or run Edge headless:

```
msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=12000 --screenshot=out.png "file:///path/creative-cso.html#feed"
```
