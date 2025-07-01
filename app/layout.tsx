import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Delius } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const delius = Delius({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius",
})

export const metadata: Metadata = {
  title: "Juanca & Nuria - Invitación de Casamiento",
  description: "Te invitamos a celebrar nuestro casamiento el 8 de noviembre de 2025",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${delius.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
