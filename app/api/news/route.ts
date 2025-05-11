import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

// POST /api/news - Create a new news post
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { title, content, author, tags, publishedAt, scheduledFor, excerpt, category, status } = await req.json();
    const news = await Blog.create({
      title,
      content,
      author,
      tags,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      isNews: true,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      excerpt,
      category,
      status,
    });
    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// GET /api/news - List all news posts
export async function GET() {
  await dbConnect();
  try {
    const news = await Blog.find({ isNews: true }).sort({ publishedAt: -1 });
    return NextResponse.json({ success: true, news });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
