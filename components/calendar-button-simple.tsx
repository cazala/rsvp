"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateGoogleCalendarUrl } from "@/lib/calendar";

interface CalendarButtonSimpleProps {
  eventDate: string;
}

export default function CalendarButtonSimple({
  eventDate,
}: CalendarButtonSimpleProps) {
  const eventDetails = {
    title: "Casamiento Nuria & Juanca",
    startDate: new Date(eventDate),
    endDate: new Date(new Date(eventDate).getTime() + 6 * 60 * 60 * 1000),
    description: "Te invitamos a celebrar nuestro casamiento!",
    location:
      "Estancia Lupita, Gral. Viamonte 2298, B1669 Del Viso, Provincia de Buenos Aires, Argentina",
  };

  const handleGoogleCalendar = () => {
    try {
      const url = generateGoogleCalendarUrl(eventDetails);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening Google Calendar:", error);
      alert("Error al abrir Google Calendar");
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleGoogleCalendar}
        className="border-2 border-ocean-blue text-ocean-blue text-lg py-6 px-8 hover:bg-ocean-blue hover:text-white bg-transparent font-light tracking-wide rounded-full"
        type="button"
        style={{
          cursor: "pointer",
        }}
      >
        <Calendar className="mr-2 ml-2 h-8 w-8" />
        Agregar al Calendario
      </Button>
    </div>
  );
}
