import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET /api/news/[id] - Get a single news post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    // Try to find by ID first
    let news = await Blog.findOne({ _id: params.id, isNews: true });
    
    // If not found by ID, try by slug
    if (!news) {
      news = await Blog.findOne({ slug: params.id, isNews: true });
    }
    
    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News post not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    news.views = (news.views || 0) + 1;
    await news.save();
    
    return NextResponse.json({ 
      success: true, 
      data: news.toObject({ getters: true }) 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch news post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      publishedAt,
      excerpt,
      content,
      status,
      tags,
      author,
      featuredImage,
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
    } = body;

    // Validate required fields
    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const slugToUse = slug || title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');

    const updateData = {
      title,
      slug: slugToUse,
      category,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      excerpt: excerpt || content.substring(0, 160) + (content.length > 160 ? '...' : ''),
      content,
      status: status || 'draft',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      author,
      featuredImage,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || (excerpt || content).substring(0, 160),
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || excerpt || content.substring(0, 160),
      ogImage: ogImage || featuredImage,
      twitterTitle: twitterTitle || title,
      twitterDescription: twitterDescription || excerpt || content.substring(0, 160),
      twitterImage: twitterImage || featuredImage,
      canonicalUrl,
      updatedAt: new Date(),
    };

    const news = await Blog.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('Error updating news post:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update news post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const deletedNews = await Blog.findByIdAndDelete(params.id);
    if (!deletedNews) {
      return NextResponse.json(
        { success: false, error: 'News post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, news: deletedNews });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete news post' },
      { status: 500 }
    );
  }
}
