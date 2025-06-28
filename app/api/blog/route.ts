import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog, { IBlog } from '@/models/Blog';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

type BlogDocument = IBlog & {
  _id: string;
  __v?: number;
};

// POST /api/blog - Create a new blog post
// Helper function to upload base64 image to Cloudinary
async function uploadBase64Image(base64Data: string, folder = 'blog-images') {
  try {
    const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder,
      resource_type: 'auto',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function POST(req: NextRequest) {
  console.log('Received POST request to /api/blog');
  try {
    await dbConnect();
    console.log('Database connected, processing request...');
    const formData = await req.formData();
    
    // Extract all fields from form data
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const tags = formData.get('tags');
    const publishedAt = formData.get('publishedAt');
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as string;
    const status = (formData.get('status') as 'draft' | 'published' | 'archived' | null) || 'draft';
    const slug = formData.get('slug') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const ogTitle = formData.get('ogTitle') as string;
    const ogDescription = formData.get('ogDescription') as string;
    const twitterTitle = formData.get('twitterTitle') as string;
    const twitterDescription = formData.get('twitterDescription') as string;
    const canonicalUrl = formData.get('canonicalUrl') as string;
    
    // Handle file upload
    const featuredImageFile = formData.get('featuredImage') as File | null;
    let featuredImage = formData.get('featuredImageUrl') as string | null;
    
    // If a new image was uploaded, process it
    if (featuredImageFile && featuredImageFile.size > 0) {
      try {
        const arrayBuffer = await featuredImageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        featuredImage = await uploadBase64Image(base64, 'blog-featured-images');
      } catch (error) {
        console.error('Error processing uploaded image:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to process uploaded image' },
          { status: 400 }
        );
      }
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

    // Create blog post data object
    const blogData: Partial<IBlog> = {
      title,
      slug: slugToUse,
      content,
      author,
      tags: Array.isArray(tags) 
        ? tags 
        : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []),
      publishedAt: publishedAt ? new Date(String(publishedAt)) : new Date(),
      isNews: true,
      excerpt: excerpt || content.substring(0, 160) + (content.length > 160 ? '...' : ''),
      category,
      status: status as 'draft' | 'published' | 'archived',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || (excerpt || content).substring(0, 160),
      ogTitle: ogTitle || title,
      ogDescription: ogDescription || excerpt || content.substring(0, 160),
      twitterTitle: twitterTitle || title,
      twitterDescription: twitterDescription || excerpt || content.substring(0, 160),
      canonicalUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only include image fields if we have an image
    if (featuredImage) {
      blogData.featuredImage = featuredImage;
      blogData.ogImage = ogTitle || featuredImage;
      blogData.twitterImage = twitterTitle || featuredImage;
    }

    const blog = await Blog.create(blogData);
    
    console.log('Blog post created successfully:', { id: blog._id, title: blog.title });
    return NextResponse.json(
      { success: true, data: blog },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/blog:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create blog post',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined
      },
      { status: 500 }
    );
  }
}

// Define the response type for blog list
type BlogListResponse = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  category?: string;
  status: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  views?: number;
};

// GET /api/blog - List all blog posts with optional filtering
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Base query to only get blog posts
    const query: any = { isNews: true };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      // Default to only published posts if no status is specified
      query.status = 'published';
    }
    // If status is 'all', do not add any status filter, thus fetching all.
    
    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    
    // Get paginated results with selected fields
    const blogDocs = await Blog.find(query)
      .sort({ publishedAt: -1, _id: -1 }) // Sort by published date and ID for consistent ordering
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt featuredImage publishedAt category status author metaTitle metaDescription views')
      .lean()
      .exec() as any[];

    // Transform the data for the response
    const data: BlogListResponse[] = blogDocs.map((post: any) => ({
      ...post,
      _id: post._id?.toString() || '',
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
