import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all blog posts with their status and isNews flag
    const posts = await Blog.find({})
      .select('title slug status isNews publishedAt')
      .sort({ publishedAt: -1 })
      .lean();
    
    // Get the posts that would be shown on the blog page
    const publishedNews = posts.filter(post => 
      post.status === 'published' && post.isNews === true
    );
    
    return NextResponse.json({
      success: true,
      totalPosts: posts.length,
      publishedNewsCount: publishedNews.length,
      publishedNews,
      allPosts: posts
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
