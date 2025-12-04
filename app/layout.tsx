import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Delius, Tangerine } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const tangerine = Tangerine({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-tangerine",
});

const delius = Delius({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delius",
});

export const metadata: Metadata = {
  title: "Sam & Fede - 14.03.2026",
  description:
    "Te invitamos a celebrar nuestro casamiento el 14 de Marzo en Salón/Estancia, CABA.",
  openGraph: {
    title: "Sam & Fede - 14.03.2026",
    description:
      "Te invitamos a celebrar nuestro casamiento el 14 de Marzo en Salón/Estancia, CABA.",
    siteName: "Sam & Fede - 14.03.2026",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "Sam & Fede - 14.03.2026",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sam & Fede - 14.03.2026",
    description:
      "Te invitamos a celebrar nuestro casamiento el 14 de Marzo en Salón/Estancia, CABA.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://sam-fede.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${tangerine.variable} ${delius.variable}`}>
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
