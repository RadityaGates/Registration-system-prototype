// Simulated email sending function
import type { TicketPurchase } from "./types"

interface EmailDetails {
  to: string
  subject: string
  html: string
}

export async function sendTicketEmail(purchase: TicketPurchase, qrCodeDataURL: string): Promise<void> {
  const emailContent: EmailDetails = {
    to: purchase.email,
    subject: `Your Laut Senja Festival Ticket: ${purchase.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h1 style="color: #000000;">Laut Senja Festival Ticket Confirmation</h1>
        <p>Dear ${purchase.fullName},</p>
        <p>Thank you for purchasing your ticket(s) for Laut Senja Festival!</p>
        
        <h2>Event Details:</h2>
        <p><strong>Event:</strong> Laut Senja Festival by Hassa Creatif</p>
        <p><strong>Date:</strong> [EVENT_DATE_HERE - e.g., October 26-27, 2025]</p>
        <p><strong>Location:</strong> [EVENT_LOCATION_HERE - e.g., Ancol Beach, Jakarta]</p>
        
        <h2>Your Ticket Information:</h2>
        <p><strong>Ticket ID:</strong> ${purchase.id}</p>
        <p><strong>Ticket Type:</strong> ${purchase.ticketTypeName}</p>
        <p><strong>Quantity:</strong> ${purchase.quantity}</p>
        <p><strong>Total Price:</strong> IDR ${purchase.totalPrice.toLocaleString("id-ID")}</p>
        
        <h2 style="color: #000000;">Your QR Code for Entry:</h2>
        <p>Please present this QR code at the event entrance.</p>
        <img src="${qrCodeDataURL}" alt="Your Ticket QR Code" style="border: 2px solid #000000; border-radius: 8px;"/>
        
        <p>We look forward to seeing you at Laut Senja Festival!</p>
        <p>Best regards,<br/>Hassa Creatif Team</p>
        <hr style="border-color: #e0e0e0;">
        <p style="font-size: 0.8em;">If you have any questions, please contact us at [CONTACT_EMAIL_OR_PHONE].</p>
      </div>
    `,
  }

  console.log("Simulating email sending with monochrome theme...")
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
