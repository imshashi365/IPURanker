import mongoose, { Schema, Document, models } from 'mongoose';

export interface ICollege extends Document {
  name: string;
  shortName?: string;
  location?: string;
  logoUrl: string;
  description: string;
  website: string;
  contactInfo?: string;
  placementStats?: any;
  courses?: string[];
}

const CollegeSchema = new Schema<ICollege>({
  name: { type: String, required: true },
  shortName: { type: String },
  location: { type: String },
  courses: [{ type: String }],
  logoUrl: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  contactInfo: { type: String },
  placementStats: { type: Schema.Types.Mixed },
});

export default models.College || mongoose.model<ICollege>('College', CollegeSchema);
