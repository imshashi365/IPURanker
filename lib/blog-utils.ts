import { BlogStatus } from '@/models/Blog';
import { generateSlug, generateMetaDescription, truncateText } from './text-utils';

export interface BlogPostData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  publishedAt?: Date | string;
  tags?: string[] | string;
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

/**
 * Validates and processes blog post data before saving to the database
 * @param data Raw blog post data
 * @returns Processed and validated blog post data
 */
export const processBlogPostData = (data: BlogPostData): any => {
  const {
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    author,
    publishedAt,
    tags,
    category,
    status = 'draft',
    isNews = false,
    metaTitle,
    metaDescription,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = data;

  // Validate required fields
  if (!title || !content || !author) {
    throw new Error('Title, content, and author are required');
  }

  // Process tags (accept both array and comma-separated string)
  const processedTags = Array.isArray(tags)
    ? tags.map(tag => tag.trim().toLowerCase()).filter(Boolean)
    : typeof tags === 'string'
    ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
    : [];

  // Generate slug if not provided
  const processedSlug = slug || generateSlug(title);

  // Generate excerpt if not provided
  const processedExcerpt = excerpt || generateMetaDescription(content, 300);

  // Process dates
  const processedPublishedAt = publishedAt 
    ? new Date(publishedAt)
    : status === 'published' 
      ? new Date() 
      : undefined;

  // Generate meta fields if not provided
  const processedMetaTitle = metaTitle || truncateText(title, 70, false);
  const processedMetaDescription = metaDescription || generateMetaDescription(processedExcerpt, 160);

  return {
    title: title.trim(),
    slug: processedSlug,
    content: content.trim(),
    excerpt: processedExcerpt,
    featuredImage: featuredImage?.trim() || undefined,
    author: author.trim(),
    publishedAt: processedPublishedAt,
    tags: processedTags,
    category: category?.trim() || undefined,
    status,
    isNews,
    metaTitle: processedMetaTitle,
    metaDescription: processedMetaDescription,
    canonicalUrl: canonicalUrl?.trim() || undefined,
    ogTitle: ogTitle?.trim() || processedMetaTitle,
    ogDescription: ogDescription?.trim() || processedMetaDescription,
    ogImage: ogImage?.trim() || featuredImage?.trim(),
    twitterTitle: twitterTitle?.trim() || processedMetaTitle,
    twitterDescription: twitterDescription?.trim() || processedMetaDescription,
    twitterImage: twitterImage?.trim() || featuredImage?.trim(),
    updatedAt: new Date(),
  };
};

/**
 * Validates a blog post status transition
 * @param currentStatus Current status of the blog post
 * @param newStatus New status to transition to
 * @returns True if the transition is valid, false otherwise
 */
export const isValidStatusTransition = (
  currentStatus: BlogStatus,
  newStatus: BlogStatus
): boolean => {
  const validTransitions: Record<BlogStatus, BlogStatus[]> = {
    draft: ['draft', 'published', 'archived'],
    published: ['published', 'archived'],
    archived: ['draft', 'published', 'archived'],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Generates a preview of the blog post with limited content
 * @param content The full HTML content
 * @param maxLength Maximum length of the preview (in characters)
 * @returns HTML preview with limited content
 */
export const generateContentPreview = (content: string, maxLength = 500): string => {
  if (!content) return '';
  
  // First try to get the first paragraph
  const firstParagraph = content.match(/<p[^>]*>([^<]+)<\/p>/i);
  if (firstParagraph && firstParagraph[0]) {
    return firstParagraph[0];
  }
  
  // Fallback: truncate the content
  const plainText = content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  return truncateText(plainText, maxLength);
};
