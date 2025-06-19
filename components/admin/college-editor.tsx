"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Upload } from "lucide-react"

import { useEffect } from "react";

function useColleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColleges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/colleges");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch colleges");
      setColleges(data.colleges);
    } catch (e: any) {
      setError(e.message || "Unknown error");
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchColleges(); }, []);

  return { colleges, loading, error, refresh: fetchColleges };
}

export default function CollegeEditor() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { colleges, loading, error, refresh } = useColleges();

  // Form state
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState("");
  const [placementRate, setPlacementRate] = useState("");
  const [topCTC, setTopCTC] = useState("");
  const [avgCTC, setAvgCTC] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleAddCollege(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const placementStats = { placementRate, topCTC, avgCTC };
      const res = await fetch("/api/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortName,
          location,
          description,
          courses: courses.split(",").map((c) => c.trim()).filter(Boolean),
          logoUrl,
          placementStats,
          website,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to add college");
      setName(""); setShortName(""); setLocation(""); setDescription(""); setCourses(""); setPlacementRate(""); setTopCTC(""); setAvgCTC(""); setLogoUrl(""); setWebsite("");
      setIsAddDialogOpen(false);
      refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCollege(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCollege) return;
    
    setSaving(true);
    setErrorMsg(null);
    try {
      const placementStats = {
        placementRate,
        topCTC,
        avgCTC,
      };
      
      const res = await fetch(`/api/colleges/${editingCollege._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortName,
          location,
          description,
          courses: courses.split(",").map((c) => c.trim()).filter(Boolean),
          logoUrl,
          placementStats,
          website,
        }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update college");
      
      // Reset form and close dialog
      setEditingCollege(null);
      setIsEditDialogOpen(false);
      refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update college");
    } finally {
      setSaving(false);
    }
  }

  function handleEditClick(college: any) {
    setEditingCollege(college);
    setName(college.name);
    setShortName(college.shortName || "");
    setLocation(college.location || "");
    setDescription(college.description || "");
    setCourses(Array.isArray(college.courses) ? college.courses.join(", ") : "");
    setWebsite(college.website || "");
    setLogoUrl(college.logoUrl || "");
    setPlacementRate(college.placementStats?.placementRate || "");
    setTopCTC(college.placementStats?.topCTC || "");
    setAvgCTC(college.placementStats?.avgCTC || "");
    setIsEditDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">College Profiles Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add College Profile</DialogTitle>
              <DialogDescription>
                Create a new college profile with details and placement information.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4" onSubmit={handleAddCollege}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">College Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full college name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortName">Short Name/Acronym</Label>
                  <Input id="shortName" value={shortName} onChange={e => setShortName(e.target.value)} placeholder="E.g., USICT" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="College location" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://college.edu" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the college" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courses">Courses Offered</Label>
                  <Input id="courses" value={courses} onChange={e => setCourses(e.target.value)} placeholder="Comma separated list of courses" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placementRate">Placement Rate</Label>
                  <Input id="placementRate" value={placementRate} onChange={e => setPlacementRate(e.target.value)} placeholder="E.g., 95%" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topCTC">Top CTC</Label>
                  <Input id="topCTC" value={topCTC} onChange={e => setTopCTC(e.target.value)} placeholder="E.g., ₹45 LPA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avgCTC">Average CTC</Label>
                  <Input id="avgCTC" value={avgCTC} onChange={e => setAvgCTC(e.target.value)} placeholder="E.g., ₹12 LPA" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">College Logo URL</Label>
                <Input id="logoUrl" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="Paste image URL here" />
              </div>
              {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save College"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading colleges...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead>Short Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Placement Rate</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.map((college) => (
                <TableRow key={college._id}>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-600">{college.shortName}</Badge>
                  </TableCell>
                  <TableCell>{college.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(college.courses || []).map((course: string) => (
                        <Badge key={course} variant="outline">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{college.placementStats?.placementRate || "-"}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(college)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
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

      {/* Edit College Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit College Profile</DialogTitle>
            <DialogDescription>
              Update the college profile details below.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleUpdateCollege}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">College Name</Label>
                <Input id="edit-name" value={name} onChange={e => setName(e.target.value)} placeholder="Full college name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-shortName">Short Name/Acronym</Label>
                <Input id="edit-shortName" value={shortName} onChange={e => setShortName(e.target.value)} placeholder="E.g., USICT" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="College location" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input id="edit-website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://college.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the college" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-courses">Courses Offered</Label>
                <Input id="edit-courses" value={courses} onChange={e => setCourses(e.target.value)} placeholder="Comma separated list of courses" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-placementRate">Placement Rate</Label>
                <Input id="edit-placementRate" value={placementRate} onChange={e => setPlacementRate(e.target.value)} placeholder="E.g., 95%" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-topCTC">Top CTC</Label>
                <Input id="edit-topCTC" value={topCTC} onChange={e => setTopCTC(e.target.value)} placeholder="E.g., ₹45 LPA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-avgCTC">Average CTC</Label>
                <Input id="edit-avgCTC" value={avgCTC} onChange={e => setAvgCTC(e.target.value)} placeholder="E.g., ₹12 LPA" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logoUrl">College Logo URL</Label>
              <Input id="edit-logoUrl" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="Paste image URL here" />
            </div>
            {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update College"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
