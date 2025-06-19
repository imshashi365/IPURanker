"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Upload } from "lucide-react";
import Papa, { ParseResult } from "papaparse";

type Placement = {
  _id: string;
  company: string;
  branch: string;
  year: number;
  ctc: number;
  college: string;
  count: number;
  createdAt?: string;
};

export default function PlacementDataTable() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loadingPlacements, setLoadingPlacements] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchPlacements = async () => {
    setLoadingPlacements(true);
    setFetchError("");
    try {
      const res = await fetch("/api/placements");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch placements");
      setPlacements(data.placements || []);
    } catch (err: any) {
      setFetchError(err.message || "Failed to fetch placements");
    } finally {
      setLoadingPlacements(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    setUploadSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large (max 10MB)");
      return;
    }
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      // @ts-ignore
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim().toLowerCase(),
        complete: async (results: ParseResult<any>) => {
          try {
            const requiredFields = ["company", "branch", 'year', 'ctc', 'college', 'students'];
            
            const processedRecords = results.data.map((record, index) => {
              // Trim all string values in the record
              const trimmedRecord: { [key: string]: any } = {};
              for (const key in record) {
                trimmedRecord[key] = typeof record[key] === 'string' ? record[key].trim() : record[key];
              }

              // Basic validation and type conversion
              const year = parseInt(trimmedRecord.year, 10);
              const ctc = parseFloat(trimmedRecord.ctc);
              const studentCount = parseInt(trimmedRecord.students, 10);

              if (isNaN(year) || isNaN(ctc) || isNaN(studentCount)) {
                throw new Error(`Invalid number format in row ${index + 2}. Year: '${trimmedRecord.year}', CTC: '${trimmedRecord.ctc}', Students: '${trimmedRecord.students}'. All must be numbers.`);
              }

              for (const field of requiredFields) {
                if (!trimmedRecord[field] && trimmedRecord[field] !== 0) {
                  throw new Error(`Missing required field '${field}' in row ${index + 2}. Please check the CSV headers.`);
                }
              }

              return {
                company: trimmedRecord.company,
                branch: trimmedRecord.branch,
                college: trimmedRecord.college,
                role: trimmedRecord.role,
                year: year,
                ctc: ctc,
                count: studentCount,
              };
            }).filter(Boolean); // Filter out any null/undefined from potential errors

            if (processedRecords.length === 0) {
              throw new Error("CSV file is empty or contains no valid records.");
            }

            const res = await fetch("/api/placements/bulk-upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ records: processedRecords }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setUploadSuccess(`Uploaded ${data.inserted} records successfully!`);
            fetchPlacements();
          } catch (err: any) {
            setUploadError(err.message || "Upload failed");
          } finally {
            setUploading(false);
          }
        },
        error: (err: Papa.ParseError) => {
          setUploadError("CSV parse error: " + err.message);
          setUploading(false);
        },
      });
    };
    reader.onerror = () => {
      setUploadError("Failed to read the file.");
      setUploading(false);
    };
    reader.readAsText(file);
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Placement Data Management</h2>
        <div className="flex gap-2">
          {/* Add Record Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Placement Record</DialogTitle>
                <DialogDescription>Add a new placement record to the database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="Job role" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college">College</Label>
                    <Select>
                      <SelectTrigger id="college">
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usict">USICT</SelectItem>
                        <SelectItem value="nsit">NSIT</SelectItem>
                        <SelectItem value="msit">MSIT</SelectItem>
                        <SelectItem value="mait">MAIT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stream">Stream</Label>
                    <Select>
                      <SelectTrigger id="stream">
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cse">CSE</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="ece">ECE</SelectItem>
                        <SelectItem value="me">ME</SelectItem>
                        <SelectItem value="civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctc">CTC (LPA)</Label>
                    <Input id="ctc" type="number" placeholder="CTC in lakhs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="students">Students</Label>
                    <Input id="students" type="number" placeholder="Number of students" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Upload Dialog */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Placement Data</DialogTitle>
                <DialogDescription>Upload a CSV file with placement data. Columns: college, year, branch, company, ctc, count</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your file here, or click to browse</p>
                  <Input id="file-upload" type="file" accept=".csv" className="hidden" onChange={handleCsvFileChange} />
                  <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Supported format: CSV. Columns: college, year, branch, company, ctc, count. Max size: 10MB.</p>
                {uploadError && <div className="text-red-600 text-sm">{uploadError}</div>}
                {uploadSuccess && <div className="text-green-600 text-sm">{uploadSuccess}</div>}
                {uploading && <div className="text-blue-600 text-sm">Uploading...</div>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Placement Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>CTC</TableHead>
              <TableHead>Students</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingPlacements ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-600">{fetchError}</TableCell>
              </TableRow>
            ) : placements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No placement records found.</TableCell>
              </TableRow>
            ) : (
              placements.map((record: Placement) => (
                <TableRow key={record._id}>
                  <TableCell className="font-medium">{record.company}</TableCell>
                  <TableCell>{record.branch}</TableCell>
                  <TableCell>{record.college}</TableCell>
                  <TableCell>{record.year}</TableCell>
                  <TableCell>{record.ctc}</TableCell>
                  <TableCell>{record.count ?? "-"}</TableCell>
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
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
