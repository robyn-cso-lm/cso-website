import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllAuthorProfiles, getAllKnowledgeEntries, getKnowledgeEntryHref, readAuthorProfile } from '@/lib/knowledge';
import styles from '../../knowledge.module.css';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllAuthorProfiles().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = readAuthorProfile(params.slug);
  if (!author) return { title: 'Author Not Found' };
  return {
    title: `${author.name} | CSO Knowledge Centre`,
    description: `${author.name}, ${author.role} at ${author.organization}.`,
  };
}

export default function AuthorPage({ params }: Props) {
  const author = readAuthorProfile(params.slug);
  if (!author) notFound();

  const entries = getAllKnowledgeEntries().filter((entry) => entry.authorSlug === author.slug);
  const articles = entries.filter((entry) => entry.type === 'article');
  const guides = entries.filter((entry) => entry.type === 'download');
  const research = entries.filter((entry) => entry.knowledgeCategory === 'Research');
  const news = entries.filter((entry) => entry.type === 'news');

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/knowledge-centre">Knowledge Centre</Link>
            <span>/</span>
            <span>{author.name}</span>
          </nav>
          <p className={styles.eyebrow}>{author.role}</p>
          <h1 className={styles.title}>{author.name}</h1>
          <p className={styles.subtitle}>{author.organization}</p>
          <p className={styles.subtitle}>{author.bio}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.navGrid}>
            <div className={styles.panel}><h2 className={styles.cardTitle}>{articles.length}</h2><p className={styles.cardText}>Articles</p></div>
            <div className={styles.panel}><h2 className={styles.cardTitle}>{guides.length}</h2><p className={styles.cardText}>Guides</p></div>
            <div className={styles.panel}><h2 className={styles.cardTitle}>{research.length}</h2><p className={styles.cardText}>Research</p></div>
            <div className={styles.panel}><h2 className={styles.cardTitle}>{news.length}</h2><p className={styles.cardText}>News</p></div>
          </div>

          <div className={styles.cardGrid} style={{ marginTop: 28 }}>
            {entries.map((entry) => (
              <Link key={`${entry.type}-${entry.slug}`} href={getKnowledgeEntryHref(entry)} className={styles.card}>
                <span className={styles.badge}>{entry.type}</span>
                <h2 className={styles.cardTitle}>{entry.title}</h2>
                <p className={styles.cardText}>{entry.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
