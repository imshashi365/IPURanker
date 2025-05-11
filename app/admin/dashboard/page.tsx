"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "lucide-react"
import AdminSidebar from "@/components/admin-sidebar"
import PlacementDataTable from "@/components/admin/placement-data-table"
import NewsEditor from "@/components/admin/news-editor"
import CollegeEditor from "@/components/admin/college-editor"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <aside className="sticky top-0 h-screen w-60 bg-white border-r shadow-sm z-10">
        <AdminSidebar />
      </aside> */}
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <Button variant="outline" className="self-end">Logout</Button>
        </div>

        {/* Dashboard Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="shadow border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
              <BarChart className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4,600+</div>
              <p className="text-xs text-gray-500 mt-1">+12% from last year</p>
            </CardContent>
          </Card>
          <Card className="shadow border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">News Articles</CardTitle>
              <LineChart className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <p className="text-xs text-gray-500 mt-1">+24 in the last month</p>
            </CardContent>
          </Card>
          <Card className="shadow border border-gray-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Affiliated Colleges</CardTitle>
              <PieChart className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">120</div>
              <p className="text-xs text-gray-500 mt-1">+3 new colleges this year</p>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <Tabs defaultValue="placements" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 rounded-lg">
              <TabsTrigger value="placements" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">Placement Data</TabsTrigger>
              <TabsTrigger value="news" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">News & Updates</TabsTrigger>
              <TabsTrigger value="colleges" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow">College Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value="placements">
              {/* <h2 className="text-xl font-semibold mb-4">Placement Data Management</h2> */}
              <PlacementDataTable />
            </TabsContent>

            <TabsContent value="news">
              {/* <h2 className="text-xl font-semibold mb-4">News & Updates Management</h2> */}
              <NewsEditor />
            </TabsContent>

            <TabsContent value="colleges">
              {/* <h2 className="text-xl font-semibold mb-4">College Profiles Management</h2> */}
              <CollegeEditor />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}

