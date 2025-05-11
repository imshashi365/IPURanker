import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import College from '@/models/College';

// POST /api/colleges - Create a new college
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { name, logoUrl, description, website, contactInfo, placementStats, shortName, location, courses } = await req.json();
    const college = await College.create({
      name,
      logoUrl,
      description,
      website,
      contactInfo,
      placementStats,
      shortName,
      location,
      courses,
    });
    return NextResponse.json({ success: true, college });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// GET /api/colleges - List all colleges
export async function GET() {
  await dbConnect();
  try {
    const colleges = await College.find({});
    return NextResponse.json({ success: true, colleges });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
