import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type KnowledgeType =
  | 'article'
  | 'download'
  | 'faq'
  | 'news'
  | 'video'
  | 'podcast'
  | 'webinar'
  | 'annual-report'
  | 'case-study';

export type KnowledgeStatus = 'published' | 'draft' | 'archived';
export type EditorialWorkflowStatus =
  | 'Draft'
  | 'Under Review'
  | 'Ready for Robyn Review'
  | 'Approved'
  | 'Scheduled'
  | 'Published'
  | 'Archived';

export interface KnowledgeFrontmatter {
  title: string;
  slug: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  date: string;
  description: string;
  author: string;
  authorSlug: string;
  category: string;
  knowledgeCategory: string;
  tags: string[];
  keywords: string[];
  originallyPublished?: string;
  lastReviewed?: string;
  lastUpdated?: string;
  reviewStatus?: string;
  reviewer?: string;
  legalReviewRequired?: boolean;
  medicalReviewRequired?: boolean;
  featuredArticle?: boolean;
  evergreen?: boolean;
  pillarArticle?: boolean;
  editorialStatus?: EditorialWorkflowStatus;
  intendedAudience?: string;
  publishMonth?: string;
  featuredImage?: string;
  socialImage?: string;
  pdfAttachment?: string;
  faqSchema?: Array<{ question: string; answer: string }>;
  internalLinkSuggestions?: string[];
  estimatedReadingTime?: number;
  seoOpportunity?: number;
  aiAuthorityScore?: number;
  primaryTopic?: string;
  secondaryTopic?: string;
  rewritePriority?: string;
  seoScore?: string;
  internalLinksNeeded?: string;
  sourceUrl?: string;
  archivedUrl?: string;
  downloadUrl?: string;
  question?: string;
  answer?: string;
}

export interface KnowledgeEntry extends KnowledgeFrontmatter {
  content: string;
}

export interface AuthorProfile {
  name: string;
  slug: string;
  role: string;
  organization: string;
  bio: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'knowledge');
const AUTHORS_DIR = path.join(process.cwd(), 'content', 'authors');

export const KNOWLEDGE_CATEGORIES = [
  'Getting Started',
  'Surrogacy',
  'Egg Donation',
  'Costs',
  'Legal',
  'International Families',
  'Surrogates',
  'Intended Parents',
  'Research',
  'News',
  'Downloads',
  'FAQs',
] as const;

export const FUTURE_CONTENT_TYPES = [
  'Videos',
  'Podcast',
  'Webinars',
  'Annual Reports',
  'Case Studies',
] as const;

const TYPE_DIRS: Record<KnowledgeType, string> = {
  article: 'articles',
  download: 'downloads',
  faq: 'faqs',
  news: 'news',
  video: 'videos',
  podcast: 'podcast',
  webinar: 'webinars',
  'annual-report': 'annual-reports',
  'case-study': 'case-studies',
};

function asArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return ['yes', 'true', '1'].includes(value.toLowerCase());
  return Boolean(value);
}

function estimateReadingTime(content: string) {
  const words = content.trim().match(/\b[\w'-]+\b/g)?.length || 0;
  return Math.max(1, Math.ceil(words / 225));
}

function readEntryFile(fullPath: string, fallbackType: KnowledgeType): KnowledgeEntry {
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const filename = path.basename(fullPath, '.mdx');
  const type = (data.type || fallbackType) as KnowledgeType;

  return {
    title: data.title || '',
    slug: data.slug || filename,
    type,
    status: data.status || 'draft',
    date: data.date || data.originallyPublished || '',
    description: data.description || '',
    author: data.author || 'Robyn Price',
    authorSlug: data.authorSlug || 'robyn-price',
    category: data.category || data.knowledgeCategory || 'Getting Started',
    knowledgeCategory: data.knowledgeCategory || data.category || 'Getting Started',
    tags: asArray(data.tags),
    keywords: asArray(data.keywords),
    originallyPublished: data.originallyPublished || data.date || '',
    lastReviewed: data.lastReviewed || '',
    lastUpdated: data.lastUpdated || data.updatedAt || data.lastReviewed || data.date || '',
    reviewStatus: data.reviewStatus || '',
    reviewer: data.reviewer || '',
    legalReviewRequired: asBoolean(data.legalReviewRequired),
    medicalReviewRequired: asBoolean(data.medicalReviewRequired),
    featuredArticle: asBoolean(data.featuredArticle),
    evergreen: data.evergreen == null ? true : asBoolean(data.evergreen),
    pillarArticle: asBoolean(data.pillarArticle),
    editorialStatus: data.editorialStatus || (data.status === 'published' ? 'Published' : data.status === 'archived' ? 'Archived' : 'Draft'),
    intendedAudience: data.intendedAudience || '',
    publishMonth: data.publishMonth || '',
    featuredImage: data.featuredImage || '',
    socialImage: data.socialImage || '',
    pdfAttachment: data.pdfAttachment || '',
    faqSchema: Array.isArray(data.faqSchema) ? data.faqSchema : [],
    internalLinkSuggestions: asArray(data.internalLinkSuggestions),
    estimatedReadingTime: Number(data.estimatedReadingTime || estimateReadingTime(content)),
    seoOpportunity: Number(data.seoOpportunity || 0),
    aiAuthorityScore: Number(data.aiAuthorityScore || 0),
    primaryTopic: data.primaryTopic || '',
    secondaryTopic: data.secondaryTopic || '',
    rewritePriority: data.rewritePriority || '',
    seoScore: data.seoScore || '',
    internalLinksNeeded: data.internalLinksNeeded || '',
    sourceUrl: data.sourceUrl || '',
    archivedUrl: data.archivedUrl || '',
    downloadUrl: data.downloadUrl || '',
    question: data.question || '',
    answer: data.answer || '',
    content,
  };
}

function readEntriesFromDir(type: KnowledgeType): KnowledgeEntry[] {
  const dir = path.join(CONTENT_DIR, TYPE_DIRS[type]);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => readEntryFile(path.join(dir, filename), type));
}

export function getAllKnowledgeEntries(options: { includeDrafts?: boolean } = {}): KnowledgeEntry[] {
  const entries = (Object.keys(TYPE_DIRS) as KnowledgeType[]).flatMap(readEntriesFromDir);
  const visibleEntries = options.includeDrafts
    ? entries
    : entries.filter((entry) => entry.status === 'published');

  return visibleEntries.sort((a, b) => {
    const aTime = new Date(a.date || a.originallyPublished || 0).getTime();
    const bTime = new Date(b.date || b.originallyPublished || 0).getTime();
    return bTime - aTime;
  });
}

export function getKnowledgeEntryBySlug(slug: string, options: { includeDrafts?: boolean } = {}) {
  return getAllKnowledgeEntries(options).find((entry) => entry.slug === slug) || null;
}

export function getKnowledgeEntryHref(entry: Pick<KnowledgeEntry, 'type' | 'slug'>) {
  if (entry.type === 'download') return '/knowledge-centre/downloads';
  if (entry.type === 'faq') return '/knowledge-centre/faqs';
  if (entry.type === 'news') return '/knowledge-centre/news';
  return `/knowledge-centre/${entry.slug}`;
}

export function getKnowledgeEntriesByType(type: KnowledgeType, options: { includeDrafts?: boolean } = {}) {
  return getAllKnowledgeEntries(options).filter((entry) => entry.type === type);
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getRelatedKnowledgeEntries(current: KnowledgeEntry, max = 4) {
  const currentWords = new Set([
    current.category,
    current.knowledgeCategory,
    current.primaryTopic,
    current.secondaryTopic,
    ...current.tags,
    ...current.keywords,
  ].filter(isText).map((item) => item.toLowerCase()));

  return getAllKnowledgeEntries()
    .filter((entry) => entry.slug !== current.slug)
    .map((entry) => {
      const candidateWords = [
        entry.category,
        entry.knowledgeCategory,
        entry.primaryTopic,
        entry.secondaryTopic,
        ...entry.tags,
        ...entry.keywords,
      ].filter(isText).map((item) => item.toLowerCase());
      const score = candidateWords.reduce((sum, item) => sum + (currentWords.has(item) ? 1 : 0), 0);
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((item) => item.entry);
}

export function filterKnowledgeEntries(entries: KnowledgeEntry[], filters: {
  query?: string;
  category?: string;
  tag?: string;
  type?: KnowledgeType | 'all';
  status?: EditorialWorkflowStatus | 'All';
  audience?: string;
  priority?: string;
  seoOpportunity?: number;
  aiAuthorityScore?: number;
  publishMonth?: string;
}) {
  const query = filters.query?.trim().toLowerCase();

  return entries.filter((entry) => {
    if (filters.type && filters.type !== 'all' && entry.type !== filters.type) return false;
    if (filters.status && filters.status !== 'All' && entry.editorialStatus !== filters.status) return false;
    if (filters.category && filters.category !== 'All' && entry.knowledgeCategory !== filters.category) return false;
    if (filters.audience && filters.audience !== 'All' && entry.intendedAudience !== filters.audience) return false;
    if (filters.priority && filters.priority !== 'All' && entry.rewritePriority !== filters.priority) return false;
    if (filters.seoOpportunity && Number(entry.seoOpportunity || 0) < filters.seoOpportunity) return false;
    if (filters.aiAuthorityScore && Number(entry.aiAuthorityScore || 0) < filters.aiAuthorityScore) return false;
    if (filters.publishMonth && filters.publishMonth !== 'All' && entry.publishMonth !== filters.publishMonth) return false;
    if (filters.tag && !entry.tags.includes(filters.tag)) return false;
    if (!query) return true;

    const haystack = [
      entry.title,
      entry.description,
      entry.category,
      entry.knowledgeCategory,
      entry.primaryTopic,
      entry.secondaryTopic,
      ...entry.tags,
      ...entry.keywords,
      entry.content,
    ].join(' ').toLowerCase();

    return haystack.includes(query);
  });
}

export function buildKnowledgeArticleSchema(entry: KnowledgeEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    datePublished: entry.originallyPublished || entry.date,
    dateModified: entry.lastUpdated || entry.lastReviewed || entry.date,
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
}

export function buildKnowledgeBreadcrumbSchema(entry: KnowledgeEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://canadiansurrogacyoptions.com' },
      { '@type': 'ListItem', position: 2, name: 'Knowledge Centre', item: 'https://canadiansurrogacyoptions.com/knowledge-centre' },
      { '@type': 'ListItem', position: 3, name: entry.title, item: `https://canadiansurrogacyoptions.com/knowledge-centre/${entry.slug}` },
    ],
  };
}

export function buildKnowledgeFaqSchema(entry: KnowledgeEntry) {
  if (!entry.faqSchema?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faqSchema.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getAllTags(entries = getAllKnowledgeEntries()) {
  return Array.from(new Set(entries.flatMap((entry) => entry.tags))).sort();
}

export function readAuthorProfile(slug: string): AuthorProfile | null {
  const fullPath = path.join(AUTHORS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  return {
    name: data.name || '',
    slug: data.slug || slug,
    role: data.role || '',
    organization: data.organization || 'Canadian Surrogacy Options',
    bio: data.bio || content.trim(),
  };
}

export function getAllAuthorProfiles() {
  if (!fs.existsSync(AUTHORS_DIR)) return [];

  return fs
    .readdirSync(AUTHORS_DIR)
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => readAuthorProfile(path.basename(filename, '.mdx')))
    .filter((profile): profile is AuthorProfile => Boolean(profile));
}
