"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Ticket } from "lucide-react"

export default function LandingPage() {
  const eventDate = "October 26-27, 2025"
  const eventLocation = "Ancol Beach, Jakarta"

  return (
    <>
      <section className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center text-center bg-white">
        <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
        <div className="relative z-10 p-6 space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-black animate-fade-in-down">Laut Senja Festival</h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium animate-fade-in-up animation-delay-300">
            by Hassa Creatif
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-gray-800 animate-fade-in-up animation-delay-500">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-6 w-6 text-black" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-black" />
              <span>{eventLocation}</span>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform animate-fade-in-up animation-delay-700"
          >
            <Link href="/tickets">
              <Ticket className="mr-2 h-5 w-5" /> Buy Tickets Now
            </Link>
          </Button>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Experience the Magic of <span className="text-gray-700">Laut Senja</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Join us for an unforgettable celebration of music, art, and culture. Immerse yourself in captivating
            performances and a vibrant atmosphere. This is more than just a festival; it's a memory in the making.
          </p>
          <Image
            src="/placeholder.svg?width=800&height=450&text=Festival+Highlights"
            alt="Laut Senja Festival Highlights"
            width={800}
            height={450}
            className="rounded-lg shadow-md mx-auto"
          />
        </div>
      </section>

      <style jsx global>{`
        .bg-dots-pattern {
          background-image: radial-gradient(#e0e0e0 1px, transparent 1px);
          background-size: 16px 16px;
        }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </>
  )
}
