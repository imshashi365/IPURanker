'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author?: string;
  publishedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  views: number;
  category?: string;
  status: string;
};

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/news/${id}`, {
          cache: 'no-store' // Ensure we get fresh data
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch post');
        }
        
        if (!data.data) {
          throw new Error('Post not found');
        }
        
        // Ensure dates are properly formatted
        const postData = {
          ...data.data,
          publishedAt: data.data.publishedAt || new Date().toISOString()
        };
        
        setPost(postData);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        
        // If it's a 404, show not found page
        if (err instanceof Error && err.message.includes('not found')) {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setLoading(false);
      setError('Invalid post ID');
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading post</h1>
        <p className="text-gray-600">{error || 'Post not found'}</p>
      </div>
    );
  }

  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date();
  const readTime = Math.ceil((post.content?.length || 0) / 1000); // Rough estimate: 1000 chars ~ 1 min

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-6">{post.title || 'Untitled Post'}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={publishedDate.toISOString()}>
                {format(publishedDate, 'MMMM d, yyyy')}
              </time>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime} min read</span>
            </div>
            
            {post.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>

          {post.featuredImage && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {post.content ? (
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-gray-600 italic">No content available for this post.</p>
        )}
      </article>
    </div>
  );
}
