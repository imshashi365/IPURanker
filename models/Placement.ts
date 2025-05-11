import mongoose, { Schema, Document, models } from 'mongoose';

export interface IPlacement extends Document {
  company: string;
  branch: string;
  year: number;
  ctc: number;
  college: string;
  count: number; // number of students placed
  createdAt?: Date;
}

const PlacementSchema = new Schema<IPlacement>({
  company: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  ctc: { type: Number, required: true },
  college: { type: String, required: true },
  count: { type: Number, required: true }, // number of students placed
  createdAt: { type: Date, default: Date.now },
});

export default models.Placement || mongoose.model<IPlacement>('Placement', PlacementSchema);
