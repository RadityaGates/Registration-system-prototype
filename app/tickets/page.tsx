"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { TicketIcon, AlertCircle, Loader2 } from "lucide-react"
import type { TicketType } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function TicketSelectionPage() {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTicketTypes() {
      try {
        const data = await import("@/lib/db").then((mod) => mod.getTicketTypes())
        setTicketTypes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchTicketTypes()
  }, [])

  const handlePurchaseClick = (ticketTypeId: string) => {
    router.push(`/checkout?ticketType=${ticketTypeId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 text-black animate-spin" />
        <p className="ml-4 text-xl text-black">Loading tickets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Error loading tickets</h2>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6 bg-black hover:bg-gray-800 text-white">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            Get Your <span className="text-gray-700">Tickets</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred ticket type and be part of the experience!
          </p>
        </header>

        {ticketTypes.length === 0 ? (
          <p className="text-center text-xl text-gray-500">
            No tickets available at the moment. Please check back later.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ticketTypes.map((ticket) => (
              <Card
                key={ticket.id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="bg-gray-50 p-6 border-b border-gray-200">
                  <CardTitle className="text-2xl font-bold text-black">{ticket.name}</CardTitle>
                  {ticket.description && (
                    <CardDescription className="text-gray-600 pt-1">{ticket.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <p className="text-4xl font-extrabold text-black mb-4">IDR {ticket.price.toLocaleString("id-ID")}</p>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      Availability:{" "}
                      <span className={`font-semibold ${ticket.stock > 0 ? "text-black" : "text-red-600"}`}>
                        {ticket.stock > 0 ? `${ticket.stock} tickets left` : "Sold Out"}
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t border-gray-200">
                  <Button
                    onClick={() => handlePurchaseClick(ticket.id)}
                    disabled={ticket.stock === 0}
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-lg rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <TicketIcon className="mr-2 h-5 w-5" />
                    {ticket.stock > 0 ? "Purchase Ticket" : "Sold Out"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
