import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">Laut Senja Festival</h3>
            <p className="text-sm">
              An unforgettable experience by Hassa Creatif.
              <br />
              [EVENT_LOCATION_HERE]
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-black mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-black transition-colors">
                  Buy Tickets
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-black mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="hover:text-black transition-colors">
                <Facebook size={24} />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-black transition-colors">
                <Instagram size={24} />
              </Link>
              <Link href="#" aria-label="Twitter" className="hover:text-black transition-colors">
                <Twitter size={24} />
              </Link>
              <Link href="#" aria-label="Youtube" className="hover:text-black transition-colors">
                <Youtube size={24} />
              </Link>
            </div>
            <p className="text-sm mt-4 text-gray-800">Powered by Hassa Creatif</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Laut Senja Festival. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
