"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { uploadFile, validateFileSize, isImageFile } from "@/lib/upload";
import { generateSlug } from "@/lib/text-utils";

// Define the NewsItem type to match the Blog model
type NewsItem = {
  _id?: string;
  title: string;
  slug?: string;
  category?: string;
  publishedAt?: string | Date;
  excerpt?: string;
  content?: string;
  status?: string;
  tags?: string[] | string;
  author?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  isNews?: boolean;
};

type FormData = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  excerpt: string;
  content: string;
  status: string;
  tags: string;
  author: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  isNews: boolean;
};

export default function NewsModal({ 
  open, 
  onClose, 
  onCreated, 
  initialData 
}: { 
  open: boolean; 
  onClose: () => void; 
  onCreated?: () => void; 
  initialData?: NewsItem;
}): React.JSX.Element {
  // State for UI elements
  const [featuredImagePreview, setFeaturedImagePreview] = useState(initialData?.featuredImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialData?._id;

  // Initialize form data with default values
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    category: "",
    publishedAt: new Date().toISOString().split('T')[0],
    excerpt: "",
    content: "",
    status: "draft",
    tags: "",
    author: "",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    isNews: true
  });

  // Format date for datetime-local input
  const formatDateForInput = (date: string | Date) => {
    try {
      const d = new Date(date);
      // Handle invalid dates
      if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 16);
      // Format as YYYY-MM-DDTHH:MM (local time)
      const pad = (n: number) => n < 10 ? '0' + n : n;
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return new Date().toISOString().slice(0, 16);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      // Small delay to allow modal close animation
      const timer = setTimeout(() => {
        setError(null);
        setFeaturedImagePreview('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Update form data when initialData changes or when the modal is opened
  useEffect(() => {
    if (open) {
      if (initialData && Object.keys(initialData).length > 0) {
        // Edit mode - populate with existing data
        const formattedData = {
          title: initialData.title || '',
          slug: initialData.slug || '',
          category: initialData.category || '',
          publishedAt: formatDateForInput(initialData.publishedAt || new Date()),
          excerpt: initialData.excerpt || '',
          content: initialData.content || '',
          status: initialData.status || 'draft',
          tags: Array.isArray(initialData.tags) 
            ? initialData.tags.join(', ')
            : typeof initialData.tags === 'string' 
              ? initialData.tags
              : '',
          author: initialData.author || '',
          featuredImage: initialData.featuredImage || '',
          metaTitle: initialData.metaTitle || initialData.title || '',
          metaDescription: initialData.metaDescription || initialData.excerpt || '',
          isNews: true
        };
        
        setFormData(formattedData);
        setFeaturedImagePreview(initialData.featuredImage || '');
      } else {
        // New post - set defaults
        const defaultTitle = '';
        const defaultSlug = defaultTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-');
          
        const defaultFormData = {
          title: defaultTitle,
          slug: defaultSlug,
          category: '',
          publishedAt: new Date().toISOString().slice(0, 16),
          excerpt: '',
          content: '',
          status: 'draft',
          tags: '',
          author: '',
          featuredImage: '',
          metaTitle: defaultTitle,
          metaDescription: '',
          isNews: true
        };
        
        setFormData(defaultFormData);
        setFeaturedImagePreview('');
      }
    }
  }, [initialData, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug when title changes and it's a new post
    if (name === 'title' && !initialData?._id) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: slug || prev.slug, // Keep existing slug if title is empty
        metaTitle: prev.metaTitle || value, // Auto-fill meta title if empty
        metaDescription: prev.metaDescription || prev.excerpt || ''
      }));
    } else if (name === 'excerpt' && !formData.metaDescription) {
      // Auto-fill meta description from excerpt if empty
      setFormData(prev => ({
        ...prev,
        [name]: value,
        metaDescription: value.substring(0, 160) // Limit to 160 chars
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      isNews: true // Ensure isNews is preserved in all updates
    }));
  };
  
  const handleFeaturedImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!isImageFile(file)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    if (!validateFileSize(file, 5)) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      const imageUrl = await uploadFile(file);
      setFormData(prev => ({
        ...prev,
        featuredImage: imageUrl,
        isNews: true // Ensure isNews is preserved
      }));
      setFeaturedImagePreview(imageUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeFeaturedImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: "",
      isNews: true // Ensure isNews is preserved
    }));
    setFeaturedImagePreview("");
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setLoading(false);
      return;
    }

    // Ensure we have a valid slug
    let slug = formData.slug;
    if (!slug) {
      slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      // Update form data with generated slug
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode && initialData?._id ? `/api/blog/${initialData._id}` : '/api/blog';

      // Generate slug from title if not provided
      const slug = formData.slug || generateSlug(formData.title);
      
      const payload = {
        ...formData,
        slug,
        isNews: true, // Ensure this is always true for blog posts
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save blog post');
      }
      
      // Reset form
      if (!isEditMode) {
        setFormData({
          title: "",
          slug: "",
          category: "",
          publishedAt: new Date().toISOString().split('T')[0],
          excerpt: "",
          content: "",
          status: "draft",
          tags: "",
          author: "",
          featuredImage: "",
          metaTitle: "",
          metaDescription: "",
          isNews: true
        });
        setFeaturedImagePreview("");
      } else {
        // Update the preview if in edit mode
        setFeaturedImagePreview(formData.featuredImage);
      }
      
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} blog post`);
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Blog Post' : 'New Blog Post'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the blog post details below.' 
              : 'Fill in the details below to create a new blog post.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="post-url-slug"
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used in the URL: /blog/{formData.slug || 'your-post-slug'}
                </p>
              </div>
              
              {/* Featured Image */}
              <div>
                <Label>Featured Image</Label>
                {featuredImagePreview ? (
                  <div className="mt-2 relative group">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={featuredImagePreview} 
                        alt="Featured" 
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeFeaturedImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click the image to change
                    </p>
                  </div>
                ) : (
                  <div 
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-1 text-center">
                      <div className="flex justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload an image</span>
                          <input
                            ref={fileInputRef}
                            id="featured-image"
                            name="featured-image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFeaturedImageChange}
                            disabled={isUploading}
                          />
                        </label>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  disabled={isUploading}
                />
              </div>
              
              {/* Content */}
              <div>
                <Label>Content *</Label>
                <div className="mt-1">
                  <RichTextEditor
                    content={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>
              
              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A brief summary of your post"
                  rows={3}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be shown in the post preview. Recommended length: 150-160 characters.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Publish Status */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium">Publish</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full mt-1 border rounded-md p-2 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="publishedAt">Publish Date</Label>
                    <Input
                      id="publishedAt"
                      name="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading || isUploading}
                    >
                      {loading 
                        ? (isEditMode ? 'Updating...' : 'Publishing...')
                        : (isEditMode ? 'Update Post' : 'Publish Post')}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Categories */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium">Categories</h3>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="admission">Admission</option>
                    <option value="counseling">Counseling</option>
                    <option value="cutoffs">Cut-offs</option>
                    <option value="events">Events</option>
                    <option value="courses">Courses</option>
                    <option value="placements">Placements</option>
                    <option value="results">Results</option>
                    <option value="notifications">Notifications</option>
                  </select>
                </div>
              </div>
              
              {/* Tags */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium">Tags</h3>
                <div>
                  <Label htmlFor="tags">Add Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>
              
              {/* Author */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium">Author</h3>
                <div>
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              {/* SEO */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="SEO title (max 60 chars)"
                      maxLength={60}
                      className="mt-1 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="SEO description (max 160 chars)"
                      rows={3}
                      maxLength={160}
                      className="mt-1 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {/* Form Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading || isUploading}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline"
                disabled={loading || isUploading}
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'draft', isNews: true }));
                  handleSubmit(new Event('submit') as any);
                }}
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                type="submit" 
                disabled={loading || isUploading}
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'published', isNews: true }));
                }}
              >
                {loading 
                  ? (isEditMode ? 'Updating...' : 'Publishing...')
                  : (isEditMode ? 'Update' : 'Publish')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
