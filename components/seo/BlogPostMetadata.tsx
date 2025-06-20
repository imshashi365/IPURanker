import Head from 'next/head';

export default function BlogPostMetadata({ 
  title, 
  description, 
  slug, 
  image, 
  publishedAt,
  updatedAt,
  author = 'IPU Ranker',
  keywords = []
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt: string;
  author?: string;
  keywords?: string[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipuraner.com';
  const canonicalUrl = `${baseUrl}/blog/${slug}`;
  const featuredImage = image || `${baseUrl}/images/default-og.jpg`;

  return (
    <Head>
      <title>{`${title} | IPU Ranker`}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={featuredImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="IPU Ranker" />
      <meta property="article:published_time" content={new Date(publishedAt).toISOString()} />
      <meta property="article:modified_time" content={new Date(updatedAt).toISOString()} />
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={featuredImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}
