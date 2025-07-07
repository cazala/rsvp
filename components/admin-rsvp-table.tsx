"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DeleteRsvpButton from "@/components/delete-rsvp-button";
import { Search } from "lucide-react";

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

interface AdminRsvpTableProps {
  rsvps: Rsvp[];
}

export default function AdminRsvpTable({ rsvps }: AdminRsvpTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRsvps = rsvps.filter((rsvp) =>
    rsvp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Label htmlFor="search-rsvp" className="text-soft-gray font-light">
            <Search className="h-4 w-4" />
          </Label>
          <Input
            id="search-rsvp"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredRsvps.length === 0 ? (
          <p className="text-center text-soft-gray py-8">
            {searchTerm
              ? "No se encontraron resultados."
              : "Aún no hay confirmaciones."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[
                    "Nombre",
                    "WhatsApp",
                    "Menor",
                    "Traslado",
                    "Horario Vuelta",
                    "Restricciones",
                    "Comentario",
                    "Invitación",
                    "Fecha",
                    "Acciones",
                  ].map((h) => (
                    <th
                      key={h}
                      className="p-2 text-left font-medium text-primary"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50 group">
                    <td className="p-2">{r.name}</td>
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
                      {r.dietary_requirements || "–"}
                    </td>
                    <td
                      className="p-2 max-w-xs truncate"
                      title={r.comment ?? ""}
                    >
                      {r.comment || "–"}
                    </td>
                    <td className="p-2">
                      {r.invitation_label ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {r.invitation_label}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">–</span>
                      )}
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
  );
}
