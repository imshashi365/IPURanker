import mongoose, { Schema, Document, models } from 'mongoose';

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface IBlog extends Document {
  // Core content
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  
  // Metadata
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  category?: string;
  status: BlogStatus;
  isNews: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  
  // Social sharing
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  
  // System fields
  createdAt: Date;
  views: number;
  likes: number;
}

const BlogSchema = new Schema<IBlog>({
  // Core content
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot be longer than 120 characters']
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please use a valid slug with letters, numbers, and hyphens']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'] 
  },
  excerpt: { 
    type: String,
    maxlength: [300, 'Excerpt cannot be longer than 300 characters']
  },
  featuredImage: {
    type: String,
    default: ''
  },
  
  // Metadata
  author: { 
    type: String, 
    required: [true, 'Author is required'],
    trim: true
  },
  publishedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  tags: [{ 
    type: String, 
    trim: true,
    lowercase: true
  }],
  category: { 
    type: String, 
    trim: true,
    index: true
  },
  status: { 
    type: String, 
    enum: {
      values: ['draft', 'published', 'archived'],
      message: 'Status must be draft, published, or archived'
    },
    default: 'draft',
    index: true
  },
  isNews: { 
    type: Boolean, 
    default: false,
    index: true
  },
  
  // SEO
  metaTitle: { 
    type: String,
    trim: true,
    maxlength: [70, 'Meta title cannot be longer than 70 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot be longer than 160 characters']
  },
  canonicalUrl: {
    type: String,
    trim: true
  },
  
  // Social sharing
  ogTitle: {
    type: String,
    trim: true
  },
  ogDescription: {
    type: String,
    trim: true
  },
  ogImage: {
    type: String,
    trim: true
  },
  twitterTitle: {
    type: String,
    trim: true
  },
  twitterDescription: {
    type: String,
    trim: true
  },
  twitterImage: {
    type: String,
    trim: true
  },
  
  // System fields
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ status: 1, publishedAt: -1 });

// Pre-save hook to ensure slug is URL-friendly
BlogSchema.pre<IBlog>('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }
  
  // Set updatedAt timestamp
  this.updatedAt = new Date();
  
  // Set excerpt if empty
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 160) + (this.content.length > 160 ? '...' : '');
  }
  
  // Set default meta values if empty
  if (!this.metaTitle) this.metaTitle = this.title;
  if (!this.metaDescription) this.metaDescription = this.excerpt?.substring(0, 160);
  if (!this.ogTitle) this.ogTitle = this.title;
  if (!this.ogDescription) this.ogDescription = this.excerpt?.substring(0, 160);
  if (!this.ogImage) this.ogImage = this.featuredImage;
  if (!this.twitterTitle) this.twitterTitle = this.title;
  if (!this.twitterDescription) this.twitterDescription = this.excerpt?.substring(0, 160);
  if (!this.twitterImage) this.twitterImage = this.featuredImage;
  
  next();
});

export default models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
