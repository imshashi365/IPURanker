"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export interface PlacementsFilterValues {
  search: string;
  year: string;
  branch: string;
  college: string;
  ctc: string;
}

interface PlacementsFilterProps {
  values: PlacementsFilterValues;
  onChange: (values: PlacementsFilterValues) => void;
}

export default function PlacementsFilter({ values, onChange }: PlacementsFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const setField = (field: keyof PlacementsFilterValues, value: string) => {
    onChange({ ...values, [field]: value });
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by company, college or role..."
            className="pl-8"
            value={values.search}
            onChange={e => setField('search', e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto w-full flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <Select value={values.year} onValueChange={v => setField('year', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
            </SelectContent>
          </Select>

          <Select value={values.branch} onValueChange={v => setField('branch', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="CST">CST</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="ITE">ITE</SelectItem>
              <SelectItem value="SE">SE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="EEE">EEE</SelectItem>
              <SelectItem value="MAE">MAE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
              <SelectItem value="ICE">ICE</SelectItem>
              <SelectItem value="PE">PE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={values.college} onValueChange={v => setField('college', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              <SelectItem value="USICT">USICT</SelectItem>
              <SelectItem value="MAIT">MAIT</SelectItem>
              <SelectItem value="MSIT">MSIT</SelectItem>
              <SelectItem value="BVCOE">BVCOE</SelectItem>
              <SelectItem value="BPIT">BPIT</SelectItem>
              <SelectItem value="HMRITM">HMRITM</SelectItem>
              <SelectItem value="GTBIT">GTBIT</SelectItem>
              <SelectItem value="ADGITM">ADGITM</SelectItem>
            </SelectContent>
          </Select>

          <Select value={values.ctc} onValueChange={v => setField('ctc', v)}>
            <SelectTrigger>
              <SelectValue placeholder="CTC Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All CTCs</SelectItem>
              <SelectItem value="0-5">0-5 LPA</SelectItem>
              <SelectItem value="5-10">5-10 LPA</SelectItem>
              <SelectItem value="10-15">10-15 LPA</SelectItem>
              <SelectItem value="15-20">15-20 LPA</SelectItem>
              <SelectItem value="20+">20+ LPA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
