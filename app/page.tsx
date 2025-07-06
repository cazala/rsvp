import type { Metadata } from "next";
import Hero from "@/components/hero";
import DateCountdown from "@/components/date-countdown";
import Venue from "@/components/venue";
import Itinerary from "@/components/itinerary";
import Dresscode from "@/components/dresscode";
import RsvpForm from "@/components/rsvp-form";
import Footer from "@/components/footer";
import { BackgroundIllustrations } from "@/components/background-illustrations";
import { validateInvitationLink } from "@/lib/invitation-actions";

// Get the event date from environment variables, with a fallback
const WEDDING_DATE =
  process.env.WEDDING_DATE ||
  process.env.NEXT_PUBLIC_WEDDING_DATE ||
  "2025-11-08T16:00:00";

export const metadata: Metadata = {
  title: "Juanca & Nuria - Invitación de Casamiento",
  description: `Te invitamos a celebrar nuestro casamiento el ${new Date(
    WEDDING_DATE
  ).toLocaleDateString("es-AR")}`,
};

interface HomeProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const inviteId = params.invite;
  let validInvite = null;

  // Validate invitation link if provided
  if (inviteId) {
    const validation = await validateInvitationLink(inviteId);
    if (validation.valid) {
      validInvite = validation.link;
    }
  }

  return (
    <main className="min-h-screen bg-primary-light relative overflow-hidden">
      {/* Background illustrations */}
      <BackgroundIllustrations validInvite={!!validInvite} />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-20">
        <Hero />
        <DateCountdown date={WEDDING_DATE} />
        <Venue />
        <Itinerary />
        <Dresscode />
        <RsvpForm inviteId={inviteId} validInvite={validInvite} />
        <Footer />
      </div>
    </main>
  );
}
