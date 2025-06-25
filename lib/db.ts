// Simulated in-memory database for demonstration
import type { Event, TicketPurchase, AdminUser } from "./types"

const events: Event[] = [
  {
    id: "evt-lsf-2025",
    slug: "laut-senja-festival",
    name: "Laut Senja Festival",
    date: "October 26-27, 2025",
    location: "Ancol Beach, Jakarta",
    description:
      "An unforgettable celebration of music, art, and culture. Immerse yourself in breathtaking sunset views, captivating performances, and a vibrant atmosphere.",
    isUpcoming: true,
    heroImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1920w%20light.png-bZ3dKMFpTMHfHbkwLlqEjkoMNFBtlS.jpeg",
    ticketTypes: [
      { id: "lsf-early", name: "Early Bird", price: 150000, stock: 50, description: "Limited early access tickets." },
      { id: "lsf-presale", name: "Presale", price: 250000, stock: 150, description: "Get them before they're gone." },
      { id: "lsf-regular", name: "Regular", price: 350000, stock: 300, description: "Standard admission." },
    ],
  },
  {
    id: "evt-jg-2024",
    slug: "jakarta-gala",
    name: "Jakarta Gala 2024",
    date: "December 12, 2024",
    location: "Ritz-Carlton, Jakarta",
    description: "An exclusive evening of elegance and networking for industry leaders.",
    isUpcoming: false,
    heroImage: "/placeholder.svg?width=800&height=450&text=Jakarta+Gala",
    ticketTypes: [{ id: "jg-vip", name: "VIP Invite", price: 1500000, stock: 0, description: "Invitation only." }],
  },
]

const ticketPurchases: TicketPurchase[] = []
const adminUsers: AdminUser[] = [{ id: "admin1", username: "admin", passwordHash: "admin123" }] // NOT SECURE! For demo only.

// --- Event Functions ---
export async function getAllEvents(): Promise<Event[]> {
  return [...events]
}
export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  return events.find((e) => e.slug === slug)
}

// --- Ticket Purchase Functions ---
export async function saveTicketPurchase(
  purchaseData: Omit<TicketPurchase, "id" | "purchaseDate" | "status">,
): Promise<TicketPurchase> {
  const event = events.find((e) => e.id === purchaseData.eventId)
  const ticketType = event?.ticketTypes.find((t) => t.id === purchaseData.ticketTypeId)

  if (!ticketType || ticketType.stock < purchaseData.quantity) {
    throw new Error("Tickets not available or insufficient stock.")
  }

  const newPurchase: TicketPurchase = {
    ...purchaseData,
    id: `${purchaseData.eventId.split("-")[1].toUpperCase()}-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    purchaseDate: new Date(),
    status: "unused",
  }
  ticketPurchases.push(newPurchase)
  ticketType.stock -= purchaseData.quantity
  return newPurchase
}

export async function getAllTicketPurchases(): Promise<TicketPurchase[]> {
  return [...ticketPurchases]
}
export async function getTicketPurchaseById(ticketId: string): Promise<TicketPurchase | undefined> {
  return ticketPurchases.find((p) => p.id === ticketId)
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

// --- Admin Functions ---
export async function findAdminUser(username: string): Promise<AdminUser | undefined> {
  return adminUsers.find((u) => u.username === username)
}
