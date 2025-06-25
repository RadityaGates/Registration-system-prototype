"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle, Download, Home } from "lucide-react"
import type { TicketPurchase } from "@/lib/types"
import Link from "next/link"

export default function ConfirmationPage() {
  const params = useParams()
  const ticketId = params.ticketId as string
  const [purchaseDetails, setPurchaseDetails] = useState<TicketPurchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ticketId) {
      async function fetchPurchaseDetails() {
        try {
          const data = await import("@/lib/db").then((mod) => mod.getTicketPurchaseById(ticketId))
          if (!data) throw new Error("Ticket not found.")
          setPurchaseDetails(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
          setLoading(false)
        }
      }
      fetchPurchaseDetails()
    } else {
      setError("No ticket ID provided.")
      setLoading(false)
    }
  }, [ticketId])

  const handleDownloadTicket = () => {
    if (purchaseDetails && purchaseDetails.qrCodeUrl) {
      const link = document.createElement("a")
      link.href = purchaseDetails.qrCodeUrl
      link.download = `LautSenjaFestival_Ticket_${purchaseDetails.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 text-black animate-spin" />
      </div>
    )
  }

  if (error || !purchaseDetails) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Error loading ticket</h2>
        <p className="text-gray-600">{error || "Ticket details could not be found."}</p>
        <Button asChild className="mt-6 bg-black hover:bg-gray-800 text-white">
          <Link href="/tickets">Back to Tickets</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gray-100 p-6 text-center border-b border-gray-200">
            <CheckCircle className="h-16 w-16 text-black mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-black">Payment Successful!</CardTitle>
            <CardDescription className="text-lg text-gray-600 pt-1">Your ticket is confirmed.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 text-black">
            <p className="text-lg mb-2">
              Hello <span className="font-semibold">{purchaseDetails.fullName}</span>,
            </p>
            <p className="mb-6 text-gray-700">
              Your ticket has been generated. A confirmation email has been sent to{" "}
              <span className="font-semibold text-black">{purchaseDetails.email}</span>.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-black mb-3">Ticket Details:</h3>
              <p>
                <strong>Ticket ID:</strong> {purchaseDetails.id}
              </p>
              <p>
                <strong>Type:</strong> {purchaseDetails.ticketTypeName}
              </p>
              <p>
                <strong>Quantity:</strong> {purchaseDetails.quantity}
              </p>
              <p>
                <strong>Total Price:</strong> IDR {purchaseDetails.totalPrice.toLocaleString("id-ID")}
              </p>
            </div>

            {purchaseDetails.qrCodeUrl && (
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-black mb-3">Your QR Code for Entry:</h3>
                <Image
                  src={purchaseDetails.qrCodeUrl || "/placeholder.svg"}
                  alt={`QR Code for ticket ${purchaseDetails.id}`}
                  width={250}
                  height={250}
                  className="mx-auto rounded-lg border-2 border-black shadow-md"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={handleDownloadTicket}
                disabled={!purchaseDetails.qrCodeUrl}
                className="bg-black hover:bg-gray-800 text-white font-semibold py-3 text-lg"
              >
                <Download className="mr-2 h-5 w-5" /> Download Ticket (QR)
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white font-semibold py-3 text-lg"
              >
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" /> Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
