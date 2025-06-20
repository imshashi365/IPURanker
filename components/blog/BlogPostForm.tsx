import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { SEOFields } from '@/components/blog/SEOFIelds';
import { BlogStatus } from '@/models/Blog';
import { processBlogPostData } from '@/lib/blog-utils';

// Form validation schema
const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens'
  ),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt is too long').optional(),
  featuredImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  author: z.string().min(1, 'Author is required'),
  publishedAt: z.date(),
  tags: z.string(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  isNews: z.boolean().default(false),
  // SEO fields
  metaTitle: z.string().max(70, 'Meta title is too long').optional(),
  metaDescription: z.string().max(160, 'Meta description is too long').optional(),
  canonicalUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url('Invalid URL').or(z.literal('')).optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  submitButtonText?: string;
  showPreviewButton?: boolean;
  onPreview?: () => void;
}

export const BlogPostForm = ({
  initialData = {},
  onSuccess,
  onCancel,
  isSubmitting: externalIsSubmitting = false,
  error: externalError,
  submitButtonText = 'Save',
  showPreviewButton = true,
  onPreview,
}: BlogPostFormProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  const [isInternalSubmitting, setIsInternalSubmitting] = useState(false);
  
  const isSubmitting = externalIsSubmitting || isInternalSubmitting;
  
  const defaultValues = useMemo(() => ({
    title: initialData.title || '',
    slug: initialData.slug || '',
    content: initialData.content || '',
    excerpt: initialData.excerpt || '',
    featuredImage: initialData.featuredImage || '',
    author: initialData.author || '',
    publishedAt: initialData.publishedAt ? new Date(initialData.publishedAt) : new Date(),
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
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
  }), [initialData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues,
  });

  const watchedValues = watch();

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    
    // Only auto-generate slug if it's empty or matches the auto-generated version
    const currentSlug = watch('slug');
    const autoSlug = generateSlugFromTitle(title);
    
    if (!currentSlug || currentSlug === generateSlugFromTitle(watch('title'))) {
      setValue('slug', autoSlug, { shouldValidate: true });
    }
  };

  const handleContentChange = (content: string) => {
    setValue('content', content);
    
    // Auto-generate excerpt if empty
    if (!watch('excerpt') && content) {
      const plainText = content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      const excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
      setValue('excerpt', excerpt);
    }
  };

  const handleImageUpload = async (file: File) => {
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
      throw err;
    }
  };

  const onSubmit = async (data: BlogPostFormValues) => {
    try {
      setIsInternalSubmitting(true);
      
      // Process tags from comma-separated string to array
      const tags = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      
      const processedData = processBlogPostData({
        ...data,
        tags,
      });

      if (onSuccess) {
        await onSuccess(processedData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsInternalSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      placeholder="Enter post title"
                      onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e);
                      }}
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="slug"
                        placeholder="post-slug"
                        className="font-mono text-sm"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const slug = generateSlugFromTitle(watch('title'));
                      setValue('slug', slug, { shouldValidate: true });
                    }}
                    disabled={isSubmitting}
                  >
                    Generate
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <Controller
                  name="featuredImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange('')}
                      disabled={isSubmitting}
                      aspectRatio="video"
                    />
                  )}
                />
                {errors.featuredImage && (
                  <p className="text-sm text-destructive">{errors.featuredImage.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      onChange={(content) => {
                        field.onChange(content);
                        handleContentChange(content);
                      }}
                      placeholder="Write your post content here..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Controller
                  name="excerpt"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="excerpt"
                      rows={3}
                      placeholder="A short excerpt that summarizes your post (optional)"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('excerpt')?.length || 0}/300 characters
                </p>
                {errors.excerpt && (
                  <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <SEOFields
            metaTitle={watch('metaTitle') || ''}
            metaDescription={watch('metaDescription') || ''}
            canonicalUrl={watch('canonicalUrl') || ''}
            ogTitle={watch('ogTitle') || ''}
            ogDescription={watch('ogDescription') || ''}
            ogImage={watch('ogImage') || watch('featuredImage') || ''}
            twitterTitle={watch('twitterTitle') || ''}
            twitterDescription={watch('twitterDescription') || ''}
            twitterImage={watch('twitterImage') || watch('featuredImage') || ''}
            onFieldChange={(field, value) => setValue(field as any, value, { shouldValidate: true })}
          />
        </div>

        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['draft', 'published', 'archived'] as const).map((status) => (
                    <Controller
                      key={status}
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Button
                          type="button"
                          variant={field.value === status ? 'default' : 'outline'}
                          size="sm"
                          className="capitalize"
                          onClick={() => field.onChange(status)}
                          disabled={isSubmitting}
                        >
                          {status}
                        </Button>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Controller
                  name="publishedAt"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="author"
                      placeholder="Author name"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="category"
                      placeholder="Category"
                      list="categories"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <datalist id="categories">
                  <option value="Technology" />
                  <option value="Business" />
                  <option value="Lifestyle" />
                  <option value="Education" />
                  <option value="Health" />
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="tags"
                      placeholder="tag1, tag2, tag3"
                      disabled={isSubmitting}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Controller
                  name="isNews"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isNews"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="isNews" className="text-sm font-normal">
                  Mark as news post
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showPreviewButton && (
            <Button
              type="button"
              variant="outline"
              onClick={onPreview}
              disabled={isSubmitting}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </Button>
        </div>
      </div>

      {externalError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {externalError}
        </div>
      )}
    </form>
  );
};

export default BlogPostForm;
