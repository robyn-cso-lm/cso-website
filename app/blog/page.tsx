import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, CATEGORIES } from '@/lib/mdx';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Blog — Surrogacy Insights & Stories',
  description: 'Expert guidance, real stories, and practical information about surrogacy in Canada. Written by Robyn Price, Executive Director of Canadian Surrogacy Options.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/blog',
  },
  openGraph: {
    title: 'Blog | Canadian Surrogacy Options',
    description: 'Surrogacy insights, real stories, and expert guidance from Canada\'s first surrogacy agency.',
    url: 'https://canadiansurrogacyoptions.com/blog',
  },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allPosts = getAllPosts();
  const activeCategory = searchParams?.category || 'All';

  const filtered =
    activeCategory === 'All'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Insights &amp; Stories</p>
          <h1 className={styles.heroH1}>From Robyn&rsquo;s Desk</h1>
          <p className={styles.heroSub}>
            Practical guidance, real stories, and honest perspectives on surrogacy in Canada.
            Whether you&rsquo;re just beginning to explore or deep in your journey, you&rsquo;ll find
            something here for you.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className={styles.filterSection}>
        <div className={styles.filterInner}>
          <div className={styles.filterTabs}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className={`${styles.filterTab} ${activeCategory === cat ? styles.activeTab : ''}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className={styles.postsSection}>
        <div className={styles.postsInner}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No posts found in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {filtered.map((post) => (
                <article key={post.slug} className={styles.postCard}>
                  <div className={styles.cardCategoryBadge}>{post.category}</div>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className={styles.cardDate}>{formatDate(post.date)}</p>
                  <p className={styles.cardDesc}>{post.description}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.cardReadMore}>
                    Read More &rarr;
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
