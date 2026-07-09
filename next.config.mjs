/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
      // Canonical family gallery lives on the portal (prettier + richer cards)
      { source: '/gallery', destination: 'https://portal.canadiansurrogacyoptions.com/profiles', permanent: false },
      // ── Pre-rebuild redirects ────────────────────────────────────────────────
      { source: '/become-a-surrogate',          destination: '/surrogates',        permanent: true },
      { source: '/ips',                          destination: '/intended-parents',  permanent: true },
      { source: '/intended-parents-landing',    destination: '/intended-parents',  permanent: true },
      { source: '/shop',                         destination: '/resources',         permanent: true },

      // ── Old WordPress URL structure (Google-indexed) ─────────────────────────
      // /aboutourteam/* variants
      { source: '/aboutourteam/faqs',           destination: '/surrogates',        permanent: true },
      { source: '/aboutourteam/faqs/',          destination: '/surrogates',        permanent: true },
      { source: '/aboutourteam/story',          destination: '/about',             permanent: true },
      { source: '/aboutourteam/story/',         destination: '/about',             permanent: true },
      { source: '/aboutourteam',                destination: '/about',             permanent: true },
      { source: '/aboutourteam/',               destination: '/about',             permanent: true },

      // /about/story/
      { source: '/about/story',                 destination: '/about',             permanent: true },
      { source: '/about/story/',                destination: '/about',             permanent: true },

      // /become-a-surrogate/ (trailing slash variant)
      { source: '/become-a-surrogate/',         destination: '/surrogates',        permanent: true },

      // /ips/ (trailing slash variant)
      { source: '/ips/',                         destination: '/intended-parents',  permanent: true },

      // /success_stories/ + wildcard sub-pages
      { source: '/success_stories',             destination: '/blog',              permanent: true },
      { source: '/success_stories/',            destination: '/blog',              permanent: true },
      { source: '/success_stories/:path*',      destination: '/blog',              permanent: true },
      { source: '/blog/truth-about-last-two-years', destination: '/blog/the-truth-about-the-last-two-years', permanent: true },
      { source: '/blog/:slug/attachment/:path*', destination: '/blog/:slug',       permanent: true },
      { source: '/welcome/attachment/:path*',    destination: '/welcome',          permanent: true },
      { source: '/contact/attachment/:path*',    destination: '/contact',          permanent: true },
      { source: '/feed',                         destination: '/blog',              permanent: true },
      { source: '/feed/',                        destination: '/blog',              permanent: true },
      { source: '/comments/feed',                destination: '/blog',              permanent: true },
      { source: '/comments/feed/',               destination: '/blog',              permanent: true },
      { source: '/blog/feed',                    destination: '/blog',              permanent: true },
      { source: '/blog/feed/',                   destination: '/blog',              permanent: true },
      { source: '/tag/:path*',                   destination: '/blog',             permanent: true },
      { source: '/category/:path*',              destination: '/blog',             permanent: true },
      { source: '/author/:path*',                destination: '/blog',             permanent: true },
      { source: '/blog/:slug/feed',              destination: '/blog/:slug',       permanent: true },
      { source: '/aboutourteam/feed',            destination: '/about',            permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})', destination: '/blog',             permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/:path*', destination: '/blog',      permanent: true },
      { source: '/Index.asp',                    destination: '/',                 permanent: true },
      { source: '/home.html',                    destination: '/',                 permanent: true },
      { source: '/index.html',                   destination: '/',                 permanent: true },
      { source: '/types_of_surrogacy.html',      destination: '/blog/gestational-vs-traditional-surrogacy', permanent: true },
      { source: '/surrogate-application',        destination: '/qualify',         permanent: true },
      { source: '/intake-form',                  destination: '/contact',         permanent: true },
      { source: '/ip-intake-form',               destination: '/intended-parents#cost-guide', permanent: true },
      { source: '/ip-intake-form/',              destination: '/intended-parents#cost-guide', permanent: true },
      { source: '/ipgiveaway',                   destination: '/resources',       permanent: true },
      { source: '/ips/what-we-offer',            destination: '/programs',        permanent: true },
      { source: '/ips/concierge/concierge-welcome', destination: '/intended-parents', permanent: true },
      { source: '/us-division',                  destination: '/international',   permanent: true },
      { source: '/cso-family-surrogacy-agency',  destination: '/about',           permanent: true },
      { source: '/types-surrogacy',              destination: '/blog/gestational-vs-traditional-surrogacy', permanent: true },
      { source: '/aboutourteam/laws',            destination: '/blog/legal-framework-canada', permanent: true },
      { source: '/aboutourteam/laws/',           destination: '/blog/legal-framework-canada', permanent: true },
      { source: '/about/law',                    destination: '/blog/legal-framework-canada', permanent: true },
      { source: '/terms-conditions',             destination: '/contact',         permanent: true },

      // Topic-level recovery for strong legacy posts
      { source: '/blog/becoming-a-surrogate-in-canada', destination: '/blog/surrogate-eligibility-canada', permanent: true },
      { source: '/blog/so-you-want-to-be-a-surrogate', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/top-5-reasons-become-surrogate', destination: '/blog/is-surrogacy-right-for-you', permanent: true },
      { source: '/blog/become-surrogate-mother', destination: '/blog/surrogate-eligibility-canada', permanent: true },
      { source: '/blog/ways-to-prepare-for-transfer-day', destination: '/blog/mcdonalds-fries-transfer-day-tradition', permanent: true },
      { source: '/blog/how-to-address-surrogacy-with-your-family', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/best-pregnancy-apps', destination: '/blog/what-to-expect-first-year', permanent: true },
      { source: '/blog/surro-self-care-tips', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosafecoldremedies', destination: '/blog/what-to-expect-first-year', permanent: true },
      { source: '/blog/update-cso-family-on-covid-19', destination: '/blog/cso-since-1992', permanent: true },
      { source: '/blog/why-canadian-surrogacy-remains-one-of-the-safest-and-most-supported-paths-in-2025', destination: '/blog/surrogacy-canada-guide', permanent: true },
      { source: '/blog/ðŸ’œ-why-canadian-surrogacy-is-still-one-of-the-most-trusted-paths-to-parenthood-in-2025', destination: '/blog/surrogacy-canada-guide', permanent: true },
      { source: '/blog/ðŸ’•-becoming-a-surrogate-in-canada-what-you-should-know-2025-edition', destination: '/blog/surrogate-eligibility-canada', permanent: true },
      { source: '/blog/keep-recipient-involved-surrogacy', destination: '/blog/what-intended-parents-want-surrogate-profile', permanent: true },
      { source: '/blog/creative-pregnancy-announcements', destination: '/blog/family-story', permanent: true },
      { source: '/blog/for-mom', destination: '/blog/letter-to-my-mom', permanent: true },
      { source: '/blog/meet-the-team-tuesday', destination: '/about', permanent: true },
      { source: '/blog/its-been-a-minute', destination: '/blog/the-truth-about-the-last-two-years', permanent: true },
      { source: '/blog/its-been-a-minute-2', destination: '/blog/the-truth-about-the-last-two-years', permanent: true },
      { source: '/blog/press-release-canadian-surrogacy-options-canadas-first-surrogacy-company-celebrates-25-years-helping-couples-nurture-their-dream-of-having-a-family', destination: '/blog/cso-since-1992', permanent: true },
      { source: '/blog/mysurrogacyjourney-back-to-the-beginning', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/mysurrogacyjourney-long-time-coming', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/mysurrogacyjourney-back-at-it', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/mysurrogacyjourney-quick-check-in', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosister-secrets-part-7', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosister-secrets-part-8', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosister-secrets-part-9', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosister-secrets-part-10', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosister-secrets-part-12', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/blog/surrosister-secrets-part-16', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },

      // Uncategorized legacy education posts
      { source: '/uncategorized/10-side-effects-of-progesterone-shots-for-ivf', destination: '/blog/what-to-expect-first-year', permanent: true },
      { source: '/uncategorized/embryo-development-after-3dt-when-to-take-a', destination: '/blog/surrogacy-timeline-canada', permanent: true },
      { source: '/uncategorized/my-story-by-joanne-wright', destination: '/about', permanent: true },
      { source: '/uncategorized/creating-families-through-surrogacy-with-canadian', destination: '/blog/cso-since-1992', permanent: true },
      { source: '/uncategorized/tips-on-preparing-for-your-egg-retrieval', destination: '/blog/egg-donation-in-canada', permanent: true },
      { source: '/uncategorized/a-patients-perspective-what-to-expect-during-your', destination: '/blog/what-to-expect-first-year', permanent: true },
      { source: '/uncategorized/what-to-expect-at-your-surrogacy-screening-appointment-2', destination: '/blog/surrogate-eligibility-canada', permanent: true },
      { source: '/uncategorized/tips-for-the-2-week-wait', destination: '/blog/mcdonalds-fries-transfer-day-tradition', permanent: true },
      { source: '/uncategorized/talkingaboutsurrogacy', destination: '/blog/what-its-like-to-be-a-surrogate-canada', permanent: true },
      { source: '/uncategorized/infertility-awareness-association-of-canada', destination: '/blog/surrogacy-vs-adoption-canada', permanent: true },
      { source: '/uncategorized/infertility-treatment-financial-assistance-fund', destination: '/blog/surrogacy-cost-canada-2026', permanent: true },

      // /services/ → /programs (no /services page on rebuilt site)
      { source: '/services',                    destination: '/programs',          permanent: true },
      { source: '/services/',                   destination: '/programs',          permanent: true },

      // /surrogates sub-page no longer exists
      { source: '/surrogates/what-to-expect-on-your-journey',  destination: '/surrogates', permanent: true },
      { source: '/surrogates/what-to-expect-on-your-journey/', destination: '/surrogates', permanent: true },
    ];
  },
};

export default nextConfig;
