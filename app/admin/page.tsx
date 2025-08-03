import { getDatabaseAdmin } from "@/lib/database";
import { checkAdminSession, logoutAdmin } from "@/lib/auth-actions";

// Force dynamic rendering for admin pages (uses cookies for authentication)
export const dynamic = 'force-dynamic';
import { getInvitationLinks } from "@/lib/invitation-actions";
import { redirect } from "next/navigation";
import { Users, Calendar, Car, Baby, LogOut, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportButton from "@/components/export-button";
import AdminRsvpTable from "@/components/admin-rsvp-table";
import AdminInvitationsTable from "@/components/admin-invitations-table";
import CustomTabs from "@/components/custom-tabs";

// Temporarily removed RsvpRaw type

type Rsvp = {
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
  invitation_label: string | null;
};

type InvitationLink = {
  id: string;
  label: string;
  created_at: string;
  created_by: string | null;
  rsvp_count: { count: number }[];
};

/* -------------------- data layer -------------------- */
async function fetchRsvps(): Promise<Rsvp[]> {
  const database = getDatabaseAdmin();
  if (!database) {
    console.error("[Admin] Database client not available");
    return [];
  }
  
  // First, fetch all RSVP responses
  const { data: rsvpData, error: rsvpError } = await database
    .from("rsvp_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (rsvpError) {
    console.error("[Admin] RSVP Database error:", rsvpError);
    return [];
  }

  // Then, fetch all invitation links
  const { data: invitationData, error: invitationError } = await database
    .from("invitation_links")
    .select("id, label");

  if (invitationError) {
    console.error("[Admin] Invitation Database error:", invitationError);
    return [];
  }

  // Create a map of invitation links for quick lookup
  const invitationMap = new Map<string, string>();
  if (invitationData) {
    (invitationData as Array<{ id: string; label: string }>).forEach((invitation) => {
      invitationMap.set(invitation.id, invitation.label);
    });
  }

  // Transform the data to include invitation_label
  const transformedData = (rsvpData as Array<Omit<Rsvp, 'invitation_label'>>)?.map((response) => ({
    ...response,
    invitation_label: response.link_id ? invitationMap.get(response.link_id) || null : null
  })) ?? [];

  return transformedData as Rsvp[];
}
/* ---------------------------------------------------- */

export default async function AdminPage() {
  /* 1️⃣  Auth first – only proceed if the cookie is valid */
  if (!(await checkAdminSession())) redirect("/admin/login");

  /* 2️⃣  Fetch data using service-role key (no RLS issues) */
  const [rsvps, invitations] = await Promise.all([
    fetchRsvps(),
    getInvitationLinks(),
  ]);

  const total = rsvps.length;
  const transfers = rsvps.filter((r: Rsvp) => r.needs_transfer).length;
  const returnEarly = rsvps.filter((r: Rsvp) => r.return_time === "temprano").length;
  const returnLate = rsvps.filter((r: Rsvp) => r.return_time === "tarde").length;
  const dietary = rsvps.filter((r: Rsvp) => r.dietary_requirements?.trim()).length;
  const minors = rsvps.filter((r: Rsvp) => r.is_minor).length;

  return (
    <div className="min-h-screen bg-primary-light p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-handwritten text-primary mb-2">
              Panel de Administración
            </h1>
            <p className="text-soft-gray text-sm md:text-base">
              Confirmaciones para el casamiento de Juanca &amp; Nuria
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ExportButton rsvps={rsvps} />
            <form action={logoutAdmin}>
              <Button
                variant="outline"
                type="submit"
                className="flex items-center gap-2 bg-transparent border-primary text-primary hover:bg-primary hover:text-white cursor-pointer text-sm md:text-base"
              >
                <LogOut className="h-4 w-4 md:h-5 md:w-5" /> 
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </form>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          {[
            { label: "Total Confirmados", value: total, icon: Users },
            { label: "Necesitan Traslado", value: transfers, icon: Car },
            {
              label: "Vuelta Temprano (00:00)",
              value: returnEarly,
              icon: Clock,
            },
            { label: "Vuelta Tarde (04:30)", value: returnLate, icon: Clock },
            {
              label: "Restricciones Alimentarias",
              value: dietary,
              icon: Calendar,
            },
            { label: "Menores de Edad", value: minors, icon: Baby },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* tabbed interface */}
        <CustomTabs
          defaultTab="confirmados"
          tabs={[
            {
              id: "confirmados",
              label: "Confirmados",
              content: <AdminRsvpTable rsvps={rsvps} />,
            },
            {
              id: "invitaciones",
              label: "Invitaciones",
              content: (
                <AdminInvitationsTable
                  invitations={invitations as InvitationLink[]}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
