"use client"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import type { TicketPurchase } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, Download, QrCode, LogOut } from "lucide-react"
import { toast } from "sonner"

export default function AdminDashboardPage() {
  const [purchases, setPurchases] = useState<TicketPurchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<TicketPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("isAdminAuthenticated") !== "true") {
      router.push("/admin/login")
      return
    }
    async function fetchPurchases() {
      setLoading(true)
      const data = await import("@/lib/db").then((mod) => mod.getAllTicketPurchases())
      const sortedData = data.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime())
      setPurchases(sortedData)
      setFilteredPurchases(sortedData)
      setLoading(false)
    }
    fetchPurchases()
  }, [router])

  useEffect(() => {
    let result = purchases
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (filterType !== "all") result = result.filter((p) => p.ticketTypeId === filterType)
    if (filterStatus !== "all") result = result.filter((p) => p.status === filterStatus)
    setFilteredPurchases(result)
  }, [searchTerm, filterType, filterStatus, purchases])

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    toast.info("Logged out successfully.")
    router.push("/admin/login")
  }

  const handleToggleCheckIn = async (ticketId: string, currentStatus: "unused" | "used") => {
    const newStatus = currentStatus === "unused" ? "used" : "unused"
    const { updateTicketStatus, getAllTicketPurchases } = await import("@/lib/db")
    await updateTicketStatus(ticketId, newStatus)
    const updatedPurchases = await getAllTicketPurchases()
    setPurchases(updatedPurchases.sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime()))
    toast.success(`Ticket ${ticketId} marked as ${newStatus}.`)
  }

  const downloadCSV = () => {
    if (filteredPurchases.length === 0) {
      toast.error("No data to download.")
      return
    }
    const headers = "Ticket ID,Full Name,Email,Phone,Ticket Type,Quantity,Total Price (IDR),Status,Purchase Date\n"
    const csvContent = filteredPurchases
      .map((p) =>
        [
          p.id,
          `"${p.fullName.replace(/"/g, '""')}"`,
          p.email,
          p.phoneNumber,
          p.ticketTypeName,
          p.quantity,
          p.totalPrice,
          p.status,
          p.purchaseDate.toISOString(),
        ].join(","),
      )
      .join("\n")
    const blob = new Blob([headers + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendees_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Attendee list downloaded.")
  }

  if (loading)
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/admin/scanner")}
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white"
          >
            <QrCode className="mr-2 h-4 w-4" /> QR Scanner
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <Label htmlFor="search" className="text-sm font-medium text-gray-600">
            Search
          </Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Name, email, ticket ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <Label htmlFor="filterType" className="text-sm font-medium text-gray-600">
            Ticket Type
          </Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger id="filterType" className="mt-1">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="early-bird">Early Bird</SelectItem>
              <SelectItem value="presale">Presale</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="filterStatus" className="text-sm font-medium text-gray-600">
            Status
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger id="filterStatus" className="mt-1">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="unused">Unused</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium block mb-1">&nbsp;</Label>
          <Button onClick={downloadCSV} className="w-full bg-black hover:bg-gray-800 text-white">
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.fullName}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.ticketTypeName}</TableCell>
                  <TableCell className="text-center">{p.quantity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${p.status === "unused" ? "bg-gray-200 text-gray-800" : "bg-black text-white"}`}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" variant="outline" onClick={() => handleToggleCheckIn(p.id, p.status)}>
                      {p.status === "unused" ? "Check In" : "Un-CheckIn"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  No ticket purchases match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
