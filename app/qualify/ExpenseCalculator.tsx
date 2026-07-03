'use client';

import { useMemo, useState } from 'react';
import styles from './ExpenseCalculator.module.css';

// Eligible expense reimbursement estimator (AHRA-compliant framing:
// reimbursement of eligible expenses, not payment). Rates mirror the
// becomeasurrogate.ca calculator so the two tools always agree.
const RATES = {
  base: {
    first: { low: 35000, high: 40000, label: 'First journey' },
    one: { low: 40000, high: 45000, label: '1 prior journey' },
    two_plus: { low: 45000, high: 50000, label: '2+ journeys' },
  },
  outOfPocket: { low: 4000, high: 4000 },
  travel: { low: 6000, high: 8000 },
  twins: { low: 5000, high: 5000 },
  csection: { low: 5000, high: 5000 },
  lostWagesPerWeek: 550,
  bedRestPerWeek: 700,
} as const;

type Experience = keyof typeof RATES.base;

const fmt = (n: number) => '$' + n.toLocaleString('en-CA');

export default function ExpenseCalculator() {
  const [experience, setExperience] = useState<Experience>('first');
  const [twins, setTwins] = useState(false);
  const [csection, setCsection] = useState(false);
  const [lostWagesWeeks, setLostWagesWeeks] = useState(0);
  const [bedRestWeeks, setBedRestWeeks] = useState(0);

  const { rows, totalLow, totalHigh } = useMemo(() => {
    const base = RATES.base[experience];
    const rows: { label: string; low: number; high: number; note?: string }[] = [
      { label: 'Base allowable expenses', low: base.low, high: base.high, note: 'reimbursed monthly' },
      { label: 'Out-of-pocket expenses', low: RATES.outOfPocket.low, high: RATES.outOfPocket.high, note: 'once pregnancy confirmed' },
      { label: 'Travel & accommodation', low: RATES.travel.low, high: RATES.travel.high, note: 'screening + transfer trips' },
    ];
    if (twins) rows.push({ label: 'Twins allowance', low: RATES.twins.low, high: RATES.twins.high });
    if (csection) rows.push({ label: 'C-section allowance', low: RATES.csection.low, high: RATES.csection.high });
    if (lostWagesWeeks > 0) {
      const amt = lostWagesWeeks * RATES.lostWagesPerWeek;
      rows.push({ label: `Lost wages (${lostWagesWeeks} wk${lostWagesWeeks > 1 ? 's' : ''})`, low: amt, high: amt });
    }
    if (bedRestWeeks > 0) {
      const amt = bedRestWeeks * RATES.bedRestPerWeek;
      rows.push({ label: `Bed rest (${bedRestWeeks} wk${bedRestWeeks > 1 ? 's' : ''})`, low: amt, high: amt });
    }
    return {
      rows,
      totalLow: rows.reduce((s, r) => s + r.low, 0),
      totalHigh: rows.reduce((s, r) => s + r.high, 0),
    };
  }, [experience, twins, csection, lostWagesWeeks, bedRestWeeks]);

  return (
    <div className={styles.calc}>
      <p className={styles.calcEyebrow}>Your journey, covered</p>
      <h3 className={styles.calcTitle}>What could your expense reimbursements look like?</h3>
      <p className={styles.calcSub}>
        You never pay to be a surrogate — your eligible expenses are reimbursed throughout the journey.
        Adjust the sliders to see a typical range.
      </p>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>Surrogacy experience</span>
        <div className={styles.pillRow}>
          {(Object.keys(RATES.base) as Experience[]).map((key) => (
            <button
              type="button"
              key={key}
              className={`${styles.pill} ${experience === key ? styles.pillActive : ''}`}
              onClick={() => setExperience(key)}
            >
              {RATES.base[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          Weeks of missed work <em>({lostWagesWeeks} wk{lostWagesWeeks === 1 ? '' : 's'})</em>
        </span>
        <input
          type="range"
          min={0}
          max={20}
          step={1}
          value={lostWagesWeeks}
          onChange={(e) => setLostWagesWeeks(Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.controlGroup}>
        <span className={styles.controlLabel}>
          Weeks of bed rest, if any <em>({bedRestWeeks} wk{bedRestWeeks === 1 ? '' : 's'})</em>
        </span>
        <input
          type="range"
          min={0}
          max={12}
          step={1}
          value={bedRestWeeks}
          onChange={(e) => setBedRestWeeks(Number(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.toggleRow}>
        <button type="button" className={`${styles.toggle} ${twins ? styles.toggleActive : ''}`} onClick={() => setTwins(!twins)}>
          Twins {twins ? '✓' : ''}
        </button>
        <button type="button" className={`${styles.toggle} ${csection ? styles.toggleActive : ''}`} onClick={() => setCsection(!csection)}>
          C-section {csection ? '✓' : ''}
        </button>
      </div>

      <div className={styles.totalCard}>
        <p className={styles.totalLabel}>Typical eligible reimbursements</p>
        <p className={styles.totalRange}>
          {fmt(totalLow)} <span className={styles.totalDash}>–</span> {fmt(totalHigh)}
        </p>
        <p className={styles.totalNote}>Tax-free. On top of pregnancy care covered by your provincial health plan.</p>
      </div>

      <div className={styles.breakdown}>
        {rows.map((r) => (
          <div className={styles.breakdownRow} key={r.label}>
            <span>
              {r.label}
              {r.note ? <em> — {r.note}</em> : null}
            </span>
            <span className={styles.breakdownAmt}>
              {r.low === r.high ? fmt(r.low) : `${fmt(r.low)}–${fmt(r.high)}`}
            </span>
          </div>
        ))}
      </div>

      <p className={styles.disclaimer}>
        Estimates based on typical CSO journeys. Canadian surrogacy is altruistic: these are
        reimbursements of your actual eligible expenses under the Assisted Human Reproduction Act,
        documented and paid throughout your journey — never money out of your pocket.
      </p>
    </div>
  );
}
