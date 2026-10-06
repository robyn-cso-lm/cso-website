import { AFTER_APPLYING, type Tier } from './surrogateScreen';

const esc = (v: unknown) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const DEEP = '#3D1A6E';
const MID = '#6B3FA0';
const LAV = '#E8E0F5';

const HEADLINE: Record<Tier, { badge: string; title: string; lead: string }> = {
  green: {
    badge: 'Great fit',
    title: 'You look like a wonderful fit',
    lead: 'Your answers check every core box. Women like you are exactly who waiting families are hoping for.',
  },
  yellow: {
    badge: 'So close',
    title: 'You are closer than you think',
    lead: 'Most of your answers look great. There are a couple of things to be aware of, and in most cases we can work through them together.',
  },
  red: {
    badge: 'Let’s talk',
    title: 'Let’s talk it through',
    lead: 'A couple of things could be barriers right now. We have worked with women in every kind of situation, and a short, honest conversation often changes the picture.',
  },
};

export function buildSurrogateResultEmail(opts: {
  firstName: string;
  tier: Tier;
  notes: string[];
}): { subject: string; html: string } {
  const { firstName, tier, notes } = opts;
  const h = HEADLINE[tier];

  const noteList = notes.length
    ? `<p style="margin:22px 0 8px;font-size:15px;color:${DEEP};"><strong>${tier === 'red' ? 'Here is what came up, and what we can often do about it:' : 'A few things to keep in mind:'}</strong></p>
       <ul style="margin:0 0 6px;padding-left:20px;font-size:15px;line-height:1.7;color:#444;">${notes.map(n => `<li style="margin-bottom:8px;">${esc(n)}</li>`).join('')}</ul>`
    : '';

  const steps = AFTER_APPLYING.map(
    (s, i) => `<tr>
      <td valign="top" style="padding:0 14px 14px 0;width:30px;font-family:Georgia,serif;font-size:22px;color:${MID};">${i + 1}</td>
      <td style="padding:0 0 14px;font-size:15px;line-height:1.6;color:#444;"><strong style="color:${DEEP};">${esc(s.title)}</strong>${s.duration ? ` <span style="color:#777;">(${esc(s.duration)})</span>` : ''}<br>${esc(s.body)}</td>
    </tr>`,
  ).join('');

  const primaryCta =
    tier === 'red'
      ? `<a href="https://calendly.com/cso-robyn" style="display:inline-block;background:${DEEP};color:#fff;text-decoration:none;font-weight:bold;font-size:16px;padding:16px 30px;border-radius:100px;">Book a free call with Robyn</a>`
      : `<a href="https://canadiansurrogacyoptions.com/surrogates?utm_source=email&utm_medium=result&utm_campaign=surrogate_screen#apply" style="display:inline-block;background:${DEEP};color:#fff;text-decoration:none;font-weight:bold;font-size:16px;padding:16px 30px;border-radius:100px;">Start my application (about 10 minutes)</a>`;

  const secondary =
    tier === 'red'
      ? ''
      : `<p style="margin:14px 0 0;font-size:14px;color:#666;">Prefer to talk first? <a href="https://calendly.com/cso-robyn" style="color:${MID};font-weight:bold;">Book a free call with Robyn</a>. You never need a call to apply.</p>`;

  const html = `<!doctype html><html><body style="margin:0;background:#F4F0FB;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <div style="max-width:620px;margin:0 auto;padding:24px 14px;">
    <div style="background:#FDFAF7;border-radius:14px;overflow:hidden;">
      <div style="background:${DEEP};padding:32px 36px;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C4ADEA;">${esc(h.badge)}</p>
        <h1 style="margin:0;font-family:Georgia,serif;font-weight:normal;font-size:30px;line-height:1.15;color:#fff;">${esc(h.title)}, ${esc(firstName)}</h1>
      </div>
      <div style="padding:30px 36px 8px;font-size:16px;line-height:1.7;">
        <p style="margin:0 0 16px;">Hi ${esc(firstName)}, thank you for taking the time to check. I grew up in this field, and the women who do this are the heart of everything we do. 💜</p>
        <p style="margin:0 0 6px;">${esc(h.lead)}</p>
        ${noteList}

        <div style="background:${LAV};border-radius:12px;padding:18px 22px;margin:26px 0;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:${DEEP};"><strong>You will never spend a cent of your own money.</strong> Eligible expenses are reimbursed throughout your journey, on top of pregnancy care covered by your provincial health plan. Canadian surrogacy is altruistic under the Assisted Human Reproduction Act, so this is reimbursement, not payment.</p>
        </div>

        <h2 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;color:${DEEP};margin:0 0 14px;">What happens after you apply</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps}</table>

        <div style="text-align:center;margin:26px 0 8px;">${primaryCta}${secondary}</div>

        <p style="margin:28px 0 0;font-size:15px;">If you have a question about anything here, just reply. A real person answers, usually the same day.</p>
        <p style="margin:18px 0 4px;">Warmly,</p>
        <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-style:italic;color:${DEEP};">Robyn Price</p>
        <p style="margin:2px 0 0;font-size:13px;color:#777;">Executive Director, Canadian Surrogacy Options</p>
        <p style="margin:18px 0 28px;font-family:Georgia,serif;font-style:italic;font-size:17px;color:${MID};">from hope to heartbeat to home</p>
      </div>
    </div>
  </div></body></html>`;

  return { subject: `Your result, and what happens next, ${firstName}`, html };
}
