import { getDatabaseAdmin } from '@/lib/database';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ConfirmacionesTable from "@/components/confirmaciones-table";

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic';

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
    console.error('[Confirmaciones] Database not available');
    return [];
  }
  
  // Fetch all RSVP responses
  const { data: rsvpData, error: rsvpError } = await database
    .from("rsvp_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (rsvpError) {
    console.error('[Confirmaciones] RSVP Database error:', rsvpError);
    return [];
  }

  // Fetch invitation links for labels
  const { data: invitationData, error: invitationError } = await database
    .from("invitation_links")
    .select("id, label");

  if (invitationError) {
    console.error('[Confirmaciones] Invitation Database error:', invitationError);
    return [];
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


export default async function ConfirmacionesPage() {
  const rsvps = await fetchRsvps();

  return (
    <main className="min-h-screen bg-primary-light relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-handwritten text-primary mb-2">
              Confirmaciones
            </h1>
            <p className="text-soft-gray text-sm md:text-base">
              Lista de todas las confirmaciones recibidas ({rsvps.length} confirmaciones)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/confirmaciones.csv">
              <Button className="bg-primary hover:bg-primary-hover text-white font-light tracking-wide cursor-pointer">
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV
              </Button>
            </Link>
          </div>
        </div>

        <ConfirmacionesTable rsvps={rsvps} />
      </div>
    </main>
  );
}