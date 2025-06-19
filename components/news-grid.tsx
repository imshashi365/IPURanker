import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar } from "lucide-react"

// Types for our news items
interface NewsItem {
  _id: string;
  title: string;
  category: string;
  publishedAt: string;
  excerpt: string;
  slug: string;
  status: string;
}

// Fetch news items from the API
async function fetchNews(category: string = 'all') {
  try {
    // Use the full URL for server-side requests
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL(`/api/news`, baseUrl);
    url.searchParams.append('status', 'published');
    if (category !== 'all') {
      url.searchParams.append('category', category);
    }
    url.searchParams.append('limit', '100');
    
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to load news');
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function NewsGrid({ category = "all" }: { category?: string }) {
  // Fetch news items from the API
  const newsItems = await fetchNews(category);
  
  // Debug: Log the first news item to check its structure
  if (newsItems.length > 0) {
    console.log('First news item:', JSON.stringify(newsItems[0], null, 2));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.length > 0 ? (
        newsItems.map((item: NewsItem) => (
          <Card key={item._id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-lg hover:underline">
                    <Link href={`/news/${item.slug || item._id}`}>{item.title}</Link>
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="whitespace-nowrap">
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {item.excerpt}
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/news/${item.slug || item._id}`}
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No news items found for this category.</p>
        </div>
      )}
    </div>
  )
}
