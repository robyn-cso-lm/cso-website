import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dashboardPath = path.join(root, 'editorial-activation', 'editorial_dashboard_data.json');
const workflowPath = path.join(root, 'content', 'knowledge', 'editorial-workflow.json');
const portalDataPath = path.resolve(root, '..', '..', '..', '..', 'cso-portal', 'client', 'src', 'data', 'editorialWorkflowData.js');
const knowledgeArticlesPath = path.join(root, 'content', 'knowledge', 'articles');

const raw = await fs.readFile(dashboardPath, 'utf8');
const data = JSON.parse(raw);

const workflowStates = [
  'Draft',
  'Under Review',
  'Ready for Robyn Review',
  'Approved',
  'Scheduled',
  'Published',
  'Archived',
];

function chooseWorkflowStatus(record) {
  if (record.recommendedAction === 'Retire') return 'Archived';
  if (record.rank <= 5) return 'Ready for Robyn Review';
  if (record.rank <= 13) return 'Under Review';
  if (record.rank <= 20) return 'Draft';
  return 'Draft';
}

function legalRequired(record) {
  return record.sensitivity === 'High' || /legal|law|parentage|contract|cost|fee|reimbursement|payment/i.test(`${record.title} ${record.primaryTopic} ${record.secondaryTopic}`);
}

function medicalRequired(record) {
  return /ivf|medical|screening|pregnancy|progesterone|medication|embryo|transfer|clinic/i.test(`${record.title} ${record.primaryTopic} ${record.secondaryTopic}`);
}

function publishMonth(record) {
  if (record.rank <= 10) return '2026-07';
  if (record.rank <= 25) return '2026-08';
  if (record.recommendedAction === 'Retire') return '';
  return '2026-09';
}

function opportunityLabel(score) {
  if (score >= 18) return 'Highest';
  if (score >= 14) return 'High';
  if (score >= 10) return 'Medium';
  return 'Low';
}

function readTime(wordCount) {
  return Math.max(1, Math.ceil(Number(wordCount || 0) / 225));
}

async function recoveredDraftBody(slug) {
  if (!slug) return '';
  try {
    const raw = await fs.readFile(path.join(knowledgeArticlesPath, `${slug}.mdx`), 'utf8');
    const content = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
    const readableChars = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    const readableRatio = content.length ? readableChars.length / content.length : 1;
    return readableRatio > 0.97 ? content : '';
  } catch {
    return '';
  }
}

async function itemFromRecord(record) {
  const workflowStatus = chooseWorkflowStatus(record);
  const content = await recoveredDraftBody(record.slug);
  return {
    slug: record.slug,
    title: record.title,
    currentSlug: record.currentSlug || record.slug,
    originalUrl: record.sourceUrl || '',
    suggestedNewUrl: record.suggestedNewUrl || '',
    originalPublicationDate: record.originallyPublished || record.date || '',
    author: record.author || 'Canadian Surrogacy Options',
    reviewer: workflowStatus === 'Ready for Robyn Review' ? 'Robyn Price' : '',
    workflowStatus,
    lastReviewedDate: record.lastReviewed || '',
    lastUpdatedDate: '',
    legalReviewRequired: legalRequired(record),
    medicalReviewRequired: medicalRequired(record),
    featuredArticle: record.rank <= 3,
    evergreen: record.recommendedAction !== 'Retire',
    pillarArticle: record.rank <= 10 || /law|cost|fees|types|surrogate|joanne|success/i.test(record.slug),
    audience: record.intendedAudience || 'Both',
    category: record.knowledgeCategory || 'Starting Your Journey',
    priority: record.priority || '★',
    rewritePriority: record.rewritePriority || '',
    recommendedAction: record.recommendedAction || '',
    seoOpportunity: record.scores?.seo || 0,
    aiAuthorityScore: record.scores?.authority || 0,
    clientValue: record.scores?.client || 0,
    institutionalKnowledge: record.scores?.institutional || 0,
    rewriteEffort: record.scores?.effort || 0,
    publishMonth: publishMonth(record),
    featuredImage: '',
    socialImage: '',
    pdfAttachment: '',
    faqSchemaReady: false,
    breadcrumbSchemaReady: true,
    estimatedReadingTime: readTime(record.wordCount),
    internalLinkSuggestions: [
      '/knowledge-centre',
      record.suggestedNewUrl || '',
      record.redirectTarget || '',
    ].filter(Boolean),
    relatedArticles: [],
    priorityScore: record.priorityScore || 0,
    seoOpportunityLabel: opportunityLabel(record.priorityScore || 0),
    whyNow: record.whyNow || '',
    whyLater: record.whyLater || '',
    whyNot: record.whyNot || '',
    notes: record.notes || '',
    content,
  };
}

const articles = await Promise.all(data.records.map(itemFromRecord));

const counts = workflowStates.reduce((acc, state) => {
  acc[state] = articles.filter((article) => article.workflowStatus === state).length;
  return acc;
}, {});

const todayArticle = articles.find((article) => article.workflowStatus === 'Ready for Robyn Review') || articles[0] || null;

const authorityGoal = 250;
const authorityPages = articles.filter((article) => article.aiAuthorityScore >= 4 && article.recommendedAction !== 'Retire').length;

const knowledgeTopics = [
  { topic: 'Costs', coverage: articles.filter((article) => article.category.includes('Costs')).length, target: 10 },
  { topic: 'Legal', coverage: articles.filter((article) => article.category.includes('Legal')).length, target: 10 },
  { topic: 'Medical', coverage: articles.filter((article) => article.category.includes('Medical') || article.medicalReviewRequired).length, target: 10 },
  { topic: 'Matching', coverage: articles.filter((article) => /matching|profile|recipient|intended/i.test(`${article.title} ${article.category}`)).length, target: 10 },
  { topic: 'LGBTQ+', coverage: articles.filter((article) => /lgbtq/i.test(`${article.title} ${article.category}`)).length, target: 10 },
  { topic: 'International', coverage: articles.filter((article) => article.category.includes('International')).length, target: 10 },
  { topic: 'Donors', coverage: articles.filter((article) => /egg|donor/i.test(`${article.title} ${article.category}`)).length, target: 10 },
  { topic: 'Fertility Clinics', coverage: articles.filter((article) => /clinic|ivf|embryo|transfer/i.test(article.title)).length, target: 10 },
].map((item) => ({ ...item, percent: Math.min(100, Math.round((item.coverage / item.target) * 100)) }));

const topOpportunities = articles
  .filter((article) => article.recommendedAction !== 'Retire')
  .sort((a, b) => b.seoOpportunity - a.seoOpportunity || b.priorityScore - a.priorityScore)
  .slice(0, 5)
  .map((article) => article.title);

const health = {
  missingFaqs: articles.filter((article) => !article.faqSchemaReady && article.workflowStatus !== 'Archived').length,
  missingSchema: articles.filter((article) => !article.breadcrumbSchemaReady && article.workflowStatus !== 'Archived').length,
  needsUpdating: articles.filter((article) => ['Under Review', 'Ready for Robyn Review'].includes(article.workflowStatus)).length,
  brokenLinks: 0,
  orphanArticles: articles.filter((article) => article.internalLinkSuggestions.length === 0).length,
  noInternalLinks: articles.filter((article) => article.internalLinkSuggestions.length < 2).length,
};

const publishingCalendar = [
  { day: 'Monday', article: 'Costs of Surrogacy', status: 'planned' },
  { day: 'Tuesday', article: 'Preparing for Matching', status: 'planned' },
  { day: 'Wednesday', article: 'How IVF Works', status: 'planned' },
  { day: 'Thursday', article: 'Choosing an Agency', status: 'planned' },
  { day: 'Friday', article: 'Legal Guide', status: 'planned' },
];

const repurposingChecklist = [
  'Website',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'Pinterest',
  'Threads',
  'Newsletter',
  'Reddit',
  'FAQ',
  'Knowledge Base',
];

const commandCentre = {
  todayArticle,
  nextBestAction: todayArticle ? {
    label: 'Review',
    title: todayArticle.title,
    estimatedTime: `${Math.max(10, todayArticle.estimatedReadingTime * 6)} minutes`,
    potentialImpact: todayArticle.priority,
    expectedTraffic: todayArticle.seoOpportunity >= 4 ? '+2,300/month' : '+600/month',
    href: `/admin/editorial?article=${encodeURIComponent(todayArticle.slug)}`,
  } : null,
  pipelineCounts: counts,
  authority: {
    current: authorityPages,
    goal: authorityGoal,
    percent: Math.round((authorityPages / authorityGoal) * 100),
  },
  publishingCalendar,
  repurposingChecklist,
  health,
  topOpportunities,
  knowledgeTopics,
  metrics: {
    articlesPublished: 0,
    pagesIndexed: 0,
    averagePosition: null,
    featuredSnippets: 0,
    llmCitations: 0,
    internalLinks: articles.reduce((sum, article) => sum + article.internalLinkSuggestions.length, 0),
    externalLinks: 0,
  },
};

const workflow = {
  generatedAt: new Date().toISOString(),
  workflowStates,
  articles,
  commandCentre,
  filters: {
    status: workflowStates,
    audience: [...new Set(articles.map((article) => article.audience))].sort(),
    category: [...new Set(articles.map((article) => article.category))].sort(),
    priority: ['★★★★★', '★★★★', '★★★', '★★', '★'],
    seoOpportunity: [1, 2, 3, 4, 5],
    aiAuthorityScore: [1, 2, 3, 4, 5],
    publishMonth: [...new Set(articles.map((article) => article.publishMonth).filter(Boolean))].sort(),
  },
};

await fs.mkdir(path.dirname(workflowPath), { recursive: true });
await fs.writeFile(workflowPath, `${JSON.stringify(workflow, null, 2)}\n`);

await fs.mkdir(path.dirname(portalDataPath), { recursive: true });
await fs.writeFile(portalDataPath, `const editorialWorkflowData = ${JSON.stringify(workflow, null, 2)};\n\nexport default editorialWorkflowData;\n`);

console.log(`Wrote ${workflowPath}`);
console.log(`Wrote ${portalDataPath}`);
