import { NextResponse } from 'next/server';
import Placement from '@/models/Placement';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  await dbConnect();
  try {
    const placements = await Placement.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ placements });
  } catch (error) {
    let message = 'Internal error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
