'use client';

import { FormEvent, Fragment, ReactNode, useState } from 'react';
import styles from './AskKnowledge.module.css';

// "Ask anything" for the Knowledge Centre. The portal finds the articles that
// best match the question and writes a short answer that links back to them.

const PORTAL_API = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'https://cso-lm-portal-production.up.railway.app';
const CALENDLY = 'https://calendly.com/cso-robyn';

const SUGGESTIONS = [
  'How much does surrogacy cost in Canada?',
  'Can egg donors be paid in Canada?',
  'Who can be a surrogate?',
  'Can we use an egg donor and a surrogate together?',
];

type Source = { title: string; url: string; category?: string | null; cited?: boolean };
type Result = { answer: string | null; sources: Source[]; reason?: string };

function toPath(url: string) {
  return url.replace(/^https:\/\/(www\.)?canadiansurrogacyoptions\.com/, '') || '/';
}

// Turns "text [1] more [2]" into text with small numbered links to the sources.
function withCitations(paragraph: string, sources: Source[]): ReactNode[] {
  return paragraph.split(/(\[\d{1,2}\])/g).map((part, i) => {
    const match = part.match(/^\[(\d{1,2})\]$/);
    const source = match ? sources[Number(match[1]) - 1] : null;
    if (!source) return <Fragment key={i}>{part}</Fragment>;
    return (
      <a key={i} href={toPath(source.url)} className={styles.cite} title={source.title}>
        {match![1]}
      </a>
    );
  });
}

export default function AskKnowledge() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(q: string) {
    const text = q.trim();
    if (text.length < 3 || loading) return;
    setQuestion(text);
    setAsked(text);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${PORTAL_API}/api/public/knowledge/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setResult(data as Result);
      try {
        (window as any).fbq?.('trackCustom', 'KnowledgeAsk');
      } catch { /* tracking is optional */ }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(question);
  }

  const cited = result?.sources.filter((s) => s.cited) || [];
  const shownSources = cited.length ? cited : result?.sources || [];

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={onSubmit} role="search">
        <label htmlFor="ask-knowledge" className={styles.label}>Ask anything about surrogacy or egg donation</label>
        <div className={styles.row}>
          <input
            id="ask-knowledge"
            className={styles.input}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How long does it take to match with a surrogate?"
            maxLength={300}
            autoComplete="off"
          />
          <button type="submit" className={styles.button} disabled={loading || question.trim().length < 3}>
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </div>
      </form>

      {!result && !loading && !error && (
        <div className={styles.suggestions} aria-label="Popular questions">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className={styles.chip} onClick={() => ask(s)}>{s}</button>
          ))}
        </div>
      )}

      <div aria-live="polite">
        {loading && (
          <div className={styles.panel}>
            <div className={styles.shimmer} />
            <div className={styles.shimmer} style={{ width: '82%' }} />
            <div className={styles.shimmer} style={{ width: '64%' }} />
          </div>
        )}

        {error && <p className={styles.error} role="alert">{error}</p>}

        {result && (
          <div className={styles.panel}>
            <p className={styles.asked}>{asked}</p>

            {result.answer ? (
              <div className={styles.answer}>
                {result.answer.split(/\n{2,}/).filter(Boolean).map((p, i) => (
                  <p key={i}>{withCitations(p, result.sources)}</p>
                ))}
              </div>
            ) : result.sources.length ? (
              <p className={styles.answer}>Here is what we have written on that:</p>
            ) : (
              <p className={styles.answer}>
                We have not written about that one yet. It is a great question, and Robyn would love to answer it
                personally on a free call.
              </p>
            )}

            {shownSources.length > 0 && (
              <div className={styles.sources}>
                <p className={styles.sourcesLabel}>{result.answer ? 'From these articles' : 'Articles'}</p>
                <ul>
                  {shownSources.map((s) => (
                    <li key={s.url}>
                      <a href={toPath(s.url)}>{s.title}</a>
                      {s.category && <span className={styles.sourceCategory}>{s.category}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.footer}>
              <a href={CALENDLY} className={styles.callLink} target="_blank" rel="noopener noreferrer">
                Talk it through with Robyn (free call)
              </a>
              {result.answer && (
                <span className={styles.note}>
                  AI summary of our articles. General information, not medical or legal advice.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
