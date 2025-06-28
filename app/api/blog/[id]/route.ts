import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

// Helper function to find a blog post by ID or slug
async function findBlogByIdOrSlug(id: string) {
  let blog = null;
  
  // First try to find by ID
  if (mongoose.Types.ObjectId.isValid(id)) {
    blog = await Blog.findById(id);
  }
  
  // If not found by ID, try to find by slug
  if (!blog) {
    blog = await Blog.findOne({ slug: id });
  }
  
  return blog;
}

// GET /api/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
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
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
  await dbConnect();
  
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Get form data values
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const publishedAt = formData.get('publishedAt') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;
    const tags = formData.get('tags') as string;
    const author = formData.get('author') as string;
    const featuredImageFile = formData.get('featuredImage') as File | null;
    const featuredImageUrl = formData.get('featuredImageUrl') as string | null;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const isNews = formData.get('isNews') === 'true';
    
    // Check if the blog post exists
    const existingBlog = await findBlogByIdOrSlug(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

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
      
    // Handle featured image upload if a new file is provided
    let featuredImageUrlToUse = existingBlog.featuredImage;
    
    if (featuredImageFile && featuredImageFile.size > 0) {
      try {
        // Upload to Cloudinary
        const cloudinary = require('@/lib/cloudinary');
        
        // Convert File to ArrayBuffer and then to Buffer
        const arrayBuffer = await featuredImageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Upload the buffer to Cloudinary
        const uploadResult = await cloudinary.uploadImage(buffer, 'blog-featured-images');
        featuredImageUrlToUse = uploadResult;
        
        // Delete old image if it exists and is from Cloudinary
        if (existingBlog.featuredImage && existingBlog.featuredImage.includes('res.cloudinary.com')) {
          try {
            const publicId = cloudinary.getPublicIdFromUrl(existingBlog.featuredImage);
            if (publicId) {
              await cloudinary.deleteImage(publicId);
            }
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError);
            // Continue even if deletion fails
          }
        }
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload featured image' },
          { status: 500 }
        );
      }
    } else if (featuredImageUrl) {
      // Use the provided URL if no new file is uploaded
      featuredImageUrlToUse = featuredImageUrl;
    }

    const updateData: any = {
      title,
      slug: slugToUse,
      category,
      publishedAt: new Date(publishedAt),
      excerpt,
      content,
      status,
      tags: Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim()),
      author,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || '',
      isNews,
      updatedAt: new Date(),
    };
    
    // Only update featuredImage if we have a new one
    if (featuredImageUrlToUse) {
      updateData.featuredImage = featuredImageUrlToUse;
      // Also update social sharing images if they were using the old featured image
      if (existingBlog.featuredImage === existingBlog.ogImage) {
        updateData.ogImage = featuredImageUrlToUse;
      }
      if (existingBlog.featuredImage === existingBlog.twitterImage) {
        updateData.twitterImage = featuredImageUrlToUse;
      }
    }
    
    // Update the blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      existingBlog._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBlog });
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
  context: { params: Promise<Record<string, string>> }
) {
  const { id } = await context.params;
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