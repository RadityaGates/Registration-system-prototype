import { getEventBySlug } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Ticket } from "lucide-react"
import Link from "next/link"

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug)

  if (!event) {
    notFound()
  }

  return (
    <div className="bg-brand-beige text-brand-navy">
      <section
        className="relative py-32 md:py-48 flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${event.heroImage})` }}
      >
        <div className="absolute inset-0 bg-brand-navy/75"></div>
        <div className="relative z-10 p-6">
          <h1 className="text-5xl md:text-7xl font-black text-brand-beige">{event.name}</h1>
          <p className="text-xl text-brand-beige/80 mt-4">
            {event.date} &bull; {event.location}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-4">About the Event</h2>
              <p className="text-lg text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
            <div>
              <h2
                className="text-4xl font-black uppercase text-transparent text-center mb-8"
                style={{ WebkitTextStroke: "1px #101419", paintOrder: "stroke fill" }}
              >
                Ticket Available
              </h2>
              <div className="space-y-6">
                {event.ticketTypes.map((ticket) => (
                  <Card key={ticket.id} className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">{ticket.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-2">IDR {ticket.price.toLocaleString("id-ID")}</p>
                      <p className="text-gray-600">{ticket.description}</p>
                      <p className={`text-sm mt-2 font-medium ${ticket.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {ticket.stock > 0 ? `${ticket.stock} tickets left` : "Sold Out"}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        disabled={ticket.stock === 0}
                        className="w-full bg-brand-navy hover:bg-black text-white"
                      >
                        <Link href={`/checkout?eventId=${event.id}&ticketType=${ticket.id}`}>
                          <Ticket className="mr-2 h-4 w-4" />
                          Buy Ticket
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
