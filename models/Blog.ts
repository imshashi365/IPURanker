import mongoose, { Schema, Document, models } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags?: string[];
  isNews?: boolean;
  scheduledFor?: Date;
  excerpt?: string;
  category?: string;
  status?: string;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  tags: [{ type: String }],
  isNews: { type: Boolean, default: false },
  scheduledFor: { type: Date },
  excerpt: { type: String },
  category: { type: String },
  status: { type: String },
});

export default models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
