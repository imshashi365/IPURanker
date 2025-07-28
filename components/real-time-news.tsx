"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ExternalLink, Newspaper, Zap, TrendingUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { generatePlaceholderImage } from "@/lib/image-utils"

interface NewsArticle {
  id: string
  title: string
  description: string
  excerpt: string
  url: string
  imageUrl: string
  publishedAt: string
  source: string
  author: string
  category: string
}

interface RealTimeNewsProps {
  category?: string
  limit?: number
}

export default function RealTimeNews({ category = "all", limit = 12 }: RealTimeNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      
      const response = await fetch(`/api/news/real-time?category=${category}&limit=${limit}`)
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.articles)
        setError(null)
      } else {
        setError("Failed to fetch news")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching news:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [category, limit])

  const getCategoryColor = (cat: string) => {
    const colors = {
      education: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      admission: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      scholarship: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      technology: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      career: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      exam: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
    return colors[cat as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const timeAgo = (dateString: string) => {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (loading) {
    return <NewsGridSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <Newspaper className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Failed to load news</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">{error}</p>
        <Button onClick={() => fetchNews()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Live Education News</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time updates from trusted sources</p>
          </div>
        </div>
        <Button
          onClick={() => fetchNews(true)}
          variant="outline"
          size="sm"
          disabled={refreshing}
          className="gap-2"
        >
          <TrendingUp className={cn("w-4 h-4", refreshing && "animate-spin")} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Card 
            key={article.id} 
            className={cn(
              "group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg",
              "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
              "hover:scale-[1.02] hover:-translate-y-1"
            )}
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = generatePlaceholderImage(400, 200, article.category);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Live Indicator */}
              {index < 3 && (
                <div className="absolute top-3 left-3 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>LIVE</span>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <Badge className={cn("text-xs font-medium", getCategoryColor(article.category))}>
                  {article.category.toUpperCase()}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo(article.publishedAt)}</span>
                  </div>
                  <span className="font-medium">{article.source}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {article.author && `By ${article.author}`}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(article.url, '_blank')}
                  className="group/btn hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <span className="text-xs">Read more</span>
                  <ExternalLink className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No news found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try refreshing or check back later for updates.</p>
        </div>
      )}
    </div>
  )
}

function NewsGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="w-48 h-6 mb-1" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
        <Skeleton className="w-24 h-8" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardHeader>
              <Skeleton className="w-full h-6 mb-2" />
              <Skeleton className="w-3/4 h-6 mb-2" />
              <div className="flex justify-between">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-2/3 h-4 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-16 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
