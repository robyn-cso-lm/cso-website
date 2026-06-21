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
  image?: string;
}

export interface Post extends PostFrontmatter {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function readPostFile(fullPath: string) {
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const filename = path.basename(fullPath, '.mdx');

  return {
    title: data.title || '',
    slug: data.slug || filename,
    date: data.date || '',
    description: data.description || '',
    category: data.category || 'Uncategorized',
    keywords: data.keywords || [],
    image: data.image || undefined,
    content,
  } as Post;
}

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const fullPath = path.join(BLOG_DIR, filename);
    return readPostFile(fullPath);
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const directPath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(directPath)) {
    return readPostFile(directPath);
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  for (const filename of files) {
    const fullPath = path.join(BLOG_DIR, filename);
    const post = readPostFile(fullPath);

    if (post.slug === slug) {
      return post;
    }
  }

  return null;
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
