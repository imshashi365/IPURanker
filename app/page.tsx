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
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Your Gateway to
              <span className="block text-primary">GGSIPU Placements & Admissions</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              Discover placement stats, explore top colleges, and stay updated with the latest admission news. All in one place.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/placements">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform transform hover:scale-105">
                  Explore Placements <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/colleges">
                <Button size="lg" variant="outline" className="transition-transform transform hover:scale-105">
                  Find Colleges
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">What We Offer</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to navigate your journey at GGSIPU.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature, index) => (
                <Card key={index} className="bg-card shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mx-auto">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardTitle className="text-xl font-semibold text-foreground mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                  <CardFooter className="justify-center pt-0">
                    <Link href={feature.href}>
                      <Button variant="link" className="text-primary hover:text-primary/80">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Placement Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Placement Statistics</h2>
              <Link href="/placements">
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All Placements
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <PlacementStats />
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Latest News & Updates</h2>
              <Link href="/news">
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All News
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <LatestNews />
            </div>
          </div>
        </section>

        {/* Top Colleges Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Top GGSIPU Colleges</h2>
              <Link href="/colleges">
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All Colleges
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <TopColleges />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          {/* <p>&copy; {new Date().getFullYear()} IPUInsight. All rights reserved.</p> */}
        </div>
      </footer>
    </div>
  )
}

const featureCards = [
  {
    icon: TrendingUp,
    title: "Placement Stats",
    description: "In-depth placement statistics, filterable by company, stream, and year.",
    href: "/placements"
  },
  {
    icon: BookOpen,
    title: "Admission Updates",
    description: "Latest news on admissions, counseling, cut-offs, and exam alerts.",
    href: "/news"
  },
  {
    icon: Building,
    title: "College Directory",
    description: "Detailed profiles of all affiliated colleges with placement records and facilities.",
    href: "/colleges"
  },
  {
    icon: GraduationCap,
    title: "Student Resources",
    description: "Helpful resources like study materials, past papers, and career guidance.",
    href: "/resources"
  }
];
