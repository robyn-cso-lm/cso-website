import type { Metadata } from 'next';
import Link from 'next/link';
import { getKnowledgeEntriesByType, getKnowledgeEntryHref, getRelatedKnowledgeEntries } from '@/lib/knowledge';
import styles from '../knowledge.module.css';

export const metadata: Metadata = {
  title: 'FAQs | CSO Knowledge Centre',
  description: 'Standalone FAQ entries from Canadian Surrogacy Options.',
};

export default function FAQsPage() {
  const faqs = getKnowledgeEntriesByType('faq');

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/knowledge-centre">Knowledge Centre</Link><span>/</span><span>FAQs</span>
          </nav>
          <h1 className={styles.title}>FAQs</h1>
          <p className={styles.subtitle}>Questions and answers live here as standalone entries, not blog posts.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.cardGrid}>
            {faqs.map((entry) => {
              const related = getRelatedKnowledgeEntries(entry, 3);
              return (
                <article key={entry.slug} className={styles.card}>
                  <span className={styles.badge}>{entry.knowledgeCategory}</span>
                  <h2 className={styles.cardTitle}>{entry.question || entry.title}</h2>
                  <p className={styles.cardText}>{entry.answer || entry.content}</p>
                  {related.length > 0 && (
                    <ul className={styles.linkList}>
                      {related.map((item) => (
                        <li key={`${item.type}-${item.slug}`}><Link href={getKnowledgeEntryHref(item)}>{item.title}</Link></li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
