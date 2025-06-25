"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { QrCode, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"
import type { TicketPurchase } from "@/lib/types"
import { toast } from "sonner"

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState("")
  const [ticketInfo, setTicketInfo] = useState<TicketPurchase | null>(null)
  const [scanResult, setScanResult] = useState<"valid" | "invalid" | "used" | "error" | null>(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("isAdminAuthenticated") !== "true") {
      router.push("/admin/login")
    }
  }, [router])

  const handleScan = async (data: string | null) => {
    if (data) {
      setScannedData(data)
      setIsLoading(true)
      setTicketInfo(null)
      setScanResult(null)
      setMessage("")

      try {
        let parsedData
        try {
          parsedData = JSON.parse(data)
        } catch (e) {
          throw new Error("Invalid QR code format.")
        }

        if (!parsedData.ticketId) throw new Error("Invalid QR code. Ticket ID missing.")

        const { getTicketPurchaseById, updateTicketStatus } = await import("@/lib/db")
        const ticket = await getTicketPurchaseById(parsedData.ticketId)

        if (!ticket) {
          setScanResult("invalid")
          setMessage(`Ticket ID ${parsedData.ticketId} not found.`)
          toast.error(`Ticket ID ${parsedData.ticketId} not found.`)
        } else if (ticket.status === "used") {
          setTicketInfo(ticket)
          setScanResult("used")
          setMessage(`Ticket ${ticket.id} has already been used.`)
          toast.warning(`Ticket ${ticket.id} has already been used.`)
        } else {
          await updateTicketStatus(ticket.id, "used")
          setTicketInfo({ ...ticket, status: "used" })
          setScanResult("valid")
          setMessage(`Ticket ${ticket.id} checked in successfully!`)
          toast.success(`Ticket ${ticket.id} checked in successfully!`)
        }
      } catch (error) {
        setScanResult("error")
        const errorMessage = error instanceof Error ? error.message : "Error validating ticket."
        setMessage(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const QrReaderComponent = () => (
    <div className="bg-gray-100 border-2 border-dashed border-gray-300 h-64 w-full flex items-center justify-center rounded-md my-4">
      <p className="text-gray-500">QR Scanner Area (Integrate Library Here)</p>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <Button onClick={() => router.back()} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <Card className="max-w-lg mx-auto shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-100 p-6 border-b border-gray-200">
          <CardTitle className="text-2xl font-bold flex items-center text-black">
            <QrCode className="mr-3 h-7 w-7" /> Ticket Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <QrReaderComponent />
          <Label htmlFor="manualScan" className="font-medium text-gray-700">
            Or Enter QR Data Manually (JSON):
          </Label>
          <Input
            id="manualScan"
            placeholder='{"ticketId":"..."}'
            value={scannedData}
            onChange={(e) => setScannedData(e.target.value)}
            className="mt-1 mb-3"
          />
          <Button
            onClick={() => handleScan(scannedData)}
            disabled={isLoading || !scannedData}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Validate Ticket
          </Button>

          {scanResult && !isLoading && (
            <div
              className={`mt-6 p-4 rounded-md text-center font-semibold border ${
                scanResult === "valid"
                  ? "bg-gray-100 text-black border-gray-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {scanResult === "valid" && <CheckCircle className="h-8 w-8 mx-auto mb-2 text-black" />}
              {scanResult === "used" && <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />}
              {(scanResult === "invalid" || scanResult === "error") && (
                <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              )}
              <p className="text-lg">{message}</p>
              {ticketInfo && (
                <div className="mt-2 text-sm text-left bg-white/50 p-3 rounded">
                  <p>
                    <strong>Name:</strong> {ticketInfo.fullName}
                  </p>
                  <p>
                    <strong>Ticket ID:</strong> {ticketInfo.id}
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="font-bold">{ticketInfo.status.toUpperCase()}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-gray-100 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">Ensure good lighting for best scanning results.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
