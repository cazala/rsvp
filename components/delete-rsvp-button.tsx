"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRsvp } from "@/lib/actions";

interface DeleteRsvpButtonProps {
  id: number;
  name: string;
}

export default function DeleteRsvpButton({ id, name }: DeleteRsvpButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteRsvp(id);
      if (result.success) {
        setShowConfirm(false);
      } else {
        alert(result.message);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-xs text-red-600">Vuela??</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
          className="h-6 px-2 text-xs"
        >
          {isPending ? "..." : "Sí"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="h-6 px-2 text-xs"
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      title={`Eliminar confirmación de ${name}`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
