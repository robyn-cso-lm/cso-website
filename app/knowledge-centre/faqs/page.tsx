import type { Metadata } from 'next';
import Link from 'next/link';
import { getKnowledgeEntriesByType, getKnowledgeEntryHref, getRelatedKnowledgeEntries } from '@/lib/knowledge';
import styles from '../knowledge.module.css';

export const metadata: Metadata = {
  title: 'FAQs | CSO Knowledge Centre',
  description: 'Plain-language answers to common questions about surrogacy and egg donation in Canada, from Canadian Surrogacy Options.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/knowledge-centre/faqs' },
};

export default function FAQsPage() {
  const faqs = getKnowledgeEntriesByType('faq');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((entry) => ({
      '@type': 'Question',
      name: entry.question || entry.title,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer || entry.description },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://canadiansurrogacyoptions.com' },
      { '@type': 'ListItem', position: 2, name: 'Knowledge Centre', item: 'https://canadiansurrogacyoptions.com/knowledge-centre' },
      { '@type': 'ListItem', position: 3, name: 'FAQs', item: 'https://canadiansurrogacyoptions.com/knowledge-centre/faqs' },
    ],
  };

  return (
    <div className={styles.shell}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/knowledge-centre">Knowledge Centre</Link><span>/</span><span>FAQs</span>
          </nav>
          <h1 className={styles.title}>FAQs</h1>
          <p className={styles.subtitle}>Honest answers to the questions we hear most about surrogacy and egg donation in Canada.</p>
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
                  <h2 className={styles.cardTitle}>
                    <Link href={getKnowledgeEntryHref(entry)}>{entry.question || entry.title}</Link>
                  </h2>
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
