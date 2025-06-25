export interface Event {
  id: string
  slug: string
  name: string
  date: string
  location: string
  description: string
  isUpcoming: boolean
  heroImage: string
  ticketTypes: TicketType[]
}

export interface TicketType {
  id: string
  name: string
  price: number
  stock: number
  description: string
}

export interface TicketPurchase {
  id: string
  eventId: string
  fullName: string
  email: string
  phoneNumber: string
  ticketTypeId: string
  ticketTypeName: string
  quantity: number
  totalPrice: number
  status: "unused" | "used"
  purchaseDate: Date
  qrCodeUrl?: string
}

export interface AdminUser {
  id: string
  username: string
  passwordHash: string // In a real app, this would be a securely hashed password
}
