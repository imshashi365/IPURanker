import CollegePageClient from './CollegePageClient';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Metadata, ResolvingMetadata } from 'next';

// Define the schema
const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortName: { type: String },
  location: { type: String },
  courses: [{ type: String }],
  logoUrl: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  contactInfo: { type: String },
  placementStats: { type: mongoose.Schema.Types.Mixed },
  bannerImage: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  establishedYear: { type: String },
  topRecruiters: [{ type: String }]
});

// Get or create the model
const College = mongoose.models?.College || mongoose.model('College', CollegeSchema);

async function getCollegeData(id: string) {
  try {
    await dbConnect();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    const objectId = new mongoose.Types.ObjectId(id);
    const college = await College.findById(objectId).lean();
    
    if (!college) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(college));
  } catch (error) {
    console.error('Error fetching college:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `College Details: ${id}`,
  };
}

export default async function CollegePage({ 
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const college = await getCollegeData(id);

  if (!college) {
    notFound();
  }

  return <CollegePageClient college={college} />;
}