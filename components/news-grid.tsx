import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar } from "lucide-react"

// Sample data - would be fetched from API in a real application
const allNewsItems = [
  {
    id: 1,
    title: "IPU CET 2024 Registration Opens",
    category: "Admission",
    date: "May 5, 2024",
    excerpt:
      "The registration process for IPU CET 2024 has begun. Students can apply online through the official website until June 10, 2024.",
    link: "/news/ipu-cet-2024-registration",
  },
  {
    id: 2,
    title: "Counseling Schedule for B.Tech Programs Announced",
    category: "Counseling",
    date: "May 3, 2024",
    excerpt:
      "GGSIPU has released the counseling schedule for B.Tech programs for the academic year 2024-25. The first round will begin on July 15.",
    link: "/news/btech-counseling-schedule",
  },
  {
    id: 3,
    title: "Cut-off Marks for 2023 Admissions Released",
    category: "Cut-offs",
    date: "April 28, 2024",
    excerpt:
      "The university has published the cut-off marks for all programs from the 2023 admission cycle to help students prepare for this year's admissions.",
    link: "/news/cutoff-marks-2023",
  },
  {
    id: 4,
    title: "New Courses Added for Academic Year 2024-25",
    category: "Courses",
    date: "April 20, 2024",
    excerpt:
      "GGSIPU has introduced several new courses including B.Sc. Data Science, B.Des. in UI/UX, and M.Tech in AI & Machine Learning.",
    link: "/news/new-courses-2024",
  },
  {
    id: 5,
    title: "IPU CET 2024 Exam Pattern and Syllabus",
    category: "Admission",
    date: "April 15, 2024",
    excerpt:
      "The university has released the exam pattern and detailed syllabus for IPU CET 2024. Check the official website for program-specific details.",
    link: "/news/ipu-cet-2024-pattern",
  },
  {
    id: 6,
    title: "Annual Tech Fest 'Technovation 2024' Announced",
    category: "Events",
    date: "April 10, 2024",
    excerpt:
      "GGSIPU's annual tech fest 'Technovation 2024' will be held from May 20-22, 2024. Registration for various competitions is now open.",
    link: "/news/technovation-2024",
  },
  {
    id: 7,
    title: "Scholarship Programs for Academic Year 2024-25",
    category: "Admission",
    date: "April 5, 2024",
    excerpt:
      "GGSIPU has announced various scholarship programs for the academic year 2024-25. Eligible students can apply through the university portal.",
    link: "/news/scholarships-2024",
  },
  {
    id: 8,
    title: "Second Round of Counseling for MBA Programs",
    category: "Counseling",
    date: "April 2, 2024",
    excerpt:
      "The second round of counseling for MBA programs will begin on April 10, 2024. Candidates can check their status on the official website.",
    link: "/news/mba-counseling-round2",
  },
  {
    id: 9,
    title: "Cut-off Trends for Engineering Programs (2019-2023)",
    category: "Cut-offs",
    date: "March 28, 2024",
    excerpt:
      "The university has published a comprehensive analysis of cut-off trends for engineering programs over the last five years.",
    link: "/news/engineering-cutoff-trends",
  },
]

export default function NewsGrid({ category = "all" }: { category?: string }) {
  // Filter news items based on category
  const newsItems =
    category === "all"
      ? allNewsItems
      : allNewsItems.filter((item) => item.category.toLowerCase() === category.toLowerCase())

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.length > 0 ? (
        newsItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                  {item.category}
                </Badge>
              </div>
              <CardDescription className="flex items-center mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                {item.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={item.link} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read more →
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No news items found for this category.</p>
        </div>
      )}
    </div>
  )
}
