"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface RsvpResponse {
  id: number
  created_at: string
  name: string
  email: string | null
  whatsapp: string | null
  dietary_requirements: string | null
  needs_transfer: boolean
  is_minor: boolean
  comment: string | null
}

interface ExportButtonProps {
  rsvps: RsvpResponse[]
}

export default function ExportButton({ rsvps }: ExportButtonProps) {
  const exportToCSV = () => {
    if (rsvps.length === 0) {
      alert("No hay datos para exportar")
      return
    }

    const headers = [
      "Nombre",
      "Email",
      "WhatsApp",
      "Menor de Edad",
      "Necesita Traslado",
      "Restricciones Alimentarias",
      "Comentario",
      "Fecha de Confirmación",
    ]

    const csvContent = [
      headers.join(","),
      ...rsvps.map((rsvp) =>
        [
          `"${rsvp.name}"`,
          `"${rsvp.email || (rsvp.is_minor ? "Menor de edad" : "")}"`,
          `"${rsvp.whatsapp || (rsvp.is_minor ? "Menor de edad" : "")}"`,
          rsvp.is_minor ? "Sí" : "No",
          rsvp.needs_transfer ? "Sí" : "No",
          `"${rsvp.dietary_requirements || ""}"`,
          `"${rsvp.comment || ""}"`,
          `"${new Date(rsvp.created_at).toLocaleDateString("es-AR")}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `confirmaciones-casamiento-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Button onClick={exportToCSV} className="flex items-center gap-2 bg-ocean-blue hover:bg-sky-blue text-white font-light tracking-wide">
      <Download className="h-5 w-5" />
      Exportar CSV
    </Button>
  )
}
