import type React from "react"
import type { Metadata } from "next"
import { Delius } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const delius = Delius({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius",
})

export const metadata: Metadata = {
  title: "Admin - Juanca & Nuria",
  description: "Panel de administración para la invitación de casamiento",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${delius.variable}`}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </div>
  )
}
