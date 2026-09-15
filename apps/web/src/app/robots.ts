import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Soft launch / testing phase — disallow indexing to prevent search engines from premature crawling
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
