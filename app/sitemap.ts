import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

const BASE_URL = 'https://canadiansurrogacyoptions.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // Use the most recent blog post date for the blog index; stable dates for static pages
  const latestPostDate = posts.length > 0 ? new Date(posts[0].date) : new Date('2026-05-01');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/intended-parents`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE_URL}/programs`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/surrogates`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/qualify`, lastModified: new Date('2026-06-14'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/guides/is-surrogacy-right`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/guides/canadian-surrogacy-roadmap`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/guides/ip-profile-template`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/guides/surrogate-readiness`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date('2026-06-14'), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/resources`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/faq`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/families`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/lgbtq-surrogacy`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/international`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date('2026-05-01'), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
