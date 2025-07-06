"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Copy,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  createInvitationLink,
  updateInvitationLink,
  deleteInvitationLink,
  toggleInvitationLinkStatus,
} from "@/lib/invitation-actions";
import { useRouter } from "next/navigation";

type InvitationLink = {
  id: string;
  label: string;
  created_at: string;
  created_by: string | null;
  is_active: boolean;
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

  const handleToggleStatus = async (id: string) => {
    const result = await toggleInvitationLinkStatus(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/?invite=${id}`;
    navigator.clipboard.writeText(url);
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
              className="max-w-sm border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
            />
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-ocean-blue hover:bg-sky-blue text-white font-light tracking-wide rounded-full cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Crear
          </Button>
        </div>

        {isCreating && (
          <div className="mt-4 p-4 border-2 border-ocean-blue/30 rounded-xl bg-ocean-blue/5">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Etiqueta del enlace (ej: Familia García)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && handleCreateLink()}
              />
              <Button
                onClick={handleCreateLink}
                className="bg-ocean-blue hover:bg-sky-blue text-white font-light rounded-full cursor-pointer"
              >
                Crear
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewLabel("");
                }}
                variant="outline"
                className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white rounded-full cursor-pointer"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[
                    "Etiqueta",
                    "ID",
                    "Estado",
                    "Confirmaciones",
                    "Creado",
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
                            className="border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              handleUpdateLink(invitation.id)
                            }
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdateLink(invitation.id)}
                            className="bg-ocean-blue hover:bg-sky-blue text-white font-light rounded-full cursor-pointer"
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
                            className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white rounded-full cursor-pointer"
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
                      <Badge
                        variant={invitation.is_active ? "default" : "secondary"}
                        className={
                          invitation.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {invitation.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-ocean-blue/10 text-ocean-blue">
                        {invitation.rsvp_count?.[0]?.count || 0}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(invitation.created_at).toLocaleDateString(
                        "es-AR"
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(invitation.id)}
                          className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white rounded-full cursor-pointer p-2"
                          title="Copiar enlace"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(invitation.id);
                            setEditLabel(invitation.label);
                          }}
                          className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white rounded-full cursor-pointer p-2"
                          title="Editar etiqueta"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(invitation.id)}
                          className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white rounded-full cursor-pointer p-2"
                          title={
                            invitation.is_active ? "Desactivar" : "Activar"
                          }
                        >
                          {invitation.is_active ? (
                            <ToggleRight className="h-3 w-3" />
                          ) : (
                            <ToggleLeft className="h-3 w-3" />
                          )}
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
        )}
      </CardContent>
    </Card>
  );
}
