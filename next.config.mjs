/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
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
