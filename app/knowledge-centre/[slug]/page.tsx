import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getAllKnowledgeEntries,
  getKnowledgeEntryBySlug,
  getKnowledgeEntryHref,
  getRelatedKnowledgeEntries,
} from '@/lib/knowledge';
import styles from '../knowledge.module.css';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllKnowledgeEntries()
    .filter((entry) => entry.type === 'article')
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getKnowledgeEntryBySlug(params.slug);
  if (!entry || entry.type !== 'article') return { title: 'Resource Not Found' };

  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `https://canadiansurrogacyoptions.com/knowledge-centre/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: 'article',
      publishedTime: entry.originallyPublished || entry.date,
    },
  };
}

function formatDate(date?: string) {
  if (!date) return 'Date to review';
  return new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function KnowledgeArticlePage({ params }: Props) {
  const entry = getKnowledgeEntryBySlug(params.slug);
  if (!entry || entry.type !== 'article') notFound();

  const related = getRelatedKnowledgeEntries(entry);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    datePublished: entry.originallyPublished || entry.date,
    dateModified: entry.lastReviewed || entry.date,
    author: {
      '@type': 'Person',
      name: entry.author,
      url: `https://canadiansurrogacyoptions.com/knowledge-centre/authors/${entry.authorSlug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Canadian Surrogacy Options',
      url: 'https://canadiansurrogacyoptions.com',
    },
  };

  return (
    <div className={styles.shell}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/knowledge-centre">Knowledge Centre</Link>
            <span>/</span>
            <span>{entry.title}</span>
          </nav>
          <div className={styles.badgeRow}>
            <Link href={`/knowledge-centre?category=${encodeURIComponent(entry.knowledgeCategory)}`} className={styles.badge}>
              {entry.knowledgeCategory}
            </Link>
            {entry.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/knowledge-centre?tag=${encodeURIComponent(tag)}`} className={styles.badge}>
                {tag}
              </Link>
            ))}
          </div>
          <h1 className={styles.title}>{entry.title}</h1>
          <p className={styles.subtitle}>{entry.description}</p>
          <p className={styles.meta}>
            By <Link href={`/knowledge-centre/authors/${entry.authorSlug}`}>{entry.author}</Link>
            {' '} - Originally published {formatDate(entry.originallyPublished || entry.date)}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.inner} ${styles.layout}`}>
          <article className={styles.article}>
            <div className={styles.prose}>
              <MDXRemote source={entry.content} />
            </div>
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.panel}>
              <h2 className={styles.cardTitle}>Review Metadata</h2>
              <p className={styles.smallText}>Last reviewed: {entry.lastReviewed || 'Not reviewed yet'}</p>
              <p className={styles.smallText}>Review status: {entry.reviewStatus || 'Unscored'}</p>
              <p className={styles.smallText}>Rewrite priority: {entry.rewritePriority || 'Unscored'}</p>
              <p className={styles.smallText}>SEO score: {entry.seoScore || 'Unscored'}</p>
              <p className={styles.smallText}>Internal links needed: {entry.internalLinksNeeded || 'TBD'}</p>
            </div>

            {related.length > 0 && (
              <div className={styles.panel}>
                <h2 className={styles.cardTitle}>You may also like...</h2>
                <ul className={styles.linkList}>
                  {related.map((item) => (
                    <li key={`${item.type}-${item.slug}`}>
                      <Link href={getKnowledgeEntryHref(item)}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
