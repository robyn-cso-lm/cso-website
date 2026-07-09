import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const matter = require('gray-matter');
const { SpreadsheetFile, Workbook } = require('@oai/artifact-tool');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const articlesDir = path.join(root, 'content', 'knowledge', 'articles');
const blogDir = path.join(root, 'content', 'blog');
const outputDir = path.join(root, 'editorial-activation');
const workbookPath = path.join(outputDir, 'cso_editorial_dashboard.xlsx');

const categoryPillars = {
  'Starting Your Journey': 'Surrogacy in Canada',
  Surrogacy: 'Surrogacy in Canada',
  'Becoming a Surrogate': 'Becoming a Surrogate in Canada',
  Surrogates: 'Becoming a Surrogate in Canada',
  'Intended Parents': 'Intended Parents: Building a Family Through Surrogacy',
  'Finding a Surrogate': 'Finding and Matching With a Surrogate',
  Matching: 'Finding and Matching With a Surrogate',
  'IVF and Medical': 'IVF, Transfer, and Pregnancy Resources',
  'Pregnancy Resources': 'IVF, Transfer, and Pregnancy Resources',
  'Legal and Parentage': 'Legal and Parentage in Canadian Surrogacy',
  Legal: 'Legal and Parentage in Canadian Surrogacy',
  'Costs and Financial Planning': 'Surrogacy Costs and Financial Planning',
  Costs: 'Surrogacy Costs and Financial Planning',
  'LGBTQ+ Family Building': 'LGBTQ+ Family Building',
  'International Parents': 'International Families',
  'Egg Donation / Little Miracles': 'Egg Donation and Little Miracles',
  'CSO History and Joanne’s Legacy': 'CSO History and Joanne Wright Legacy',
  'CSO History and Joanne?s Legacy': 'CSO History and Joanne Wright Legacy',
  'Success Stories': 'CSO Family Stories',
  'News / Press': 'CSO News and Press',
};

const pillarDetails = {
  'Surrogacy in Canada': {
    faq: 'What is surrogacy in Canada?; Gestational vs traditional surrogacy; How does Canadian surrogacy work?',
    downloads: 'Program Guide; Canadian Surrogacy Roadmap',
    future: 'Intro video: Surrogacy in Canada; Podcast: What makes Canada different',
  },
  'Becoming a Surrogate in Canada': {
    faq: 'Who can be a surrogate?; Do I qualify?; What happens after I apply?',
    downloads: 'Surrogate Readiness Guide; Surrogate Program Guide',
    future: 'Video: Surrogate screening walkthrough; Webinar: Is surrogacy right for me?',
  },
  'Intended Parents: Building a Family Through Surrogacy': {
    faq: 'How do intended parents start?; What do surrogates look for?; How long does matching take?',
    downloads: 'Program Guide; IP Profile Template',
    future: 'Podcast: Intended parent first steps; Webinar: How to prepare for matching',
  },
  'Finding and Matching With a Surrogate': {
    faq: 'How does matching work?; Can I find a surrogate independently?; What makes a good match?',
    downloads: 'IP Profile Template; Matching Readiness Checklist',
    future: 'Video: Matching expectations; Case study: Strong match examples',
  },
  'IVF, Transfer, and Pregnancy Resources': {
    faq: 'What happens at transfer?; What medications are used?; What happens during the two-week wait?',
    downloads: 'Payment Timeline; IVF/Transfer Preparation Checklist',
    future: 'Video: Transfer day prep; Podcast: Surrogate pregnancy support',
  },
  'Legal and Parentage in Canadian Surrogacy': {
    faq: 'Is surrogacy legal in Canada?; What legal steps are required?; How is parentage established?',
    downloads: 'Legal Process Overview; Parentage Checklist',
    future: 'Webinar with legal partner; Annual legal update',
  },
  'Surrogacy Costs and Financial Planning': {
    faq: 'What does surrogacy cost in Canada?; What reimbursements are allowed?; When are payments due?',
    downloads: 'Cost Guide; Payment Timeline',
    future: 'Cost explainer video; Annual cost benchmark report',
  },
  'LGBTQ+ Family Building': {
    faq: 'Can LGBTQ+ families pursue surrogacy in Canada?; What should same-sex intended parents know?',
    downloads: 'LGBTQ+ Family Building Guide',
    future: 'Family story video; Pride-season research brief',
  },
  'International Families': {
    faq: 'Can international parents work with CSO?; What should non-Canadian intended parents know?',
    downloads: 'International Parents Guide',
    future: 'Webinar: International surrogacy in Canada',
  },
  'Egg Donation and Little Miracles': {
    faq: 'How does egg donation fit with surrogacy?; What is Little Miracles?',
    downloads: 'Egg Donation Overview; Donor Matching Guide',
    future: 'Video: Egg donor process; Podcast with LM team',
  },
  'CSO History and Joanne Wright Legacy': {
    faq: 'Who founded CSO?; What is CSO’s history?',
    downloads: 'CSO History Timeline',
    future: 'Founder story video; Annual legacy report',
  },
  'CSO Family Stories': {
    faq: 'What do real journeys look like?; How do families share their story?',
    downloads: 'Story Submission Guide',
    future: 'Case studies; Video story library',
  },
  'CSO News and Press': {
    faq: 'Where can media contact CSO?; What announcements are current?',
    downloads: 'Media Kit; Press Backgrounder',
    future: 'Annual State of Surrogacy report; Media archive',
  },
};

const sensitivityTerms = [
  'legal', 'law', 'parentage', 'contract', 'reimbursement', 'cost', 'expense', 'payment',
  'medication', 'progesterone', 'ivf', 'embryo', 'transfer', 'screening', 'medical',
  'covid', 'clinic', 'retrieval', 'pregnancy',
];

const stopWords = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'you', 'are', 'can',
  'will', 'into', 'about', 'what', 'when', 'why', 'how', 'our', 'cso', 'canada',
  'canadian', 'surrogacy', 'surrogate', 'surrogates', 'options', 'blog', 'page',
]);

function normalizeText(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function titleCase(value = '') {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function words(value = '') {
  return normalizeText(value)
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function wordCount(value = '') {
  const matches = String(value).trim().match(/\b[\w’'-]+\b/g);
  return matches ? matches.length : 0;
}

function tokensFor(record) {
  return new Set(words(`${record.title} ${record.description || ''} ${record.slug} ${record.category || ''} ${record.content || ''}`));
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function safePathFromUrl(url = '') {
  try {
    return new URL(url).pathname.replace(/\/$/, '') || '/';
  } catch {
    return '';
  }
}

function recoveryLevel(status, count) {
  if (status === 'Yes' && count >= 450) return 'Full';
  if (status === 'Yes' && count >= 200) return 'Partial';
  if (status === 'Partial' || count >= 80) return 'Minimal';
  return 'Minimal';
}

function classifyAudience(text, category) {
  const haystack = normalizeText(`${text} ${category}`);
  const ip = /intended parent|parents|recipient|family|families|infertility|lgbtq|international/.test(haystack);
  const surrogate = /surrogate|surro|pregnancy|transfer|screening|medication|reimbursement|become/.test(haystack);
  const professional = /press|legal|law|agency|midwifery|professional/.test(haystack);
  if (professional && !ip && !surrogate) return 'Professionals';
  if (ip && surrogate) return 'Both';
  if (surrogate) return 'Surrogates';
  if (ip) return 'Intended Parents';
  return 'Both';
}

function classifyTopic(record) {
  const haystack = normalizeText(`${record.title} ${record.slug} ${record.content.slice(0, 1000)} ${record.category}`);
  if (/joanne|history|1992|founder|press release|team|csofamily|creating families|my story/.test(haystack)) return ['CSO history and legacy', 'Institutional trust'];
  if (/story|success|journey|touching|mom|surrosister|secret surro|secretsurro/.test(haystack)) return ['Real stories', 'Lived experience'];
  if (/legal|law|parentage|contract/.test(haystack)) return ['Legal process', 'Parentage'];
  if (/cost|fee|reimbursement|payment|expense|financial/.test(haystack)) return ['Costs and reimbursements', 'Financial planning'];
  if (/ivf|embryo|transfer|progesterone|medication|screening|clinic|retrieval|2 week|two week/.test(haystack)) return ['IVF and medical process', 'Pregnancy support'];
  if (/intended parent|recipient|profile|family|families/.test(haystack)) return ['Intended parent journey', 'Family building'];
  if (/become|eligibility|qualify|screening|surrogate mother|self care|surrosister|surro[-\s]?sister|surro[-\s]?secrets/.test(haystack)) return ['Surrogate journey', 'Support and readiness'];
  if (/egg|donor|donation|little miracles/.test(haystack)) return ['Egg donation', 'Donor education'];
  if (/international|us division/.test(haystack)) return ['International parents', 'Cross-border considerations'];
  return [record.title, 'General education'];
}

function inferredCategory(record) {
  const key = normalizeText(`${record.title} ${record.slug}`);
  const full = normalizeText(`${record.title} ${record.slug} ${record.content.slice(0, 800)} ${record.knowledgeCategory || ''}`);
  const classify = (haystack) => {
    if (/legal|law|laws|parentage|contract/.test(haystack)) return 'Legal and Parentage';
    if (/cost|fee|fees|reimbursement|payment|expense|financial/.test(haystack)) return 'Costs and Financial Planning';
    if (/ivf|embryo|transfer|progesterone|medication|clinic|retrieval|2 week|two week/.test(haystack)) return 'IVF and Medical';
    if (/screening|pregnancy|cold remedies|autumn pregnancy/.test(haystack)) return 'Pregnancy Resources';
    if (/become|becoming|eligibility|qualify|surrogate mother|top 5 reasons|self care|surrosister|surro[-\s]?sister|surro[-\s]?secrets/.test(haystack)) return 'Becoming a Surrogate';
    if (/intended parent|recipient|family profile|families waiting|what we offer/.test(haystack)) return 'Intended Parents';
    if (/egg|donor|donation|little miracles/.test(haystack)) return 'Egg Donation / Little Miracles';
    if (/international|us division/.test(haystack)) return 'International Parents';
    if (/joanne|history|1992|press release|team|csofamily|my story|creating families/.test(haystack)) return 'CSO History and Joanne’s Legacy';
    if (/story|success|journey|touching|mom|good luck|goodluck|ritual/.test(haystack)) return 'Success Stories';
    return '';
  };
  return classify(key) || classify(full) || record.knowledgeCategory || record.category || 'Starting Your Journey';
}

function legalMedicalSensitivity(record) {
  const haystack = normalizeText(`${record.title} ${record.content}`);
  const hits = sensitivityTerms.filter((term) => haystack.includes(term)).length;
  if (hits >= 4 || /legal|law|contract|parentage|progesterone|medication|ivf|embryo|clinic/.test(haystack)) return 'High';
  if (hits >= 2 || /cost|reimbursement|screening|pregnancy/.test(haystack)) return 'Medium';
  return 'Low';
}

function scoreRecord(record, overlap) {
  const wc = record.wordCount;
  const haystack = normalizeText(`${record.title} ${record.slug} ${record.content}`);
  let seo = 2;
  if (/(how|what|why|cost|legal|ivf|surrogate|intended|canada|eligibility|requirements|guide|tips)/.test(haystack)) seo += 1;
  if (wc >= 500) seo += 1;
  if (wc >= 900) seo += 1;
  if (record.sourceContentType === 'tag' || record.sourceContentType === 'page') seo -= 1;
  if (overlap?.score > 0.12) seo -= 1;
  seo = Math.max(1, Math.min(5, seo));

  let authority = 2;
  if (/(legal|ivf|medication|screening|parentage|reimbursement|matching|surrogate journey|joanne|history|press)/.test(haystack)) authority += 1;
  if (wc >= 500) authority += 1;
  if (/(story|journey|surrosister|joanne|recipient|intended parent)/.test(haystack)) authority += 1;
  if (record.recoveryLevel === 'Minimal') authority -= 1;
  authority = Math.max(1, Math.min(5, authority));

  let client = 2;
  if (/(how|what|tips|expect|prepare|screening|transfer|family|surrogate|intended|cost|eligibility)/.test(haystack)) client += 1;
  if (wc >= 350) client += 1;
  if (/(tag|terms|about|page 2)/.test(haystack)) client -= 1;
  client = Math.max(1, Math.min(5, client));

  let institutional = 2;
  if (/(joanne|1992|press|team|cso|story|success|journey|surrosister|family)/.test(haystack)) institutional += 2;
  if (record.sourceContentType === 'page') institutional += 1;
  if (record.recoveryLevel === 'Minimal') institutional -= 1;
  institutional = Math.max(1, Math.min(5, institutional));

  let effort = 3;
  if (record.recoveryLevel === 'Minimal') effort += 1;
  if (record.sensitivity === 'High') effort += 1;
  if (wc < 200) effort += 1;
  if (wc > 800 && record.sensitivity === 'Low') effort -= 1;
  if (overlap?.score > 0.18) effort -= 1;
  effort = Math.max(1, Math.min(5, effort));

  return { seo, authority, client, institutional, effort };
}

function recommendedAction(record, overlap) {
  if (record.sourceContentType === 'tag') return 'Retire';
  if (/terms|conditions|faqs$|about$|page 2|canadiansurrogacy$|csofamily$|secretsurro$/.test(record.slug)) return 'Retire';
  if (/joanne|press-release|success-stories|goodluckcharms|creating-families/.test(record.slug)) return record.sensitivity === 'High' ? 'Moderate rewrite' : 'Light update';
  if (overlap?.score > 0.16) return 'Merge';
  if (record.recoveryLevel === 'Minimal') return 'Full rewrite';
  if (record.sensitivity === 'High') return 'Moderate rewrite';
  if (record.wordCount >= 500 && record.scores?.client >= 4 && record.sensitivity === 'Low') return 'Light update';
  return 'Moderate rewrite';
}

function workflowStatus(record) {
  if (record.recommendedAction === 'Retire' || record.recommendedAction === 'Merge') return 'Needs Robyn review';
  if (record.sensitivity === 'High') return 'Needs legal review';
  if (record.recoveryLevel === 'Full' && record.recommendedAction === 'Light update') return 'Ready to publish';
  return 'Needs Robyn review';
}

function priorityStars(score) {
  if (score >= 20) return '★★★★★';
  if (score >= 16) return '★★★★';
  if (score >= 12) return '★★★';
  if (score >= 8) return '★★';
  return '★';
}

function priorityLabel(stars) {
  return String(stars).length;
}

function reasonForNow(record) {
  if (record.scores.client >= 4 && record.scores.authority >= 4) return 'High audience usefulness plus strong lived/institutional expertise.';
  if (record.scores.seo >= 4) return 'Strong search intent that can support Knowledge Centre discovery quickly.';
  if (record.pillar.includes('CSO History')) return 'Builds trust and preserves institutional history that competitors cannot copy.';
  return 'Adds useful support content to a major Knowledge Centre pillar.';
}

function reasonForLater(record) {
  if (record.sensitivity === 'High') return 'Needs careful medical/legal/currentness review before publication.';
  if (record.recommendedAction === 'Merge') return 'Should be folded into a stronger modern article instead of published alone.';
  if (record.recoveryLevel !== 'Full') return 'Recovered content is incomplete and needs editorial reconstruction.';
  return 'Can follow after the first pillar pages and top-intent resources are live.';
}

function reasonForNot(record) {
  if (record.recommendedAction === 'Retire') return 'Low standalone value or archive/tag/page artifact rather than a publishable article.';
  if (record.sourceContentType === 'page') return 'May be better represented as site/about/program content, not a Knowledge Centre article.';
  if (record.scores.client <= 2) return 'Limited direct usefulness for intended parents or surrogates.';
  return 'No hard blocker; do not publish until reviewed and modernized.';
}

function modernizationPackage(record, allRecords) {
  const specificTitles = {
    'my-story-by-joanne-wright': 'Joanne Wright and the Story Behind Canadian Surrogacy Options',
    'press-release-canadian-surrogacy-options-canadas-first-surrogacy-company-celebrates-25-years-helping-couples-nurture-their-dream-of-having-a-family': 'CSO’s 25-Year Legacy as Canada’s First Surrogacy Company',
    'success-stories': 'CSO Success Stories: Real Surrogacy Journeys in Canada',
    goodluckcharms: 'Transfer Day Good Luck Charms and Surrogacy Rituals',
    'creating-families-through-surrogacy-with-canadian': 'Creating Families Through Surrogacy in Canada',
    'what-to-expect-at-your-surrogacy-screening-appointment-2': 'What to Expect at Your Surrogacy Screening Appointment',
    'top-5-reasons-become-surrogate': 'Top Reasons Women Choose to Become Surrogates',
    'becoming-a-surrogate-in-canada': 'Becoming a Surrogate in Canada: What to Know First',
    'fees-for-surrogacy-process-in-canada': 'Surrogacy Fees and Costs in Canada',
    'types-surrogacy': 'Types of Surrogacy in Canada',
    'types-of-surrogacy-html': 'Types of Surrogacy in Canada',
    laws: 'Surrogacy Laws in Canada',
    law: 'Surrogacy Law in Canada',
    'how-to-address-surrogacy-with-your-family': 'How to Talk With Your Family About Surrogacy',
    'surrogacy-blogs-we-love': 'Surrogacy Stories and Blogs Worth Reading',
    'what-we-offer': 'CSO Programs and Support Options',
    'surrosister-secrets-part-16': 'SurroSister Secrets: Preparing for Transfer',
  };
  const hasSpecificTitle = Boolean(specificTitles[record.slug]);
  const cleanTitle = specificTitles[record.slug] || titleCase(record.title);
  const updatedTitle = hasSpecificTitle || /canada/i.test(cleanTitle) ? cleanTitle : `${cleanTitle} in Canada`;
  const metaTitle = `${updatedTitle} | CSO Knowledge Centre`.slice(0, 60);
  const metaDescription = `Learn ${updatedTitle.toLowerCase()} from Canadian Surrogacy Options, with practical guidance for ${record.intendedAudience.toLowerCase()}.`.slice(0, 155);
  const related = allRecords
    .filter((candidate) => candidate.slug !== record.slug && candidate.pillar === record.pillar)
    .slice(0, 4)
    .map((candidate) => candidate.title)
    .join('; ');
  const pillarUrl = `/knowledge-centre?category=${encodeURIComponent(record.knowledgeCategory)}`;
  return {
    slug: record.slug,
    originalTitle: record.title,
    updatedTitle,
    metaTitle,
    metaDescription,
    suggestedH1: updatedTitle,
    suggestedSummary: `A modernized CSO resource explaining ${updatedTitle.toLowerCase()}, preserving the recovered article's useful experience while updating facts, tone, and internal links.`,
    suggestedCTA: record.intendedAudience === 'Surrogates'
      ? 'Take the surrogate readiness self-assessment or book a confidential conversation with CSO.'
      : record.intendedAudience === 'Intended Parents'
        ? 'Download the CSO Program Guide or book a planning call with the CSO team.'
        : 'Explore the CSO Program Guide or speak with the team about your next step.',
    internalLinks: [
      '/knowledge-centre',
      pillarUrl,
      '/surrogates',
      '/intended-parents',
      '/programs',
    ].join('; '),
    relatedArticles: related || 'Add once first wave is published',
    downloadableGuide: record.pillar.includes('Costs')
      ? 'Cost Guide; Payment Timeline'
      : record.intendedAudience === 'Surrogates'
        ? 'Surrogate Readiness Guide'
        : 'Program Guide',
    faqLinks: pillarDetails[record.pillar]?.faq || 'Add matching FAQ entries',
    pillarPage: record.pillar,
  };
}

async function readMdxDir(dir) {
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith('.mdx'));
  return Promise.all(files.map(async (file) => {
    const fullPath = path.join(dir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = matter(raw);
    return {
      file,
      ...parsed.data,
      slug: parsed.data.slug || path.basename(file, '.mdx'),
      title: parsed.data.title || titleCase(path.basename(file, '.mdx')),
      content: parsed.content.trim(),
    };
  }));
}

async function readRedirects() {
  const config = await fs.readFile(path.join(root, 'next.config.mjs'), 'utf8');
  const matches = [...config.matchAll(/\{\s*source:\s*'([^']+)'\s*,\s*destination:\s*'([^']+)'\s*,\s*permanent:\s*true\s*\}/g)];
  return matches.map((match) => ({ source: match[1], destination: match[2], type: 301 }));
}

function currentRedirectFor(record, redirects) {
  const originalPath = safePathFromUrl(record.sourceUrl);
  const candidates = new Set([
    originalPath,
    originalPath.replace(/\/$/, ''),
    originalPath.endsWith('/') ? originalPath : `${originalPath}/`,
    `/${record.slug}`,
    `/blog/${record.slug}`,
    `/uncategorized/${record.slug}`,
  ]);
  return redirects.find((redirect) => candidates.has(redirect.source)) || null;
}

function hasRedirectChain(redirect, redirectMap) {
  if (!redirect) return false;
  const destination = redirect.destination.split('#')[0].replace(/\/$/, '') || '/';
  return redirectMap.has(destination) || redirectMap.has(`${destination}/`);
}

async function buildData() {
  const articles = await readMdxDir(articlesDir);
  const modernPosts = await readMdxDir(blogDir);
  const redirects = await readRedirects();
  const redirectMap = new Map(redirects.map((redirect) => [redirect.source.replace(/\/$/, '') || '/', redirect.destination]));
  const modernTokens = modernPosts.map((post) => ({ ...post, tokenSet: tokensFor(post) }));

  const records = articles.map((article) => {
    const wc = wordCount(article.content);
    const base = {
      ...article,
      wordCount: wc,
      recoveryLevel: recoveryLevel(article.recoveryStatus, wc),
      sourceAvailable: article.archivedUrl ? 'Yes' : article.sourceUrl ? 'Partial' : 'No',
      knowledgeCategory: article.knowledgeCategory || article.category || 'Starting Your Journey',
      sourceContentType: article.sourceContentType || 'article',
      currentSlug: article.slug,
    };
    const tokenSet = tokensFor(base);
    const overlap = modernTokens
      .map((post) => ({ slug: post.slug, title: post.title, score: jaccard(tokenSet, post.tokenSet) }))
      .sort((a, b) => b.score - a.score)[0] || null;
    base.knowledgeCategory = inferredCategory(base);
    const [primaryTopic, secondaryTopic] = classifyTopic(base);
    const sensitivity = legalMedicalSensitivity(base);
    const intendedAudience = classifyAudience(`${base.title} ${base.content}`, base.knowledgeCategory);
    const pillar = categoryPillars[base.knowledgeCategory] || categoryPillars[base.category] || 'Surrogacy in Canada';
    const record = {
      ...base,
      primaryTopic,
      secondaryTopic,
      intendedAudience,
      sensitivity,
      pillar,
      modernOverlapSlug: overlap?.slug || '',
      modernOverlapTitle: overlap?.title || '',
      modernOverlapScore: Number((overlap?.score || 0).toFixed(3)),
    };
    record.scores = scoreRecord(record, overlap);
    record.recommendedAction = recommendedAction(record, overlap);
    record.workflowStatus = workflowStatus(record);
    record.rewritePriority = record.recommendedAction === 'Full rewrite'
      ? 'High'
      : record.recommendedAction === 'Moderate rewrite'
        ? 'Medium'
        : record.recommendedAction === 'Merge'
          ? 'Medium'
          : 'Low';
    const educationalBoost = /(law|legal|types|fees|cost|screening|progesterone|ivf|becoming|become|expect|address|family|surrogacy)/.test(record.slug) ? 2 : 0;
    const historicalBoost = /(joanne|press-release|success-stories|creating-families|goodluckcharms)/.test(record.slug) ? 2 : 0;
    record.priorityScore = Math.round(
      record.scores.seo * 1.3 +
      record.scores.authority * 1.2 +
      record.scores.client * 1.4 +
      record.scores.institutional * 0.9 -
      record.scores.effort * 0.8 +
      educationalBoost +
      historicalBoost -
      (record.recommendedAction === 'Retire' ? 8 : 0) -
      (record.recommendedAction === 'Merge' ? 3 : 0)
    );
    record.priority = priorityStars(record.priorityScore);
    record.priorityRank = priorityLabel(record.priority);
    record.suggestedNewUrl = record.recommendedAction === 'Retire'
      ? ''
      : record.recommendedAction === 'Merge' && record.modernOverlapSlug
        ? `/blog/${record.modernOverlapSlug}`
        : `/knowledge-centre/${record.slug}`;
    record.currentRedirect = currentRedirectFor(record, redirects);
    record.redirectTarget = record.currentRedirect?.destination || record.suggestedNewUrl || '';
    record.needsRobynReview = record.workflowStatus === 'Needs Robyn review' ? 'Yes' : '';
    record.readyToPublish = record.workflowStatus === 'Ready to publish' ? 'Yes' : '';
    record.published = '';
    record.needsLegalReview = record.workflowStatus === 'Needs legal review' ? 'Yes' : '';
    record.whyNow = reasonForNow(record);
    record.whyLater = reasonForLater(record);
    record.whyNot = reasonForNot(record);
    record.notes = [
      record.recoveryLevel !== 'Full' ? `Recovery is ${record.recoveryLevel.toLowerCase()}.` : '',
      record.sensitivity !== 'Low' ? `${record.sensitivity} legal/medical sensitivity.` : '',
      record.recommendedAction === 'Merge' ? `Likely merge with ${record.modernOverlapTitle}.` : '',
    ].filter(Boolean).join(' ');
    return record;
  }).sort((a, b) => b.priorityScore - a.priorityScore || b.wordCount - a.wordCount);

  records.forEach((record, index) => {
    record.rank = index + 1;
  });

  const top25 = records.filter((record) => record.recommendedAction !== 'Retire').slice(0, 25);
  const top10 = top25.filter((record) => record.recommendedAction !== 'Merge').slice(0, 10).map((record) => modernizationPackage(record, records));

  const duplicateGroups = buildDuplicateGroups(records);
  const redirectRows = buildRedirectRows(records, redirects, redirectMap);
  const pillarRows = buildPillarRows(records);

  return { records, top25, top10, duplicateGroups, redirects, redirectRows, pillarRows };
}

function buildDuplicateGroups(records) {
  const groups = [
    {
      group: 'Becoming a surrogate eligibility cluster',
      articles: records.filter((record) => /becoming-a-surrogate|become-surrogate|top-5-reasons|screening|qualify|eligibility/.test(record.slug)),
      recommendation: 'Merge strongest evergreen guidance into the modern surrogate eligibility/readiness resources; keep personal experience excerpts as callouts.',
    },
    {
      group: 'SurroSister / SecretSurro journey cluster',
      articles: records.filter((record) => /surrosister|surro-secrets|secretsurro|mysurrogacyjourney/.test(record.slug)),
      recommendation: 'Do not publish as many standalone posts first. Build one historical journey hub and select only the best entries as supporting stories.',
    },
    {
      group: 'Legal and types of surrogacy cluster',
      articles: records.filter((record) => /law|laws|types.*surrogacy|types-of-surrogacy/.test(record.slug)),
      recommendation: 'Merge into one current legal/process pillar after legal review; redirect old pages to the authoritative version.',
    },
    {
      group: 'IVF, medication, transfer, and pregnancy cluster',
      articles: records.filter((record) => /progesterone|medication|ivf|transfer|screening|2-week|two-week|cold|pregnancy/.test(record.slug)),
      recommendation: 'Treat as high-value but clinically sensitive support content; modernize with medical review and clear disclaimers.',
    },
    {
      group: 'CSO history and Joanne legacy cluster',
      articles: records.filter((record) => /joanne|story|1992|press-release|csofamily|creating-families|team/.test(record.slug)),
      recommendation: 'Preserve as historical/institutional content. This is trust-building material, not generic SEO filler.',
    },
  ];
  return groups
    .filter((group) => group.articles.length > 0)
    .map((group) => ({
      group: group.group,
      count: group.articles.length,
      slugs: group.articles.map((record) => record.slug).join('; '),
      recommendation: group.recommendation,
      keepHistorical: group.group.includes('history') || group.group.includes('SurroSister') ? 'Yes' : 'Selective',
    }));
}

function buildPillarRows(records) {
  const byPillar = new Map();
  for (const record of records) {
    if (!byPillar.has(record.pillar)) byPillar.set(record.pillar, []);
    byPillar.get(record.pillar).push(record);
  }
  return [...byPillar.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([pillar, items]) => {
      const details = pillarDetails[pillar] || { faq: 'Add FAQ entries', downloads: 'Add guide/download', future: 'Add video/podcast/webinar later' };
      const publishable = items.filter((item) => item.recommendedAction !== 'Retire');
      return {
        pillar,
        articleCount: items.length,
        priorityChildren: publishable.slice(0, 8).map((item) => item.title).join('; '),
        relatedFaqs: details.faq,
        downloads: details.downloads,
        futureVideosPodcasts: details.future,
        firstAction: publishable[0] ? `Modernize: ${publishable[0].title}` : 'Retire or redirect only',
      };
    });
}

function buildRedirectRows(records, redirects, redirectMap) {
  const rows = records.map((record) => {
    const existing = record.currentRedirect;
    const source = safePathFromUrl(record.sourceUrl) || `/blog/${record.slug}`;
    const proposed = record.suggestedNewUrl || existing?.destination || '/knowledge-centre';
    const chain = hasRedirectChain(existing, redirectMap);
    const destinationExists = existing
      ? existing.destination.startsWith('/blog/') || existing.destination.startsWith('/knowledge-centre') || ['/', '/about', '/blog', '/contact', '/programs', '/resources', '/surrogates', '/intended-parents', '/international', '/qualify'].some((pathName) => existing.destination.split('#')[0] === pathName)
      : false;
    return {
      oldUrl: source,
      currentRedirectTarget: existing?.destination || '',
      proposedFutureTarget: proposed,
      redirectType: '301',
      status: existing ? (chain ? 'Review chain' : 'Mapped') : 'Needs mapping when published',
      seoRisk: !existing && record.recommendedAction !== 'Retire' ? 'Medium' : chain ? 'Medium' : 'Low',
      recommendation: existing
        ? `Keep for now; update to ${proposed} only after replacement is published.`
        : record.recommendedAction === 'Retire'
          ? 'No publish target needed unless Search Console shows traffic.'
          : `Add redirect to ${proposed} after editorial approval and publication.`,
      destinationExists: destinationExists ? 'Likely' : existing ? 'Check' : '',
    };
  });
  return rows.sort((a, b) => a.status.localeCompare(b.status) || a.oldUrl.localeCompare(b.oldUrl));
}

function rowsForDashboard(records) {
  return records.map((record) => ({
    Rank: record.rank,
    Priority: record.priority,
    Title: record.title,
    'Current Slug': record.slug,
    'Original URL': record.sourceUrl || '',
    'Suggested New URL': record.suggestedNewUrl,
    'Original Publication Date': record.originallyPublished || record.date || '',
    'Recovery Status': record.recoveryLevel,
    'Source Available': record.sourceAvailable,
    'Knowledge Centre Category': record.knowledgeCategory,
    'Primary Topic': record.primaryTopic,
    'Secondary Topic': record.secondaryTopic,
    'Intended Audience': record.intendedAudience,
    'Rewrite Priority': record.rewritePriority,
    'Publish Priority Score': record.priorityScore,
    'Recommended Action': record.recommendedAction,
    'SEO Value': record.scores.seo,
    'AI Authority Value': record.scores.authority,
    'Client Value': record.scores.client,
    'Institutional Knowledge': record.scores.institutional,
    'Rewrite Effort': record.scores.effort,
    'Legal / Medical Sensitivity': record.sensitivity,
    'Needs Robyn Review': record.needsRobynReview,
    'Ready To Publish': record.readyToPublish,
    Published: record.published,
    'Needs Legal Review': record.needsLegalReview,
    'Modern Overlap': record.modernOverlapTitle,
    'Modern Overlap Slug': record.modernOverlapSlug,
    'Redirect Target': record.redirectTarget,
    'Word Count': record.wordCount,
    Notes: record.notes,
  }));
}

function objectRows(objects) {
  const headers = Object.keys(objects[0] || {});
  return [headers, ...objects.map((row) => headers.map((header) => row[header] ?? ''))];
}

function applyBasicFormatting(sheet, rowCount, colCount) {
  sheet.showGridLines = false;
  const used = sheet.getRangeByIndexes(0, 0, Math.max(rowCount, 1), Math.max(colCount, 1));
  used.format = {
    font: { name: 'Aptos', size: 10, color: '#243233' },
    wrapText: true,
    verticalAlignment: 'top',
  };
  const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
  header.format = {
    fill: '#143C3A',
    font: { bold: true, color: '#FFFFFF' },
    wrapText: true,
    horizontalAlignment: 'center',
  };
  header.format.rowHeight = 36;
  used.format.borders = { preset: 'outside', style: 'thin', color: '#D7E2DD' };
  sheet.freezePanes.freezeRows(1);
  sheet.getUsedRange().format.autofitColumns();
  sheet.getUsedRange().format.autofitRows();
}

async function addSheet(workbook, name, rows, tableName) {
  const sheet = workbook.worksheets.add(name);
  sheet.getRangeByIndexes(0, 0, rows.length, rows[0].length).values = rows;
  applyBasicFormatting(sheet, rows.length, rows[0].length);
  sheet.tables.add(sheet.getRangeByIndexes(0, 0, rows.length, rows[0].length), true, tableName);
  return sheet;
}

async function buildWorkbook(data) {
  const workbook = Workbook.create();
  await addSheet(workbook, 'Editorial Dashboard', objectRows(rowsForDashboard(data.records)), 'EditorialDashboard');
  await addSheet(workbook, 'Ranked Roadmap', objectRows(data.records.map((record) => ({
    Rank: record.rank,
    Priority: record.priority,
    Title: record.title,
    Action: record.recommendedAction,
    Category: record.knowledgeCategory,
    Pillar: record.pillar,
    'Publish Score': record.priorityScore,
    'Workflow Status': record.workflowStatus,
    'Why Now': record.whyNow,
    'Why Later': record.whyLater,
    'Why Not': record.whyNot,
  }))), 'RankedRoadmap');
  await addSheet(workbook, 'Top 25', objectRows(data.top25.map((record) => ({
    Rank: record.rank,
    Priority: record.priority,
    Title: record.title,
    Action: record.recommendedAction,
    'Why Now': record.whyNow,
    'Why Later': record.whyLater,
    'Why Not': record.whyNot,
    'Suggested URL': record.suggestedNewUrl,
  }))), 'Top25Recommendations');
  await addSheet(workbook, 'Top 10 Prep', objectRows(data.top10.map((item, index) => ({
    '#': index + 1,
    Slug: item.slug,
    'Original Title': item.originalTitle,
    'Updated Title': item.updatedTitle,
    'Meta Title': item.metaTitle,
    'Meta Description': item.metaDescription,
    'Suggested H1': item.suggestedH1,
    Summary: item.suggestedSummary,
    CTA: item.suggestedCTA,
    'Internal Links': item.internalLinks,
    'Related Articles': item.relatedArticles,
    'Downloadable Guide': item.downloadableGuide,
    'FAQ Links': item.faqLinks,
    'Pillar Page': item.pillarPage,
  }))), 'Top10Prep');
  await addSheet(workbook, 'Pillar Architecture', objectRows(data.pillarRows), 'PillarArchitecture');
  await addSheet(workbook, 'Duplicate Review', objectRows(data.duplicateGroups), 'DuplicateReview');
  await addSheet(workbook, 'Redirect Validation', objectRows(data.redirectRows), 'RedirectValidation');

  const dashboard = workbook.worksheets.getItem('Editorial Dashboard');
  dashboard.getRange('A1:AE1').format.fill = '#123B3A';
  dashboard.getRange('A:AE').format.wrapText = true;

  return workbook;
}

function markdownTable(rows, headers) {
  const escape = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${headers.map((header) => escape(row[header])).join(' | ')} |`),
  ].join('\n');
}

async function writeReports(data) {
  const summary = `# CSO Knowledge Centre Editorial Activation Summary

Generated: 2026-07-09

## Inventory

- Recovered draft resources reviewed: ${data.records.length}
- Recommended first wave: ${data.top25.length}
- Prepared modernization packages: ${data.top10.length}
- Duplicate / merge clusters identified: ${data.duplicateGroups.length}

## Editorial Rule

No recovered draft should be published automatically. Each item should move through Robyn review and legal/medical review where flagged before publication.
`;

  const roadmapRows = data.records.map((record) => ({
    Rank: record.rank,
    Priority: record.priority,
    Title: record.title,
    Action: record.recommendedAction,
    Category: record.knowledgeCategory,
    Workflow: record.workflowStatus,
  }));
  const roadmap = `# Ranked Publishing Roadmap

${markdownTable(roadmapRows, ['Rank', 'Priority', 'Title', 'Action', 'Category', 'Workflow'])}
`;

  const top25Rows = data.top25.map((record) => ({
    Rank: record.rank,
    Priority: record.priority,
    Title: record.title,
    'Why now?': record.whyNow,
    'Why later?': record.whyLater,
    'Why not?': record.whyNot,
  }));
  const top25 = `# Top 25 Publishing Recommendations

${markdownTable(top25Rows, ['Rank', 'Priority', 'Title', 'Why now?', 'Why later?', 'Why not?'])}
`;

  const top10Rows = data.top10.map((item, index) => ({
    '#': index + 1,
    Slug: item.slug,
    'Updated Title': item.updatedTitle,
    'Meta Title': item.metaTitle,
    'Meta Description': item.metaDescription,
    CTA: item.suggestedCTA,
    'Pillar Page': item.pillarPage,
  }));
  const top10 = `# Top 10 Modernization Package

${markdownTable(top10Rows, ['#', 'Slug', 'Updated Title', 'Meta Title', 'Meta Description', 'CTA', 'Pillar Page'])}
`;

  const pillars = `# Pillar Architecture

${markdownTable(data.pillarRows, ['pillar', 'articleCount', 'priorityChildren', 'relatedFaqs', 'downloads', 'futureVideosPodcasts', 'firstAction'])}
`;

  const duplicates = `# Duplicate and Merge Report

${markdownTable(data.duplicateGroups, ['group', 'count', 'slugs', 'recommendation', 'keepHistorical'])}
`;

  const redirects = `# Redirect Validation Report

## Rule

Keep existing redirects in place until the replacement Knowledge Centre resource is published. Then update the legacy URL to the new canonical resource only when the new page is live.

${markdownTable(data.redirectRows, ['oldUrl', 'currentRedirectTarget', 'proposedFutureTarget', 'redirectType', 'status', 'seoRisk', 'recommendation', 'destinationExists'])}
`;

  await fs.mkdir(outputDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outputDir, 'editorial_activation_summary.md'), summary),
    fs.writeFile(path.join(outputDir, 'ranked_publishing_roadmap.md'), roadmap),
    fs.writeFile(path.join(outputDir, 'top_25_recommendations.md'), top25),
    fs.writeFile(path.join(outputDir, 'top_10_modernization_package.md'), top10),
    fs.writeFile(path.join(outputDir, 'pillar_architecture.md'), pillars),
    fs.writeFile(path.join(outputDir, 'duplicate_merge_report.md'), duplicates),
    fs.writeFile(path.join(outputDir, 'redirect_validation_report.md'), redirects),
    fs.writeFile(path.join(outputDir, 'editorial_dashboard_data.json'), JSON.stringify(data, null, 2)),
  ]);
}

async function verifyWorkbook(workbook) {
  const overview = await workbook.inspect({
    kind: 'workbook,sheet,table',
    maxChars: 5000,
    tableMaxRows: 3,
    tableMaxCols: 6,
  });
  console.log(overview.ndjson);

  const errors = await workbook.inspect({
    kind: 'match',
    searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
    options: { useRegex: true, maxResults: 300 },
    summary: 'final formula error scan',
  });
  console.log(errors.ndjson);

  for (const sheetName of ['Editorial Dashboard', 'Ranked Roadmap', 'Top 25', 'Top 10 Prep', 'Pillar Architecture', 'Duplicate Review', 'Redirect Validation']) {
    const preview = await workbook.render({ sheetName, autoCrop: 'all', scale: 1, format: 'png' });
    await fs.writeFile(path.join(outputDir, `${sheetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const data = await buildData();
  await writeReports(data);
  const workbook = await buildWorkbook(data);
  await verifyWorkbook(workbook);
  const xlsx = await SpreadsheetFile.exportXlsx(workbook);
  await xlsx.save(workbookPath);
  console.log(`Saved ${workbookPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
