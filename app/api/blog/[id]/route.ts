import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

type Params = {
  id: string;
};

// Helper function to find a blog post by ID or slug
async function findBlogByIdOrSlug(id: string) {
  let blog = null;
  
  // Check if the param is a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(id)) {
    // Try to find by ID first if it's a valid ObjectId
    blog = await Blog.findOne({ _id: new mongoose.Types.ObjectId(id), isNews: true });
  }
  
  // If not found by ID, try by slug
  if (!blog) {
    blog = await Blog.findOne({ slug: id, isNews: true });
  }
  
  return blog;
}

// GET /api/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  context: { params: Params }
) {
  const { id } = context.params;
  await dbConnect();
  try {
    const blog = await findBlogByIdOrSlug(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    
    return NextResponse.json({ 
      success: true, 
      data: blog.toObject({ getters: true }) 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Params }
) {
  const { id } = context.params;
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

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Params }
) {
  const { id } = context.params;
  await dbConnect();
  try {
    // Find the post first to get its ID
    const post = await findBlogByIdOrSlug(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Delete using the found post's ID
    const deletedPost = await Blog.findByIdAndDelete(post._id);
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete blog post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
