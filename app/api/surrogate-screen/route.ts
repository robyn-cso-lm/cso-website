import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/graphMail';
import { subscribeAndTag } from '@/lib/mailchimp';
import { capturePortalLead } from '@/lib/portalLead';
import { MOTIVATION_IDS, QUESTIONS, scoreScreen } from '@/lib/surrogateScreen';
import { buildSurrogateResultEmail } from '@/lib/surrogateScreenEmail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROBYN = 'robyn@canadiansurrogacyoptions.com';
const SOURCE_PATH = '/qualify';

const esc = (v: unknown) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: NextRequest) {
  try {
    const { firstName, email, phone, answers, motivation, captchaToken, website, utm: rawUtm } = await req.json();

    if (website) return NextResponse.json({ success: true }); // honeypot

    if (!(await verifyRecaptcha(captchaToken))) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
    }

    const name = typeof firstName === 'string' ? firstName.trim().slice(0, 80) : '';
    const mail = typeof email === 'string' ? email.trim().slice(0, 200) : '';
    const tel = typeof phone === 'string' ? phone.trim().slice(0, 40) : '';
    if (!name || !mail) return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    if (!EMAIL_RE.test(mail)) return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });

    // Score on the server: never trust a result sent by the browser.
    const scored = answers && typeof answers === 'object' ? scoreScreen(answers as Record<string, unknown>) : null;
    if (!scored) return NextResponse.json({ error: 'Please answer every question first.' }, { status: 400 });
    const { tier, hard, soft, lines } = scored;

    const picked: string[] = Array.isArray(motivation)
      ? motivation.filter((m: unknown): m is string => typeof m === 'string' && MOTIVATION_IDS.includes(m))
      : [];
    const motivationLabels = QUESTIONS.find(q => q.id === 'motivation')!.options
      .filter(o => picked.includes(o.value))
      .map(o => o.label);

    // Ad attribution
    const utm: Record<string, string> = {};
    if (rawUtm && typeof rawUtm === 'object') {
      for (const [k, v] of Object.entries(rawUtm as Record<string, unknown>).slice(0, 8)) {
        if (k.startsWith('utm_') && k.length <= 30 && typeof v === 'string') utm[k] = v.slice(0, 100);
      }
    }
    const utmQuery = new URLSearchParams(utm).toString();
    const sourcePath = utmQuery ? `${SOURCE_PATH}?${utmQuery}` : SOURCE_PATH;
    const utmLine = Object.keys(utm).length ? Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(', ') : 'direct / organic';

    const label = tier === 'green' ? 'GREEN' : tier === 'yellow' ? 'YELLOW' : 'RED';
    const result = buildSurrogateResultEmail({ firstName: name, tier, notes: [...hard, ...soft] });

    const steps = await Promise.allSettled([
      // 1. The result and what happens next, straight to her.
      sendMail(mail, result.subject, result.html),
      // 2. Priority-tagged heads-up to Robyn so the team knows who to call first.
      sendMail(
        ROBYN,
        `[${label}] Surrogate screen: ${name}${utm.utm_source ? ` (${utm.utm_source})` : ''}`,
        `<p><strong>${esc(name)}</strong> finished the surrogate screening quiz. Priority: <strong>${label}</strong>${
          tier === 'green' ? ' (call first)' : tier === 'yellow' ? ' (worth a conversation)' : ' (gentle conversation, may not qualify yet)'
        }.</p>
         <ul><li>Email: ${esc(mail)}</li>${tel ? `<li>Phone: ${esc(tel)}</li>` : ''}<li>Came from: ${esc(utmLine)}</li></ul>
         <p><strong>Her answers</strong></p><ul>${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
         ${motivationLabels.length ? `<p><strong>What draws her:</strong> ${esc(motivationLabels.join('; '))}</p>` : ''}
         <p>She was emailed her result and next steps automatically.</p>`,
      ),
      subscribeAndTag({
        email: mail,
        firstName: name,
        mergeFields: { MMERGE3: 'Surrogate' },
        tags: ['Surrogate', 'Surrogate Lead', 'Website Quiz', 'Qualify Quiz', `Qualify: ${tier}`],
        context: 'surrogate-screen',
      }),
      capturePortalLead({
        type: 'surrogate',
        email: mail,
        firstName: name,
        phone: tel || undefined,
        source: 'website_qualify_quiz',
        sourceUrl: sourcePath,
        rawPayload: { tier, utm, answers, motivation: picked },
      }),
    ]);

    steps.forEach((r, i) => {
      if (r.status === 'rejected') console.error('[surrogate-screen] step failed', { step: i, error: r.reason });
    });

    return NextResponse.json({ success: true, emailed: steps[0].status === 'fulfilled', tier });
  } catch (err) {
    console.error('[surrogate-screen] Error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
