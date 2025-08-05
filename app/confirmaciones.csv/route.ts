import { NextResponse } from 'next/server';
import { getDatabaseAdmin } from '@/lib/database';

interface RsvpResponse {
  id: number;
  created_at: string;
  name: string;
  whatsapp: string | null;
  dietary_requirements: string | null;
  needs_transfer: boolean;
  return_time: string | null;
  is_minor: boolean;
  comment: string | null;
  link_id: string | null;
}

interface Rsvp extends RsvpResponse {
  invitation_label: string | null;
}

async function fetchRsvps(): Promise<Rsvp[]> {
  const database = getDatabaseAdmin();
  
  if (!database) {
    throw new Error('Database not available');
  }
  
  // Fetch all RSVP responses
  const { data: rsvpData, error: rsvpError } = await database
    .from("rsvp_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (rsvpError) {
    throw new Error(`Failed to fetch RSVP responses: ${rsvpError.message}`);
  }

  // Fetch invitation links for labels
  const { data: invitationData, error: invitationError } = await database
    .from("invitation_links")
    .select("id, label");

  if (invitationError) {
    throw new Error(`Failed to fetch invitation links: ${invitationError.message}`);
  }

  // Join data to include invitation labels
  const invitationMap = new Map<string, string>();
  if (invitationData) {
    (invitationData as Array<{ id: string; label: string }>).forEach((invitation) => {
      invitationMap.set(invitation.id, invitation.label);
    });
  }

  const transformedData = (rsvpData as Array<Omit<Rsvp, 'invitation_label'>>)?.map((response) => ({
    ...response,
    invitation_label: response.link_id ? invitationMap.get(response.link_id) || null : null
  })) ?? [];

  return transformedData;
}

function generateCsv(rsvps: Rsvp[]): string {
  const headers = [
    "Nombre",
    "WhatsApp", 
    "Menor de Edad",
    "Necesita Traslado",
    "Horario de Vuelta",
    "Restricciones Alimentarias",
    "Comentario",
    "Fecha de Confirmación"
  ];

  const csvContent = [
    headers.join(","),
    ...rsvps.map((rsvp) =>
      [
        `"${rsvp.name}"`,
        `"${rsvp.whatsapp || (rsvp.is_minor ? "Menor de edad" : "")}"`,
        rsvp.is_minor ? "Sí" : "No",
        rsvp.needs_transfer ? "Sí" : "No",
        rsvp.return_time ? (rsvp.return_time === "temprano" ? "00:00" : "04:30") : "",
        `"${rsvp.dietary_requirements || ""}"`,
        `"${rsvp.comment || ""}"`,
        `"${new Date(rsvp.created_at).toLocaleDateString("es-AR")}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
}

export async function GET() {
  try {
    // Fetch RSVP data
    const rsvps = await fetchRsvps();
    
    // Generate CSV content
    const csvContent = generateCsv(rsvps);
    
    // Create response with proper headers
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="confirmaciones-casamiento-${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    return response;
  } catch (error) {
    console.error('Error generating CSV:', error);
    return new NextResponse('Error generating CSV file', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}