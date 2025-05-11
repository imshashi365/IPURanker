"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar } from "lucide-react"

import { useEffect, useState } from "react";

function useLatestNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (!data.news) throw new Error("No news found");
        setNews(data.news);
      } catch (e: any) {
        setError(e.message || "Unknown error");
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return { news, loading, error };
}

export default function LatestNews() {
  const { news, loading, error } = useLatestNews();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading news...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!news.length) {
    return <div className="p-8 text-center text-gray-500">No news found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {news.map((item) => (
        <Card key={item._id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{item.title}</CardTitle>
              {item.category && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                  {item.category}
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-1" />
              {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{item.excerpt}</p>
          </CardContent>
          <CardFooter>
            <Link href={"/news/" + (item._id || "") } className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Read more →
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

