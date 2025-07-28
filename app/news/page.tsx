import { Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import NewsCategoryGrid from "@/components/news-category-grid"
import RealTimeNews from "@/components/real-time-news"

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          News & Admission Updates
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Stay updated with the latest news, admission notices, counseling schedules, and more from GGSIPU.
        </p>
      </div>

      {/* Real-time News Section */}
      <section>
        <RealTimeNews limit={6} />
      </section>

      {/* Separator */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-background px-4">
          Archived News & Updates
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
      </div>

      {/* Archived News Tabs */}
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
            <NewsCategoryGrid category="all" />
          </Suspense>
        </TabsContent>

        <TabsContent value="admission">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsCategoryGrid category="admission" />
          </Suspense>
        </TabsContent>

        <TabsContent value="counseling">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsCategoryGrid category="counseling" />
          </Suspense>
        </TabsContent>

        <TabsContent value="cutoffs">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsCategoryGrid category="cutoffs" />
          </Suspense>
        </TabsContent>

        <TabsContent value="events">
          <Suspense fallback={<NewsGridSkeleton />}>
            <NewsCategoryGrid category="events" />
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
