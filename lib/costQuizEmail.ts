import {
  CONCERN_NOTES,
  cad,
  exact,
  type PathwayEstimate,
  type QuizAnswers,
} from './costQuiz';
import { NOT_COVERED_BY_AGENCY_FEE, PAYMENT_STAGES, PRICING_VERIFIED, REFUND_POLICY_URL } from './pricing';

const esc = (v: unknown) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type Brand = 'cso' | 'camica';

const THEMES = {
  cso: {
    deep: '#3D1A6E', mid: '#6B3FA0', lav: '#E8E0F5', tint: '#F4EFFB', bg: '#FDFAF7',
    name: 'Canadian Surrogacy Options',
    title: 'Executive Director, Canadian Surrogacy Options',
    applyUrl: 'https://portal.canadiansurrogacyoptions.com/register',
    consultUrl: 'https://calendly.com/cso-robyn',
    sentenceKicker: 'Canadian Surrogacy Options',
  },
  camica: {
    deep: '#1C4F58', mid: '#2D7A87', lav: '#D4EDEB', tint: '#EAF4F3', bg: '#FAF6EE',
    name: 'Camica',
    title: 'Founder, Camica',
    applyUrl: 'https://portal.canadiansurrogacyoptions.com/camica/register',
    consultUrl: 'https://calendly.com/cso-robyn/camica-consult',
    sentenceKicker: 'Camica',
  },
} as const;
type Theme = (typeof THEMES)[Brand];

function pathwayBlock(p: PathwayEstimate, t: Theme): string {
  const suggested = p.agencyTiers.find(t => t.suggested)!;
  const feeText = exact(suggested.from, suggested.currency);
  const rows = p.journey.items
    .filter(i => i.covered || i.high > 0)
    .map(i => {
      const amount = i.covered
        ? `<span style="color:#2f7d4f">Covered by provincial health insurance</span>`
        : `${cad(i.low)} to ${cad(i.high)}`;
      return `<tr><td style="padding:6px 12px 6px 0;color:#444;font-size:14px">${esc(i.label)}</td><td style="padding:6px 0;text-align:right;white-space:nowrap;font-size:14px;color:${t.deep}">${amount}</td></tr>`;
    })
    .join('');

  const donor = p.donor
    ? `<p style="margin:14px 0 0;font-size:14px;color:#444"><strong>Egg donation (Little Miracles):</strong> agency fee ${exact(p.donor.agencyFee.low)} to ${exact(p.donor.agencyFee.high)} plus HST. A typical donor cycle all in is ${exact(p.donor.cycleTotal.low)} to ${exact(p.donor.cycleTotal.high)}, and higher for a non-local donor.</p>`
    : '';

  return `
  <div style="border:1px solid ${t.lav};border-radius:12px;margin:22px 0;overflow:hidden">
    <div style="background:${t.deep};color:#fff;padding:14px 18px">
      <div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;opacity:.8">${esc(p.kicker)}</div>
      <div style="font-size:19px;font-weight:600">${esc(p.title)}</div>
    </div>
    <div style="padding:16px 18px">
      <p style="margin:0 0 14px;font-size:14px;color:#444;line-height:1.6">${esc(p.summary)}</p>

      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${t.mid}"><strong>1. What you pay the agency</strong></p>
      <p style="margin:0 0 6px;font-size:15px;color:${t.deep}"><strong>${esc(suggested.name)}: from ${esc(feeText)}</strong></p>
      <p style="margin:0 0 6px;font-size:14px;color:#444">${esc(p.suggestedReason)}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#666">${esc(p.agencyNote)}</p>
      ${p.id === 'canadian' ? `<p style="margin:8px 0;padding:10px 12px;background:${t.tint};border-radius:8px;font-size:14px;color:${t.deep}"><strong>Paid in three equal stages, not all upfront:</strong> ${esc(exact(Math.round(p.agencyCAD / 3)))} at ${PAYMENT_STAGES.map(st => esc(st.name.toLowerCase())).join(', then ')}, plus HST. Our refund policy is published in writing: <a href="https://canadiansurrogacyoptions.com${REFUND_POLICY_URL}" style="color:${t.mid}">read it here</a>.</p>` : ''}
      <ul style="margin:6px 0 16px;padding-left:18px;font-size:13px;color:#444">${suggested.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul>

      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${t.mid}"><strong>2. What you pay for the journey itself</strong></p>
      <p style="margin:0 0 6px;font-size:13px;color:#666">Paid to your surrogate, clinic, lawyers and insurers, not to us.</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin:8px 0 0;font-size:15px;color:${t.deep}"><strong>Journey total: ${cad(p.journey.low)} to ${cad(p.journey.high)}</strong></p>
      ${donor}

      <div style="background:${t.lav};border-radius:10px;padding:14px 16px;margin-top:16px">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${t.mid}">All in, estimated (CAD)</div>
        <div style="font-size:22px;font-weight:600;color:${t.deep}">${cad(p.allIn.low)} to ${cad(p.allIn.high)}</div>
      </div>
    </div>
  </div>`;
}

export function buildEstimateEmail(opts: {
  firstName: string;
  answers: QuizAnswers;
  estimates: PathwayEstimate[];
  brand?: Brand;
}): { subject: string; html: string } {
  const { firstName, answers, estimates, brand = 'cso' } = opts;
  const t = THEMES[brand];
  const concern = CONCERN_NOTES[answers.concern];

  const html = `<!doctype html><html><body style="margin:0;background:${t.bg};font-family:Arial,Helvetica,sans-serif;color:#333">
  <div style="max-width:640px;margin:0 auto;padding:28px 20px">
    <p style="font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:${t.mid};margin:0 0 6px">${esc(t.sentenceKicker)}</p>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;color:${t.deep};margin:0 0 14px">Your written next step, ${esc(firstName)}</h1>

    <p style="font-size:15px;line-height:1.7">Hi ${esc(firstName)}, I grew up in this field, and the question I get asked most is about money. So here it is, written down, with nothing hidden. You do not need a call to read any of this. If you want one after, I am happy to talk.</p>

    <p style="font-size:15px;line-height:1.7;background:#fff;border-left:4px solid ${t.mid};padding:12px 14px;margin:18px 0"><strong>${esc(concern.title)}.</strong> ${esc(concern.body)}</p>

    ${estimates.filter(e => e.available).map(p => pathwayBlock(p, t)).join('')}
    ${estimates.some(e => !e.available) ? `<p style="font-size:14px;color:#555;line-height:1.6"><s>Camica Hybrid Pathway</s>: currently not offered. Ask me what the closest alternative looks like for you.</p>` : ''}

    <h2 style="font-family:Georgia,serif;font-weight:400;font-size:21px;color:${t.deep};margin:26px 0 6px">What the agency fee does not cover</h2>
    <ul style="padding-left:18px;font-size:14px;line-height:1.7;color:#444">${NOT_COVERED_BY_AGENCY_FEE.map(i => `<li>${esc(i)}</li>`).join('')}</ul>

    <p style="font-size:13px;line-height:1.6;color:#666">These are ranges, not quotes. Agency fees were last checked in ${esc(PRICING_VERIFIED)}. US figures are converted to CAD at 1 USD = 1.36 CAD and rounded to the nearest $1,000. Your own numbers will move with your clinic, your surrogate and your lawyers, and your final written estimate separates agency fees from client expenses line by line.</p>

    <h2 style="font-family:Georgia,serif;font-weight:400;font-size:21px;color:${t.deep};margin:26px 0 6px">What happens next</h2>
    <ol style="padding-left:18px;font-size:14px;line-height:1.8;color:#444">
      <li><strong>Start your profile</strong> whenever you are ready. It takes about 10 minutes: <a href="${t.applyUrl}" style="color:${t.mid}">begin your application</a>.</li>
      <li><strong>Reply to this email</strong> with any question about a line item. A real person answers, usually the same day.</li>
      <li><strong>A call is optional.</strong> If you would rather talk it through, <a href="${t.consultUrl}" style="color:${t.mid}">book a time with me</a>.</li>
    </ol>

    <p style="font-size:15px;line-height:1.7">If you ever want a more personal, concierge-level experience, with me involved at every stage, just say the word.</p>

    <p style="font-size:15px;line-height:1.7;margin-top:22px">With love,<br><span style="font-family:Georgia,serif;font-size:20px;font-style:italic;color:${t.deep}">Robyn Price</span><br><span style="font-size:13px;color:#666">${esc(t.title)}</span></p>
    <p style="font-family:Georgia,serif;font-style:italic;color:${t.mid};font-size:15px;margin-top:18px">from hope to heartbeat to home</p>
  </div></body></html>`;

  return { subject: `Your written surrogacy cost breakdown, ${firstName}`, html };
}
