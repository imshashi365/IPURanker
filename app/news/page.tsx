import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import NewsGrid from "@/components/news-grid"

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">News & Admission Updates</h1>
        <p className="text-gray-600">
          Stay updated with the latest news, admission notices, counseling schedules, and more from GGSIPU.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All Updates</TabsTrigger>
          <TabsTrigger value="admission">Admissions</TabsTrigger>
          <TabsTrigger value="counseling">Counseling</TabsTrigger>
          <TabsTrigger value="cutoffs">Cut-offs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid category="all" />
          </Suspense>
        </TabsContent>

        <TabsContent value="admission">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid category="admission" />
          </Suspense>
        </TabsContent>

        <TabsContent value="counseling">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid category="counseling" />
          </Suspense>
        </TabsContent>

        <TabsContent value="cutoffs">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid category="cutoffs" />
          </Suspense>
        </TabsContent>

        <TabsContent value="events">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid category="events" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
