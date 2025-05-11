"use client";
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react";

function useColleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/colleges");
        const data = await res.json();
        if (!data.colleges) throw new Error("No colleges found");
        setColleges(data.colleges);
      } catch (e: any) {
        setError(e.message || "Unknown error");
        setColleges([]);
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
  }, []);

  return { colleges, loading, error };
}

export default function TopColleges() {
  const { colleges, loading, error } = useColleges();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading top colleges...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!colleges.length) {
    return <div className="p-8 text-center text-gray-500">No colleges found.</div>;
  }

  // Sort colleges by placementRate (as number), fallback to topCTC or _id, and pick top 4
  const topColleges = [...colleges]
    .sort((a, b) => {
      // Extract placementRate as number (remove %)
      const aRate = Number((a.placementStats?.placementRate || "0").replace(/[^\d.]/g, ""));
      const bRate = Number((b.placementStats?.placementRate || "0").replace(/[^\d.]/g, ""));
      return bRate - aRate;
    })
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {topColleges.map((college) => (
        <Card key={college._id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image src={college.logoUrl || "/placeholder.svg"} alt={college.name} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Badge className="bg-blue-600">{college.shortName}</Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2">{college.name}</CardTitle>
            <CardDescription>{college.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {(college.courses || []).map((course: string) => (
                  <Badge key={course} variant="outline">
                    {course}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Placement</p>
                  <p className="font-medium">{college.placementStats?.placementRate || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Top CTC</p>
                  <p className="font-medium">{college.placementStats?.topCTC || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg CTC</p>
                  <p className="font-medium">{college.placementStats?.avgCTC || "-"}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={"/colleges/" + (college._id || "")} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

