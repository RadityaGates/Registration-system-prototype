"use client"
import Link from "next/link"
import { Menu, X, Ticket, Home, CalendarDays, Info, ShieldIcon as UserShield } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/#about", label: "About", icon: <Info size={18} /> },
    { href: "/tickets", label: "Buy Tickets", icon: <Ticket size={18} /> },
    { href: "/admin/dashboard", label: "Admin", icon: <UserShield size={18} /> },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <CalendarDays className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">Laut Senja Festival</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    pathname === link.href || (link.href.includes("#") && pathname === "/")
                      ? "bg-black text-white"
                      : "text-black hover:bg-gray-100"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-40 pb-3 border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${
                    pathname === link.href || (link.href.includes("#") && pathname === "/")
                      ? "bg-black text-white"
                      : "text-black hover:bg-gray-100"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
