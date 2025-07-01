import type { Metadata } from "next"
import Hero from "@/components/hero"
import DateCountdown from "@/components/date-countdown"
import Venue from "@/components/venue"
import Dresscode from "@/components/dresscode"
import RsvpForm from "@/components/rsvp-form"
import Footer from "@/components/footer"
import { BackgroundIllustrations } from "@/components/background-illustrations"

// Get the event date from environment variables, with a fallback
const WEDDING_DATE = process.env.WEDDING_DATE || process.env.NEXT_PUBLIC_WEDDING_DATE || "2025-11-08T16:00:00"

export const metadata: Metadata = {
  title: "Juanca & Nuria - Invitación de Casamiento",
  description: `Te invitamos a celebrar nuestro casamiento el ${new Date(WEDDING_DATE).toLocaleDateString("es-AR")}`,
}

export default function Home() {
  return (
    <main className="min-h-screen bg-light-blue relative overflow-hidden">
      {/* Background illustrations */}
      <BackgroundIllustrations />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-20">
        <Hero />
        <DateCountdown date={WEDDING_DATE} />
        <Venue />
        <Dresscode />
        <RsvpForm />
        <Footer />
      </div>
    </main>
  )
}
