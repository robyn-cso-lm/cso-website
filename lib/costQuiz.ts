/**
 * The /surrogacy-costs quiz: questions, pathway rules and the estimate.
 *
 * Pure functions only, so the browser and the API route compute identical
 * numbers (the server recomputes from the answers and never trusts totals
 * sent by the client).
 */
import { buildBreakdown, toCAD, type LineItem, type Location } from './costEstimate';
import {
  CAMICA_CONCIERGE_FROM,
  CAMICA_HYBRID,
  CAMICA_TIERS,
  CSO_TIERS,
  LM,
} from './pricing';

// ── Answers ──────────────────────────────────────────────────────────────────
export type Route = 'canada' | 'us' | 'unsure';
export type ParentType = 'couple_infertility' | 'same_sex' | 'single' | 'other';
export type EmbryoStatus = 'ontario_clinic' | 'canada_clinic' | 'us_clinic' | 'not_yet';
export type DonorNeed = 'yes' | 'no' | 'unsure';
export type Timing = 'asap' | 'soon' | 'later' | 'exploring';
export type Concern = 'cost' | 'matching' | 'clinic' | 'legal' | 'timeline';

export interface QuizAnswers {
  route: Route;
  location: Location;
  parentType: ParentType;
  embryos: EmbryoStatus;
  donor: DonorNeed;
  timing: Timing;
  concern: Concern;
}

export type QuestionKey = keyof QuizAnswers;

export interface Option { value: string; label: string; sub?: string }
export interface Question { key: QuestionKey; title: string; sub?: string; options: Option[] }

export const QUESTIONS: Question[] = [
  {
    key: 'route',
    title: 'Where are you thinking of building your family?',
    sub: 'No wrong answer. If you are not sure, we will show you both side by side.',
    options: [
      { value: 'canada', label: 'Canada', sub: 'Altruistic surrogacy: your surrogate is reimbursed for her expenses, not paid a fee' },
      { value: 'us', label: 'The U.S.', sub: 'Compensated surrogacy through Camica, our U.S. brand' },
      { value: 'unsure', label: "I'm not sure yet", sub: 'Show me both' },
    ],
  },
  {
    key: 'location',
    title: 'Where do you live?',
    sub: 'Travel for the birth is a real line in the budget, so we count it.',
    options: [
      { value: 'ontario', label: 'Ontario' },
      { value: 'canada_other', label: 'Elsewhere in Canada' },
      { value: 'us_northeast', label: 'U.S. Northeast', sub: 'NY, New England, nearby' },
      { value: 'us_other', label: 'Elsewhere in the U.S.' },
      { value: 'international', label: 'Outside North America' },
    ],
  },
  {
    key: 'parentType',
    title: 'Who is building this family?',
    options: [
      { value: 'couple_infertility', label: 'A couple facing infertility or loss' },
      { value: 'same_sex', label: 'A same-sex couple' },
      { value: 'single', label: 'A single parent by choice' },
      { value: 'other', label: 'Something else', sub: 'Every family is welcome' },
    ],
  },
  {
    key: 'embryos',
    title: 'Do you already have embryos?',
    sub: 'Where they are stored changes shipping costs.',
    options: [
      { value: 'ontario_clinic', label: 'Yes, at an Ontario clinic' },
      { value: 'canada_clinic', label: 'Yes, at another Canadian clinic' },
      { value: 'us_clinic', label: 'Yes, at a U.S. clinic' },
      { value: 'not_yet', label: 'Not yet', sub: 'Embryos still need to be created' },
    ],
  },
  {
    key: 'donor',
    title: 'Will you need an egg donor?',
    sub: 'Donor costs are separate, so they get their own line.',
    options: [
      { value: 'yes', label: 'Yes', sub: 'Through Little Miracles, our egg donation agency' },
      { value: 'no', label: 'No', sub: 'We have our own eggs or donor eggs already' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
  },
  {
    key: 'timing',
    title: 'When would you like to start?',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: 'soon', label: 'In the next 3 to 6 months' },
      { value: 'later', label: 'In 6 to 12 months' },
      { value: 'exploring', label: 'Just exploring for now' },
    ],
  },
  {
    key: 'concern',
    title: 'What worries you most right now?',
    sub: 'We will make sure your written next step speaks to it first.',
    options: [
      { value: 'cost', label: 'The cost' },
      { value: 'matching', label: 'Finding the right surrogate' },
      { value: 'clinic', label: 'Clinic coordination' },
      { value: 'legal', label: 'The legal process' },
      { value: 'timeline', label: 'How long it will take' },
    ],
  },
];

/** Whitelist check so the API never trusts arbitrary strings. */
export function parseAnswers(input: unknown): QuizAnswers | null {
  if (!input || typeof input !== 'object') return null;
  const src = input as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const q of QUESTIONS) {
    const v = src[q.key];
    if (typeof v !== 'string' || !q.options.some(o => o.value === v)) return null;
    out[q.key] = v;
  }
  return out as unknown as QuizAnswers;
}

export function describeAnswers(a: QuizAnswers): string[] {
  return QUESTIONS.map(q => {
    const opt = q.options.find(o => o.value === a[q.key]);
    return `${q.title} ${opt?.label ?? a[q.key]}`;
  });
}

// ── Estimate ─────────────────────────────────────────────────────────────────
export type PathwayId = 'canadian' | 'hybrid' | 'us';

export interface AgencyTierView {
  name: string;
  from: number;
  currency: 'CAD' | 'USD';
  forWhom: string;
  includes: string[];
  suggested: boolean;
}

export interface PathwayEstimate {
  id: PathwayId;
  title: string;
  kicker: string;
  summary: string;
  agencyTiers: AgencyTierView[];
  agencyNote: string;
  /** Fee for the suggested tier, in CAD, before tax. */
  agencyCAD: number;
  suggestedReason: string;
  journey: { low: number; high: number; items: LineItem[] };
  donor: { agencyFee: { low: number; high: number }; cycleTotal: { low: number; high: number } } | null;
  allIn: { low: number; high: number };
  hasConcierge: boolean;
}

const isCanadianResident = (l: Location) => l === 'ontario' || l === 'canada_other';

export function pathwaysFor(a: QuizAnswers): PathwayId[] {
  const canadian = isCanadianResident(a.location);
  const wantsSpeed = a.timing === 'asap' || a.concern === 'matching' || a.concern === 'timeline';

  if (a.route === 'canada') return canadian && wantsSpeed ? ['canadian', 'hybrid'] : ['canadian'];
  if (a.route === 'us') return ['us'];
  return canadian ? ['canadian', 'hybrid', 'us'] : ['us', 'canadian'];
}

function suggestCso(a: QuizAnswers): { id: string; reason: string } {
  if (a.timing === 'asap') return { id: 'priority', reason: 'You said you want to start as soon as possible, and Priority Match is built for speed.' };
  if (a.concern === 'matching' || a.concern === 'timeline') return { id: 'guided', reason: `Your main worry is ${a.concern === 'matching' ? 'finding the right surrogate' : 'how long it takes'}, and Guided Journey gives you a dedicated case manager and active matching advocacy.` };
  if (a.concern === 'cost' || a.timing === 'exploring') return { id: 'foundation', reason: 'Foundation is the lowest-cost way to have an experienced agency matching and supporting you.' };
  return { id: 'guided', reason: 'Guided Journey is the best fit for most families who want a trusted partner without paying for speed they do not need.' };
}

function suggestCamica(a: QuizAnswers): { id: string; reason: string } {
  if (a.timing === 'asap' || a.concern === 'matching' || a.concern === 'timeline') return { id: 'priority', reason: 'Priority targets a match in 60 to 90 days, which fits how you answered.' };
  return { id: 'signature', reason: 'Signature is full-service matching without the expedited tier.' };
}

const money = (n: number) => Math.round(n);

export function buildEstimate(a: QuizAnswers, id: PathwayId): PathwayEstimate {
  const wantsDonor = a.donor === 'yes';
  const calcAnswers = { location: a.location, embryos: a.embryos, donor: wantsDonor } as const;

  let tiers: AgencyTierView[];
  let agencyCAD: number;
  let reason: string;
  let title: string;
  let kicker: string;
  let summary: string;
  let agencyNote: string;
  let calcPathway: 'canadian' | 'us_ontario' | 'us_us';
  let hasConcierge = false;

  if (id === 'canadian') {
    const pick = suggestCso(a);
    tiers = CSO_TIERS.map(t => ({ name: t.name, from: t.from, currency: 'CAD' as const, forWhom: t.forWhom, includes: t.includes, suggested: t.id === pick.id }));
    agencyCAD = CSO_TIERS.find(t => t.id === pick.id)!.from;
    reason = pick.reason;
    title = 'Surrogacy in Canada';
    kicker = 'Canadian Surrogacy Options';
    summary = 'Altruistic surrogacy. Your surrogate is reimbursed for her pregnancy expenses and receives no fee. Hospital and delivery care are covered by provincial health insurance.';
    agencyNote = 'Agency fees are in CAD, plus HST.';
    calcPathway = 'canadian';
  } else if (id === 'hybrid') {
    tiers = [{
      name: 'Hybrid Pathway',
      from: CAMICA_HYBRID.from,
      currency: 'USD',
      forWhom: 'A Florida surrogate carries your baby and travels to Ontario for the birth',
      includes: [
        'Matching from Camica\'s Florida surrogate pool',
        'Medical, legal and support managed by Camica',
        'Your baby is born in Canada',
        `$${CAMICA_HYBRID.deposit.toLocaleString()} deposit credited to your total`,
      ],
      suggested: true,
    }];
    agencyCAD = toCAD(CAMICA_HYBRID.from, 'USD');
    reason = 'A compensated U.S. surrogate usually means a faster match, with the birth still happening in Canada.';
    title = 'Hybrid: a Florida surrogate, a Canadian birth';
    kicker = 'Camica, our U.S. brand';
    summary = 'Compensated surrogacy through Camica. Your surrogate carries in Florida and travels to Ontario for delivery, so you stay home and your baby is born in Canada.';
    agencyNote = 'Camica fees are in USD, converted below. Founding-family rate, subject to availability.';
    calcPathway = 'us_ontario';
  } else {
    const pick = suggestCamica(a);
    tiers = CAMICA_TIERS.map(t => ({ name: t.name, from: t.from, currency: 'USD' as const, forWhom: t.forWhom, includes: t.includes, suggested: t.id === pick.id }));
    agencyCAD = toCAD(CAMICA_TIERS.find(t => t.id === pick.id)!.from, 'USD');
    reason = pick.reason;
    title = 'Surrogacy in the U.S.';
    kicker = 'Camica, our U.S. brand';
    summary = 'Compensated surrogacy, based in Florida. Surrogate compensation is a separate, larger line than in Canada, and hospital and delivery are paid privately.';
    agencyNote = `Camica fees are in USD, converted below. A Concierge tier is also available from $${CAMICA_CONCIERGE_FROM.toLocaleString()} USD by application.`;
    calcPathway = 'us_us';
    hasConcierge = true;
  }

  const { items, total } = buildBreakdown(
    { location: calcAnswers.location, embryos: calcAnswers.embryos, donor: false },
    calcPathway,
    { skipDonor: true },
  );

  const donor = wantsDonor
    ? { agencyFee: { ...LM.agencyFee }, cycleTotal: { ...LM.cycleTotal } }
    : null;

  const donorLow = donor ? donor.cycleTotal.low : 0;
  const donorHigh = donor ? donor.cycleTotal.high : 0;

  return {
    id, title, kicker, summary,
    agencyTiers: tiers, agencyNote, agencyCAD, suggestedReason: reason,
    journey: { low: money(total.low), high: money(total.high), items },
    donor,
    allIn: {
      low: money(agencyCAD + total.low + donorLow),
      high: money(agencyCAD + total.high + donorHigh),
    },
    hasConcierge,
  };
}

export function buildAllEstimates(a: QuizAnswers): PathwayEstimate[] {
  return pathwaysFor(a).map(id => buildEstimate(a, id));
}

/** "$72,000" from a CAD number, rounded to the nearest $1,000. */
export function cad(n: number): string {
  return '$' + (Math.round(n / 1000) * 1000).toLocaleString('en-CA');
}

export function exact(n: number, currency: 'CAD' | 'USD' = 'CAD'): string {
  return '$' + n.toLocaleString('en-CA') + (currency === 'USD' ? ' USD' : '');
}

export const CONCERN_NOTES: Record<Concern, { title: string; body: string }> = {
  cost: {
    title: 'You said cost is your biggest worry',
    body: 'So here is everything, up front. The agency fee is the smaller piece. Most of the budget is paid to your surrogate, your clinic and your lawyers, not to us, and your written next step lists every line.',
  },
  matching: {
    title: 'You said finding the right surrogate is your biggest worry',
    body: 'Matching time depends on surrogate availability, and we will tell you our honest current timeline in your written next step, including what happens if matching takes longer than hoped.',
  },
  clinic: {
    title: 'You said clinic coordination is your biggest worry',
    body: 'Clinic coordination is part of what the agency does. Your written next step explains which parts we manage and which your clinic handles.',
  },
  legal: {
    title: 'You said the legal process is your biggest worry',
    body: 'Legal fees are paid to independent lawyers, never to us, and they are itemized in the estimate. Your written next step walks through the contract and parentage steps in plain language.',
  },
  timeline: {
    title: 'You said the timeline is your biggest worry',
    body: 'We will lay the whole timeline out in writing, including where the unknowns are. Honest beats optimistic.',
  },
};
