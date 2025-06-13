"use client";
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Award, CircleDollarSign, ArrowRight } from "lucide-react"

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {topColleges.map((college) => (
        <Card key={college._id} className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <div className="relative h-48 w-full overflow-hidden">
            <Image 
              src={college.logoUrl || "/placeholder.svg"} 
              alt={college.name} 
              fill 
              className="object-cover transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="bg-primary text-primary-foreground shadow-md">{college.shortName}</Badge>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="line-clamp-2 text-xl font-bold">{college.name}</CardTitle>
              <CardDescription className="flex items-center pt-1 text-sm">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{college.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(college.courses || []).slice(0, 3).map((course: string) => (
                    <Badge key={course} variant="secondary">
                      {course}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-3 text-sm pt-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-muted-foreground">
                      <TrendingUp className="mr-2 h-4 w-4 text-primary" /> Placement
                    </span>
                    <span className="font-semibold text-foreground">{college.placementStats?.placementRate || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-muted-foreground">
                      <Award className="mr-2 h-4 w-4 text-primary" /> Top CTC
                    </span>
                    <span className="font-semibold text-foreground">{college.placementStats?.topCTC || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-muted-foreground">
                      <CircleDollarSign className="mr-2 h-4 w-4 text-primary" /> Avg CTC
                    </span>
                    <span className="font-semibold text-foreground">{college.placementStats?.avgCTC || "-"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-0 pt-6 mt-auto">
              <Link href={`/colleges/${college._id || ""}`} className="w-full">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}
