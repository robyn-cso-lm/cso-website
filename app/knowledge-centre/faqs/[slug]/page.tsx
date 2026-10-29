import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getKnowledgeEntriesByType,
  getKnowledgeEntryBySlug,
  getKnowledgeEntryHref,
  getRelatedKnowledgeEntries,
} from '@/lib/knowledge';
import styles from '../../knowledge.module.css';

interface Props {
  params: { slug: string };
}

const SITE = 'https://canadiansurrogacyoptions.com';

export async function generateStaticParams() {
  return getKnowledgeEntriesByType('faq').map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getKnowledgeEntryBySlug(params.slug);
  if (!entry || entry.type !== 'faq') return { title: 'Question Not Found' };
  const title = entry.question || entry.title;

  return {
    title: `${title} | CSO FAQ`,
    description: entry.answer || entry.description,
    alternates: { canonical: `${SITE}/knowledge-centre/faqs/${entry.slug}` },
    openGraph: {
      title,
      description: entry.answer || entry.description,
      type: 'article',
    },
  };
}

export default function FAQEntryPage({ params }: Props) {
  const entry = getKnowledgeEntryBySlug(params.slug);
  if (!entry || entry.type !== 'faq') notFound();

  const question = entry.question || entry.title;
  const related = getRelatedKnowledgeEntries(entry, 4);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: entry.answer || entry.description },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Knowledge Centre', item: `${SITE}/knowledge-centre` },
      { '@type': 'ListItem', position: 3, name: 'FAQs', item: `${SITE}/knowledge-centre/faqs` },
      { '@type': 'ListItem', position: 4, name: question, item: `${SITE}/knowledge-centre/faqs/${entry.slug}` },
    ],
  };

  return (
    <div className={styles.shell}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/knowledge-centre">Knowledge Centre</Link>
            <span>/</span>
            <Link href="/knowledge-centre/faqs">FAQs</Link>
            <span>/</span>
            <span>{question}</span>
          </nav>
          <div className={styles.badgeRow}>
            <Link href={`/knowledge-centre?category=${encodeURIComponent(entry.knowledgeCategory)}`} className={styles.badge}>
              {entry.knowledgeCategory}
            </Link>
          </div>
          <h1 className={styles.title}>{question}</h1>
          <p className={styles.subtitle}>{entry.answer}</p>
          <p className={styles.meta}>
            By <Link href={`/knowledge-centre/authors/${entry.authorSlug}`}>{entry.author}</Link>
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.inner} ${styles.layout}`}>
          <article className={styles.article}>
            <div className={styles.prose}>
              <MDXRemote source={entry.content} />
            </div>
            <p>
              <Link href="/knowledge-centre/faqs">See all FAQs</Link>
            </p>
          </article>

          <aside className={styles.sidebar}>
            {related.length > 0 && (
              <div className={styles.panel}>
                <h2 className={styles.cardTitle}>Related questions and guides</h2>
                <ul className={styles.linkList}>
                  {related.map((item) => (
                    <li key={`${item.type}-${item.slug}`}>
                      <Link href={getKnowledgeEntryHref(item)}>{item.question || item.title}</Link>
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
