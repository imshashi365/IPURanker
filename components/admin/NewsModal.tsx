"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewsModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          publishedAt: date ? new Date(date) : new Date(),
          excerpt,
          content,
          status,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          author,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create news post");
      setTitle("");
      setCategory("");
      setDate("");
      setExcerpt("");
      setContent("");
      setStatus("");
      setTags("");
      setAuthor("");
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New News Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Category</Label>
            <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full border rounded px-2 py-1">
              <option value="">Select category</option>
              <option value="admission">Admission</option>
              <option value="counseling">Counseling</option>
              <option value="cutoffs">Cut-offs</option>
              <option value="events">Events</option>
              <option value="courses">Courses</option>
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} required />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} required rows={5} />
          </div>
          <div>
            <Label>Status</Label>
            <select value={status} onChange={e => setStatus(e.target.value)} required className="w-full border rounded px-2 py-1">
              <option value="">Select status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          <div>
            <Label>Author</Label>
            <Input value={author} onChange={e => setAuthor(e.target.value)} required />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? "Posting..." : "Post News"}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
