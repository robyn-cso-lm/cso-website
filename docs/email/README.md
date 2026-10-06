# Warm IP email: the cost quiz announcement (Mailchimp)

File: `warm-ip-cost-quiz.html`. Copy and paste the whole file into Mailchimp.

## How to load it
1. Mailchimp, **Create**, **Email**, **Regular**.
2. Pick **Code your own**, then **Paste in code**. Paste the entire contents of `warm-ip-cost-quiz.html`. Click **Save and continue**.
3. Under **To**, choose the audience carefully (see below).
4. **Subject line** (pick one):
   - `How much does surrogacy actually cost? (we built the answer)`
   - `The question I get on every call`
   - `See your cost, in writing, in 2 minutes`
5. **Preview text** is already inside the HTML (Mailchimp usually picks it up). If it asks, use: `Every cost itemized. Our fee paid in three equal stages. No call needed.`
6. **From name:** Robyn Price. **From email:** robyn@canadiansurrogacyoptions.com.
7. Send yourself a **test** first. Click the button and both links. Check it on your phone.

## Who to send it to (important)
- **Do NOT send to the "IP Waiting 2026" audience.** Those are paying clients in active journeys.
- **Do NOT send to "2026 Leads."** That audience is surrogate contacts, and this email is for intended parents.
- Send to your **intended-parent leads**: the main list with the tag **IP Lead** (and **Cost Guide Download**). Use a **segment**: tag contains `IP Lead`, and exclude anyone tagged as a client.
- Exclude anyone who already took the quiz (tag `Cost Quiz`).

## Already built in
- Merge tags: `*|FNAME|*` with a "Hi there" fallback, plus the required `*|LIST:ADDRESS|*`, `*|UPDATE_PROFILE|*` and `*|UNSUB|*`. **Do not delete the footer.**
- Tracked links (`utm_` values) so you can see which leads came from this email.
- A second link to the Camica U.S. version for people considering the U.S.

## After you send
- In Mailchimp, watch **clicks on the main button**, not opens.
- In Robyn's inbox, "Cost quiz lead" emails show where each lead came from.
- Follow up personally within a day with anyone who finishes the quiz and asks for the written next step.
