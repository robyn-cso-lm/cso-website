import { NextResponse } from 'next/server';
import { getAllKnowledgeEntries, getKnowledgeEntryHref } from '@/lib/knowledge';

// Published Knowledge Centre content as plain text, for the "Ask anything" box.
// The portal reads this feed, picks the articles that best match a question,
// and writes a short answer that links back to them. Drafts are never included.

export const dynamic = 'force-static';
export const revalidate = 3600;

const SITE = 'https://canadiansurrogacyoptions.com';
const MAX_TEXT = 8000;

function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>|]/g, ' ')
    .replace(/^\s*[-+]\s+/gm, '')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function GET() {
  const entries = getAllKnowledgeEntries()
    .filter((entry) => entry.type !== 'download' && entry.type !== 'news')
    .filter((entry) => !/ archives$/i.test(entry.title))
    .map((entry) => {
      const href = getKnowledgeEntryHref(entry);
      const faqText = (entry.faqSchema || []).map((f) => `${f.question} ${f.answer}`).join(' ');
      const text = [entry.question, entry.answer, toPlainText(entry.content), faqText]
        .filter(Boolean)
        .join(' ')
        .slice(0, MAX_TEXT);
      return {
        slug: entry.slug,
        type: entry.type,
        title: entry.title,
        url: href.startsWith('http') ? href : `${SITE}${href}`,
        category: entry.knowledgeCategory || entry.category || '',
        description: entry.description || '',
        keywords: [...(entry.tags || []), ...(entry.keywords || [])].join(', '),
        text,
      };
    });

  return NextResponse.json(
    { generated_at: new Date().toISOString(), count: entries.length, entries },
    { headers: { 'Cache-Control': 'public, max-age=600, s-maxage=3600' } },
  );
}
