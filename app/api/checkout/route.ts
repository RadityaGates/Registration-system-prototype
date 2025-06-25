import { NextResponse } from "next/server"
import { saveTicketPurchase } from "@/lib/db"
import { generateQRCodeDataURL } from "@/lib/qr"
import { sendTicketEmail } from "@/lib/email"
import type { TicketPurchase } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phoneNumber, ticketTypeId, ticketTypeName, quantity, totalPrice } = body

    if (!fullName || !email || !phoneNumber || !ticketTypeId || !ticketTypeName || !quantity || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save purchase to DB (simulated)
    // In a real app, you'd handle payment processing here (e.g., Midtrans webhook)
    // For now, we assume payment is successful upon form submission.
    const purchaseData: Omit<TicketPurchase, "id" | "purchaseDate" | "status" | "qrCodeUrl"> = {
      fullName,
      email,
      phoneNumber,
      ticketTypeId,
      ticketTypeName,
      quantity,
      totalPrice,
    }

    const newPurchase = await saveTicketPurchase(purchaseData)

    // Generate QR Code
    // The QR code should ideally contain the unique ticket ID or a URL to validate the ticket
    const qrCodeDataURL = await generateQRCodeDataURL(
      JSON.stringify({ ticketId: newPurchase.id, event: "Laut Senja Festival" }),
    )

    // Update purchase with QR code URL (or store it separately)
    newPurchase.qrCodeUrl = qrCodeDataURL
    // If your DB schema is strict, you might need an update operation here.
    // For the in-memory store, this direct modification is fine.

    // Send confirmation email with QR code
    await sendTicketEmail(newPurchase, qrCodeDataURL)

    return NextResponse.json(
      {
        message: "Checkout successful, ticket generated and email sent.",
        ticketId: newPurchase.id,
        qrCodeUrl: qrCodeDataURL, // Optionally send QR to client too, or just rely on email
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Checkout error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error during checkout"
    // Check for specific stock error
    if (errorMessage.includes("insufficient stock") || errorMessage.includes("not available")) {
      return NextResponse.json({ error: errorMessage }, { status: 409 }) // Conflict for stock issues
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
