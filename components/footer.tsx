import Link from "next/link"
import { GraduationCap, Twitter, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-3 text-xl font-bold text-foreground">IPUBuddy</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              A comprehensive platform for students of Guru Gobind Singh Indraprastha University and its affiliated colleges.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/placements" className="text-sm text-muted-foreground hover:text-primary transition-colors">Placements</Link></li>
              <li><Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">News & Updates</Link></li>
              <li><Link href="/colleges" className="text-sm text-muted-foreground hover:text-primary transition-colors">Colleges</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Contact</h3>
            <address className="text-sm text-muted-foreground not-italic space-y-3">
              <p>IPUBuddy<br />Sector 15, Noida<br />UP - 201301</p>
              <p>Email: <a href="mailto:mail@ipubuddy.com" className="hover:text-primary transition-colors">mail@ipubuddy.com</a></p>
            </address>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-6 w-6" /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-6 w-6" /></Link>
              <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} IPURanker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
