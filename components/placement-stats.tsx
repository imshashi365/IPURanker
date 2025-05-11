"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "@/components/ui/chart"

// Sample data - would be fetched from API in a real application
const placementData = [
  { year: "2019", placements: 3200 },
  { year: "2020", placements: 3500 },
  { year: "2021", placements: 3800 },
  { year: "2022", placements: 4200 },
  { year: "2023", placements: 4600 },
]

const topCompanies = [
  { name: "Amazon", students: 120 },
  { name: "Microsoft", students: 95 },
  { name: "Google", students: 85 },
  { name: "TCS", students: 210 },
  { name: "Infosys", students: 180 },
]

const averageCTC = [
  { stream: "CSE", ctc: 12 },
  { stream: "IT", ctc: 10 },
  { stream: "ECE", ctc: 8 },
  { stream: "ME", ctc: 7 },
  { stream: "Civil", ctc: 6 },
]

export default function PlacementStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Yearly Placements</CardTitle>
          <CardDescription>Total students placed over the years</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={placementData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="placements" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Recruiting Companies</CardTitle>
          <CardDescription>Companies with most hires in 2023</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCompanies} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average CTC by Stream</CardTitle>
          <CardDescription>In lakhs per annum (2023)</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageCTC}>
              <XAxis dataKey="stream" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ctc" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
