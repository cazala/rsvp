"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateGoogleCalendarUrl } from "@/lib/calendar"

interface CalendarButtonSimpleProps {
  eventDate: string
}

export default function CalendarButtonSimple({ eventDate }: CalendarButtonSimpleProps) {
  const eventDetails = {
    title: "Casamiento Nuria & Juanca",
    startDate: new Date(eventDate),
    endDate: new Date(new Date(eventDate).getTime() + 6 * 60 * 60 * 1000),
    description: "Te invitamos a celebrar nuestro casamiento. ¡Esperamos verte ahí!",
    location: "Estancia La Lupita, Gral. Viamonte 2298, B1669 Del Viso, Provincia de Buenos Aires, Argentina",
  }

  const handleGoogleCalendar = () => {
    try {
      const url = generateGoogleCalendarUrl(eventDetails)
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error opening Google Calendar:", error)
      alert("Error al abrir Google Calendar")
    }
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleGoogleCalendar}
        className="border-2 border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white bg-transparent font-light tracking-wide rounded-full"
        type="button"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Agregar al Calendario
      </Button>
    </div>
  )
}
