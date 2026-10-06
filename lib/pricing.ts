/**
 * Agency fees shown on /surrogacy-costs. One place to edit.
 *
 * SOURCES (last checked 2026-10-06; Robyn confirmed the live-site CSO and Camica
 * prices are correct, and the brand file was updated to match):
 *  - CSO tiers: live /programs and /intended-parents pages.
 *  - Camica tiers and Hybrid Pathway: live camica.ca.
 *  - Little Miracles: the master brand file only. little-miracles.ca does not
 *    publish prices, so CONFIRM these before the page goes live.
 */

export const PRICING_VERIFIED = 'October 2026';

export type CsoTier = {
  id: 'independent' | 'foundation' | 'guided' | 'priority';
  name: string;
  from: number; // CAD, before HST
  forWhom: string;
  includes: string[];
};

export const CSO_TIERS: CsoTier[] = [
  {
    id: 'independent',
    name: 'Independent Journey',
    from: 1500,
    forWhom: 'You run your own journey with our tools and calls',
    includes: [
      'Comprehensive journey checklist',
      'Legal and clinic referrals',
      'CSO document templates',
      'Consultation calls as needed',
    ],
  },
  {
    id: 'foundation',
    name: 'Foundation',
    from: 9500,
    forWhom: 'Informed and ready for an experienced partner',
    includes: [
      'Surrogate matching coordination',
      'Legal and clinic referrals',
      'Journey milestone support',
      'Access to our screened surrogate pool',
    ],
  },
  {
    id: 'guided',
    name: 'Guided Journey',
    from: 19500,
    forWhom: 'Want a trusted partner beside you',
    includes: [
      'Everything in Foundation',
      'Dedicated case management',
      'Regular journey check-ins',
      'IP profile creation and presentation',
      'Matching advocacy and surrogate introductions',
    ],
  },
  {
    id: 'priority',
    name: 'Priority Match',
    from: 29500,
    forWhom: 'Ready now, and want the fastest path',
    includes: [
      'Everything in Guided Journey',
      'Priority matching',
      'Doubled surrogate recruitment',
      'Faster average match timeline',
      'Split payment structure available',
    ],
  },
];

export type CamicaTier = {
  id: string;
  name: string;
  from: number; // USD
  forWhom: string;
  includes: string[];
};

export const CAMICA_TIERS: CamicaTier[] = [
  {
    id: 'signature',
    name: 'Signature',
    from: 28000,
    forWhom: 'Full-service matching',
    includes: [
      'Surrogate matching and background screening',
      'Legal contract coordination',
      'Escrow management setup',
      'Dedicated case manager',
    ],
  },
  {
    id: 'priority',
    name: 'Priority',
    from: 38000,
    forWhom: 'Expedited matching, target 60 to 90 days',
    includes: [
      'Everything in Signature',
      'Full medical screening package',
      'Psychological evaluation support',
      'Priority access to new surrogate profiles',
    ],
  },
  {
    id: 'premier',
    name: 'Premier',
    from: 48000,
    forWhom: 'Concierge experience',
    includes: [
      'Everything in Priority',
      'Robyn personally involved throughout',
      'VIP clinic coordination',
      'Post-birth support package',
    ],
  },
];

export const CAMICA_CONCIERGE_FROM = 65000; // USD, by application only

/** Florida surrogate travels to Ontario for delivery. Founding-family rate on camica.ca. */
export const CAMICA_HYBRID = { from: 26500, deposit: 2500 }; // USD

/** Little Miracles egg donation (CAD). CONFIRM: not published on little-miracles.ca. */
export const LM = {
  agencyFee: { low: 2750, high: 3500 },
  cycleTotal: { low: 16450, high: 20400 }, // typical all-in donor cycle; non-local donors cost more
};

/** What the agency fee never covers. Same list as the client-expense lines in the estimate. */
export const NOT_COVERED_BY_AGENCY_FEE = [
  'Surrogate monthly allowance and pregnancy expenses',
  'Fertility clinic, transfer and medication costs',
  'Legal fees: surrogacy contracts and parentage orders',
  'Counselling and psychological assessments',
  'Insurance, travel and any lost-wage reimbursements',
  'Egg donation, if you need it',
];

/**
 * The CSO agency fee is paid in three stages, not all upfront. Stage names and
 * what each protects come from the published refund policy on /intended-parents.
 *
 * TODO(Robyn): set `share` on each stage (the three must total 1). Until then
 * the quiz shows the three stages without dollar amounts rather than guessing.
 */
export type PaymentStage = { label: string; name: string; protects: string; share: number | null };

export const PAYMENT_STAGES: PaymentStage[] = [
  {
    label: 'Stage 1',
    name: 'Intake and profile',
    protects: 'Before matching starts: 85% back, or pause free for up to 12 months.',
    share: null,
  },
  {
    label: 'Stage 2',
    name: 'Active matching',
    protects: 'Pause free any time, or a sliding-scale refund while we search.',
    share: null,
  },
  {
    label: 'Stage 3',
    name: 'After your match',
    protects: 'Full support, with flexibility for real hardship.',
    share: null,
  },
];
