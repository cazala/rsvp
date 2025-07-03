export const WEDDING_CONFIG = {
  // Event date and time (ISO format)
  date:
    process.env.WEDDING_DATE ||
    process.env.NEXT_PUBLIC_WEDDING_DATE ||
    "2025-11-08T16:00:00",

  // Event details
  title: "Casamiento Nuria & Juanca",
  venue: {
    name: "Estancia Lupita",
    address:
      "Gral. Viamonte 2298, B1669 Del Viso, Provincia de Buenos Aires, Argentina",
    googleMapsUrl: "https://maps.app.goo.gl/wdKEnfEndLM1GVc89",
    directionsUrl: "https://maps.app.goo.gl/r6qtgTfT874Kxta78",
  },

  // Couple names
  couple: {
    name1: "Juanca",
    name2: "Nuria",
  },
} as const;

// Helper function to get the wedding date
export function getWeddingDate(): Date {
  return new Date(WEDDING_CONFIG.date);
}

// Helper function to format the wedding date
export function getFormattedWeddingDate(): string {
  const date = getWeddingDate();
  const rawDate = date.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
}
