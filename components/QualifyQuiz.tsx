'use client';

import { useState, useEffect } from 'react';
import { trackLead } from '@/lib/track';
import styles from '@/app/qualify/qualify.module.css';

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
// (no fee; eligible expenses reimbursed) — NOT US compensation rules.
const QUESTIONS: Question[] = [
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'Canadian fertility clinics generally ask that surrogates be between 21 and 45.',
    type: 'radio',
    options: [
      { value: 'under21', label: 'Under 21', result: 'hard_fail', message: 'Clinics in Canada generally require surrogates to be at least 21. If you’re close, reach out — we’re happy to talk through your timeline.' },
      { value: '21-29', label: '21–29', result: 'pass' },
      { value: '30-35', label: '30–35', result: 'pass' },
      { value: '36-41', label: '36–41', result: 'pass' },
      { value: '42-45', label: '42–45', result: 'soft_fail', message: 'Some clinics cap first-time surrogates around 42–43, though policies vary. It’s worth a conversation — we’ve seen flexibility in the right circumstances.' },
      { value: 'over45', label: 'Over 45', result: 'hard_fail', message: 'Most Canadian clinics set an upper age limit around 45 for medical safety. If you’re just over, a quick call can clarify whether any clinic options exist.' },
    ],
  },
  {
    id: 'previous_birth',
    title: 'Have you previously given birth, and is that child currently in your care?',
    subtitle: 'A prior healthy pregnancy is a standard requirement for surrogacy in Canada.',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes — I’ve given birth and my child lives with me', result: 'pass' },
      { value: 'birth_no_custody', label: 'I’ve given birth, but my child isn’t in my care', result: 'soft_fail', message: 'Having a child currently in your care is typically expected. We’d want to understand your full situation — please reach out and let’s talk.' },
      { value: 'pregnant_first', label: 'I’m pregnant with my first right now', result: 'soft_fail', message: 'You’ll want to complete your own family first. Once your little one arrives and you’re ready, we’d love to hear from you.' },
      { value: 'no', label: 'No — I haven’t given birth before', result: 'hard_fail', message: 'A previous successful pregnancy is a medical requirement — it helps everyone understand how your body handles pregnancy. We hope your own family journey is a beautiful one.' },
    ],
  },
  {
    id: 'health',
    title: 'How would you describe your overall physical health?',
    type: 'radio',
    options: [
      { value: 'excellent', label: 'Excellent — no chronic conditions', result: 'pass' },
      { value: 'good', label: 'Good — minor or well-managed conditions', result: 'pass' },
      { value: 'some', label: 'I have some ongoing health challenges', result: 'soft_fail', message: 'Many conditions are perfectly compatible with surrogacy — it depends on the specifics. Reach out and let our team and the clinic evaluate; we work with women in all kinds of situations.' },
      { value: 'serious', label: 'I have serious or complex health conditions', result: 'hard_fail', message: 'Complex conditions that could affect pregnancy safety are a concern — your wellbeing always comes first. That said, “serious” is relative, and a call with our team might clarify things.' },
    ],
  },
  {
    id: 'bmi',
    title: 'What is your approximate BMI?',
    subtitle: 'Most Canadian clinics ask for a BMI under about 35. Search “BMI calculator” if you’re unsure.',
    type: 'radio',
    options: [
      { value: 'under19', label: 'Under 19', result: 'soft_fail', message: 'A very low BMI can affect fertility-treatment outcomes. Working with your doctor toward a healthy range would strengthen your application.' },
      { value: '19-29', label: '19–29', result: 'pass' },
      { value: '30-34', label: '30–34', result: 'pass' },
      { value: '35-37', label: '35–37', result: 'soft_fail', message: 'Many clinics ask for a BMI around 35 or under. You’re close — small, sustainable changes can make a real difference, and we’d love to support you toward that goal.' },
      { value: 'over37', label: 'Over 37', result: 'hard_fail', message: 'A BMI in clinic range (often around 35 or under) is a clinical requirement at most fertility clinics. It’s something many women work toward specifically — come back when you’re in range and we’ll be here.' },
    ],
  },
  {
    id: 'smoking',
    title: 'Do you currently smoke, vape, or use cannabis?',
    subtitle: 'Being substance-free is required for fertility treatment and a healthy pregnancy.',
    type: 'radio',
    options: [
      { value: 'none', label: 'No — I don’t use any of these', result: 'pass' },
      { value: 'quit_over6', label: 'I used to, but I’ve been free for over 6 months', result: 'pass' },
      { value: 'quit_under6', label: 'I recently quit (under 6 months)', result: 'soft_fail', message: 'Most programs ask for around 6 months smoke- and vape-free before screening. You’re on the right path — keep going and reach out when you hit that mark.' },
      { value: 'smoke_vape', label: 'I currently smoke or vape', result: 'soft_fail', message: 'Being smoke- and vape-free is required, but many surrogates have quit specifically for this journey. A few months free and you’re eligible — it’s a very achievable goal.' },
      { value: 'cannabis', label: 'I use cannabis (occasionally or regularly)', result: 'soft_fail', message: 'Cannabis use isn’t compatible with screening and fertility treatment. A few months free is typically required — let’s talk about your timeline.' },
    ],
  },
  {
    id: 'medications',
    title: 'Are you currently taking any psychiatric medications?',
    subtitle: 'This includes antidepressants, antipsychotics, mood stabilizers, or ADHD medications.',
    type: 'radio',
    options: [
      { value: 'none', label: 'No', result: 'pass' },
      { value: 'antidepressant_low', label: 'Yes — a low-dose antidepressant (e.g. for anxiety)', result: 'soft_fail', message: 'Many surrogates take low-dose antidepressants and go on to have wonderful journeys. This is reviewed individually — please don’t let it stop you from reaching out.' },
      { value: 'other_psych', label: 'Yes — another type of psychiatric medication', result: 'soft_fail', message: 'Eligibility depends on the specific medication and dose, and is reviewed individually with the clinic. The best next step is a conversation — we’ve helped women navigate this before.' },
    ],
  },
  {
    id: 'residency',
    title: 'Do you live in Canada with provincial health coverage?',
    subtitle: 'Your pregnancy care is covered by your provincial health plan, which is part of what makes a Canadian journey work.',
    type: 'radio',
    options: [
      { value: 'citizen_pr', label: 'Yes — I’m a citizen or permanent resident with provincial coverage', result: 'pass' },
      { value: 'covered_other', label: 'I live in Canada with provincial health coverage on another status', result: 'pass' },
      { value: 'no_coverage', label: 'I live in Canada but don’t currently have provincial coverage', result: 'soft_fail', message: 'Provincial health coverage matters because it covers your pregnancy care. If your coverage is in progress, reach out and we’ll talk through your timing.' },
      { value: 'outside', label: 'I live outside Canada', result: 'hard_fail', message: 'Canadian Surrogacy Options works with surrogates living in Canada. If you’re in the United States, our sister agency Camica may be able to help — see the note below.' },
    ],
  },
  {
    id: 'support',
    title: 'Do you have a partner or family member who supports your decision?',
    subtitle: 'This is a meaningful journey — having people in your corner makes a real difference.',
    type: 'radio',
    options: [
      { value: 'yes', label: 'Yes — I have strong support from people close to me', result: 'pass' },
      { value: 'some', label: 'Sort of — some people in my life are on board', result: 'soft_fail', message: 'A clear support network isn’t a hard requirement, but it matters for your wellbeing. We’d love to talk through your situation — our team is experienced with family dynamics around surrogacy.' },
      { value: 'no', label: 'Not really — I’d be doing this mostly on my own', result: 'soft_fail', message: 'Surrogacy without a strong support system can be a lot to carry. It’s not an automatic disqualifier — let’s have a real conversation about how we can set you up for success.' },
    ],
  },
  {
    id: 'motivation',
    title: 'What draws you to surrogacy?',
    subtitle: 'Select all that apply — there are no wrong answers.',
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
  const [step, setStep] = useState(0); // index into QUESTIONS
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [motivation, setMotivation] = useState<string[]>([]);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadRecaptcha(); }, []);

  const totalSteps = QUESTIONS.length + 1; // welcome + questions
  const progress = showResults
    ? 100
    : !started
    ? 0
    : ((step + 1) / totalSteps) * 100;

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

  // Derive outcome
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
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, phone, role: 'Surrogate', captchaToken, website }),
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
        {/* ── Welcome ── */}
        {!started && !showResults && (
          <div className={`${styles.welcome} ${styles.fadeIn}`}>
            <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
            <h1 className={styles.welcomeTitle}>
              Could surrogacy be<br /><em>right for you?</em>
            </h1>
            <p className={styles.welcomeSub}>
              Answer 8 honest questions and you&rsquo;ll get a personalized result based on
              Canadian eligibility guidelines &mdash; including anything worth working toward.
            </p>
            <p className={styles.welcomeNote}>No pressure. No wrong answers. About 3 minutes.</p>
            <button className={styles.startBtn} onClick={() => { setStarted(true); setStep(0); }}>
              Let&rsquo;s Find Out &rarr;
            </button>
          </div>
        )}

        {/* ── Questions ── */}
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

        {/* ── Results ── */}
        {showResults && (
          <div className={styles.fadeIn}>
            <div className={styles.resultCard}>
              <div className={`${styles.resultBadge} ${cleanPass ? styles.badgePass : hasHardFail ? styles.badgeTalk : styles.badgeSoft}`}>
                {cleanPass ? '💜' : hasHardFail ? '💬' : '✨'}
              </div>
              <h2 className={styles.resultTitle}>
                {cleanPass ? 'You look like a wonderful fit.' : hasHardFail ? 'Let’s have a conversation.' : 'You’re on the right track.'}
              </h2>
              <p className={styles.resultText}>
                {cleanPass
                  ? 'Based on your answers, you appear to meet the core requirements. The next step is a relaxed conversation with Robyn and our team — no commitment, no pressure.'
                  : hasHardFail
                  ? 'There are a couple of things that might be barriers — but we’ve worked with women in all kinds of situations, and a short call often changes the picture entirely.'
                  : 'Most of your answers look great. There are a couple of things to be aware of — and in most cases, we can work through them together.'}
              </p>
            </div>

            {allFeedback.length > 0 && (
              <div className={styles.feedbackCard}>
                <h3 className={styles.feedbackTitle}>
                  {hasHardFail ? 'Here’s what came up — and what we can often do about it:' : 'A couple of things to keep in mind:'}
                </h3>
                {allFeedback.map((msg, i) => (
                  <div className={styles.feedbackItem} key={i}>
                    <div className={styles.feedbackNum}>{i + 1}</div>
                    <p className={styles.feedbackText}>{msg}</p>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.guidelineNote}>
              <p>
                <strong>A note on how surrogacy works in Canada.</strong> Surrogacy here is
                altruistic: you&rsquo;re never paid a fee, but all of your eligible
                pregnancy-related expenses are reimbursed, and your pregnancy care is covered by
                your provincial health plan. CSO follows Canadian guidelines under the Assisted
                Human Reproduction Act, so you&rsquo;re always supported and never out of pocket.
              </p>
            </div>

            <div className={styles.callCard}>
              <p className={styles.callTitle}>
                {cleanPass ? 'Ready to take the next step?' : 'Let’s talk — we sort this out all the time.'}
              </p>
              <p className={styles.callText}>
                {cleanPass
                  ? 'Book a free, relaxed call with Robyn. No commitment — just a conversation.'
                  : 'Our team has helped women in all kinds of situations. A quick call often clears things up.'}
              </p>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.callBtn}>
                Book a Free Call with Robyn
              </a>
            </div>

            {/* Lead form */}
            <div className={styles.formCard}>
              {done ? (
                <div className={styles.success}>
                  <h3 className={styles.successTitle}>Thank you, {firstName}.</h3>
                  <p className={styles.successText}>
                    We&rsquo;ve got your details. Robyn or a member of the team will reach out
                    personally, usually the same day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className={styles.formTitle}>Stay in touch</h3>
                  <p className={styles.formSub}>
                    Leave your details and our team will reach out &mdash; whether you&rsquo;re ready now,
                    have questions, or want to revisit later.
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
                  <p className={styles.privacy}>We&rsquo;ll never share your information. Robyn reads every message personally.</p>
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
