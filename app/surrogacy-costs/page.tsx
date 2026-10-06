import type { Metadata } from 'next';
import { Suspense } from 'react';
import CostQuiz from './CostQuiz';
import styles from './quiz.module.css';
import { NOT_COVERED_BY_AGENCY_FEE } from '@/lib/pricing';

const URL = 'https://canadiansurrogacyoptions.com/surrogacy-costs';

export const metadata: Metadata = {
  title: 'What Does Surrogacy Cost? Honest Costs for Your Family',
  description:
    'Answer seven quick questions and see what surrogacy could cost for your family in Canada or the U.S., with agency fees separated from everything else. No call needed.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'What Does Surrogacy Cost for Your Family? | Canadian Surrogacy Options',
    description:
      'Seven questions, a written breakdown, no call required. Agency fees and client expenses, separated line by line.',
    url: URL,
  },
};

export default function SurrogacyCostsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} hero-enter`}>
          <p className={styles.eyebrow}>A clearer way to begin</p>
          <h1 className={styles.h1}>What will surrogacy cost for your family?</h1>
          <p className={styles.sub}>
            Seven quick questions. Every cost, up front, with what you pay us kept separate
            from what you pay everyone else. Our fee is paid in three stages, and no call is needed.
          </p>
        </div>
        <Suspense fallback={null}>
          <CostQuiz />
        </Suspense>
      </section>

      <section className={styles.explain}>
        <div className={styles.explainInner}>
          <div className={styles.explainCol}>
            <h2 className={styles.h2}>What the agency fee covers</h2>
            <p className={styles.body}>
              The agency fee pays for our work: matching, case management, screening
              coordination, your profile, and a team that stays involved. It is the smaller
              part of the budget.
            </p>
          </div>
          <div className={styles.explainCol}>
            <h2 className={styles.h2}>What it does not cover</h2>
            <ul className={styles.list}>
              {NOT_COVERED_BY_AGENCY_FEE.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.body}>
              These are paid to your surrogate, clinic, lawyers and insurers. We show every
              line in your estimate so nothing arrives as a surprise.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
