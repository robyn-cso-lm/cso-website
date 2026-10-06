// Shared cost model for /cost-calculator and /surrogacy-costs.
// Ranges only, in CAD (USD converted at RATE). Edit numbers here, once.

// ── Types ─────────────────────────────────────────────────────────────────────
export type Location  = 'ontario' | 'canada_other' | 'us_northeast' | 'us_other' | 'international';
export type Embryos   = 'ontario_clinic' | 'canada_clinic' | 'us_clinic' | 'need_donation' | 'not_yet';
export type Pathway   = 'canadian' | 'us_ontario' | 'us_us' | 'both';

export interface Answers { location?: Location; embryos?: Embryos; pathway?: Pathway; donor?: boolean; }

// ── Cost logic ────────────────────────────────────────────────────────────────
export const RATE = 1.36; // USD → CAD

export function toCAD(amt: number, currency: 'CAD'|'USD') {
  return currency === 'USD' ? Math.round(amt * RATE) : amt;
}

export interface LineItem {
  label:     string;
  low:       number;
  high:      number;
  note?:     string;
  covered?:  string;   // "Covered by OHIP" · $0, shown in green, not budgeted
  contactUs?: boolean; // agency/LM fee · no number, shown as TBD
  donor?: boolean;     // egg-donation line (calculator highlights these)
}

export function buildBreakdown(
  answers: Answers,
  pathway: 'canadian'|'us_ontario'|'us_us',
  opts: { skipDonor?: boolean } = {},
) {
  const items: LineItem[] = [];
  const isIntl         = answers.location === 'international';
  const isCAD          = pathway === 'canadian';
  const curr           = isCAD ? 'CAD' : 'USD';
  const isCanadianBirth = pathway !== 'us_us';

  // ── Embryo shipping ──
  if (answers.embryos === 'canada_clinic') {
    items.push({ label: 'Embryo shipping to Ontario clinic', low: 400, high: 900, note: 'CAD' });
  } else if (answers.embryos === 'us_clinic') {
    if (pathway === 'us_us') {
      items.push({ label: 'Embryo shipping to US surrogate clinic', low: toCAD(500,'USD'), high: toCAD(1500,'USD'), note: 'USD converted' });
    } else {
      items.push({ label: 'Embryo shipping to Ontario clinic', low: 800, high: 2000, note: 'CAD' });
    }
  }

  // ── Surrogate expenses ──
  if (pathway === 'canadian') {
    items.push({ label: 'Surrogate monthly allowance & expenses (10 mo.)', low: 30000, high: 45000, note: 'CAD · altruistic, no compensation' });
  } else {
    items.push({ label: 'Surrogate compensation', low: toCAD(55000,'USD'), high: toCAD(70000,'USD'), note: 'USD converted · Camica quotes $55,000 to $70,000+' });
    items.push({ label: 'Surrogate monthly allowance & expenses (10 mo.)', low: toCAD(8000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted' });
  }
  items.push({ label: 'Surrogate lost wages · pre-birth appointments', low: toCAD(1000,curr), high: toCAD(4000,curr), note: `${isCAD?'CAD':'USD converted'} · monitoring, transfers, OB visits` });

  // ── Medical ──
  items.push({ label: 'Embryo transfer & monitoring', low: toCAD(3000,curr), high: toCAD(6000,curr), note: isCAD ? 'CAD' : 'USD converted' });
  items.push({ label: 'Surrogate medications', low: toCAD(3000,curr), high: toCAD(5000,curr), note: isCAD ? 'CAD' : 'USD converted' });
  items.push({ label: 'Psychological assessments & counselling', low: toCAD(2000,curr), high: toCAD(4500,curr), note: `${isCAD?'CAD':'USD converted'} · IPs + surrogate; required by most agencies` });

  // ── Delivery ──
  if (pathway === 'us_us') {
    items.push({ label: 'Hospital & delivery (US)', low: toCAD(8000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted' });
    items.push({ label: 'OB/GYN care (US)', low: toCAD(2000,'USD'), high: toCAD(3000,'USD'), note: 'USD converted' });
  } else {
    items.push({ label: 'Hospital & delivery (Ontario)', low: 0, high: 0, covered: 'OHIP / provincial health coverage' });
    items.push({ label: 'OB/GYN care (Ontario)', low: 0, high: 0, covered: 'OHIP / provincial health coverage' });
  }

  // ── Surrogate travel (Pathway B only) ──
  if (pathway === 'us_ontario') {
    items.push({ label: 'Surrogate flights to Ontario', low: toCAD(1500,'USD'), high: toCAD(2500,'USD'), note: 'USD converted' });
    items.push({ label: 'Surrogate accommodation & daily allowance in Ontario', low: toCAD(5000,'USD'), high: toCAD(10000,'USD'), note: 'USD converted · 3–4 weeks' });
  }

  // ── IP travel ──
  const travelLabel = pathway === 'us_us' ? 'Your travel to delivery location' : 'Your travel to Ontario for the birth';
  if (answers.location === 'ontario') {
    if (!isIntl && pathway !== 'us_us') items.push({ label: travelLabel, low: 0, high: 500, note: 'CAD · local' });
  } else if (answers.location === 'canada_other') {
    items.push({ label: travelLabel, low: 800, high: 3000, note: 'CAD · flights within Canada' });
  } else if (answers.location === 'us_northeast') {
    if (pathway === 'us_us') {
      items.push({ label: travelLabel, low: 0, high: toCAD(1000,'USD'), note: 'Already in US' });
    } else {
      items.push({ label: travelLabel, low: 500, high: 2000, note: 'CAD · ~4 hr drive from NY/Boston' });
    }
  } else if (answers.location === 'us_other') {
    if (pathway === 'us_us') {
      items.push({ label: travelLabel, low: toCAD(500,'USD'), high: toCAD(2500,'USD'), note: 'USD converted' });
    } else {
      items.push({ label: travelLabel, low: toCAD(800,'USD'), high: toCAD(3500,'USD'), note: 'USD converted · flights to Ontario' });
    }
  } else if (isIntl) {
    if (pathway === 'us_us') {
      items.push({ label: travelLabel, low: toCAD(4000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted · international flights + accommodation' });
    } else {
      items.push({ label: 'Your international flights + accommodation for birth', low: 6000, high: 16000, note: 'CAD · varies significantly' });
      items.push({ label: 'Extended stay post-birth (awaiting travel documents)', low: 4000, high: 10000, note: 'CAD · typically 2–6 weeks in Ontario' });
    }
    items.push({ label: 'Return travel home with newborn', low: toCAD(2000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted' });
  }

  // ── Legal ──
  if (pathway === 'canadian') {
    items.push({ label: 'Surrogacy contract (both parties)', low: 4000, high: 6000, note: 'CAD' });
    items.push({ label: 'Parentage order & Ontario birth registration', low: 2500, high: 4000, note: 'CAD' });
    if (isIntl) {
      items.push({ label: 'Home country legal recognition of parentage', low: 2000, high: 8000, note: 'CAD · varies significantly by country' });
    }
  } else if (pathway === 'us_ontario') {
    items.push({ label: 'Surrogacy contract (both parties)', low: toCAD(4000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted' });
    items.push({ label: 'Parentage order & Ontario birth registration', low: 2500, high: 4000, note: 'CAD' });
    if (isIntl) {
      items.push({ label: 'Home country legal recognition of parentage', low: 2000, high: 8000, note: 'CAD · varies significantly by country' });
    }
  } else {
    items.push({ label: 'Surrogacy contract (both parties)', low: toCAD(4000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted' });
    items.push({ label: 'Parentage order & birth registration', low: toCAD(4500,'USD'), high: toCAD(7000,'USD'), note: 'USD converted' });
    if (isIntl) {
      items.push({ label: 'International legal recognition', low: toCAD(2000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted · varies by country' });
    }
  }

  // ── Newborn · international IPs, Canadian birth ──
  if (isIntl && isCanadianBirth) {
    items.push({ label: 'Newborn health insurance (in Canada, pre-departure)', low: 2000, high: 5000, note: 'CAD · covers baby until registered in home country' });
    items.push({ label: 'Canadian citizenship certificate & travel document', low: 300, high: 800, note: 'CAD · government fees + expedited courier' });
  }

  // ── Insurance & admin ──
  items.push({ label: 'Surrogate life & disability insurance', low: toCAD(1500,curr), high: toCAD(3500,curr), note: isCAD ? 'CAD' : 'USD converted' });
  items.push({ label: 'Surrogate supplemental health (dental, vision, prescriptions)', low: isCAD ? 500 : toCAD(400,'USD'), high: isCAD ? 1500 : toCAD(1200,'USD'), note: isCAD ? 'CAD · beyond OHIP' : 'USD converted' });
  if (!isCanadianBirth) {
    items.push({ label: 'Travel & health insurance', low: toCAD(400,'USD'), high: toCAD(800,'USD'), note: 'USD converted' });
  }

  // ── LM egg donation add-on ──
  const needsDonor = !opts.skipDonor && (answers.donor || answers.embryos === 'need_donation');
  if (needsDonor) {
    items.push({ label: 'LM agency fee · egg donation coordination', low: 0, high: 0, contactUs: true, donor: true });
    items.push({ label: 'Egg donor compensation', low: toCAD(5000,'USD'), high: toCAD(15000,'USD'), note: 'USD converted · varies by donor', donor: true });
    items.push({ label: 'Egg donor medical screening, medications & legal', low: toCAD(4000,'USD'), high: toCAD(9000,'USD'), note: 'USD converted', donor: true });
  }

  const total = items.reduce((acc, i) => ({
    low:  acc.low  + (i.low  || 0),
    high: acc.high + (i.high || 0),
  }), { low: 0, high: 0 });

  return { items, total };
}

export function fmt(n: number) {
  const rounded = Math.round(n / 1000) * 1000;
  return '$' + rounded.toLocaleString();
}
