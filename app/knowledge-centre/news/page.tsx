import type { Metadata } from 'next';
import Link from 'next/link';
import { getKnowledgeEntriesByType, getKnowledgeEntryHref, getRelatedKnowledgeEntries } from '@/lib/knowledge';
import styles from '../knowledge.module.css';

export const metadata: Metadata = {
  title: 'News | CSO Knowledge Centre',
  description: 'CSO news and announcements, separate from blogs and Knowledge Centre articles.',
};

export default function NewsPage() {
  const news = getKnowledgeEntriesByType('news');

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/knowledge-centre">Knowledge Centre</Link><span>/</span><span>News</span>
          </nav>
          <h1 className={styles.title}>News</h1>
          <p className={styles.subtitle}>News is kept separate from blogs and educational resources.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`${styles.inner} ${styles.cardGrid}`}>
          {news.map((entry) => {
            const related = getRelatedKnowledgeEntries(entry, 3);
            return (
              <article key={entry.slug} className={styles.card}>
                <div className={styles.badgeRow}>
                  <span className={styles.badge}>{entry.knowledgeCategory}</span>
                  {entry.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/knowledge-centre?tag=${encodeURIComponent(tag)}`} className={styles.badge}>{tag}</Link>
                  ))}
                </div>
                <h2 className={styles.cardTitle}>{entry.title}</h2>
                <p className={styles.cardText}>{entry.description}</p>
                <p className={styles.meta}>By {entry.author}</p>
                {related.length > 0 && (
                  <>
                    <p className={styles.meta}>You may also like...</p>
                    <ul className={styles.linkList}>
                      {related.map((item) => (
                        <li key={`${item.type}-${item.slug}`}><Link href={getKnowledgeEntryHref(item)}>{item.title}</Link></li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
