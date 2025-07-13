import { MetadataRoute } from 'next';
import { connectToDB } from '@/lib/mongoose';
import College from '@/models/College';
import Blog from '@/models/Blog';

function ensureHttpsAndWww(url: string): string {
  // Ensure the URL starts with https://
  let processedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Ensure www. is present
  if (!processedUrl.includes('www.')) {
    processedUrl = processedUrl.replace('https://', 'https://www.');
  }
  
  // Remove trailing slash for consistency
  return processedUrl.endsWith('/') ? processedUrl.slice(0, -1) : processedUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the domain with www for consistency
  const baseUrl = ensureHttpsAndWww('ipubuddy.com');
  
  // Connect to database
  await connectToDB();

  // Get current date for lastModified
  const currentDate = new Date();
  
  // Static routes
  const staticRoutes = [
    { url: '', priority: 1.0 },
    { url: '/blog', priority: 0.8 },
    { url: '/colleges', priority: 0.9 },
    { url: '/news', priority: 0.8 },
    { url: '/placements', priority: 0.7 },
    { url: '/admin', priority: 0.3 },
    { url: '/admin/dashboard', priority: 0.3 },
  ].map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: route.priority,
  }));

  // Fetch dynamic routes
  try {
    // Get all published colleges
    const colleges = await College.find({}, 'slug updatedAt').lean();
    const collegeRoutes = colleges.map(college => ({
      url: `${baseUrl}/colleges/${college.slug || college._id}`,
      lastModified: college.updatedAt || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Get all published blog posts and news articles
    const blogPosts = await Blog.find({ status: 'published' }, 'slug updatedAt isNews').lean();
    
    const blogPostRoutes = blogPosts
      .filter(post => !post.isNews)
      .map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    const newsArticleRoutes = blogPosts
      .filter(post => post.isNews)
      .map(post => ({
        url: `${baseUrl}/news/${post.slug}`,
        lastModified: post.updatedAt || currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));

    return [
      ...staticRoutes,
      ...collegeRoutes,
      ...blogPostRoutes,
      ...newsArticleRoutes,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return just the static routes if there's an error with the database
    return staticRoutes;
  }
}
