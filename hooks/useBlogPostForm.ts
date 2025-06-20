import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BlogStatus } from '@/models/Blog';
import { processBlogPostData } from '@/lib/blog-utils';

interface UseBlogPostFormProps {
  initialData?: any;
  onSuccess?: (data: any) => void;
  redirectPath?: string;
}

export const useBlogPostForm = ({
  initialData = {},
  onSuccess,
  redirectPath,
}: UseBlogPostFormProps = {}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    slug: initialData.slug || '',
    content: initialData.content || '',
    excerpt: initialData.excerpt || '',
    featuredImage: initialData.featuredImage || '',
    author: initialData.author || '',
    publishedAt: initialData.publishedAt || new Date().toISOString().split('T')[0],
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
    category: initialData.category || '',
    status: initialData.status || 'draft',
    isNews: initialData.isNews || false,
    metaTitle: initialData.metaTitle || '',
    metaDescription: initialData.metaDescription || '',
    canonicalUrl: initialData.canonicalUrl || '',
    ogTitle: initialData.ogTitle || '',
    ogDescription: initialData.ogDescription || '',
    ogImage: initialData.ogImage || '',
    twitterTitle: initialData.twitterTitle || '',
    twitterDescription: initialData.twitterDescription || '',
    twitterImage: initialData.twitterImage || '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      // Auto-generate excerpt if empty or content has changed significantly
      ...(!prev.excerpt && {
        excerpt: content.substring(0, 300) + (content.length > 300 ? '...' : '')
      })
    }));
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      return url;
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image');
      throw err;
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Process the form data
      const processedData = processBlogPostData({
        ...formData,
        // Convert comma-separated tags to array
        tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
      });

      const method = initialData?._id ? 'PUT' : 'POST';
      const url = initialData?._id 
        ? `/api/news/${initialData._id}`
        : '/api/news';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save post');
      }

      const result = await response.json();
      toast.success(`Post ${initialData?._id ? 'updated' : 'created'} successfully`);
      
      if (onSuccess) {
        onSuccess(result);
      } else if (redirectPath) {
        router.push(redirectPath);
      }

      return result;
    } catch (err) {
      console.error('Error saving post:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save post';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, initialData, onSuccess, redirectPath, router]);

  const updateStatus = useCallback(async (newStatus: BlogStatus) => {
    if (!initialData?._id) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/news/${initialData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }

      const result = await response.json();
      toast.success(`Post ${newStatus} successfully`);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error('Error updating status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [initialData?._id, onSuccess]);

  return {
    formData,
    setFormData,
    handleChange,
    handleContentChange,
    handleImageUpload,
    handleSubmit,
    updateStatus,
    isSubmitting,
    error,
  };
};

export default useBlogPostForm;
