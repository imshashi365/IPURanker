import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const revalidate = 3600; // Revalidate every hour

async function getBlogPosts() {
  await dbConnect();
  
  try {
    const posts = await Blog.find({ status: 'published', isNews: true })
      .select('title slug excerpt featuredImage publishedAt tags')
      .sort({ publishedAt: -1 })
      .lean();
      
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
      tags: post.tags || [],
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export const metadata = {
  title: 'Blog - IPU Ranker',
  description: 'Latest news, updates, and articles about IPU colleges, admissions, and more.',
  openGraph: {
    title: 'Blog - IPU Ranker',
    description: 'Latest news, updates, and articles about IPU colleges, admissions, and more.',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">IPU Ranker Blog</h1>
        <p className="text-xl text-gray-600">Latest news, updates, and articles about IPU colleges, admissions, and more.</p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No blog posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.slug}`}>
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
