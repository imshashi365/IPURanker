import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    let query = Blog.find({ status: 'published' }).sort({ publishedAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const news = await query.exec();

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ message: 'Error fetching news' }, { status: 500 });
  }
}
