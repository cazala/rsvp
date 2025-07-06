import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminSession, logoutAdmin } from "@/lib/auth-actions";
import { getInvitationLinks } from "@/lib/invitation-actions";
import { redirect } from "next/navigation";
import { Users, Calendar, Car, Baby, LogOut, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportButton from "@/components/export-button";
import AdminRsvpTable from "@/components/admin-rsvp-table";
import AdminInvitationsTable from "@/components/admin-invitations-table";
import CustomTabs from "@/components/custom-tabs";

type Rsvp = {
  id: number;
  created_at: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  dietary_requirements: string | null;
  needs_transfer: boolean;
  return_time: string | null;
  is_minor: boolean;
  comment: string | null;
  link_id: string | null;
  invitation_label?: string;
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
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("rsvp_responses")
    .select(
      `
      *,
      invitation_links(label)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Admin] Supabase error:", error);
    return [];
  }

  // Transform data to include invitation label
  return (data ?? []).map((rsvp) => ({
    ...rsvp,
    invitation_label: rsvp.invitation_links?.label || null,
  }));
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
  const transfers = rsvps.filter((r) => r.needs_transfer).length;
  const returnEarly = rsvps.filter((r) => r.return_time === "temprano").length;
  const returnLate = rsvps.filter((r) => r.return_time === "tarde").length;
  const dietary = rsvps.filter((r) => r.dietary_requirements?.trim()).length;
  const minors = rsvps.filter((r) => r.is_minor).length;

  return (
    <div className="min-h-screen bg-light-blue p-8">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-handwritten text-ocean-blue mb-2">
              Panel de Administración
            </h1>
            <p className="text-soft-gray">
              Confirmaciones para el casamiento de Juanca &amp; Nuria
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ExportButton rsvps={rsvps} />
            <form action={logoutAdmin}>
              <Button
                variant="outline"
                type="submit"
                className="flex items-center gap-2 bg-transparent border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white cursor-pointer"
              >
                <LogOut className="h-5 w-5" /> Salir
              </Button>
            </form>
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
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
                <Icon className="h-6 w-6 text-ocean-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ocean-blue">
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
