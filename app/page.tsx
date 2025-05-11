import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Building, GraduationCap, TrendingUp } from "lucide-react"
import PlacementStats from "@/components/placement-stats"
import LatestNews from "@/components/latest-news"
import TopColleges from "@/components/top-colleges"
import ThemeToggle from "@/components/ui/theme-toggle"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Hero Section - Modern SaaS Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-100 py-24 md:py-32 flex flex-col items-center justify-center">
        {/* Blurred gradient shapes */}
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] bg-gradient-to-br from-purple-300 via-blue-200 to-teal-100 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute -bottom-24 right-0 w-[32rem] h-[32rem] bg-gradient-to-tr from-blue-200 via-purple-100 to-white rounded-full blur-2xl opacity-40 z-0" />

        {/* Announcement badge */}
        <div className="relative z-10 mb-6 flex justify-center">
          <span className="bg-gradient-to-r from-blue-500 to-purple-400 text-white text-xs font-semibold px-4 py-1 rounded-full shadow">New</span>
          <span className="ml-2 text-sm text-gray-500 font-medium">Smart placement filter now live!</span>
        </div>

        {/* Main headline */}
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
          <span className="flex items-center justify-center">Explore Placements.</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600">Navigate IPU Admissions with Ease.</span>
        </h1>
        {/* Subheadline */}
        <p className="relative text-center z-10 text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto ">
          Whether you're applying to GGSIPU or tracking college placements, our platform brings you all the essential info—accurate, simple, and student-focused.
        </p>
        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/placements">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-8 py-3 text-lg font-bold shadow-lg hover:scale-105 transition">
              Get Started
            </Button>
          </Link>
          <Link href="/colleges">
            <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-700 px-8 py-3 text-lg font-bold bg-white hover:bg-blue-50 transition">
              Preview Platform
            </Button>
          </Link>
        </div>
        {/* Floating card/mockup illustration */}
        <div className="relative z-10 w-full flex justify-center">
          <div className="bg-white/80 border border-blue-100 rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-3xl flex flex-col md:flex-row items-center gap-8 backdrop-blur-md">
            {/* Example card content - replace with your own illustration or stats */}
            <div className="flex-1 flex flex-col items-start">
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full mb-2 text-xs">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#6366f1" /><text x="12" y="17" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">IPU</text></svg>
                Placements
              </span>
              <div className="text-xl font-bold text-gray-800 mb-1">Top Companies</div>
              <div className="text-3xl font-extrabold text-blue-600 mb-2">Google, Microsoft, Amazon</div>
              <div className="text-gray-500 text-sm">+150 others hiring from GGSIPU</div>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full mb-2 text-xs">
                <GraduationCap className="w-4 h-4" />
                Colleges
              </span>
              <div className="text-xl font-bold text-gray-800 mb-1">Affiliated Colleges</div>
              <div className="text-3xl font-extrabold text-purple-600 mb-2">50+ Institutes</div>
              <div className="text-gray-500 text-sm">Explore all with reviews & stats</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 px-4 mt-20 rounded-3xl overflow-hidden bg-gradient-to-br">
        {/* Blurred gradient shapes for subtle SaaS effect */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-4xl font-bold text-center mb-14 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">What We Offer</h2>
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
            <CardHeader className="pb-3 flex flex-col items-center">
              <TrendingUp className="h-10 w-10 mb-2 text-white" />
              <CardTitle className="text-lg font-bold text-white">Placement Stats</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-white">
              Comprehensive placement statistics from all GGSIPU colleges, filterable by company, stream, and year.
            </CardContent>
            <CardFooter className="justify-center">
              <Link href="/placements" className="text-white hover:text-gray-100 inline-flex items-center font-semibold transition-colors">
                View Stats <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg">
            <CardHeader className="pb-3 flex flex-col items-center">
              <BookOpen className="h-10 w-10 mb-2 text-white" />
              <CardTitle className="text-lg font-bold text-white">Admission Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-white">
              Latest news about IPU admissions, counseling schedules, cut-offs, and important exam alerts.
            </CardContent>
            <CardFooter className="justify-center">
              <Link href="/news" className="text-white hover:text-gray-100 inline-flex items-center font-semibold transition-colors">
                Read Updates <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg">
            <CardHeader className="pb-3 flex flex-col items-center">
              <Building className="h-10 w-10 mb-2 text-white" />
              <CardTitle className="text-lg font-bold text-white">College Directory</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-white">
              Detailed profiles of all affiliated colleges with their placement records, facilities, and courses.
            </CardContent>
            <CardFooter className="justify-center">
              <Link href="/colleges" className="text-white hover:text-gray-100 inline-flex items-center font-semibold transition-colors">
                Explore Colleges <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 transition-all shadow-lg">
            <CardHeader className="pb-3 flex flex-col items-center">
              <GraduationCap className="h-10 w-10 mb-2 text-white" />
              <CardTitle className="text-lg font-bold text-white">Student Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-white">
              Helpful resources for students including study materials, previous year papers, and career guidance.
            </CardContent>
            <CardFooter className="justify-center">
              <Link href="/resources" className="text-white hover:text-gray-100 inline-flex items-center font-semibold transition-colors">
                Access Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Placement Stats Section */}
      <section className="relative py-16 px-4 mt-20 rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-100 shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">Placement Statistics</h2>
          <Link href="/placements">
            <Button variant="outline" className="mt-4 md:mt-0 border-blue-600 text-blue-700 bg-white/80 hover:bg-blue-50 dark:hover:bg-blue-900 shadow-sm">
              View All Placements
            </Button>
          </Link>
        </div>
        <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-xl p-6 mb-10 ring-1 ring-blue-200/40 dark:ring-blue-900/30 backdrop-blur-md relative z-10">
          <PlacementStats />
        </div>
      </section>

      {/* Latest News Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight">Latest News & Updates</h2>
            <Link href="/news">
              <Button variant="outline" className="mt-4 md:mt-0 border-blue-600 text-blue-700 bg-white/80 hover:bg-blue-50 dark:hover:bg-blue-900 shadow-sm">
                View All News
              </Button>
            </Link>
          </div>
          <div className="rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-lg p-6">
            <LatestNews />
          </div>
        </div>
      </section>

      {/* Top Colleges Section */}
      <section className="relative py-16 px-4 mt-20 mb-20 rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-100 shadow-none">
  {/* Blurred gradient shapes for subtle SaaS effect */}
  <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent">Top GGSIPU Colleges</h2>
          <Link href="/colleges">
            <Button variant="outline" className="mt-4 md:mt-0 border-blue-600 text-blue-700 bg-white/80 hover:bg-blue-50 dark:hover:bg-blue-900 shadow-sm">
              View All Colleges
            </Button>
          </Link>
        </div>
        <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow-xl p-6 ring-1 ring-blue-200/40 dark:ring-blue-900/30 backdrop-blur-md relative z-10">
          <TopColleges />
        </div>
      </section>
    </div>
  )
}
