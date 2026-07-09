import type { Metadata } from 'next';
import Link from 'next/link';
import { getKnowledgeEntriesByType, getKnowledgeEntryHref, getRelatedKnowledgeEntries } from '@/lib/knowledge';
import styles from '../knowledge.module.css';

export const metadata: Metadata = {
  title: 'Downloads | CSO Knowledge Centre',
  description: 'CSO guides, PDFs, and downloadable resources.',
};

export default function DownloadsPage() {
  const downloads = getKnowledgeEntriesByType('download');

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/knowledge-centre">Knowledge Centre</Link><span>/</span><span>Downloads</span>
          </nav>
          <h1 className={styles.title}>Downloads</h1>
          <p className={styles.subtitle}>Guides and PDFs live here as their own content type.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`${styles.inner} ${styles.cardGrid}`}>
          {downloads.map((entry) => {
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
                {entry.downloadUrl && <Link href={entry.downloadUrl} className={styles.button}>Open Download</Link>}
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
