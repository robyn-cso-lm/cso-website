import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FUTURE_CONTENT_TYPES,
  KNOWLEDGE_CATEGORIES,
  KnowledgeType,
  filterKnowledgeEntries,
  getAllKnowledgeEntries,
  getAllTags,
  getKnowledgeEntryHref,
} from '@/lib/knowledge';
import styles from './knowledge.module.css';

export const metadata: Metadata = {
  title: 'Knowledge Centre | Canadian Surrogacy Options',
  description: 'CSO resources for surrogacy, egg donation, legal questions, costs, international families, surrogates, intended parents, downloads, FAQs, news, and research.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/knowledge-centre' },
};

export default function KnowledgeCentrePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; tag?: string; type?: string };
}) {
  const entries = getAllKnowledgeEntries();
  const tags = getAllTags(entries);
  const requestedType = searchParams?.type;
  const activeType: KnowledgeType | 'all' =
    requestedType === 'article' ||
    requestedType === 'download' ||
    requestedType === 'faq' ||
    requestedType === 'news'
      ? requestedType
      : 'all';
  const filtered = filterKnowledgeEntries(entries, {
    query: searchParams?.q,
    category: searchParams?.category,
    tag: searchParams?.tag,
    type: activeType,
  });

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Knowledge Centre</span>
          </nav>
          <p className={styles.eyebrow}>CSO Digital Library</p>
          <h1 className={styles.title}>Knowledge Centre</h1>
          <p className={styles.subtitle}>
            A growing library for surrogacy education, recovered historical resources, guides,
            FAQs, research, and news from Canadian Surrogacy Options.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.navGrid}>
            {KNOWLEDGE_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/knowledge-centre?category=${encodeURIComponent(category)}`}
                className={styles.navCard}
              >
                <span className={styles.badge}>{category}</span>
                <h2 className={styles.cardTitle}>{category}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <form className={styles.filters}>
            <div className={styles.field}>
              <label htmlFor="q">Search</label>
              <input id="q" name="q" defaultValue={searchParams?.q || ''} className={styles.input} placeholder="Search by keyword" />
            </div>
            <div className={styles.field}>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" defaultValue={searchParams?.category || 'All'} className={styles.select}>
                <option value="All">All</option>
                {KNOWLEDGE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="type">Content Type</label>
              <select id="type" name="type" defaultValue={searchParams?.type || 'all'} className={styles.select}>
                <option value="all">All</option>
                <option value="article">Articles</option>
                <option value="download">Downloads</option>
                <option value="faq">FAQs</option>
                <option value="news">News</option>
              </select>
            </div>
            {searchParams?.tag && <input type="hidden" name="tag" value={searchParams.tag} />}
          </form>

          <div className={styles.badgeRow} style={{ marginBottom: 24 }}>
            {tags.slice(0, 18).map((tag) => (
              <Link key={tag} href={`/knowledge-centre?tag=${encodeURIComponent(tag)}`} className={styles.badge}>
                {tag}
              </Link>
            ))}
          </div>

          <div className={styles.cardGrid}>
            {filtered.map((entry) => (
              <Link key={`${entry.type}-${entry.slug}`} href={getKnowledgeEntryHref(entry)} className={styles.card}>
                <div className={styles.badgeRow}>
                  <span className={styles.badge}>{entry.knowledgeCategory}</span>
                  <span className={styles.badge}>{entry.type}</span>
                </div>
                <h2 className={styles.cardTitle}>{entry.title}</h2>
                <p className={styles.cardText}>{entry.description}</p>
                <p className={styles.meta}>By {entry.author}</p>
              </Link>
            ))}
          </div>

          <div className={styles.cardGrid} style={{ marginTop: 28 }}>
            {FUTURE_CONTENT_TYPES.map((type) => (
              <div key={type} className={`${styles.card} ${styles.placeholder}`}>
                <span className={styles.badge}>Placeholder</span>
                <h2 className={styles.cardTitle}>{type}</h2>
                <p className={styles.cardText}>Reserved for the next phase of the CSO digital library.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
