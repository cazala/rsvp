"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { generateGoogleCalendarUrl, generateICSFile } from "@/lib/calendar"

interface CalendarDebugProps {
  eventDate: string
}

export default function CalendarDebug({ eventDate }: CalendarDebugProps) {
  const [debugInfo, setDebugInfo] = useState<string>("")

  const eventDetails = {
    title: "Casamiento Nuria & Juanca",
    startDate: new Date(eventDate),
    endDate: new Date(new Date(eventDate).getTime() + 6 * 60 * 60 * 1000),
    description: "Te invitamos a celebrar nuestro casamiento. ¡Esperamos verte ahí!",
    location: "Estancia La Lupita, Gral. Viamonte 2298, B1669 Del Viso, Provincia de Buenos Aires, Argentina",
  }

  const handleDebug = () => {
    const googleUrl = generateGoogleCalendarUrl(eventDetails)
    const icsContent = generateICSFile(eventDetails)

    const info = `
Event Date: ${eventDate}
Start Date: ${eventDetails.startDate.toISOString()}
End Date: ${eventDetails.endDate.toISOString()}

Google Calendar URL:
${googleUrl}

ICS Content:
${icsContent}
    `

    setDebugInfo(info)
    console.log("Calendar Debug Info:", info)
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <Button onClick={handleDebug} variant="outline" size="sm">
        Debug Calendar
      </Button>
      {debugInfo && <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">{debugInfo}</pre>}
    </div>
  )
}
