import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private-inquiry', '/api/'],
      },
    ],
    sitemap: 'https://canadiansurrogacyoptions.com/sitemap.xml',
  };
}
