import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx';
import LeadCapture from '@/components/LeadCapture';
import ContactForm from '@/components/ContactForm';
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

  const ogImage = post.image
    ? `https://canadiansurrogacyoptions.com${post.image}`
    : 'https://canadiansurrogacyoptions.com/og-image.png';

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
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

  const ogImage = post.image
    ? `https://canadiansurrogacyoptions.com${post.image}`
    : 'https://canadiansurrogacyoptions.com/og-image.png';

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: 'Robyn Price',
      url: 'https://canadiansurrogacyoptions.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Canadian Surrogacy Options',
      url: 'https://canadiansurrogacyoptions.com',
      logo: { '@type': 'ImageObject', url: 'https://canadiansurrogacyoptions.com/og-image.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://canadiansurrogacyoptions.com/blog/${post.slug}`,
    },
    url: `https://canadiansurrogacyoptions.com/blog/${post.slug}`,
    keywords: post.keywords?.join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://canadiansurrogacyoptions.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://canadiansurrogacyoptions.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://canadiansurrogacyoptions.com/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
              Book a free 30-minute call with Robyn. No commitment, no pressure. Just
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

          {/* Contact Form */}
          <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>Or send a message</h3>
            <p className={styles.contactSub}>
              Not ready to book a call? Send Robyn a message directly — she reads every one.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Email capture */}
      <LeadCapture />

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
