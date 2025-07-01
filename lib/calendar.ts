interface CalendarEvent {
  title: string
  startDate: Date
  endDate: Date
  description?: string
  location?: string
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    // Format: YYYYMMDDTHHMMSSZ
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const startDate = formatDate(event.startDate)
  const endDate = formatDate(event.endDate)

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || "",
    location: event.location || "",
    trp: "false", // Don't show popup
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const startDate = formatDate(event.startDate)
  const endDate = formatDate(event.endDate)
  const now = formatDate(new Date())

  // Escape special characters in text fields
  const escapeText = (text: string): string => {
    return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `DTSTAMP:${now}`,
    `UID:wedding-${Date.now()}@wedding-invitation.com`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description || "")}`,
    `LOCATION:${escapeText(event.location || "")}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return icsContent
}

export function downloadICSFile(event: CalendarEvent, filename = "event.ics"): void {
  try {
    const icsContent = generateICSFile(event)
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })

    // Create download link
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading ICS file:", error)
    alert("Error al descargar el archivo de calendario. Por favor, intenta de nuevo.")
  }
}
