'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Location  = 'ontario' | 'canada_other' | 'us_northeast' | 'us_other' | 'international';
type Embryos   = 'ontario_clinic' | 'canada_clinic' | 'us_clinic' | 'need_donation';
type Pathway   = 'canadian' | 'us_ontario' | 'us_us' | 'both';

interface Answers { location?: Location; embryos?: Embryos; pathway?: Pathway; }

// ── Cost logic ────────────────────────────────────────────────────────────────
const RATE = 1.36; // USD → CAD

function toCAD(amt: number, currency: 'CAD'|'USD') {
  return currency === 'USD' ? Math.round(amt * RATE) : amt;
}

interface LineItem {
  label:     string;
  low:       number;
  high:      number;
  note?:     string;
  covered?:  string;   // "Covered by OHIP" — $0, shown in green, not budgeted
  contactUs?: boolean; // agency/LM fee — no number, shown as TBD
}

function buildBreakdown(answers: Answers, pathway: 'canadian'|'us_ontario'|'us_us') {
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
    items.push({ label: 'Surrogate monthly allowance & expenses (10 mo.)', low: 30000, high: 45000, note: 'CAD — altruistic, no compensation' });
  } else {
    items.push({ label: 'Surrogate compensation', low: toCAD(45000,'USD'), high: toCAD(65000,'USD'), note: 'USD converted · typical range' });
    items.push({ label: 'Surrogate monthly allowance & expenses (10 mo.)', low: toCAD(8000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted' });
  }
  items.push({ label: 'Surrogate lost wages — pre-birth appointments', low: toCAD(1000,curr), high: toCAD(4000,curr), note: `${isCAD?'CAD':'USD converted'} · monitoring, transfers, OB visits` });

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

  // ── Newborn — international IPs, Canadian birth ──
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
  if (answers.embryos === 'need_donation') {
    items.push({ label: '🌸 LM agency fee — egg donation coordination', low: 0, high: 0, contactUs: true });
    items.push({ label: '🌸 Egg donor compensation', low: toCAD(5000,'USD'), high: toCAD(15000,'USD'), note: 'USD converted · varies by donor' });
    items.push({ label: '🌸 Egg donor medical screening, medications & legal', low: toCAD(4000,'USD'), high: toCAD(9000,'USD'), note: 'USD converted' });
  }

  const total = items.reduce((acc, i) => ({
    low:  acc.low  + (i.low  || 0),
    high: acc.high + (i.high || 0),
  }), { low: 0, high: 0 });

  return { items, total };
}

function fmt(n: number) {
  const rounded = Math.round(n / 1000) * 1000;
  return '$' + rounded.toLocaleString();
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ background: '#E8E0F5', height: 4, borderRadius: 2, maxWidth: 520, margin: '0 auto 32px' }}>
      <div style={{ background: '#3D1A6E', height: 4, borderRadius: 2, width: `${(step / total) * 100}%`, transition: 'width 0.3s ease' }} />
    </div>
  );
}

interface OptionCard { value: string; label: string; sub?: string; emoji?: string; }

function OptionGrid({ options, onSelect }: { options: OptionCard[]; onSelect: (v: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: options.length <= 3 ? `repeat(${options.length}, 1fr)` : 'repeat(2, 1fr)', gap: 12, maxWidth: 620, margin: '0 auto' }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onSelect(opt.value)}
          style={{ padding: '18px 16px', borderRadius: 12, border: '2px solid #E8E0F5', background: '#fff',
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            boxShadow: '0 2px 8px rgba(61,26,110,0.05)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#9B7FC7'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(61,26,110,0.12)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8E0F5'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(61,26,110,0.05)'; }}>
          {opt.emoji && <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{opt.emoji}</div>}
          <div style={{ fontWeight: 600, color: '#3D1A6E', fontSize: '0.9375rem', marginBottom: opt.sub ? 4 : 0 }}>{opt.label}</div>
          {opt.sub && <div style={{ fontSize: '0.8125rem', color: '#777', lineHeight: 1.4 }}>{opt.sub}</div>}
        </button>
      ))}
    </div>
  );
}

function StepWrapper({ step, total, question, sub, children }: { step: number; total: number; question: string; sub?: string; children: ReactNode }) {
  return (
    <div style={{ padding: '48px 24px', maxWidth: 700, margin: '0 auto' }}>
      <ProgressBar step={step} total={total} />
      <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B7FC7', textAlign: 'center', marginBottom: 12 }}>
        Step {step} of {total}
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 500, color: '#3D1A6E', textAlign: 'center', marginBottom: sub ? 12 : 28, lineHeight: 1.2 }}>
        {question}
      </h2>
      {sub && <p style={{ textAlign: 'center', color: '#666', marginBottom: 28, fontSize: '0.9375rem' }}>{sub}</p>}
      {children}
    </div>
  );
}

// ── Pathway result card ───────────────────────────────────────────────────────
function PathwayResult({ title: pathwayTitle, sub, color, answers, pathway }:
  { title: string; sub: string; color: string; answers: Answers; pathway: 'canadian'|'us_ontario'|'us_us' }) {

  const { items, total } = buildBreakdown(answers, pathway);
  const hasDonation = answers.embryos === 'need_donation';

  // Initialise user budget inputs to midpoint of each range
  const [userAmounts, setUserAmounts] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    items.forEach((item, i) => {
      if (item.covered || item.contactUs) {
        init[i] = '';
      } else {
        const mid = Math.round((item.low + item.high) / 2 / 1000) * 1000;
        init[i] = mid > 0 ? String(mid) : '';
      }
    });
    return init;
  });

  function setAmt(i: number, val: string) {
    const clean = val.replace(/[^0-9]/g, '');
    setUserAmounts(prev => ({ ...prev, [i]: clean }));
  }

  const userTotal = Object.values(userAmounts).reduce((sum, v) => sum + (parseInt(v) || 0), 0);

  const inputStyle: React.CSSProperties = {
    width: 96,
    padding: '3px 6px',
    border: '1px solid #d0c4e8',
    borderRadius: 6,
    fontSize: '0.84375rem',
    textAlign: 'right',
    fontFamily: 'inherit',
    color: '#3D1A6E',
    background: '#faf8ff',
    outline: 'none',
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: `2px solid ${color}33`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(61,26,110,0.08)', marginBottom: 28 }}>

      {/* Header */}
      <div style={{ background: color, color: '#fff', padding: '18px 24px' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 4 }}>{sub}</div>
        <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{pathwayTitle}</div>
      </div>

      <div style={{ padding: '16px 24px 20px' }}>

        {/* Range summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 14, borderBottom: '2px solid #E8E0F5' }}>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Estimated range</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3D1A6E' }}>
            {fmt(total.low)} – {fmt(total.high)} CAD
          </span>
        </div>

        {/* Line items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84375rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '5px 10px 8px 0', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: '#aaa', letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid #e8e0f5' }}>Item</th>
              <th style={{ padding: '5px 10px 8px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color: '#aaa', letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid #e8e0f5', whiteSpace: 'nowrap' }}>Est. range</th>
              <th style={{ padding: '5px 0 8px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 600, color: '#3D1A6E', letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid #e8e0f5', minWidth: 116 }}>Your budget</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0ebf8' }}>

                {/* Label */}
                <td style={{ padding: '7px 10px 7px 0', color: item.label.startsWith('🌸') ? '#7a5c00' : '#444', verticalAlign: 'middle', lineHeight: 1.35 }}>
                  {item.label}
                  {item.note && <span style={{ fontSize: '0.72rem', color: '#bbb', marginLeft: 5 }}>({item.note})</span>}
                </td>

                {/* Range */}
                <td style={{ padding: '7px 10px', textAlign: 'right', verticalAlign: 'middle', whiteSpace: 'nowrap', color: '#2d2d2d', fontWeight: 500 }}>
                  {item.covered
                    ? <span style={{ color: '#2a8f5a', fontStyle: 'italic', fontSize: '0.78rem', fontWeight: 400 }}>✓ {item.covered}</span>
                    : item.contactUs
                      ? <span style={{ color: '#9B7FC7', fontStyle: 'italic', fontWeight: 400 }}>—</span>
                      : item.low === item.high
                        ? fmt(item.low)
                        : `${fmt(item.low)} – ${fmt(item.high)}`}
                </td>

                {/* Input */}
                <td style={{ padding: '7px 0', textAlign: 'right', verticalAlign: 'middle' }}>
                  {item.covered ? (
                    <span style={{ color: '#2a8f5a', fontWeight: 700 }}>$0</span>
                  ) : item.contactUs ? (
                    <span style={{ fontSize: '0.78rem', color: '#9B7FC7', fontStyle: 'italic' }}>TBD</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ color: '#999' }}>$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={userAmounts[i] ?? ''}
                        onChange={e => setAmt(i, e.target.value)}
                        placeholder="0"
                        style={inputStyle}
                      />
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {/* Agency fee row */}
            <tr style={{ background: '#f7f3fc', borderBottom: '1px solid #e8e0f5' }}>
              <td style={{ padding: '9px 10px 9px 0', fontWeight: 600, color: '#3D1A6E' }}>Agency coordination fee</td>
              <td style={{ padding: '9px 10px', textAlign: 'right', color: '#9B7FC7', fontStyle: 'italic', fontSize: '0.84375rem' }}>Contact us for pricing</td>
              <td style={{ padding: '9px 0', textAlign: 'right', fontSize: '0.78rem', color: '#9B7FC7', fontStyle: 'italic' }}>TBD</td>
            </tr>

            {/* Your budgeted total */}
            <tr style={{ background: color }}>
              <td colSpan={2} style={{ padding: '12px 10px 12px 0', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Your budgeted total</td>
              <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 800, color: '#fff', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
                {userTotal > 0 ? `$${userTotal.toLocaleString()}` : '—'}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.75rem', color: '#bbb', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
          USD converted at 1 USD = {RATE} CAD. Rounded to nearest $1,000. Pre-filled with midpoint estimates — adjust to match your situation.
          {hasDonation ? ' 🌸 Egg donation costs are in addition to the above.' : ''}
        </p>
      </div>
    </div>
  );
}

// ── Results page ──────────────────────────────────────────────────────────────
function Results({ answers, onBack }: { answers: Answers; onBack: () => void }) {
  const pathways: { pathway: 'canadian'|'us_ontario'|'us_us'; title: string; sub: string; color: string }[] = [];
  const isIntl = answers.location === 'international';

  if (answers.pathway === 'canadian' || answers.pathway === 'both') {
    pathways.push({ pathway: 'canadian', title: 'Canadian Surrogate · Deliver in Ontario', sub: 'CSO Fast Track · Altruistic surrogate', color: '#3D1A6E' });
  }
  if (answers.pathway === 'us_ontario' || answers.pathway === 'both') {
    pathways.push({ pathway: 'us_ontario', title: 'US Surrogate · Deliver in Ontario', sub: 'Camica Priority · Baby born in Canada', color: '#1a6e5c' });
  }
  if (answers.pathway === 'us_us') {
    pathways.push({ pathway: 'us_us', title: 'US Surrogate · Deliver in the US', sub: 'Camica Priority · Baby born in United States', color: '#1a4a6e' });
  }

  const hasUSPathway = pathways.some(p => p.pathway === 'us_us');

  interface ContingencyItem { label: string; range: string; note: string; }
  const contingencyItems: ContingencyItem[] = [
    {
      label: 'Surrogate bed rest — lost wages',
      range: '$3,000 – $15,000+',
      note: 'Doctor-ordered bed rest; reimbursed at surrogate\'s actual income. Varies widely.',
    },
    {
      label: 'Failed embryo transfer (each additional attempt)',
      range: '$3,000 – $6,000',
      note: 'Medications, monitoring, and clinic fees per cycle.',
    },
    {
      label: 'Childcare during appointments & recovery',
      range: '$1,500 – $6,000',
      note: 'If surrogate has young children at home.',
    },
    {
      label: 'C-section recovery support',
      range: '$1,000 – $4,000',
      note: 'Additional home care and extended recovery time.',
    },
    {
      label: 'NICU stay — premature birth',
      range: hasUSPathway ? '$0 – $100,000+' : '$0 – $20,000',
      note: hasUSPathway
        ? 'Ontario OHIP covers most costs; US NICU without full insurance coverage can be very significant.'
        : 'Ontario OHIP covers most costs — this covers gaps, extras, and extended stays.',
    },
    ...(isIntl ? [{
      label: 'Visa and entry documentation for your newborn',
      range: '$2,000 – $8,000',
      note: 'Varies significantly by country. Budget time as well as money.',
    }] : []),
    ...(answers.embryos === 'need_donation' ? [{
      label: 'Additional egg retrieval cycle',
      range: '$8,000 – $14,000',
      note: 'If first cycle doesn\'t yield sufficient viable embryos.',
    }] : []),
  ];

  return (
    <div style={{ padding: '48px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
      <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B7FC7', textAlign: 'center', marginBottom: 12 }}>
        Your personalized estimate
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 500, color: '#3D1A6E', textAlign: 'center', marginBottom: 8, lineHeight: 1.2 }}>
        Here's what your journey could cost
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 40, fontSize: '0.9375rem', maxWidth: 560, margin: '0 auto 40px' }}>
        Realistic ranges based on your situation. Adjust the <strong style={{ color: '#3D1A6E' }}>Your budget</strong> column to build your own number — the total updates automatically.
      </p>

      {pathways.map(p => (
        <PathwayResult key={p.pathway} answers={answers} {...p} />
      ))}

      {/* Budget for the unexpected */}
      <div style={{ background: '#fff', borderRadius: 16, border: '2px solid #e8d8a0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(61,26,110,0.08)', marginBottom: 28 }}>
        <div style={{ background: '#7a5c00', color: '#fff', padding: '18px 24px' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 4 }}>Plan ahead · all figures CAD</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>Budget for the unexpected</div>
        </div>
        <div style={{ padding: '16px 24px 20px' }}>
          <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: 16, lineHeight: 1.6, marginTop: 0 }}>
            These situations don't happen in every journey — but they're common enough that we recommend budgeting for at least some of them.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84375rem' }}>
            <tbody>
              {contingencyItems.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5eedc' }}>
                  <td style={{ padding: '9px 12px 9px 0', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: '#3d2200', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: '#999', lineHeight: 1.4 }}>{item.note}</div>
                  </td>
                  <td style={{ padding: '9px 0', textAlign: 'right', fontWeight: 600, color: '#7a5c00', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {item.range}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#fdf6e3', borderRadius: 8, fontSize: '0.8125rem', color: '#7a5c00', lineHeight: 1.5 }}>
            💡 <strong>We recommend setting aside a contingency fund of at least $10,000–$20,000 CAD</strong> on top of your base estimate. Most journeys don't hit all of these — but having the buffer means you're never making financial decisions during a vulnerable moment.
          </div>
        </div>
      </div>

      {/* Agency fee note */}
      <div style={{ background: '#f7f3fc', borderRadius: 12, padding: '20px 24px', marginBottom: 40, border: '1px solid #cbbfe6' }}>
        <div style={{ fontWeight: 700, color: '#3D1A6E', marginBottom: 8, fontSize: '0.9rem' }}>About the agency coordination fee</div>
        <p style={{ margin: 0, color: '#555', fontSize: '0.875rem', lineHeight: 1.6 }}>
          The estimates above show your direct journey costs — surrogate expenses, medical, legal, and travel.
          The CSO / Camica agency fee covers your case management, surrogate matching and screening, support throughout your journey, and all the coordination behind the scenes. It's listed separately because it's part of a conversation about your specific situation.
          <strong style={{ color: '#3D1A6E' }}> Book a call and we'll give you the full picture.</strong>
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', background: '#3D1A6E', borderRadius: 16, padding: '40px 32px', color: '#fff' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 500, marginBottom: 12, lineHeight: 1.2 }}>
          Want a personalized breakdown?
        </h3>
        <p style={{ opacity: 0.88, marginBottom: 28, fontSize: '0.9375rem', maxWidth: 480, margin: '0 auto 28px' }}>
          Book a free 30-minute call with Robyn. We'll walk through your specific situation, answer every question, and give you a detailed written estimate — no obligation.
        </p>
        <a href="https://calendly.com/cso-robyn" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#fff', color: '#3D1A6E', padding: '14px 36px', borderRadius: 50, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', letterSpacing: '0.02em' }}>
          Book a Free Call with Robyn →
        </a>
        <p style={{ marginTop: 16, fontSize: '0.8rem', opacity: 0.7 }}>
          Or email <a href="mailto:robyn@canadiansurrogacyoptions.com" style={{ color: '#E8E0F5' }}>robyn@canadiansurrogacyoptions.com</a>
        </p>
      </div>

      <button onClick={onBack}
        style={{ display: 'block', margin: '24px auto 0', background: 'none', border: 'none', color: '#9B7FC7', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}>
        ← Start over
      </button>
    </div>
  );
}

// ── Main calculator ───────────────────────────────────────────────────────────
export default function CostCalculator() {
  const [step, setStep]       = useState(1);
  const [answers, setAnswers] = useState<Answers>({});

  function answer<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(s => s + 1);
  }

  const TOTAL = 3;

  if (step > TOTAL) {
    return <Results answers={answers} onBack={() => { setStep(1); setAnswers({}); }} />;
  }

  return (
    <>
      {step > 1 && (
        <div style={{ padding: '16px 24px 0', maxWidth: 700, margin: '0 auto' }}>
          <button onClick={() => setStep(s => s - 1)}
            style={{ background: 'none', border: 'none', color: '#9B7FC7', cursor: 'pointer', fontSize: '0.875rem' }}>
            ← Back
          </button>
        </div>
      )}

      {step === 1 && (
        <StepWrapper step={1} total={TOTAL} question="Where are you and your partner based?" sub="This affects travel costs to the birth and which delivery options make sense for you.">
          <OptionGrid onSelect={v => answer('location', v as Location)} options={[
            { value: 'ontario',       emoji: '🍁', label: 'Ontario, Canada',         sub: 'Local to the birth' },
            { value: 'canada_other',  emoji: '🇨🇦', label: 'Rest of Canada',          sub: 'Domestic flights to Ontario' },
            { value: 'us_northeast',  emoji: '🗽', label: 'US — Northeast',           sub: 'NY, Boston, New England — ~4hr drive' },
            { value: 'us_other',      emoji: '🇺🇸', label: 'US — Other states',        sub: 'Flights to Ontario or US delivery' },
            { value: 'international', emoji: '✈️', label: 'Outside North America',    sub: 'International flights + extended stay' },
          ]} />
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper step={2} total={TOTAL} question="What's your embryo situation?" sub="This determines whether there are shipping costs and whether egg donation is part of the picture.">
          <OptionGrid onSelect={v => answer('embryos', v as Embryos)} options={[
            { value: 'ontario_clinic', emoji: '🏥', label: 'Embryos at an Ontario clinic',          sub: 'No shipping needed — ready to transfer' },
            { value: 'canada_clinic',  emoji: '🇨🇦', label: 'Embryos at another Canadian clinic',   sub: 'Domestic shipping to Ontario' },
            { value: 'us_clinic',      emoji: '🇺🇸', label: 'Embryos at a US clinic',               sub: 'Cross-border shipping required' },
            { value: 'need_donation',  emoji: '🌸', label: 'We need egg donation',                  sub: 'Through Little Miracles — we\'ll include those costs' },
          ]} />
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper step={3} total={TOTAL} question="Which surrogate pathway are you considering?" sub="Canadian surrogates are altruistic — no compensation, longer wait. US surrogates are faster to match but higher cost.">
          <OptionGrid onSelect={v => answer('pathway', v as Pathway)} options={[
            { value: 'canadian',   emoji: '🍁', label: 'Canadian surrogate',                       sub: 'Altruistic · $90–$130K CAD typical · 6–18 month wait' },
            { value: 'us_ontario', emoji: '🤝', label: 'US surrogate — baby born in Ontario',      sub: 'Camica Priority · faster match · baby gets Canadian birth cert' },
            { value: 'us_us',      emoji: '🇺🇸', label: 'US surrogate — baby born in the US',     sub: 'Camica Priority · simplest if you\'re in the US · more legal steps' },
            { value: 'both',       emoji: '⚖️', label: 'Show me Canadian + US side by side',      sub: 'Compare your two main options' },
          ]} />
        </StepWrapper>
      )}
    </>
  );
}
