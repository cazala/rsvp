export const WEDDING_CONFIG = {
  // Event date and time (ISO format)
  date:
    process.env.WEDDING_DATE ||
    process.env.NEXT_PUBLIC_WEDDING_DATE ||
    "2026-03-14T18:00:00",

  // Event details
  title: "Casamiento Sam & Fede",
  venue: {
    name: "Salón/Estancia",
    address:
      "Direccion 123, CABA",
    googleMapsUrl: "https://maps.app.goo.gl/pzUYPNgXcw7WPZqf7",
    directionsUrl: "https://maps.app.goo.gl/r6qtgTfT874Kxta78",
  },

  // Couple names
  couple: {
    name1: "Sam",
    name2: "Fede",
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
