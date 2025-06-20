import { BlogStatus } from '@/models/Blog';

declare global {
  interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    author: string;
    publishedAt: Date | string;
    updatedAt: Date | string;
    tags: string[];
    category?: string;
    status: BlogStatus;
    isNews: boolean;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    views: number;
    likes: number;
    createdAt: Date | string;
  }

  export interface BlogListResponse {
    success: boolean;
    data: BlogPost[];
    pagination?: {
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    };
  }

  interface BlogResponse {
    success: boolean;
    blog?: BlogPost;
    error?: string;
  }

  interface BlogFormData {
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    author: string;
    publishedAt?: string;
    tags?: string[];
    category?: string;
    status?: BlogStatus;
    isNews?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  }
}
