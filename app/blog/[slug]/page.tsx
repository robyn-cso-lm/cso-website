import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx';
import styles from './post.module.css';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://canadiansurrogacyoptions.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://canadiansurrogacyoptions.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category);

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Robyn Price',
      url: 'https://canadiansurrogacyoptions.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Canadian Surrogacy Options',
      url: 'https://canadiansurrogacyoptions.com',
    },
    url: `https://canadiansurrogacyoptions.com/blog/${post.slug}`,
    keywords: post.keywords?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className={styles.categoryBadge}>
            {post.category}
          </Link>
          <h1 className={styles.heroH1}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>By Robyn Price</span>
            <span className={styles.metaDivider}>&middot;</span>
            <time className={styles.date} dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          <article className={styles.prose}>
            <MDXRemote source={post.content} />
          </article>

          {/* CTA Block */}
          <div className={styles.ctaBlock}>
            <h3 className={styles.ctaTitle}>Ready to start your journey?</h3>
            <p className={styles.ctaText}>
              Book a free 30-minute call with Robyn. No commitment, no pressure &mdash; just
              the information you need to take your next step with confidence.
            </p>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Book Now &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedInner}>
            <h2 className={styles.relatedTitle}>More in {post.category}</h2>
            <div className={styles.relatedGrid}>
              {related.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className={styles.relatedCard}>
                  <p className={styles.relatedCat}>{rel.category}</p>
                  <h3 className={styles.relatedCardTitle}>{rel.title}</h3>
                  <p className={styles.relatedDesc}>{rel.description}</p>
                  <span className={styles.relatedReadMore}>Read more &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
