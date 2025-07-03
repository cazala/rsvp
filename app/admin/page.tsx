import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminSession, logoutAdmin } from "@/lib/auth-actions";
import { redirect } from "next/navigation";
import { Users, Calendar, Car, Baby, LogOut, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportButton from "@/components/export-button";
import DeleteRsvpButton from "@/components/delete-rsvp-button";

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
};

/* -------------------- data layer -------------------- */
async function fetchRsvps(): Promise<Rsvp[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("rsvp_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Admin] Supabase error:", error);
    return [];
  }
  return data ?? [];
}
/* ---------------------------------------------------- */

export default async function AdminPage() {
  /* 1️⃣  Auth first – only proceed if the cookie is valid */
  if (!(await checkAdminSession())) redirect("/admin/login");

  /* 2️⃣  Fetch RSVP data using service-role key (no RLS issues) */
  const rsvps = await fetchRsvps();

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
            { label: "Total Invitados", value: total, icon: Users },
            { label: "Necesitan Traslado", value: transfers, icon: Car },
            { label: "Vuelta Temprano (00:00)", value: returnEarly, icon: Clock },
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

        {/* table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-handwritten text-ocean-blue">
              Confirmaciones Recibidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rsvps.length === 0 ? (
              <p className="text-center text-soft-gray py-8">
                Aún no hay confirmaciones.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {[
                        "Nombre",
                        "Email",
                        "WhatsApp",
                        "Menor",
                        "Traslado",
                        "Horario Vuelta",
                        "Restricciones",
                        "Comentario",
                        "Fecha",
                        "Acciones",
                      ].map((h) => (
                        <th
                          key={h}
                          className="p-2 text-left font-medium text-ocean-blue"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b hover:bg-gray-50 group"
                      >
                        <td className="p-2">{r.name}</td>
                        <td className="p-2">
                          {r.email ?? (
                            <span className="italic text-gray-400">–</span>
                          )}
                        </td>
                        <td className="p-2">
                          {r.whatsapp ?? (
                            <span className="italic text-gray-400">–</span>
                          )}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              r.is_minor
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {r.is_minor ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              r.needs_transfer
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {r.needs_transfer ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="p-2">
                          {r.return_time ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                r.return_time === "temprano"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {r.return_time === "temprano" ? "00:00" : "04:30"}
                            </span>
                          ) : (
                            <span className="italic text-gray-400">–</span>
                          )}
                        </td>
                        <td
                          className="p-2 max-w-xs truncate"
                          title={r.dietary_requirements ?? ""}
                        >
                          {r.dietary_requirements || "-"}
                        </td>
                        <td
                          className="p-2 max-w-xs truncate"
                          title={r.comment ?? ""}
                        >
                          {r.comment || "-"}
                        </td>
                        <td className="p-2">
                          {new Date(r.created_at).toLocaleDateString("es-AR")}
                        </td>
                        <td className="p-2">
                          <DeleteRsvpButton id={r.id} name={r.name} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
