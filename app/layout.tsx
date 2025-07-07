import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Delius } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const delius = Delius({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius",
});

export const metadata: Metadata = {
  title: "Juanca & Nuria - 08.11.2025",
  description:
    "Te invitamos a celebrar nuestro casamiento el 8 de Noviembre en Estancia Lupita, Del Viso.",
  openGraph: {
    title: "Juanca & Nuria - 08.11.2025",
    description:
      "Te invitamos a celebrar nuestro casamiento el 8 de Noviembre en Estancia Lupita, Del Viso.",
    siteName: "Juanca & Nuria - 08.11.2025",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "Juanca & Nuria - 08.11.2025",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juanca & Nuria - 08.11.2025",
    description:
      "Te invitamos a celebrar nuestro casamiento el 8 de Noviembre en Estancia Lupita, Del Viso.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://juanca-nuria.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${delius.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
