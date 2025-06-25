export interface TicketType {
  id: string
  name: string
  price: number
  stock: number
  description?: string
}

export interface TicketPurchase {
  id: string // Unique Ticket ID (e.g. LSF-2025-XYZ123)
  fullName: string
  email: string
  phoneNumber: string
  ticketTypeId: string
  ticketTypeName: string
  quantity: number
  totalPrice: number
  qrCodeUrl?: string // URL or base64 data of the QR code
  status: "unused" | "used"
  purchaseDate: Date
}

export interface AdminUser {
  id: string
  username: string
  passwordHash: string // In a real app, never store plain passwords
}
