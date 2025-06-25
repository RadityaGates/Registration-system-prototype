import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAllEvents } from "@/lib/db"
import { ArrowRight } from "lucide-react"

export default async function HomePage() {
  const allEvents = await getAllEvents()
  const upcomingEvents = allEvents.filter((event) => event.isUpcoming)

  return (
    <div className="bg-brand-beige text-brand-navy">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center text-center bg-hero-crowd bg-cover bg-center">
        <div className="absolute inset-0 bg-brand-navy/70"></div>
        <div className="relative z-10 p-6 space-y-6">
          <h1
            className="text-6xl md:text-8xl font-black uppercase text-transparent"
            style={{ WebkitTextStroke: "2px #F5F5DC", paintOrder: "stroke fill" }}
          >
            Hassa Creatif
          </h1>
          <p className="text-lg md:text-xl text-brand-beige max-w-2xl mx-auto">
            We are a 360 creative solutions company, unified by a passion for developing disruptive ideas. We turn
            consumers into fans through human-centered storied experiences.
          </p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-12">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Link href={`/events/${event.slug}`} key={event.id}>
                  <Card className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                    <div className="overflow-hidden">
                      <img
                        src={event.heroImage || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{event.date}</p>
                      <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                      <p className="text-gray-600 mb-4">{event.location}</p>
                      <div className="text-brand-navy font-semibold flex items-center group-hover:text-brand-accent transition-colors">
                        View Event <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No upcoming events. Please check back soon!</p>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">About Us</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our work cuts across Media & Advertising, Experiential Marketing, Audio/Visual production, Digital marketing
            & Tech innovation, and Entertainment. With every project and endeavour we undertake, we go out of our way to
            raise the bar, hop over it, and raise it even higher.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-brand-navy text-brand-beige">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase">
              Work Together <span className="text-brand-accent">*</span> Let's Talk
            </h2>
          </div>
          <form className="max-w-xl mx-auto mt-12 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium uppercase tracking-wider mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent"
              ></textarea>
            </div>
            <div className="text-right">
              <Button
                type="submit"
                className="bg-brand-beige text-brand-navy hover:bg-white font-bold uppercase tracking-wider px-8 py-3"
              >
                Send Form
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
