'use client';

import { useEffect, useRef, useState } from 'react';
import CountUp from '@/components/CountUp';
import {
  CONCERN_NOTES,
  QUESTIONS,
  buildAllEstimates,
  cad,
  exact,
  parseAnswers,
  type PathwayEstimate,
  type QuizAnswers,
} from '@/lib/costQuiz';
import { NOT_COVERED_BY_AGENCY_FEE, PRICING_VERIFIED } from '@/lib/pricing';
import { trackLead, trackQuizComplete, trackSchedule, trackStartApplication } from '@/lib/track';
import styles from './quiz.module.css';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function loadRecaptcha() {
  if (!SITE_KEY || document.getElementById('recaptcha-script')) return;
  const s = document.createElement('script');
  s.id = 'recaptcha-script';
  s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  s.async = true;
  document.head.appendChild(s);
}

async function getToken(action: string): Promise<string | null> {
  if (!SITE_KEY || !window.grecaptcha) return null;
  try {
    return await window.grecaptcha.execute(SITE_KEY, { action });
  } catch {
    return null;
  }
}

const roundK = (n: number) => Math.round(n / 1000) * 1000;

// ── One pathway's full breakdown ─────────────────────────────────────────────
function PathwayCard({ p }: { p: PathwayEstimate }) {
  const suggested = p.agencyTiers.find(t => t.suggested)!;

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <p className={styles.cardKicker}>{p.kicker}</p>
        <h3 className={styles.cardTitle}>{p.title}</h3>
      </header>

      <div className={styles.cardBody}>
        <p className={styles.cardSummary}>{p.summary}</p>

        {/* 1. Agency */}
        <section className={styles.block}>
          <h4 className={styles.blockTitle}><span>1</span> What you pay the agency</h4>
          <ul className={styles.tiers}>
            {p.agencyTiers.map(t => (
              <li key={t.name} className={`${styles.tier} ${t.suggested ? styles.tierSuggested : ''}`}>
                <div className={styles.tierTop}>
                  <div>
                    <strong>{t.name}</strong>
                    {t.suggested && p.agencyTiers.length > 1 && <em className={styles.pill}>Suggested for you</em>}
                    <div className={styles.tierFor}>{t.forWhom}</div>
                  </div>
                  <div className={styles.tierPrice}>from {exact(t.from, t.currency)}</div>
                </div>
                {t.suggested && (
                  <details className={styles.more}>
                    <summary>What is included</summary>
                    <ul>{t.includes.map(i => <li key={i}>{i}</li>)}</ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
          {p.agencyTiers.length > 1 && <p className={styles.reason}>{p.suggestedReason}</p>}
          <p className={styles.fine}>{p.agencyNote}</p>
        </section>

        {/* 2. Journey */}
        <section className={styles.block}>
          <h4 className={styles.blockTitle}><span>2</span> What you pay for the journey itself</h4>
          <p className={styles.fine}>Paid to your surrogate, clinic, lawyers and insurers, not to us.</p>
          <p className={styles.range}>
            {cad(p.journey.low)} <span>to</span> {cad(p.journey.high)}
          </p>
          <details className={styles.more}>
            <summary>See every line</summary>
            <table className={styles.lines}>
              <tbody>
                {p.journey.items.map(i => (
                  <tr key={i.label}>
                    <td>{i.label}</td>
                    <td>
                      {i.covered ? (
                        <span className={styles.covered}>Covered by provincial health insurance</span>
                      ) : i.low === i.high ? (
                        cad(i.low)
                      ) : (
                        `${cad(i.low)} to ${cad(i.high)}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>

        {/* 3. Donor */}
        {p.donor && (
          <section className={styles.block}>
            <h4 className={styles.blockTitle}><span>3</span> Egg donation, through Little Miracles</h4>
            <p className={styles.range}>
              {exact(p.donor.cycleTotal.low)} <span>to</span> {exact(p.donor.cycleTotal.high)}
            </p>
            <p className={styles.fine}>
              A typical all-in donor cycle, higher for a non-local donor. Little Miracles&rsquo; own
              agency fee, {exact(p.donor.agencyFee.low)} to {exact(p.donor.agencyFee.high)} plus HST, is
              part of this.
            </p>
          </section>
        )}

        {/* Total */}
        <div className={styles.total}>
          <div className={styles.totalLabel}>All in, estimated</div>
          <div className={styles.totalNum}>
            <CountUp end={roundK(p.allIn.low)} prefix="$" /> <span>to</span>{' '}
            <CountUp end={roundK(p.allIn.high)} prefix="$" />
            <small> CAD</small>
          </div>
          <div className={styles.fine}>
            Agency fee for {suggested.name}
            {p.agencyTiers.length > 1 ? ' (suggested)' : ''}, plus journey costs
            {p.donor ? ', plus egg donation' : ''}. HST on agency fees is additional.
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function CostQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [picked, setPicked] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<null | { emailed: boolean }>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const total = QUESTIONS.length;
  const done = step >= total;
  const complete = done ? parseAnswers(answers) : null;
  const estimates = complete ? buildAllEstimates(complete) : [];

  useEffect(() => { loadRecaptcha(); }, []);

  // Move focus to the new heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (step > 0 || answers.route) headingRef.current?.focus({ preventScroll: true });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (done && complete) {
      trackQuizComplete('surrogacy_costs');
      wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(value: string) {
    const q = QUESTIONS[step];
    setPicked(value);
    setAnswers(prev => ({ ...prev, [q.key]: value }));
    window.setTimeout(() => {
      setPicked(null);
      setStep(s => s + 1);
    }, 220);
  }

  function restart() {
    setStep(0);
    setSent(null);
    setError('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const captchaToken = await getToken('cost_quiz');
      const res = await fetch('/api/cost-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, phone, answers: complete, captchaToken, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      trackLead({ type: 'Intended Parent', source: 'cost_quiz' });
      setSent({ emailed: data.emailed !== false });
    } catch {
      setError('We could not reach the server. Please try again.');
    } finally {
      setSending(false);
    }
  }

  // ── Questions ──
  if (!done) {
    const q = QUESTIONS[step];
    return (
      <div className={styles.quiz} role="group" aria-labelledby="quiz-q">
        <div className={styles.progress} aria-hidden="true">
          <div className={styles.progressBar} style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <div key={step} className={styles.step}>
          <p className={styles.stepCount}>Question {step + 1} of {total}</p>
          <h2 id="quiz-q" ref={headingRef} tabIndex={-1} className={styles.question}>{q.title}</h2>
          {q.sub && <p className={styles.questionSub}>{q.sub}</p>}
          <div className={styles.options} role="radiogroup" aria-labelledby="quiz-q">
            {q.options.map(o => (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={answers[q.key] === o.value || picked === o.value}
                className={`${styles.option} ${picked === o.value || (picked === null && answers[q.key] === o.value) ? styles.optionOn : ''}`}
                onClick={() => choose(o.value)}
              >
                <span className={styles.optionLabel}>{o.label}</span>
                {o.sub && <span className={styles.optionSub}>{o.sub}</span>}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>
              &larr; Back
            </button>
          )}
        </div>
        <p className={styles.reassure}>About two minutes. No call, no pressure.</p>
      </div>
    );
  }

  // ── Results ──
  const concern = complete ? CONCERN_NOTES[complete.concern] : null;

  return (
    <div className={styles.resultsWrap} ref={wrapRef}>
      <div className={styles.results}>
        <div className={styles.resultsHead}>
          <h2 id="quiz-q" ref={headingRef} tabIndex={-1} className={styles.resultsTitle}>
            Here is what your journey could cost
          </h2>
          <p className={styles.resultsSub}>
            Ranges, not quotes, in Canadian dollars. U.S. figures are converted at 1 USD = 1.36 CAD
            and rounded to the nearest $1,000. Agency fees last checked {PRICING_VERIFIED}.
          </p>
          <button type="button" className={styles.linkBtn} onClick={restart}>Change my answers</button>
        </div>

        {concern && (
          <div className={styles.concern}>
            <strong>{concern.title}.</strong> {concern.body}
          </div>
        )}

        <div className={styles.cards}>
          {estimates.map(p => <PathwayCard key={p.id} p={p} />)}
        </div>

        <div className={styles.notCovered}>
          <h3>What the agency fee never covers</h3>
          <ul>{NOT_COVERED_BY_AGENCY_FEE.map(i => <li key={i}>{i}</li>)}</ul>
        </div>

        {/* Capture */}
        <div className={styles.capture}>
          {!sent ? (
            <>
              <h3 className={styles.captureTitle}>Want this in writing?</h3>
              <p className={styles.captureSub}>
                We will email you this breakdown with your written next step, so you can share it
                with your partner, your clinic or your accountant. You do not need a call.
              </p>
              <form onSubmit={submit} className={styles.form} noValidate>
                <label className={styles.field}>
                  <span>First name</span>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" required />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
                </label>
                <label className={styles.field}>
                  <span>Phone <em>(optional, for text updates)</em></span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
                </label>
                <div className={styles.honey} aria-hidden="true">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label>
                </div>
                {error && <p className={styles.error} role="alert">{error}</p>}
                <button type="submit" className={styles.submit} disabled={sending || !firstName.trim() || !email.trim()}>
                  {sending ? 'Sending...' : 'Send me the written next step'}
                </button>
                <p className={styles.consent}>
                  We will email your breakdown and the occasional helpful note. Unsubscribe any
                  time. See our <a href="/privacy">privacy policy</a>.
                </p>
              </form>
            </>
          ) : (
            <div className={styles.thanks} role="status">
              <h3 className={styles.captureTitle}>
                {sent.emailed ? `Check your inbox, ${firstName.trim()}` : `Thank you, ${firstName.trim()}`}
              </h3>
              <p className={styles.captureSub}>
                {sent.emailed
                  ? 'Your written breakdown is on its way. Reply to that email with any question and a real person will answer.'
                  : 'Your estimate is above, and we have your details. We will follow up personally with your written breakdown.'}
              </p>
              <div className={styles.thanksActions}>
                <a
                  href="https://portal.canadiansurrogacyoptions.com/register"
                  className={styles.submit}
                  onClick={() => trackStartApplication('cost_quiz')}
                >
                  Begin my application
                </a>
                <a
                  href="https://calendly.com/cso-robyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ghost}
                  onClick={() => trackSchedule('cost_quiz')}
                >
                  A call is optional, but I&rsquo;d love to talk
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
