"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateRsvp } from "@/lib/actions";
import { X } from "lucide-react";

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

interface EditRsvpDialogProps {
  rsvp: Rsvp;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditRsvpDialog({ rsvp, isOpen, onClose }: EditRsvpDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [needsTransfer, setNeedsTransfer] = useState(rsvp.needs_transfer);
  const [isMinor, setIsMinor] = useState(rsvp.is_minor);

  // Reset state when rsvp changes
  useEffect(() => {
    setNeedsTransfer(rsvp.needs_transfer);
    setIsMinor(rsvp.is_minor);
    setMessage("");
  }, [rsvp, isOpen]);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await updateRsvp(rsvp.id, formData);
        setMessage(result.message);
        if (result.success) {
          setTimeout(() => {
            onClose();
            setMessage("");
          }, 1500);
        }
      } catch (error) {
        console.error("Edit form error:", error);
        setMessage("Error inesperado al actualizar la confirmación.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-handwritten text-primary">
            Editar Confirmación
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium text-primary">
                Nombre *
              </Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={rsvp.name}
                required
                className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
              />
            </div>

            {/* Minor Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_minor"
                name="is_minor"
                checked={isMinor}
                onCheckedChange={(checked) => setIsMinor(checked === true)}
              />
              <Label
                htmlFor="edit-is_minor"
                className="text-sm font-medium text-primary cursor-pointer"
              >
                Es menor de edad
              </Label>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="edit-whatsapp" className="text-sm font-medium text-primary">
                WhatsApp {!isMinor && "*"}
              </Label>
              <Input
                id="edit-whatsapp"
                name="whatsapp"
                type="tel"
                defaultValue={rsvp.whatsapp || ""}
                className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
              />
            </div>

            {/* Transfer Question */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">
                ¿Necesitás traslado? *
              </Label>
              <RadioGroup name="transfer" value={needsTransfer ? "yes" : "no"} onValueChange={(value) => setNeedsTransfer(value === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="edit-transfer-yes" />
                  <Label htmlFor="edit-transfer-yes" className="cursor-pointer">
                    Sí, necesito traslado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="edit-transfer-no" />
                  <Label htmlFor="edit-transfer-no" className="cursor-pointer">
                    No, tengo movilidad propia
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Return Time (always present, conditionally visible) */}
            <div className={`space-y-3 ${needsTransfer ? "" : "hidden"}`}>
              <Label className="text-sm font-medium text-primary">
                ¿A qué hora preferís volver? *
              </Label>
              <RadioGroup name="return_time" defaultValue={rsvp.return_time || "temprano"}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="temprano" id="edit-return-early" />
                  <Label htmlFor="edit-return-early" className="cursor-pointer">
                    00:00 (temprano)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tarde" id="edit-return-late" />
                  <Label htmlFor="edit-return-late" className="cursor-pointer">
                    04:30 (tarde)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dietary Requirements */}
            <div className="space-y-2">
              <Label htmlFor="edit-dietary" className="text-sm font-medium text-primary">
                Restricciones alimentarias
              </Label>
              <Textarea
                id="edit-dietary"
                name="dietary"
                defaultValue={rsvp.dietary_requirements || ""}
                className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                placeholder="Ejemplo: vegetariano, celíaco, alérgico a..."
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="edit-comment" className="text-sm font-medium text-primary">
                Comentario adicional
              </Label>
              <Textarea
                id="edit-comment"
                name="comment"
                defaultValue={rsvp.comment || ""}
                className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                placeholder="Cualquier cosa que quieras decirnos..."
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`text-sm ${message.includes("exitosamente") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-light tracking-wide cursor-pointer"
              >
                {isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}