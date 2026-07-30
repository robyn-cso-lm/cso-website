/**
 * Verbatim public Google reviews.
 *
 * Single source of truth, shared by /trust and by blog posts that quote them.
 * These were previously inlined in app/trust/page.tsx.
 *
 * RULES:
 * - Quote text is verbatim. Never reword, tighten, or combine reviews.
 * - Never add an entry that is not a real, published, attributable review.
 * - `name` must match the name the reviewer published under.
 */

export type Review = {
  /** The name the reviewer published under. */
  name: string;
  /** Attribution line, e.g. "Public Google review · a year ago". */
  meta: string;
  /** Verbatim review text. */
  quote: string;
};

export const googleReviews: Review[] = [
  {
    name: 'Grit and a Little Glitter',
    meta: 'Public Google review · a month ago',
    quote:
      'Our family had an absolutely amazing experience with Canadian Surrogacy Options. The staff were compassionate, knowledgeable, and always available to answer questions or provide reassurance during emotional moments.',
  },
  {
    name: 'julien marchand',
    meta: 'Public Google review · a year ago',
    quote:
      'The CSO team has been great. We are scrutinizing all bills and steps of the process and everything has been according to what had been discussed. Robyn is accessible and involved in the whole journey.',
  },
  {
    name: 'Erin M',
    meta: 'Public Google review · a year ago',
    quote:
      'I have had nothing but the greatest support from all of them at CSO. If I ever ran into an issue, Robyn and the rest of the team took care of it ASAP.',
  },
  {
    name: 'Caity Herman',
    meta: 'Public Google review · a year ago',
    quote:
      'Very positive experience. Lovely staff and generally quick in responses and communication, and quick to help bridge any gaps where needed between agency, surrogate, and clinics.',
  },
];

/** Look up reviews by reviewer name, preserving the requested order. */
export function reviewsByName(...names: string[]): Review[] {
  return names
    .map(n => googleReviews.find(r => r.name === n))
    .filter((r): r is Review => Boolean(r));
}
