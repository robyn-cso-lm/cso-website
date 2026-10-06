'use client';

import { useState, useEffect } from 'react';
import { trackLead } from '@/lib/track';
import styles from '@/app/qualify/qualify.module.css';
import ExpenseCalculator from '@/app/qualify/ExpenseCalculator';
import { AFTER_APPLYING, QUESTIONS, type Outcome, type Option, type Question } from '@/lib/surrogateScreen';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const CALENDLY = 'https://calendly.com/cso-robyn';

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

const SCORED = QUESTIONS.filter((q) => q.type === 'radio').length;

type AnswerMap = Record<string, { value: string; result?: Outcome; message?: string }>;

export default function QualifyQuiz() {
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [motivation, setMotivation] = useState<string[]>([]);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadRecaptcha(); }, []);

  const totalSteps = QUESTIONS.length + 1;
  const progress = showResults ? 100 : !started ? 0 : ((step + 1) / totalSteps) * 100;

  function selectOption(q: Question, opt: Option) {
    setAnswers((prev) => ({ ...prev, [q.id]: { value: opt.value, result: opt.result, message: opt.message } }));
  }

  function toggleMotivation(value: string) {
    setMotivation((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function next() {
    if (step === QUESTIONS.length - 1) {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (step === 0) {
      setStarted(false);
    } else {
      setStep((s) => s - 1);
    }
  }

  const current = QUESTIONS[step];
  const isAnswered = current?.type === 'checkbox' ? true : Boolean(answers[current?.id]);

  const hardFails: string[] = [];
  const softFails: string[] = [];
  QUESTIONS.forEach((q) => {
    if (q.type !== 'radio') return;
    const a = answers[q.id];
    if (!a?.message) return;
    if (a.result === 'hard_fail') hardFails.push(a.message);
    else if (a.result === 'soft_fail') softFails.push(a.message);
  });
  const allFeedback = [...hardFails, ...softFails];
  const cleanPass = hardFails.length === 0 && softFails.length === 0;
  const hasHardFail = hardFails.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const captchaToken = await getToken('qualify_quiz');
    try {
      const res = await fetch('/api/surrogate-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          phone,
          captchaToken,
          website,
          answers: Object.fromEntries(Object.entries(answers).map(([id, a]) => [id, a.value])),
          motivation,
          // Ad attribution: which campaign and ad sent this person.
          utm: Object.fromEntries(
            Array.from(new URLSearchParams(window.location.search).entries()).filter(([k]) => k.startsWith('utm_')),
          ),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setDone(true);
      trackLead({ type: 'Surrogate', source: 'qualify_quiz' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.inner}>
        {!started && !showResults && (
          <div className={`${styles.welcome} ${styles.fadeIn}`}>
            <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
            <h1 className={styles.welcomeTitle}>
              Could surrogacy be<br /><em>right for you?</em>
            </h1>
            <p className={styles.welcomeSub}>
              8 quick questions. A real answer at the end — plus a calculator that shows
              what your expense reimbursements could look like (most journeys: $45,000+).
            </p>
            <p className={styles.welcomeNote}>No pressure. No wrong answers. About 2 minutes.</p>
            <button className={styles.startBtn} onClick={() => { setStarted(true); setStep(0); }}>
              Let&apos;s Go &rarr;
            </button>
          </div>
        )}

        {started && !showResults && current && (
          <div className={`${styles.card} ${styles.fadeIn}`} key={current.id}>
            <p className={styles.qCount}>
              {current.type === 'checkbox' ? 'Almost done' : `Question ${step + 1} of ${SCORED}`}
            </p>
            <h2 className={styles.qTitle}>{current.title}</h2>
            {current.subtitle ? <p className={styles.qSub}>{current.subtitle}</p> : <div className={styles.qSpacer} />}

            <div>
              {current.options.map((opt) => {
                const selected =
                  current.type === 'checkbox'
                    ? motivation.includes(opt.value)
                    : answers[current.id]?.value === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                    onClick={() => (current.type === 'checkbox' ? toggleMotivation(opt.value) : selectOption(current, opt))}
                  >
                    <span>{opt.label}</span>
                    {selected && <span className={styles.check}>&#10003;</span>}
                  </button>
                );
              })}
            </div>

            <div className={styles.navRow}>
              <button type="button" className={styles.backBtn} onClick={back}>&larr; Back</button>
              <button type="button" className={styles.nextBtn} onClick={next} disabled={!isAnswered}>
                {step === QUESTIONS.length - 1 ? 'See My Results →' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className={styles.fadeIn}>
            <div className={styles.resultCard}>
              <div className={`${styles.resultBadge} ${cleanPass ? styles.badgePass : hasHardFail ? styles.badgeTalk : styles.badgeSoft}`}>
                {cleanPass ? 'Great fit' : hasHardFail ? 'Let’s talk' : 'So close'}
              </div>
              <h2 className={styles.resultTitle}>
                {cleanPass ? 'You qualify. Let’s go!' : hasHardFail ? 'Let’s talk it through.' : 'You’re closer than you think.'}
              </h2>
              <p className={styles.resultText}>
                {cleanPass
                  ? 'Your answers check every core box. Women like you are exactly who waiting families are hoping for — and the next step takes two minutes: start your application or leave your email and we’ll take it from there.'
                  : hasHardFail
                  ? 'A couple of things could be barriers, but we’ve worked with women in every kind of situation, and a short call often changes the picture entirely.'
                  : 'Most of your answers look great. There are a couple of things to be aware of, and in most cases we can work through them together.'}
              </p>
            </div>

            {allFeedback.length > 0 && (
              <div className={styles.feedbackCard}>
                <h3 className={styles.feedbackTitle}>
                  {hasHardFail ? 'Here is what came up, and what we can often do about it:' : 'A couple of things to keep in mind:'}
                </h3>
                {allFeedback.map((msg, i) => (
                  <div className={styles.feedbackItem} key={i}>
                    <div className={styles.feedbackNum}>{i + 1}</div>
                    <p className={styles.feedbackText}>{msg}</p>
                  </div>
                ))}
              </div>
            )}

            <ExpenseCalculator />

            <div className={styles.guidelineNote}>
              <p>
                <strong>You will never spend a cent of your own money.</strong> Groceries, gas,
                childcare, maternity clothes, prenatal vitamins, travel, lost wages — every
                eligible expense is reimbursed throughout your journey, tax-free, on top of
                pregnancy care covered by your provincial health plan. Canadian surrogacy is
                altruistic under the Assisted Human Reproduction Act — this is reimbursement,
                not payment — and CSO has guided compliant journeys since 1992.
              </p>
            </div>

            <div className={styles.callCard}>
              <p className={styles.callTitle}>
                {cleanPass ? 'Ready? Start your application now.' : 'Let’s talk. We sort this out all the time.'}
              </p>
              <p className={styles.callText}>
                {cleanPass
                  ? 'It takes about 10 minutes, there’s no commitment, and our team reviews every application personally — usually the same day.'
                  : 'Our team has helped women in all kinds of situations. A quick call often clears things up.'}
              </p>
              {cleanPass ? (
                <>
                  <a href="/surrogates#apply" className={styles.callBtn}>
                    Start My Application →
                  </a>
                  <p className={styles.callText} style={{ marginTop: 14, marginBottom: 0 }}>
                    <a href="https://portal.canadiansurrogacyoptions.com/profiles" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                      Meet the families waiting for you
                    </a>
                    {' '}· Prefer to talk first?{' '}
                    <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                      Book a free call with Robyn
                    </a>
                  </p>
                </>
              ) : (
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.callBtn}>
                  Book a Free Call with Robyn
                </a>
              )}
            </div>

            <div className={styles.afterCard}>
              <p className={styles.afterEyebrow}>What happens after you apply</p>
              <ol className={styles.afterList}>
                {AFTER_APPLYING.map((st, i) => (
                  <li key={st.title} className={styles.afterItem}>
                    <span className={styles.afterNum}>{i + 1}</span>
                    <span>
                      <strong>{st.title}</strong>
                      {st.duration ? <em> ({st.duration})</em> : null}
                      <span className={styles.afterBody}>{st.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className={styles.afterFoot}>No phone call is needed to apply, and applying is not a commitment.</p>
            </div>
            <div className={styles.formCard}>
              {done ? (
                <div className={styles.success}>
                  <h3 className={styles.successTitle}>Thank you, {firstName}.</h3>
                  <p className={styles.successText}>
                    Check your inbox: we&apos;ve emailed your result and exactly what happens
                    next. Robyn or a member of the team will also reach out personally,
                    usually the same day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className={styles.formTitle}>Or just send us your email</h3>
                  <p className={styles.formSub}>
                    Not ready to apply this second? Drop your details and Robyn will reach out
                    personally — usually the same day.
                  </p>
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className={styles.formRow}>
                    <div>
                      <label className={styles.label}>First name *</label>
                      <input className={styles.input} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div>
                      <label className={styles.label}>Phone (optional)</label>
                      <input className={styles.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <label className={styles.label}>Email *</label>
                  <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  {error && <p className={styles.error}>{error}</p>}
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Sending...' : 'Send to the CSO Team'}
                  </button>
                  <p className={styles.privacy}>We&apos;ll never share your information. Robyn reads every message personally.</p>
                </form>
              )}
            </div>

            <p className={styles.camicaPointer}>
              Live in the United States? Surrogacy rules and compensation differ there. Our sister
              agency <a href="https://camica.ca" target="_blank" rel="noopener noreferrer">Camica</a> supports US-based journeys.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
