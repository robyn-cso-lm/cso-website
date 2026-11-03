import Link from 'next/link';
import styles from './KnowledgeLinks.module.css';

export interface KnowledgeLink {
  href: string;
  label: string;
}

interface Props {
  label?: string;
  heading: string;
  sub?: string;
  links: KnowledgeLink[];
}

export default function KnowledgeLinks({ label = 'From the Knowledge Centre', heading, sub, links }: Props) {
  return (
    <section className={styles.wrap} aria-labelledby="kc-links-heading">
      <div className={styles.inner}>
        <span className={styles.label}>{label}</span>
        <h2 id="kc-links-heading" className={styles.heading}>{heading}</h2>
        {sub && <p className={styles.sub}>{sub}</p>}
        <div className={styles.grid}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.card}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/knowledge-centre" className={styles.more}>
          Browse the whole Knowledge Centre &rarr;
        </Link>
      </div>
    </section>
  );
}
