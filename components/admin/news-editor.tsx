"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import NewsModal from "./NewsModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MoreHorizontal, Plus } from "lucide-react"


// Fetch news from the API
function useNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch news");
      setNews(data.news);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  return { news, loading, error, refresh: fetchNews };
}

export default function NewsEditor() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { news, loading, error, refresh } = useNews();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News & Updates Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add News
            </Button>
          </DialogTrigger>
          <NewsModal open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onCreated={refresh} />
        </Dialog>
      </div>

      <div className="rounded-md border">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading news...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                      {item.category || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        {item.status === "draft" ? (
                          <DropdownMenuItem>Publish</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Unpublish</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

