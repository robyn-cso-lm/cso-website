import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { subscribeAndTag } from '@/lib/mailchimp';
import { sendIntendedParentLeadToZapier } from '@/lib/zapier';
import { capturePortalLead } from '@/lib/portalLead';
import { buildAllEstimates, cad, describeAnswers, parseAnswers } from '@/lib/costQuiz';
import { buildEstimateEmail } from '@/lib/costQuizEmail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROBYN = 'robyn@canadiansurrogacyoptions.com';
const SOURCE_PATH = '/surrogacy-costs';
const SOURCE_LABEL = 'Cost quiz: written next step';

const esc = (v: unknown) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: NextRequest) {
  try {
    const { firstName, email, phone, answers: rawAnswers, captchaToken, website } = await req.json();

    if (website) return NextResponse.json({ success: true }); // honeypot

    if (!(await verifyRecaptcha(captchaToken))) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    const name = typeof firstName === 'string' ? firstName.trim().slice(0, 80) : '';
    const mail = typeof email === 'string' ? email.trim().slice(0, 200) : '';
    const tel = typeof phone === 'string' ? phone.trim().slice(0, 40) : '';
    const answers = parseAnswers(rawAnswers);

    if (!name || !mail) return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    if (!EMAIL_RE.test(mail)) return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    if (!answers) return NextResponse.json({ error: 'Please answer every question first.' }, { status: 400 });

    // Never trust numbers from the browser: rebuild the estimate from the answers.
    const estimates = buildAllEstimates(answers);
    const answerLines = describeAnswers(answers);
    const summaryLines = estimates.map(e => `${e.title}: all in ${cad(e.allIn.low)} to ${cad(e.allIn.high)} CAD`);

    const tags = ['IP Lead', 'Cost Quiz', `Cost Quiz: ${answers.route}`];
    if (answers.donor === 'yes') tags.push('Needs Egg Donor');

    const email1 = buildEstimateEmail({ firstName: name, answers, estimates });

    const results = await Promise.allSettled([
      // 1. The written next step, straight to the lead.
      sendMail(mail, email1.subject, email1.html),
      // 2. Heads-up to Robyn with the whole picture.
      sendMail(
        ROBYN,
        `Cost quiz lead: ${name} (${answers.route}, ${answers.timing === 'asap' ? 'ASAP' : answers.timing})`,
        `<p><strong>${esc(name)}</strong> finished the cost quiz and was emailed their written breakdown automatically.</p>
         <ul><li>Email: ${esc(mail)}</li>${tel ? `<li>Phone: ${esc(tel)}</li>` : ''}</ul>
         <p><strong>Their answers</strong></p><ul>${answerLines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
         <p><strong>What they were shown</strong></p><ul>${summaryLines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`,
      ),
      subscribeAndTag({
        email: mail,
        firstName: name,
        mergeFields: { MMERGE3: 'Intended Parent' },
        tags,
        context: 'cost-quiz',
      }),
      sendIntendedParentLeadToZapier({
        formType: 'Cost Quiz',
        firstName: name,
        email: mail,
        phone: tel,
        role: 'Intended Parent',
        message: [...answerLines, ...summaryLines].join(' | ').slice(0, 1500),
        sourcePath: SOURCE_PATH,
        sourceLabel: SOURCE_LABEL,
      }),
      capturePortalLead({
        type: 'ip',
        email: mail,
        firstName: name,
        phone: tel || undefined,
        source: 'website_cost_quiz',
        sourceUrl: SOURCE_PATH,
        rawPayload: { answers, estimates: estimates.map(e => ({ id: e.id, allIn: e.allIn })) },
      }),
    ]);

    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error('[cost-quiz] step failed', { step: i, error: r.reason });
    });

    // The lead is only "delivered" if we could email them their estimate.
    // If that one step failed they still see the estimate on screen.
    return NextResponse.json({ success: true, emailed: results[0].status === 'fulfilled' });
  } catch (err) {
    console.error('[cost-quiz] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
