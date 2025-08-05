'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

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
  invitation_label: string | null;
}

interface ConfirmacionesTableProps {
  rsvps: RsvpResponse[];
}

function formatReturnTime(returnTime: string | null): string {
  if (!returnTime) return '';
  return returnTime === 'temprano' ? '00:00' : '04:30';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-AR");
}

export default function ConfirmacionesTable({ rsvps }: ConfirmacionesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRsvps = useMemo(() => {
    if (!searchTerm.trim()) return rsvps;

    const term = searchTerm.toLowerCase().trim();
    return rsvps.filter(rsvp => 
      rsvp.name.toLowerCase().includes(term) ||
      rsvp.whatsapp?.toLowerCase().includes(term) ||
      rsvp.comment?.toLowerCase().includes(term) ||
      rsvp.dietary_requirements?.toLowerCase().includes(term)
    );
  }, [rsvps, searchTerm]);

  return (
    <>
      {/* Search */}
      <Card className="rounded-xl border py-4 shadow-sm mb-6">
        <CardContent className="px-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="search" className="text-soft-gray font-light">
              <Search className="h-4 w-4" />
            </Label>
            <Input
              id="search"
              placeholder="Buscar por nombre, WhatsApp o comentario..."
              className="max-w-sm border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <span className="text-sm text-soft-gray">
                {filteredRsvps.length} de {rsvps.length} confirmaciones
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="p-3 text-left font-medium text-primary text-sm">Nombre</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">WhatsApp</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">Menor</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">Traslado</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">Horario Vuelta</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">Restricciones</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">Comentario</th>
                    <th className="p-3 text-left font-medium text-primary text-sm">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.map((rsvp, index) => (
                    <tr key={rsvp.id} className={`border-b hover:bg-gray-50 group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="p-3 font-medium text-gray-900 select-text">{rsvp.name}</td>
                      <td className="p-3 text-gray-700 select-text font-mono text-sm">
                        {rsvp.whatsapp || (rsvp.is_minor ? "Menor de edad" : "")}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rsvp.is_minor
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {rsvp.is_minor ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rsvp.needs_transfer
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {rsvp.needs_transfer ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 select-text font-mono text-sm">
                        {rsvp.return_time && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rsvp.return_time === "temprano"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {formatReturnTime(rsvp.return_time)}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-700 select-text max-w-48">
                        <div className="truncate" title={rsvp.dietary_requirements || ""}>
                          {rsvp.dietary_requirements || ""}
                        </div>
                      </td>
                      <td className="p-3 text-gray-700 select-text max-w-48">
                        <div className="truncate" title={rsvp.comment || ""}>
                          {rsvp.comment || ""}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600 text-sm select-text">
                        {formatDate(rsvp.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredRsvps.map((rsvp) => (
          <Card key={rsvp.id} className="rounded-xl border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-900 select-text">{rsvp.name}</h3>
                <span className="text-sm text-gray-500 select-text">{formatDate(rsvp.created_at)}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">WhatsApp</p>
                  <p className="text-sm text-gray-700 select-text font-mono">
                    {rsvp.whatsapp || (rsvp.is_minor ? "Menor de edad" : "—")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Menor de Edad</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rsvp.is_minor
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {rsvp.is_minor ? "Sí" : "No"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Necesita Traslado</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rsvp.needs_transfer
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {rsvp.needs_transfer ? "Sí" : "No"}
                  </span>
                </div>
                {rsvp.return_time && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Horario de Vuelta</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rsvp.return_time === "temprano"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {formatReturnTime(rsvp.return_time)}
                    </span>
                  </div>
                )}
              </div>

              {rsvp.dietary_requirements && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Restricciones Alimentarias</p>
                  <p className="text-sm text-gray-700 select-text">{rsvp.dietary_requirements}</p>
                </div>
              )}

              {rsvp.comment && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Comentario</p>
                  <p className="text-sm text-gray-700 select-text">{rsvp.comment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRsvps.length === 0 && (
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm 
                ? `No se encontraron confirmaciones que coincidan con "${searchTerm}"`
                : "No hay confirmaciones disponibles."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}