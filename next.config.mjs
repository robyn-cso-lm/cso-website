/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
      { source: '/become-a-surrogate', destination: '/surrogates', permanent: true },
      { source: '/ips', destination: '/intended-parents', permanent: true },
      { source: '/intended-parents-landing', destination: '/intended-parents', permanent: true },
      { source: '/shop', destination: '/resources', permanent: true },
    ];
  },
};

export default nextConfig;
