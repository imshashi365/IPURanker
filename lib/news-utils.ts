import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { IBlog } from '@/models/Blog';

interface GetNewsParams {
  limit?: number;
  category?: string;
}

export async function getNews({ limit, category }: GetNewsParams = {}): Promise<IBlog[]> {
  try {
    await dbConnect();

    const filter: { status: string; category?: string } = { status: 'published' };
    if (category && category !== 'all') {
      filter.category = category;
    }

    let query = Blog.find(filter)
      .sort({ publishedAt: -1 })
      .lean();

    if (limit) {
      query = query.limit(limit);
    }

    const news = await query.exec();
    return news as unknown as IBlog[];
  } catch (error) {
    console.error('Error fetching news from DB:', error);
    return [];
  }
}
