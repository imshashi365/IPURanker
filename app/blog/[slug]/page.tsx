import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogPostMetadata from '@/components/seo/BlogPostMetadata';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 3600; // Revalidate every hour

async function getBlogPost(slug: string) {
  await dbConnect();
  
  try {
    const post = await Blog.findOne({ slug, isNews: true, status: 'published' });
    if (!post) return null;
    
    // Convert to plain object and handle ObjectId serialization
    const result = JSON.parse(JSON.stringify(post));
    
    // Ensure we have all required fields
    return {
      ...result,
      publishedAt: result.publishedAt || result.createdAt,
      updatedAt: result.updatedAt || result.createdAt,
      tags: result.tags || [],
      author: result.author || 'IPU Ranker',
      excerpt: result.excerpt || result.content?.substring(0, 160) + '...' || '',
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export async function generateStaticParams() {
  await dbConnect();
  const posts = await Blog.find({ status: 'published', isNews: true })
    .select('slug')
    .lean();
    
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <BlogPostMetadata
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        image={post.featuredImage}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author}
        keywords={post.tags}
      />
      
      <JsonLd
        type="BlogPosting"
        data={{
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage,
          author: {
            '@type': 'Person',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'IPU Ranker',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ipuraner.com/logo.png',
            },
          },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://ipuraner.com/blog/${post.slug}`,
          },
        }}
      />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 text-sm">
          <span>By {post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={new Date(post.publishedAt).toISOString()}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <>
              <span className="mx-2">•</span>
              <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
        {post.featuredImage && (
          <div className="mt-6 rounded-lg overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </header>

      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags?.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <a
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
