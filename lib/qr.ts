import QRCode from "qrcode"

export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      scale: 8,
      color: {
        dark: "#000000", // Black for QR code
        light: "#FFFFFF00", // Transparent background
      },
    })
    return qrCodeDataURL
  } catch (err) {
    console.error("Error generating QR code:", err)
    throw err
  }
}
