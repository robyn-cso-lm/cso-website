import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Jost } from 'next/font/google';
import CostQuiz from '../../surrogacy-costs/CostQuiz';
import styles from '../../surrogacy-costs/quiz.module.css';
import { NOT_COVERED_BY_AGENCY_FEE } from '@/lib/pricing';

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

const URL = 'https://canadiansurrogacyoptions.com/camica/costs';

export const metadata: Metadata = {
  title: { absolute: 'What Does U.S. Surrogacy Cost? | Camica' },
  description:
    'Answer seven quick questions and see what U.S. surrogacy could cost for your family, with the agency fee separated from surrogate compensation, medical, legal and escrow. No call needed.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'What Does U.S. Surrogacy Cost for Your Family? | Camica',
    description: 'Seven questions, a written breakdown, no call required.',
    url: URL,
  },
};

export default function CamicaCostsPage() {
  return (
    <div className={`camica-shell ${jost.variable} ${styles.camica}`}>
      <header className={styles.camHeader}>
        <div className={styles.camHeaderInner}>
          <a href="https://camica.ca" className={styles.camWordmark}>CAMI<span>C</span>A</a>
          <nav className={styles.camLinks} aria-label="Camica">
            <a href="https://camica.ca/#intended-parents">For Intended Parents</a>
            <a href="https://calendly.com/cso-robyn/camica-consult" className={styles.camBtn}>Book a consultation</a>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.heroInner} hero-enter`}>
          <p className={styles.eyebrow}>A clearer way to begin</p>
          <h1 className={styles.h1}>What does U.S. surrogacy cost for your family?</h1>
          <p className={styles.sub}>
            Seven quick questions. Every cost, up front, with what you pay us kept separate
            from surrogate compensation, medical, legal and escrow. No call needed.
          </p>
        </div>
        <Suspense fallback={null}>
          <CostQuiz brand="camica" defaultRoute="us" />
        </Suspense>
      </section>

      <section className={styles.explain}>
        <div className={styles.explainInner}>
          <div className={styles.explainCol}>
            <h2 className={styles.h2}>What the agency fee covers</h2>
            <p className={styles.body}>
              Camica&rsquo;s fee pays for our work: matching, screening, contract coordination,
              escrow setup and a case manager who knows your name. It is one part of the budget,
              and the estimate shows the rest.
            </p>
          </div>
          <div className={styles.explainCol}>
            <h2 className={styles.h2}>What it does not cover</h2>
            <ul className={styles.list}>
              {NOT_COVERED_BY_AGENCY_FEE.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className={styles.camFooter}>
        <em>from hope to heartbeat to home</em>
        Camica &middot; Florida&rsquo;s boutique surrogacy agency &middot; Serving North America<br />
        <a href="mailto:robyn@camica.ca">robyn@camica.ca</a> &middot; Sister agency:{' '}
        <a href="https://canadiansurrogacyoptions.com">Canadian Surrogacy Options</a>
      </footer>
    </div>
  );
}
