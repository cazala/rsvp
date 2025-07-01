import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Juanca & Nuria",
  description: "Panel de administración para la invitación de casamiento",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
