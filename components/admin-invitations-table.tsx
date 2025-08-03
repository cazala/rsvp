"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Plus, Copy, Edit, Trash2, Check } from "lucide-react";
import {
  createInvitationLink,
  updateInvitationLink,
  deleteInvitationLink,
} from "@/lib/invitation-actions";
import { useRouter } from "next/navigation";

type InvitationLink = {
  id: string;
  label: string;
  created_at: string;
  created_by: string | null;
  rsvp_count: { count: number }[];
};

interface AdminInvitationsTableProps {
  invitations: InvitationLink[];
}

export default function AdminInvitationsTable({
  invitations,
}: AdminInvitationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const filteredInvitations = invitations.filter((invitation) =>
    invitation.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateLink = async () => {
    if (!newLabel.trim()) return;

    const result = await createInvitationLink(newLabel);
    if (result.success) {
      setNewLabel("");
      setIsCreating(false);
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  const handleUpdateLink = async (id: string) => {
    if (!editLabel.trim()) return;

    const result = await updateInvitationLink(id, editLabel);
    if (result.success) {
      setEditingId(null);
      setEditLabel("");
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  const handleDeleteLink = async (id: string, label: string) => {
    if (!confirm(`¿Estás seguro de que querés eliminar el enlace "${label}"?`))
      return;

    const result = await deleteInvitationLink(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/?invite=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4 mt-4">
          <div className="flex items-center space-x-2 flex-1">
            <Label
              htmlFor="search-invitations"
              className="text-soft-gray font-light"
            >
              <Search className="h-4 w-4" />
            </Label>
            <Input
              id="search-invitations"
              placeholder="Buscar por etiqueta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
            />
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-primary hover:bg-primary-hover text-white font-light tracking-wide rounded-full cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Crear
          </Button>
        </div>

        {isCreating && (
          <div className="mt-4 p-4 border-2 border-primary/30 rounded-xl bg-primary/5">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Etiqueta del enlace (ej: Familia García)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && handleCreateLink()}
              />
              <Button
                onClick={handleCreateLink}
                className="bg-primary hover:bg-primary-hover text-white font-light rounded-full cursor-pointer"
              >
                Crear
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewLabel("");
                }}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white rounded-full cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredInvitations.length === 0 ? (
          <p className="text-center text-soft-gray py-8">
            {searchTerm
              ? "No se encontraron resultados."
              : "Aún no hay enlaces de invitación."}
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {[
                      "Invitación",
                      "ID",
                      "Confirmaciones",
                      "Creado",
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
                  {filteredInvitations.map((invitation) => (
                    <tr
                      key={invitation.id}
                      className="border-b hover:bg-gray-50 group"
                    >
                      <td className="p-2">
                        {editingId === invitation.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleUpdateLink(invitation.id)
                              }
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateLink(invitation.id)}
                              className="bg-primary hover:bg-primary-hover text-white font-light rounded-full cursor-pointer"
                            >
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditLabel("");
                              }}
                              className="border-primary text-primary hover:bg-primary hover:text-white rounded-full cursor-pointer"
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          invitation.label
                        )}
                      </td>
                      <td className="p-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {invitation.id}
                        </code>
                      </td>
                      <td className="p-2">
                        {invitation.rsvp_count?.[0]?.count || 0}
                      </td>
                      <td className="p-2">
                        {new Date(invitation.created_at).toLocaleDateString(
                          "es-AR"
                        )}
                      </td>
                      <td className="p-2">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(invitation.id)}
                            className="bg-primary hover:bg-primary-hover text-white font-light tracking-wide rounded-full cursor-pointer flex items-center gap-2 px-3"
                          >
                            {copiedId === invitation.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            Copiar Link
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(invitation.id);
                              setEditLabel(invitation.label);
                            }}
                            className="border-primary text-primary hover:bg-primary hover:text-white rounded-full cursor-pointer p-2"
                            title="Editar etiqueta"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDeleteLink(invitation.id, invitation.label)
                            }
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full cursor-pointer p-2"
                            title="Eliminar enlace"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Invitación</div>
                      {editingId === invitation.id ? (
                        <div className="mt-1 space-y-2">
                          <Input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              handleUpdateLink(invitation.id)
                            }
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateLink(invitation.id)}
                              className="bg-primary hover:bg-primary-hover text-white font-light rounded-full cursor-pointer"
                            >
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditLabel("");
                              }}
                              className="border-primary text-primary hover:bg-primary hover:text-white rounded-full cursor-pointer"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="font-medium">{invitation.label}</div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">ID</div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
                          {invitation.id}
                        </code>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Confirmaciones</div>
                        <div className="font-medium">
                          {invitation.rsvp_count?.[0]?.count || 0}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Creado</div>
                      <div>
                        {new Date(invitation.created_at).toLocaleDateString(
                          "es-AR"
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(invitation.id)}
                        className="bg-primary hover:bg-primary-hover text-white font-light tracking-wide rounded-full cursor-pointer flex items-center gap-2 px-3"
                      >
                        {copiedId === invitation.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        Copiar Link
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(invitation.id);
                          setEditLabel(invitation.label);
                        }}
                        className="border-primary text-primary hover:bg-primary hover:text-white rounded-full cursor-pointer"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDeleteLink(invitation.id, invitation.label)
                        }
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
