import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-brand-beige/70 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Hassa Creatif. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link href="/#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/events" className="hover:text-white transition-colors">
              Events
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
