'use client';

import { useState } from 'react';

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

interface LineItem { label: string; low: number; high: number; note?: string; }

function buildBreakdown(answers: Answers, pathway: 'canadian'|'us_ontario'|'us_us') {
  const items: LineItem[] = [];

  // ── Embryo shipping ──
  if (answers.embryos === 'ontario_clinic') {
    // no shipping needed
  } else if (answers.embryos === 'canada_clinic') {
    items.push({ label: 'Embryo shipping to Ontario clinic', low: 400, high: 900, note: 'CAD' });
  } else if (answers.embryos === 'us_clinic') {
    if (pathway === 'us_us') {
      items.push({ label: 'Embryo shipping to US surrogate clinic', low: toCAD(500,  'USD'), high: toCAD(1500, 'USD'), note: 'USD converted' });
    } else {
      items.push({ label: 'Embryo shipping to Ontario clinic', low: 800, high: 2000, note: 'CAD' });
    }
  }

  // ── Surrogate expenses ──
  if (pathway === 'canadian') {
    items.push({ label: 'Surrogate monthly allowance & expenses (10 mo.)', low: 30000, high: 45000, note: 'CAD — altruistic, no compensation' });
  } else {
    items.push({ label: 'Surrogate compensation', low: toCAD(45000,'USD'), high: toCAD(65000,'USD'), note: 'USD converted · typical range' });
    items.push({ label: 'Monthly allowance & expenses (10 mo.)', low: toCAD(8000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted' });
  }

  // ── Medical ──
  items.push({ label: 'Embryo transfer & monitoring', low: toCAD(3000, pathway === 'canadian' ? 'CAD' : 'USD'), high: toCAD(6000, pathway === 'canadian' ? 'CAD' : 'USD') });
  items.push({ label: 'Surrogate medications', low: toCAD(3000, pathway === 'canadian' ? 'CAD' : 'USD'), high: toCAD(5000, pathway === 'canadian' ? 'CAD' : 'USD') });
  items.push({ label: 'Psychological assessments & medical screening', low: toCAD(1800, pathway === 'canadian' ? 'CAD' : 'USD'), high: toCAD(3200, pathway === 'canadian' ? 'CAD' : 'USD') });

  // ── Delivery ──
  if (pathway === 'us_us') {
    items.push({ label: 'Hospital & delivery (US)', low: toCAD(8000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted' });
    items.push({ label: 'OB/GYN (US)', low: toCAD(2000,'USD'), high: toCAD(3000,'USD'), note: 'USD converted' });
  } else {
    items.push({ label: 'Hospital & delivery (Ontario)', low: 11000, high: 11000, note: 'CAD' });
    items.push({ label: 'OB/GYN (Ontario)', low: 3000, high: 5000, note: 'CAD' });
  }

  // ── Surrogate travel (Pathway B only) ──
  if (pathway === 'us_ontario') {
    items.push({ label: 'Surrogate flights to Ontario', low: toCAD(1500,'USD'), high: toCAD(2500,'USD'), note: 'USD converted' });
    items.push({ label: 'Surrogate accommodation & daily allowance in Ontario', low: toCAD(5000,'USD'), high: toCAD(10000,'USD'), note: 'USD converted · 3–4 weeks' });
  }

  // ── IP travel ──
  const travelLabel = pathway === 'us_us' ? 'Your travel to delivery location' : 'Your travel to Ontario for the birth';
  if (answers.location === 'ontario') {
    if (pathway !== 'us_us') items.push({ label: travelLabel, low: 0, high: 500, note: 'CAD · local' });
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
  } else if (answers.location === 'international') {
    if (pathway === 'us_us') {
      items.push({ label: travelLabel, low: toCAD(4000,'USD'), high: toCAD(12000,'USD'), note: 'USD converted · international flights + accommodation' });
    } else {
      items.push({ label: 'Your international flights + accommodation for birth', low: 6000, high: 16000, note: 'CAD · varies significantly' });
    }
    items.push({ label: 'Return travel home with newborn', low: toCAD(2000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted' });
  }

  // ── Legal ──
  if (pathway === 'canadian') {
    items.push({ label: 'Surrogacy contract (both parties)', low: 4000, high: 6000, note: 'CAD' });
    items.push({ label: 'Parentage order & Ontario birth registration', low: 2500, high: 4000, note: 'CAD' });
  } else if (pathway === 'us_ontario') {
    items.push({ label: 'Surrogacy contract (both parties)', low: toCAD(4000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted' });
    items.push({ label: 'Parentage order & Ontario birth registration', low: 2500, high: 4000, note: 'CAD' });
  } else {
    items.push({ label: 'Surrogacy contract (both parties)', low: toCAD(4000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted' });
    items.push({ label: 'Parentage order & birth registration', low: toCAD(4500,'USD'), high: toCAD(7000,'USD'), note: 'USD converted' });
    if (answers.location === 'international') {
      items.push({ label: 'International legal recognition', low: toCAD(2000,'USD'), high: toCAD(6000,'USD'), note: 'USD converted · varies by country' });
    }
  }

  // ── Insurance & admin ──
  items.push({ label: 'Life insurance for surrogate, background checks', low: toCAD(1300, pathway === 'canadian' ? 'CAD' : 'USD'), high: toCAD(2900, pathway === 'canadian' ? 'CAD' : 'USD') });
  items.push({ label: 'Travel & health insurance', low: pathway === 'canadian' ? 0 : toCAD(400,'USD'), high: toCAD(800, pathway === 'canadian' ? 'CAD' : 'USD') });

  // ── LM egg donation add-on ──
  if (answers.embryos === 'need_donation') {
    items.push({ label: '🌸 LM agency fee — egg donation coordination', low: 0, high: 0, note: 'Contact us for pricing' });
    items.push({ label: '🌸 Egg donor compensation', low: toCAD(5000,'USD'), high: toCAD(15000,'USD'), note: 'USD converted · varies by donor' });
    items.push({ label: '🌸 Egg donor medical screening, medications & legal', low: toCAD(4000,'USD'), high: toCAD(9000,'USD'), note: 'USD converted' });
  }

  const total = items.reduce((acc, i) => ({
    low: acc.low + (i.low || 0),
    high: acc.high + (i.high || 0),
  }), { low: 0, high: 0 });

  return { items, total };
}

function fmt(n: number) {
  return '$' + Math.round(n / 500) * 500 >= 1000
    ? '$' + (Math.round(n / 1000) * 1000).toLocaleString()
    : '$' + n.toLocaleString();
}

// ── Shared UI pieces ──────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ background: '#E8E0F5', height: 4, borderRadius: 2, marginBottom: 32, maxWidth: 520, margin: '0 auto 32px' }}>
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

function StepWrapper({ step, total, question, sub, children }: { step: number; total: number; question: string; sub?: string; children: React.ReactNode }) {
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
function PathwayResult({ title: pathwayTitle, sub, color, answers, pathway, onBack }:
  { title: string; sub: string; color: string; answers: Answers; pathway: 'canadian'|'us_ontario'|'us_us'; onBack: () => void }) {

  const { items, total } = buildBreakdown(answers, pathway);
  const hasDonation = answers.embryos === 'need_donation';

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: `2px solid ${color}33`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(61,26,110,0.08)', marginBottom: 28 }}>
      <div style={{ background: color, color: '#fff', padding: '18px 24px' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 4 }}>{sub}</div>
        <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{pathwayTitle}</div>
      </div>
      <div style={{ padding: '16px 24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 14, borderBottom: '2px solid #E8E0F5' }}>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Estimated total range</span>
          <span style={{ fontSize: '1.375rem', fontWeight: 700, color: '#3D1A6E' }}>
            {fmt(total.low)} – {fmt(total.high)} CAD
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84375rem' }}>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0ebf8' }}>
                <td style={{ padding: '7px 0', color: item.label.startsWith('🌸') ? '#7a5c00' : '#444', paddingRight: 12 }}>
                  {item.label}
                  {item.note && <span style={{ fontSize: '0.75rem', color: '#aaa', marginLeft: 6 }}>({item.note})</span>}
                </td>
                <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 500, color: item.note === 'Contact us for pricing' ? '#9B7FC7' : '#2d2d2d', whiteSpace: 'nowrap' }}>
                  {item.note === 'Contact us for pricing'
                    ? '—'
                    : item.low === item.high
                      ? fmt(item.low)
                      : `${fmt(item.low)} – ${fmt(item.high)}`}
                </td>
              </tr>
            ))}
            <tr style={{ background: '#f7f3fc' }}>
              <td style={{ padding: '10px 0', fontWeight: 700, color: '#3D1A6E' }}>Agency coordination fee</td>
              <td style={{ padding: '10px 0', textAlign: 'right', color: '#9B7FC7', fontStyle: 'italic', fontSize: '0.84375rem' }}>Contact us for pricing</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: 12, fontStyle: 'italic' }}>
          USD amounts converted at 1 USD = {RATE} CAD. All figures in Canadian dollars. Rounded to nearest $1,000.{hasDonation ? ' Egg donation costs are in addition to the above.' : ''}
        </p>
      </div>
    </div>
  );
}

// ── Results page ──────────────────────────────────────────────────────────────
function Results({ answers, onBack }: { answers: Answers; onBack: () => void }) {
  const pathways: { pathway: 'canadian'|'us_ontario'|'us_us'; title: string; sub: string; color: string }[] = [];

  if (answers.pathway === 'canadian' || answers.pathway === 'both') {
    pathways.push({ pathway: 'canadian', title: 'Canadian Surrogate · Deliver in Ontario', sub: 'CSO Fast Track · Altruistic surrogate', color: '#3D1A6E' });
  }
  if (answers.pathway === 'us_ontario' || answers.pathway === 'both') {
    pathways.push({ pathway: 'us_ontario', title: 'US Surrogate · Deliver in Ontario', sub: 'Camica Priority · Baby born in Canada', color: '#1a6e5c' });
  }
  if (answers.pathway === 'us_us') {
    pathways.push({ pathway: 'us_us', title: 'US Surrogate · Deliver in the US', sub: 'Camica Priority · Baby born in United States', color: '#1a4a6e' });
  }

  const variableFactors = [
    'Number of embryo transfer attempts needed',
    answers.location === 'international' ? 'Visa and entry documentation for your baby' : null,
    'Surrogate income (higher income = higher lost-wages reimbursement)',
    'Surrogate having young children (childcare costs)',
    'Bed rest during pregnancy — can add significant lost wages + care costs',
    'NICU stay or premature birth',
    answers.embryos === 'need_donation' ? 'Number of egg retrieval cycles needed' : null,
  ].filter(Boolean) as string[];

  return (
    <div style={{ padding: '48px 24px 80px', maxWidth: 760, margin: '0 auto' }}>
      <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B7FC7', textAlign: 'center', marginBottom: 12 }}>
        Your personalized estimate
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 500, color: '#3D1A6E', textAlign: 'center', marginBottom: 8, lineHeight: 1.2 }}>
        Here's what your journey could cost
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 40, fontSize: '0.9375rem', maxWidth: 540, margin: '0 auto 40px' }}>
        These are realistic ranges based on your situation. Every journey is different — the variables section below explains what can move the needle.
      </p>

      {pathways.map(p => (
        <PathwayResult key={p.pathway} answers={answers} {...p} onBack={onBack} />
      ))}

      {/* Variable factors */}
      <div style={{ background: '#fff8e8', borderRadius: 12, padding: '20px 24px', marginBottom: 32, border: '1px solid #e8d8a0' }}>
        <div style={{ fontWeight: 700, color: '#7a5c00', marginBottom: 10, fontSize: '0.9rem' }}>⚠️ Factors that can significantly increase costs</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#555', fontSize: '0.875rem', lineHeight: 1.8 }}>
          {variableFactors.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>

      {/* Agency fee note */}
      <div style={{ background: '#f7f3fc', borderRadius: 12, padding: '20px 24px', marginBottom: 40, border: '1px solid #cbbfe6' }}>
        <div style={{ fontWeight: 700, color: '#3D1A6E', marginBottom: 8, fontSize: '0.9rem' }}>About the agency coordination fee</div>
        <p style={{ margin: 0, color: '#555', fontSize: '0.875rem', lineHeight: 1.6 }}>
          The estimates above show your direct journey costs — surrogate expenses, medical, legal, and travel.
          The CSO / Camica agency coordination fee covers your case management, surrogate matching, screening, support throughout your journey, and all the behind-the-scenes coordination. It's listed separately because it's part of a conversation about your specific situation.
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
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});

  function answer<K extends keyof Answers>(key: K, value: Answers[K]) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStep(s => s + 1);
  }

  function back() {
    if (step > 1) { setStep(s => s - 1); }
  }

  // Total steps: 3 (+ results isn't really a "step")
  const TOTAL = 3;

  if (step > TOTAL) {
    return <Results answers={answers} onBack={() => { setStep(1); setAnswers({}); }} />;
  }

  return (
    <>
      {step > 1 && (
        <div style={{ padding: '16px 24px 0', maxWidth: 700, margin: '0 auto' }}>
          <button onClick={back}
            style={{ background: 'none', border: 'none', color: '#9B7FC7', cursor: 'pointer', fontSize: '0.875rem' }}>
            ← Back
          </button>
        </div>
      )}

      {step === 1 && (
        <StepWrapper step={1} total={TOTAL} question="Where are you and your partner based?" sub="This affects travel costs to the birth and which delivery options make sense for you.">
          <OptionGrid onSelect={v => answer('location', v as Location)} options={[
            { value: 'ontario', emoji: '🍁', label: 'Ontario, Canada', sub: 'Local to the birth' },
            { value: 'canada_other', emoji: '🇨🇦', label: 'Rest of Canada', sub: 'Domestic flights to Ontario' },
            { value: 'us_northeast', emoji: '🗽', label: 'US — Northeast', sub: 'NY, Boston, New England — ~4hr drive' },
            { value: 'us_other', emoji: '🇺🇸', label: 'US — Other states', sub: 'Flights to Ontario or US delivery' },
            { value: 'international', emoji: '✈️', label: 'Outside North America', sub: 'International flights + extended stay' },
          ]} />
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper step={2} total={TOTAL} question="What's your embryo situation?" sub="This determines whether there are shipping costs and whether egg donation is part of the picture.">
          <OptionGrid onSelect={v => answer('embryos', v as Embryos)} options={[
            { value: 'ontario_clinic', emoji: '🏥', label: 'Embryos at an Ontario clinic', sub: 'No shipping needed — ready to transfer' },
            { value: 'canada_clinic', emoji: '🇨🇦', label: 'Embryos at another Canadian clinic', sub: 'Domestic shipping to Ontario' },
            { value: 'us_clinic', emoji: '🇺🇸', label: 'Embryos at a US clinic', sub: 'Cross-border shipping required' },
            { value: 'need_donation', emoji: '🌸', label: 'We need egg donation', sub: 'Through Little Miracles — we\'ll include those costs' },
          ]} />
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper step={3} total={TOTAL} question="Which surrogate pathway are you considering?" sub="Canadian surrogates are altruistic — no compensation, longer wait. US surrogates are faster to match but higher cost.">
          <OptionGrid onSelect={v => answer('pathway', v as Pathway)} options={[
            { value: 'canadian', emoji: '🍁', label: 'Canadian surrogate', sub: 'Altruistic · $90–$130K CAD typical · 6–18 month wait' },
            { value: 'us_ontario', emoji: '🤝', label: 'US surrogate — baby born in Ontario', sub: 'Camica Priority · faster match · baby gets Canadian birth cert' },
            { value: 'us_us', emoji: '🇺🇸', label: 'US surrogate — baby born in the US', sub: 'Camica Priority · simplest if you\'re in the US · more legal steps' },
            { value: 'both', emoji: '⚖️', label: 'Show me Canadian + US side by side', sub: 'Compare your two main options' },
          ]} />
        </StepWrapper>
      )}
    </>
  );
}
