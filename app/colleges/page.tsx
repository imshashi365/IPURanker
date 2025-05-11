import { Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import CollegesGrid from "@/components/colleges-grid"

export default function CollegesPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Colleges Directory</h1>
        <p className="text-gray-600">
          Browse through all colleges affiliated with GGSIPU. View detailed profiles, courses offered, and placement
          records.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search colleges by name, location or courses..." className="pl-8" />
        </div>
        <Button className="sm:w-auto w-full">Search</Button>
      </div>

      <Suspense fallback={<CollegesGridSkeleton />}>
        <CollegesGrid />
      </Suspense>
    </div>
  )
}

function CollegesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
