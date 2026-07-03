'use client';

import { useState, useEffect } from 'react';
import { trackLead } from '@/lib/track';
import styles from '@/app/qualify/qualify.module.css';
import ExpenseCalculator from '@/app/qualify/ExpenseCalculator';

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

type Outcome = 'pass' | 'soft_fail' | 'hard_fail';

interface Option {
  value: string;
  label: string;
  result?: Outcome;
  message?: string;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: 'radio' | 'checkbox';
  options: Option[];
}

// Canadian surrogate eligibility. Framed for Canada's altruistic model
// (no fee; eligible expenses reimbursed), not US compensation rules.
const QUESTIONS: Question[] = [
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'Many clinics prefer surrogates to be 21 to 45, but we often work with women into their late 40s depending on health, history, and the clinic.',
    type: 'radio',
    options: [
      { value: 'under21', label: 'Under 21', result: 'hard_fail', message: 'Clinics in Canada generally require surrogates to be at least 21. If you are close, reach out and we can talk through your timeline.' },
      { value: '21-29', label: '21 to 29', result: 'pass' },
      { value: '30-35', label: '30 to 35', result: 'pass' },
      { value: '36-41', label: '36 to 41', result: 'pass' },
      { value: '42-45', label: '42 to 45', result: 'pass' },
      { value: '46-49', label: '46 to 49', result: 'soft_fail', message: 'This can still be possible with the right health profile, history, and clinic. We work with women in this range, so please reach out for a real conversation.' },
      { value: 'over49', label: 'Over 49', result: 'soft_fail', message: 'This becomes more limited, but not every situation is the same. Reach out and we can tell you honestly what may still be possible.' },
    ],
  },
  {
    id: 'previous_birth',
    title: 'Have you previously given birth?',
    subtitle: 'A prior healthy pregnancy is still the most common path, but there can be exceptions with extra screening and medical steps.',
    type: 'radio',
    options: [
      { value: 'yes_child_in_care', label: 'Yes, and my child is in my care', result: 'pass' },
      { value: 'yes_not_in_care', label: 'Yes, but my child is not in my care', result: 'soft_fail', message: 'This may still be possible, but we would want to understand the full situation before saying yes or no.' },
      { value: 'pregnant_first', label: 'I am pregnant with my first right now', result: 'soft_fail', message: 'You would want to complete your own pregnancy first, then we can talk once you are through delivery and recovery.' },
      { value: 'no_not_yet', label: 'No, I have not given birth before', result: 'soft_fail', message: 'This is less common and involves more screening, more medical review, and the right clinic fit, but it can be possible. Please reach out if this is your situation.' },
    ],
  },
  {
    id: 'health',
    title: 'How would you describe your overall physical health?',
    type: 'radio',
    options: [
      { value: 'excellent', label: 'Excellent, no chronic conditions', result: 'pass' },
      { value: 'good', label: 'Good, minor or well-managed conditions', result: 'pass' },
      { value: 'some', label: 'I have some ongoing health challenges', result: 'soft_fail', message: 'Many conditions are perfectly compatible with surrogacy. It depends on the specifics. Reach out and let our team and the clinic evaluate your situation.' },
      { value: 'serious', label: 'I have serious or complex health conditions', result: 'hard_fail', message: 'Complex conditions that could affect pregnancy safety are a concern, and your wellbeing always comes first. That said, a conversation with our team may still help clarify things.' },
    ],
  },
  {
    id: 'bmi',
    title: 'What is your approximate BMI?',
    subtitle: 'Most Canadian clinics ask for a BMI under about 35. Search "BMI calculator" if you are unsure.',
    type: 'radio',
    options: [
      { value: 'under19', label: 'Under 19', result: 'soft_fail', message: 'A very low BMI can affect fertility treatment outcomes. Working with your doctor toward a healthy range would strengthen your application.' },
      { value: '19-29', label: '19 to 29', result: 'pass' },
      { value: '30-34', label: '30 to 34', result: 'pass' },
      { value: '35-37', label: '35 to 37', result: 'soft_fail', message: 'Many clinics ask for a BMI around 35 or under. You are close, and small sustainable changes can make a real difference.' },
      { value: 'over37', label: 'Over 37', result: 'hard_fail', message: 'A BMI in clinic range, often around 35 or under, is a clinical requirement at most fertility clinics. Many women work toward this and come back when the timing is right.' },
    ],
  },
  {
    id: 'smoking',
    title: 'Do you currently smoke, vape, or use cannabis?',
    subtitle: 'Being substance-free is required for fertility treatment and a healthy pregnancy.',
    type: 'radio',
    options: [
      { value: 'none', label: 'No, I do not use any of these', result: 'pass' },
      { value: 'quit_over6', label: 'I used to, but I have been free for over 6 months', result: 'pass' },
      { value: 'quit_under6', label: 'I recently quit (under 6 months)', result: 'soft_fail', message: 'Most programs ask for around 6 months smoke and vape free before screening. You are on the right path.' },
      { value: 'smoke_vape', label: 'I currently smoke or vape', result: 'soft_fail', message: 'Being smoke and vape free is required, but many surrogates have quit specifically for this journey. A few months free can make a big difference.' },
      { value: 'cannabis', label: 'I use cannabis (occasionally or regularly)', result: 'soft_fail', message: 'Cannabis use is not compatible with screening and fertility treatment. A few months free is typically required, so let us talk about your timeline.' },
    ],
  },
  {
    id: 'medications',
    title: 'Are you currently taking any psychiatric medications?',
    subtitle: 'This includes antidepressants, antipsychotics, mood stabilizers, or ADHD medications.',
    type: 'radio',
    options: [
      { value: 'none', label: 'No', result: 'pass' },
      { value: 'antidepressant_low', label: 'Yes, a low-dose antidepressant (for example for anxiety)', result: 'soft_fail', message: 'Many surrogates take low-dose antidepressants and go on to have wonderful journeys. This is reviewed individually, so please do not let it stop you from reaching out.' },
      { value: 'other_psych', label: 'Yes, another type of psychiatric medication', result: 'soft_fail', message: 'Eligibility depends on the specific medication and dose, and is reviewed individually with the clinic. The best next step is a conversation.' },
    ],
  },
  {
    id: 'residency',
    title: 'Do you live in Canada with provincial health coverage?',
    subtitle: 'Your pregnancy care is covered by your provincial health plan, which is part of what makes a Canadian journey work.',
    type: 'radio',
    options: [
      { value: 'citizen_pr', label: 'Yes, I am a citizen or permanent resident with provincial coverage', result: 'pass' },
      { value: 'covered_other', label: 'I live in Canada with provincial health coverage on another status', result: 'pass' },
      { value: 'no_coverage', label: 'I live in Canada but do not currently have provincial coverage', result: 'soft_fail', message: 'Provincial health coverage matters because it covers your pregnancy care. If your coverage is in progress, reach out and we will talk through your timing.' },
      { value: 'us', label: 'I live in the United States', result: 'pass' },
      { value: 'outside', label: 'I live outside Canada and the US', result: 'soft_fail', message: 'We support surrogates living in Canada and, currently, the United States. If you are elsewhere, reach out and we will talk honestly about what is possible.' },
    ],
  },
  {
    id: 'support',
    title: 'Do you have a partner or family member who supports your decision?',
    subtitle: 'This is a meaningful journey, and having people in your corner makes a real difference.',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes, I have strong support from people close to me', result: 'pass' },
      { value: 'some', label: 'Sort of, some people in my life are on board', result: 'soft_fail', message: 'A clear support network is helpful, but not always a hard requirement. We would love to talk through your situation.' },
      { value: 'no', label: 'Not really, I would be doing this mostly on my own', result: 'soft_fail', message: 'Surrogacy without a strong support system can be a lot to carry. It is not an automatic disqualifier, but it is worth a real conversation.' },
    ],
  },
  {
    id: 'motivation',
    title: 'What draws you to surrogacy?',
    subtitle: 'Select all that apply. There are no wrong answers.',
    type: 'checkbox',
    options: [
      { value: 'help_family', label: 'I want to help someone build their family' },
      { value: 'enjoy_pregnancy', label: 'I genuinely love being pregnant' },
      { value: 'give_back', label: 'I feel called to give back' },
      { value: 'meaningful', label: 'I want to do something deeply meaningful' },
      { value: 'feels_right', label: 'It just feels right for me' },
    ],
  },
];

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
    const quizAnswers = QUESTIONS.map((q) => {
      if (q.type === 'checkbox') {
        const picked = q.options.filter((o) => motivation.includes(o.value)).map((o) => o.label);
        return picked.length ? `${q.title} ${picked.join('; ')}` : null;
      }
      const a = answers[q.id];
      if (!a) return null;
      const label = q.options.find((o) => o.value === a.value)?.label || a.value;
      const flag = a.result && a.result !== 'pass' ? ` [${a.result}]` : '';
      return `${q.title} ${label}${flag}`;
    }).filter(Boolean);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          phone,
          role: 'Surrogate',
          captchaToken,
          website,
          sourceLabel: 'Surrogate qualify quiz',
          quizAnswers,
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
                    <a href="/gallery" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
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

            <div className={styles.formCard}>
              {done ? (
                <div className={styles.success}>
                  <h3 className={styles.successTitle}>Thank you, {firstName}.</h3>
                  <p className={styles.successText}>
                    We&apos;ve got your details. Robyn or a member of the team will reach out
                    personally, usually the same day.
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
