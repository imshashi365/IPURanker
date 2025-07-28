"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ExternalLink, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
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

export default function LatestNewsWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch('/api/news/real-time?category=all&limit=4')
        const data = await response.json()
        
        if (data.success) {
          setArticles(data.articles.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching latest news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestNews()
  }, [])

  const timeAgo = (dateString: string) => {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getCategoryColor = (cat: string) => {
    const colors = {
      education: "bg-blue-500",
      admission: "bg-green-500",
      scholarship: "bg-purple-500",
      technology: "bg-orange-500",
      career: "bg-pink-500",
      exam: "bg-yellow-500"
    }
    return colors[cat as keyof typeof colors] || "bg-gray-500"
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-32 h-6" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="flex space-x-3">
              <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <CardTitle className="text-lg font-bold">Latest News</CardTitle>
            <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>
          <Link href="/news">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <TrendingUp className="w-4 h-4 mr-1" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="group flex space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => window.open(article.url, '_blank')}
          >
            <div className="relative flex-shrink-0">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = generatePlaceholderImage(64, 64, article.category);
                }}
              />
              <div className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full", getCategoryColor(article.category))} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                {article.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                <span className="font-medium">{article.source}</span>
                <span>{timeAgo(article.publishedAt)}</span>
              </div>
            </div>
            
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
          </div>
        ))}
        
        {articles.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent news available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
