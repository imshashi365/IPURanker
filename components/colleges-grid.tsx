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

export default function CollegesGrid() {
  const { colleges, loading, error } = useColleges();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading colleges...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!colleges.length) {
    return <div className="p-8 text-center text-gray-500">No colleges found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {colleges.map((college) => (
        <Card
          key={college._id}
          className="overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-[1.025] hover:shadow-2xl bg-white border border-gray-100"
        >
          <div className="relative h-48 w-full bg-gray-50">
            <Image
              src={college.logoUrl || "/placeholder.svg"}
              alt={college.name}
              fill
              className="object-cover rounded-t-2xl"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-blue-600 text-xs px-2 py-1 rounded shadow">{college.shortName}</Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-lg font-semibold mb-1">{college.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <svg width="16" height="16" fill="none" className="inline-block mr-1 text-gray-400"><path d="M8 14s6-4.686 6-8A6 6 0 1 0 2 6c0 3.314 6 8 6 8Z" stroke="currentColor" strokeWidth="1.2"/></svg>
              {college.location}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {(college.courses || []).map((course: string) => (
                <Badge key={course} variant="outline" className="text-xs px-2 py-0.5 border-blue-200">
                  {course}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between text-xs bg-gray-50 rounded px-2 py-1 mb-2">
              <div className="flex flex-col items-center flex-1">
                <span className="text-gray-500">Placement</span>
                <span className="font-semibold text-gray-800">{college.placementStats?.placementRate || "-"}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-gray-500">Top CTC</span>
                <span className="font-semibold text-gray-800">{college.placementStats?.topCTC || "-"}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-gray-500">Avg CTC</span>
                <span className="font-semibold text-gray-800">{college.placementStats?.avgCTC || "-"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/colleges/${college._id}`} className="w-full">
              <Button className="w-full" size="sm">
                View College Profile
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
