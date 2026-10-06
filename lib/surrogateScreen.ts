/**
 * Surrogate screening quiz: questions and scoring.
 *
 * Shared by the /qualify page and /api/surrogate-screen so the server scores
 * answers itself and never trusts a result sent by the browser.
 */

export type Outcome = 'pass' | 'soft_fail' | 'hard_fail';

export interface Option {
  value: string;
  label: string;
  result?: Outcome;
  message?: string;
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  type: 'radio' | 'checkbox';
  options: Option[];
}

// Canadian surrogate eligibility. Framed for Canada's altruistic model
// (no fee; eligible expenses reimbursed), not US compensation rules.
export const QUESTIONS: Question[] = [
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

export type Tier = 'green' | 'yellow' | 'red';

export const MOTIVATION_IDS = ['help_family', 'enjoy_pregnancy', 'give_back', 'meaningful', 'feels_right'];

/** answers: question id -> chosen option value. Returns null if any scored question is missing or invalid. */
export function scoreScreen(answers: Record<string, unknown>): {
  tier: Tier;
  hard: string[];
  soft: string[];
  lines: string[];
} | null {
  const hard: string[] = [];
  const soft: string[] = [];
  const lines: string[] = [];
  for (const q of QUESTIONS) {
    if (q.type !== 'radio') continue;
    const v = answers[q.id];
    const opt = typeof v === 'string' ? q.options.find(o => o.value === v) : undefined;
    if (!opt) return null;
    lines.push(`${q.title} ${opt.label}${opt.result && opt.result !== 'pass' ? ` [${opt.result}]` : ''}`);
    if (opt.result === 'hard_fail' && opt.message) hard.push(opt.message);
    else if (opt.result === 'soft_fail' && opt.message) soft.push(opt.message);
  }
  const tier: Tier = hard.length > 0 ? 'red' : soft.length > 0 ? 'yellow' : 'green';
  return { tier, hard, soft, lines };
}

/**
 * What happens after she applies. Durations are only shown when set, so we never
 * publish a timeline Robyn has not confirmed.
 * TODO(Robyn): add `duration` (for example "about a week") to each step you want shown.
 */
export const AFTER_APPLYING: { title: string; body: string; duration?: string }[] = [
  { title: 'We read it', body: 'A real person on our team reviews your answers personally, usually the same day.' },
  { title: 'We talk', body: 'A relaxed conversation to get to know you. No pressure, and you can ask us anything.' },
  { title: 'Your matches', body: 'We hand-pick families who fit you, and you choose.' },
  { title: 'Medical screening', body: 'The fertility clinic handles it, and the intended parents pay for it.' },
  { title: 'Your own lawyer', body: 'Independent legal advice, paid for by the intended parents, before anything proceeds.' },
  { title: 'Your journey', body: 'Transfer, pregnancy and birth, with our support team beside you the whole way.' },
];
