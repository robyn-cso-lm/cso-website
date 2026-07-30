/**
 * Real, attributable reviews and testimonials.
 *
 * Single source of truth, shared by /trust and by blog posts that quote them.
 *
 * RULES:
 * - Quote text is verbatim. Never reword, tighten, combine, or fix typos.
 *   Small imperfections are what make a testimonial read as a real person.
 * - Never add an entry that is not a real, published or directly supplied,
 *   attributable review.
 * - `meta` must describe what the quote actually is. Do not label something a
 *   Google review unless it was published as one. Where the source is not
 *   known, describe the person's relationship to CSO instead, using only
 *   details they stated themselves.
 */

export type Review = {
  /** The name the reviewer published or supplied. */
  name: string;
  /** Attribution line shown under the name. Must be accurate about the source. */
  meta: string;
  /** Verbatim review text. */
  quote: string;
  /** Where the quote came from. Used to filter which ones a page shows. */
  source: 'google' | 'testimonial';
  /**
   * Star rating, only where the person actually left one. Stars render solely
   * when this is set, so an unrated testimonial is never dressed up as a
   * five-star review. Leave it off unless you have checked the real rating.
   */
  rating?: 1 | 2 | 3 | 4 | 5;
};

export const reviews: Review[] = [
  // ── Public Google reviews ────────────────────────────────────────────────
  {
    name: 'Grit and a Little Glitter',
    meta: 'Public Google review · a month ago',
    source: 'google',
    quote:
      'Our family had an absolutely amazing experience with Canadian Surrogacy Options. The staff were compassionate, knowledgeable, and always available to answer questions or provide reassurance during emotional moments.',
  },
  {
    name: 'julien marchand',
    meta: 'Public Google review · a year ago',
    source: 'google',
    quote:
      'The CSO team has been great. We are scrutinizing all bills and steps of the process and everything has been according to what had been discussed. Robyn is accessible and involved in the whole journey.',
  },
  {
    name: 'Erin M',
    meta: 'Public Google review · a year ago',
    source: 'google',
    quote:
      'I have had nothing but the greatest support from all of them at CSO. If I ever ran into an issue, Robyn and the rest of the team took care of it ASAP.',
  },
  {
    name: 'Caity Herman',
    meta: 'Public Google review · a year ago',
    source: 'google',
    quote:
      'Very positive experience. Lovely staff and generally quick in responses and communication, and quick to help bridge any gaps where needed between agency, surrogate, and clinics.',
  },

  // ── Testimonials supplied directly ───────────────────────────────────────
  // Attribution below is built only from details each person stated in their
  // own testimonial. If any of these were in fact posted publicly somewhere,
  // update `meta` to name that source.
  {
    name: 'Vicky V',
    meta: 'Intended parent · two journeys with CSO, most recently 2023',
    source: 'testimonial',
    quote:
      'I am a former IP and used CSO twice the last time was in 2023. We were blessed with two successful journeys and gifted with two incredible daughters. Our experience with CSO from start to finish was professional, organized and made our journeys seamless. We remain advocates of CSO and our surrogates. My sister in law is on a current journey with them currently. Same experience thus far. Feel free to reach out!',
  },
  {
    name: 'Simonica K',
    meta: 'Intended parent · matched within months of signing',
    source: 'testimonial',
    quote:
      "My husband Nick and I signed on with CSO in May, we're lucky enough to match late summer and our experience with CSO has been that they answer questions anytime we want beyond office hours. We were referred by my sister in law who used them twice and we are having a positive experience. Would recommend.",
  },
  {
    name: 'Sharron F',
    meta: 'Intended parent · surrogate has been with CSO over a decade',
    source: 'testimonial',
    quote:
      "I've seen many negative comments about CSO. My surrogate has been with them for over a decade and had had multiple journeys as have others, so I don't think this is an agency issue but rather a people issue. This isn't a black and white industry so choose your surrogate wisely and let the agency do its job. Would highly recommend",
  },
  {
    name: 'L&A',
    meta: 'Intended parents · two children with CSO, now beginning a third journey',
    source: 'testimonial',
    quote:
      'Ten years ago, friends advised me to choose CSO to have a baby; they had three children with this agency. I went ahead with my eyes closed and quickly had my son. Two years later, his little sister was born. Robyn and her mother Joanne were incredible. Our entire journey went very well. Today, a new journey opens up to us. We are very happy to be reunited with Robyn for a new journey. We are eager to meet our future surrogate and share this wonderful adventure with her and CSO.',
  },
];

/** Public Google reviews only. */
export const googleReviews: Review[] = reviews.filter(r => r.source === 'google');

/** Look up reviews by name, preserving the requested order. */
export function reviewsByName(...names: string[]): Review[] {
  return names
    .map(n => reviews.find(r => r.name === n))
    .filter((r): r is Review => Boolean(r));
}
