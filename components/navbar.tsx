"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Placements", href: "/placements" },
  { name: "News", href: "/news", badge: "LIVE" },
  { name: "Colleges", href: "/colleges" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between p-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="ml-3 text-2xl font-bold text-foreground">IPUBuddy</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <DarkModeToggle />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground ml-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                {item.name}
              </Link>
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          <DarkModeToggle />
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Admin <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-3 text-2xl font-bold text-foreground">IPURanker</span>
            </Link>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/admin"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
