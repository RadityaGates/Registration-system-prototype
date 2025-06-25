"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, AlertCircle, ShoppingCart } from "lucide-react"
import type { TicketType } from "@/lib/types"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTicketTypesData() {
      try {
        const data = await import("@/lib/db").then((mod) => mod.getTicketTypes())
        setTicketTypes(data)
        const typeFromQuery = searchParams.get("ticketType")
        if (typeFromQuery && data.some((t) => t.id === typeFromQuery)) {
          setSelectedTicketTypeId(typeFromQuery)
        } else if (data.length > 0) {
          setSelectedTicketTypeId(data[0].id)
        }
      } catch (err) {
        setError("Failed to load ticket information.")
        toast.error("Failed to load ticket information.")
      } finally {
        setLoading(false)
      }
    }
    fetchTicketTypesData()
  }, [searchParams])

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketTypeId)
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) {
      toast.error("Please select a valid ticket type.")
      return
    }
    if (quantity <= 0) {
      toast.error("Quantity must be at least 1.")
      return
    }
    if (quantity > selectedTicket.stock) {
      toast.error(`Only ${selectedTicket.stock} ${selectedTicket.name} tickets available.`)
      return
    }

    setSubmitting(true)
    setError(null)
    toast.loading("Processing your order...", { id: "checkout-toast" })

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          ticketTypeId: selectedTicket.id,
          ticketTypeName: selectedTicket.name,
          quantity,
          totalPrice,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Checkout failed")
      }

      toast.success("Checkout successful! Redirecting...", { id: "checkout-toast" })
      router.push(`/confirmation/${result.ticketId}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error(errorMessage, { id: "checkout-toast" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 text-black animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gray-100 p-6 border-b border-gray-200">
            <CardTitle className="text-3xl font-bold flex items-center text-black">
              <ShoppingCart className="mr-3 h-8 w-8" />
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ticketType" className="text-gray-700 font-medium">
                    Ticket Type
                  </Label>
                  <Select value={selectedTicketTypeId} onValueChange={setSelectedTicketTypeId} required>
                    <SelectTrigger id="ticketType" className="mt-1">
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id} disabled={type.stock === 0}>
                          {type.name} (IDR {type.price.toLocaleString("id-ID")}) -{" "}
                          {type.stock > 0 ? `${type.stock} left` : "Sold Out"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-gray-700 font-medium">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    min="1"
                    max={selectedTicket?.stock}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {selectedTicket && (
                <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-md">
                  <h3 className="text-lg font-semibold text-black mb-2">Order Summary</h3>
                  <p className="text-gray-800">Ticket: {selectedTicket.name}</p>
                  <p className="text-gray-800">Quantity: {quantity}</p>
                  <p className="text-xl font-bold text-black mt-2">Total: IDR {totalPrice.toLocaleString("id-ID")}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  submitting || !selectedTicket || selectedTicket.stock === 0 || quantity > (selectedTicket?.stock || 0)
                }
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 text-lg rounded-md disabled:opacity-50"
              >
                {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {submitting ? "Processing..." : "Simulate Payment & Get Ticket"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="p-6 bg-gray-100 text-center border-t border-gray-200">
            <p className="text-sm text-gray-500">This is a simulated payment. No real transaction will occur.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
