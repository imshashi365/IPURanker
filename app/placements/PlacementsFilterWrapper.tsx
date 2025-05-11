"use client";

import { useState, useMemo } from "react";
import PlacementsFilter, { PlacementsFilterValues } from "@/components/placements-filter";
import PlacementsTable from "@/components/placements-table";

interface Placement {
  _id: string;
  company: string;
  role?: string;
  college: string;
  stream?: string;
  branch?: string;
  year: number | string;
  ctc: number | string;
  count: number;
}

interface Props {
  placements: Placement[];
}

const defaultFilter: PlacementsFilterValues = {
  search: "",
  year: "all",
  branch: "all",
  college: "all",
  ctc: "all",
};

export default function PlacementsFilterWrapper({ placements }: Props) {
  const [filter, setFilter] = useState<PlacementsFilterValues>(defaultFilter);

  const filtered = useMemo(() => {
    return placements.filter((p) => {
      // Search
      const search = filter.search.toLowerCase();
      const matchesSearch =
        !search ||
        p.company?.toLowerCase().includes(search) ||
        p.college?.toLowerCase().includes(search) ||
        p.role?.toLowerCase().includes(search);
      // Year
      const matchesYear = filter.year === "all" || String(p.year) === filter.year;
      // Branch
      const matchesBranch = filter.branch === "all" || p.branch === filter.branch;
      // College
      const matchesCollege = filter.college === "all" || p.college === filter.college;
      // CTC
      let matchesCtc = true;
      if (filter.ctc && filter.ctc !== "all") {
        const ctcNum = typeof p.ctc === "string" ? parseFloat(p.ctc) : p.ctc;
        if (filter.ctc === "0-5") matchesCtc = ctcNum >= 0 && ctcNum < 5;
        else if (filter.ctc === "5-10") matchesCtc = ctcNum >= 5 && ctcNum < 10;
        else if (filter.ctc === "10-15") matchesCtc = ctcNum >= 10 && ctcNum < 15;
        else if (filter.ctc === "15-20") matchesCtc = ctcNum >= 15 && ctcNum < 20;
        else if (filter.ctc === "20+") matchesCtc = ctcNum >= 20;
      }
      return matchesSearch && matchesYear && matchesBranch && matchesCollege && matchesCtc;
    });
  }, [placements, filter]);

  return (
    <div>
      <PlacementsFilter values={filter} onChange={setFilter} />
      <PlacementsTable placements={filtered} />
    </div>
  );
}
