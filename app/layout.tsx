import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IPUBuddy - GGSIPU Admission, Colleges, Cutoffs & Predictor Tool",
  description: "Explore GGSIPU colleges, admission process, seat matrix, placement data, and use our powerful College Predictor & Cutoff Analyzer to plan your admission smartly.",
  keywords: [
    "GGSIPU admission 2025",
    "IPU colleges list",
    "GGSIPU cutoff",
    "IPU college predictor",
    "GGSIPU counseling",
    "IP University seat matrix",
    "IPU fees structure",
    "GGSIPU placement",
    "IPUBuddy"
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  authors: [{ name: "IPUBuddy Team", url: "https://www.ipubuddy.com" }],
  creator: "Shashi Kumar",
  openGraph: {
    title: "IPUBuddy - Smart Admission Guidance for GGSIPU",
    description: "All-in-one portal for GGSIPU aspirants. Get latest cutoff trends, explore college options, and predict your admission chances now!",
    url: "https://www.ipubuddy.com",
    siteName: "IPUBuddy",
    locale: "en_IN",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          forcedTheme="light" 
          enableSystem={false} 
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
