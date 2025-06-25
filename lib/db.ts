// Simulated in-memory database
import type { TicketPurchase, TicketType, AdminUser } from "./types"

const ticketPurchases: TicketPurchase[] = []
const adminUsers: AdminUser[] = [
  { id: "admin1", username: "admin", passwordHash: "hashed_password_admin" }, // Store hashed passwords in real app
]

export const availableTickets: TicketType[] = [
  { id: "early-bird", name: "Early Bird", price: 150000, stock: 50, description: "Get your tickets early and save!" },
  { id: "presale", name: "Presale", price: 250000, stock: 150, description: "Limited presale tickets." },
  { id: "regular", name: "Regular", price: 350000, stock: 300, description: "Standard admission ticket." },
]

export async function saveTicketPurchase(
  purchase: Omit<TicketPurchase, "id" | "purchaseDate" | "status">,
): Promise<TicketPurchase> {
  const ticketType = availableTickets.find((t) => t.id === purchase.ticketTypeId)
  if (!ticketType || ticketType.stock < purchase.quantity) {
    throw new Error("Tickets not available or insufficient stock.")
  }

  const newPurchase: TicketPurchase = {
    ...purchase,
    id: `LSF-2025-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    purchaseDate: new Date(),
    status: "unused",
  }
  ticketPurchases.push(newPurchase)

  // Update stock
  ticketType.stock -= purchase.quantity

  console.log("Ticket purchase saved:", newPurchase)
  console.log("Current purchases:", ticketPurchases)
  return newPurchase
}

export async function getTicketPurchaseById(ticketId: string): Promise<TicketPurchase | undefined> {
  return ticketPurchases.find((p) => p.id === ticketId)
}

export async function getAllTicketPurchases(): Promise<TicketPurchase[]> {
  return [...ticketPurchases] // Return a copy
}

export async function updateTicketStatus(
  ticketId: string,
  status: "unused" | "used",
): Promise<TicketPurchase | undefined> {
  const purchase = ticketPurchases.find((p) => p.id === ticketId)
  if (purchase) {
    purchase.status = status
    return purchase
  }
  return undefined
}

export async function findAdminUser(username: string): Promise<AdminUser | undefined> {
  return adminUsers.find((u) => u.username === username)
}

export async function getTicketTypes(): Promise<TicketType[]> {
  return [...availableTickets]
}
