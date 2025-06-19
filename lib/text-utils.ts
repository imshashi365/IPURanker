/**
 * Truncates text to a specified length, adding an ellipsis if truncated
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @param addEllipsis Whether to add '...' when text is truncated
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, addEllipsis = true): string => {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return addEllipsis ? `${truncated}...` : truncated;
};

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
};

/**
 * Extracts the first paragraph from HTML content
 * @param html The HTML content to extract from
 * @returns Plain text of the first paragraph
 */
export const extractFirstParagraph = (html: string): string => {
  if (!html) return '';
  
  // Simple regex to extract text inside the first <p> tag
  const match = /<p[^>]*>([^<]+)<\/p>/.exec(html);
  if (match && match[1]) {
    // Remove HTML tags and trim
    return match[1].replace(/<[^>]*>?/gm, '').trim();
  }
  
  // Fallback: strip all HTML tags and return first 160 chars
  return html.replace(/<[^>]*>?/gm, '').substring(0, 160).trim();
};

/**
 * Generates meta description from content
 * @param content The content to generate description from
 * @param maxLength Maximum length of the description
 * @returns Generated meta description
 */
export const generateMetaDescription = (content: string, maxLength = 160): string => {
  if (!content) return '';
  
  // First try to get the first paragraph
  const firstParagraph = extractFirstParagraph(content);
  
  // If we have a first paragraph, use it (truncated if needed)
  if (firstParagraph) {
    return truncateText(firstParagraph, maxLength, false);
  }
  
  // Fallback: strip HTML and truncate
  const plainText = content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
  return truncateText(plainText, maxLength, false);
};
