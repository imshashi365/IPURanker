'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

type BlogPost = {
  _id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  category?: string;
};

export default function LatestNews() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ensure we get fresh data and don't cache
        const res = await fetch('/api/news?limit=3', {
          cache: 'no-store',
          next: { revalidate: 60 } // Revalidate every 60 seconds
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch latest posts');
        }
        
        // Ensure we have an array of posts
        const postsData = Array.isArray(data.data) ? data.data : [];
        
        // Ensure each post has required fields
        const formattedPosts = postsData.map((post: Partial<BlogPost> & { _id: string }) => ({
          ...post,
          _id: post._id || '',
          title: post.title || 'Untitled Post',
          excerpt: post.excerpt || '',
          publishedAt: post.publishedAt || new Date().toISOString(),
          content: post.content || ''
        }));
        
        setPosts(formattedPosts);
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPosts([]); // Ensure posts is an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
    
    // Set up refresh interval (e.g., every 5 minutes)
    const intervalId = setInterval(fetchLatestPosts, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Error loading news: {error}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No News Found</h3>
        <p className="text-sm text-muted-foreground">
          There are no news posts available at the moment. Please check back later.
        </p>
        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link href="/admin/news">
              Create News Post
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post._id} className="flex flex-col h-full">
          {post.featuredImage && (
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl line-clamp-2">
              <Link href={`/news/${post.slug || post._id}`} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.publishedAt), 'MMM d, yyyy')}
              {post.category && (
                <>
                  <span>•</span>
                  <span className="text-primary">{post.category}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground line-clamp-3">{post.excerpt || post.content.substring(0, 150)}...</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 h-auto">
              <Link href={`/news/${post.slug || post._id}`}>
                Read more
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
