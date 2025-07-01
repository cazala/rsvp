"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateGoogleCalendarUrl, downloadICSFile } from "@/lib/calendar"

interface CalendarButtonProps {
  eventDate: string
}

export default function CalendarButton({ eventDate }: CalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const eventDetails = {
    title: "Casamiento Nuria & Juanca",
    startDate: new Date(eventDate),
    endDate: new Date(new Date(eventDate).getTime() + 6 * 60 * 60 * 1000), // 6 hours duration
    description: "Te invitamos a celebrar nuestro casamiento. ¡Esperamos verte ahí!",
    location: "Estancia La Lupita, Gral. Viamonte 2298, B1669 Del Viso, Provincia de Buenos Aires, Argentina",
  }

  const handleGoogleCalendar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = generateGoogleCalendarUrl(eventDetails)
    window.open(url, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  const handleDownloadICS = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    downloadICSFile(eventDetails, "casamiento-nuria-juanca.ics")
    setIsOpen(false)
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative inline-block">
      <Button
        onClick={toggleDropdown}
        className="bg-[#9b8579] hover:bg-[#8a7668] text-white flex items-center gap-2"
        type="button"
      >
        <Calendar className="h-4 w-4" />
        Agregar al Calendario
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown menu */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={handleGoogleCalendar}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Google Calendar
              </button>
              <button
                onClick={handleDownloadICS}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Descargar archivo .ics
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
