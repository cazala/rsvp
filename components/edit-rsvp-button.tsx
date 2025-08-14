"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditRsvpDialog from "@/components/edit-rsvp-dialog";

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

interface EditRsvpButtonProps {
  rsvp: Rsvp;
}

export default function EditRsvpButton({ rsvp }: EditRsvpButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsDialogOpen(true)}
        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer"
        title={`Editar confirmación de ${rsvp.name}`}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <EditRsvpDialog
        rsvp={rsvp}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}