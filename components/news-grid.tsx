import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { IBlog } from "@/models/Blog"

interface NewsGridProps {
  news: IBlog[];
}

export default function NewsGrid({ news }: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.length > 0 ? (
        news.map((item) => (
          <Card key={item._id as string}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-lg hover:underline">
                    <Link href={`/blog/${item.slug || item._id}`}>{item.title}</Link>
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
                href={`/blog/${item.slug || item._id}`}
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
