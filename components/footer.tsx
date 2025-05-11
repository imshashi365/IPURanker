import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GGSIPU Student Portal</h3>
            <p className="text-blue-100">
              A comprehensive platform for students of Guru Gobind Singh Indraprastha University and its affiliated
              colleges.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/placements" className="text-blue-100 hover:text-white">
                  Placements
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-blue-100 hover:text-white">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="text-blue-100 hover:text-white">
                  Colleges
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-blue-100">
              Guru Gobind Singh Indraprastha University
              <br />
              Sector 16C, Dwarka
              <br />
              New Delhi - 110078
            </p>
            <p className="mt-2 text-blue-100">Email: info@ipu.ac.in</p>
          </div>
        </div>
        <div className="mt-8 border-t border-blue-500 pt-8 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} GGSIPU Student Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
