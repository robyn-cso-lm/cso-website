import Link from 'next/link';
import styles from '../guides.module.css';

export const metadata = { title: 'From Surrogate to Agency Team | Career Guide', description: 'Explore six surrogacy agency roles, prepare your résumé and practise for interviews with this 16-page PDF.' };

export default function AgencyTeamGuide() {
  return <main>
    <section className={styles.hero}><div className={styles.inner}>
      <p className={styles.eyebrow}>Canadian Surrogacy Options · Career guide</p>
      <h1 className={styles.title}>From Surrogate to Agency Team</h1>
      <p className={styles.subtitle}>Carrying for a family and supporting someone else’s journey are different kinds of work. Explore six agency roles and see where your experience fits.</p>
    </div></section>
    <section className={styles.grid}><div className={styles.inner}>
      <div className={styles.card}><h2 className={styles.cardTitle}>Build your next step</h2>
      <p className={styles.cardDescription}>This 16-page guide includes a résumé template, an agency introduction email, interview questions, and a 30-day plan. It also covers boundaries and the questions to ask before accepting a role.</p>
      <p className={styles.cardDescription}>One payment of CAD $37. After payment, your personal PDF download link is emailed to the address entered at checkout. The link lasts 72 hours.</p>
      <a className="btn btn-primary" href="https://buy.stripe.com/fZu8wO4eGa639U9a4X8Ra09">Buy the PDF for CAD $37</a></div>
      <p>This is an educational resource, not a job opening. Buying it is not required to apply and does not guarantee employment or give you a hiring advantage.</p>
      <p><Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/contact">Questions about your purchase?</Link></p>
    </div></section></main>;
}
