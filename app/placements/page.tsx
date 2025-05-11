import { Suspense } from "react"
import PlacementsTable from "@/components/placements-table"
import PlacementsFilterWrapper from "./PlacementsFilterWrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import dbConnect from "@/lib/mongodb";
import PlacementModel from "@/models/Placement";

export const dynamic = "force-dynamic"; // ensure SSR

async function getPlacements() {
  await dbConnect();
  const placements = await PlacementModel.find({}).lean();
  // Optionally, map _id to string for React keys
  return placements.map((p: any) => ({ ...p, _id: p._id.toString() }));
}

export default async function PlacementsPage() {
  const placements = await getPlacements();
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Placements Dashboard</h1>
        <p className="text-gray-600">
          Explore placement statistics across all GGSIPU colleges. Filter by company, stream, year, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-blue-600">4,600+</CardTitle>
            <CardDescription>Students placed in 2023</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-blue-600">250+</CardTitle>
            <CardDescription>Companies visited</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-blue-600">₹45 LPA</CardTitle>
            <CardDescription>Highest package offered</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-4xl font-bold text-blue-600">₹8.5 LPA</CardTitle>
            <CardDescription>Average package</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Placement Records</CardTitle>
          <CardDescription>Comprehensive placement data from all GGSIPU colleges</CardDescription>
        </CardHeader>
        <CardContent>
          {/* PlacementsFilter and PlacementsTable are now client-side for interactive filtering */}
          <PlacementsFilterWrapper placements={placements} />
        </CardContent>
      </Card>
    </div>
  )
}

function PlacementsTableSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
    </div>
  )
}
