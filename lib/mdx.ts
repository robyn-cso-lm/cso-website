import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  keywords: string[];
}

export interface Post extends PostFrontmatter {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const fullPath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(raw);

    return {
      title: data.title || '',
      slug: data.slug || filename.replace('.mdx', ''),
      date: data.date || '',
      description: data.description || '',
      category: data.category || 'Uncategorized',
      keywords: data.keywords || [],
    } as PostFrontmatter;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  return {
    title: data.title || '',
    slug: data.slug || slug,
    date: data.date || '',
    description: data.description || '',
    category: data.category || 'Uncategorized',
    keywords: data.keywords || [],
    content,
  };
}

export function getRelatedPosts(currentSlug: string, category: string, max = 3): PostFrontmatter[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, max);
}

export const CATEGORIES = [
  'All',
  'Intended Parents',
  'Surrogates',
  'Egg Donation',
  'Legal and Process',
  'Real Stories',
  'Agency News',
] as const;
