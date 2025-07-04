"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { submitRsvp } from "@/lib/actions";

interface RsvpFormProps {
  inviteId?: string;
  validInvite?: { id: string; label: string } | null;
}

export default function RsvpForm({ validInvite }: RsvpFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isMinor, setIsMinor] = useState(false);
  const [needsTransfer, setNeedsTransfer] = useState(false);

  // Don't show form if no valid invitation is provided
  if (!validInvite) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await submitRsvp(formData);

      setMessage(result.message);
      if (result.success) {
        setIsSubmitted(true);
      }
    });
  };

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-16 relative">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-handwritten text-ocean-blue mb-4">
            ¡Gracias!
          </h2>
          <p className="text-soft-gray font-light mb-6">{message}</p>
          {/* <Button
            onClick={() => {
              setIsSubmitted(false);
              setMessage("");
              setIsMinor(false);
            }}
            className="bg-ocean-blue hover:bg-sky-blue text-white font-light tracking-wide rounded-full cursor-pointer"
          >
            Confirmar Otra Asistencia
          </Button> */}
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-16 relative">
      <div className="text-center mb-8">
        <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-2">
          RSVP
        </p>
        <h2 className="text-3xl md:text-4xl font-handwritten text-ocean-blue mb-4">
          Confirmación
        </h2>
        <p className="text-soft-gray font-light">
          Por favor, confirmá tu asistencia
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden input for invitation link */}
          <input type="hidden" name="link_id" value={validInvite?.id || ""} />
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-soft-gray font-light">
              Nombre Completo
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Tu nombre completo"
              className="border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_minor"
              name="is_minor"
              checked={isMinor}
              onCheckedChange={(checked) => setIsMinor(checked as boolean)}
              className="border-2 border-ocean-blue/30 data-[state=checked]:bg-ocean-blue data-[state=checked]:border-ocean-blue"
            />
            <Label
              htmlFor="is_minor"
              className="text-sm font-light text-soft-gray"
            >
              Soy menor de edad
            </Label>
          </div>

          {!isMinor && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-soft-gray font-light">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required={!isMinor}
                  placeholder="tu@email.com"
                  className="border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-soft-gray font-light">
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required={!isMinor}
                  placeholder="Tu número de WhatsApp"
                  className="border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="dietary" className="text-soft-gray font-light">
              Restricciones Alimentarias
            </Label>
            <Textarea
              id="dietary"
              name="dietary"
              placeholder="Alergias o restricciones alimentarias"
              className="border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-soft-gray font-light">
              ¿Necesitás traslado?
            </Label>
            <RadioGroup
              name="transfer"
              defaultValue="no"
              onValueChange={(value) => setNeedsTransfer(value === "yes")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="yes"
                  id="transfer-yes"
                  className="border-2 border-ocean-blue/30 text-ocean-blue"
                />
                <Label
                  htmlFor="transfer-yes"
                  className="text-soft-gray font-light"
                >
                  Sí
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="no"
                  id="transfer-no"
                  className="border-2 border-ocean-blue/30 text-ocean-blue"
                />
                <Label
                  htmlFor="transfer-no"
                  className="text-soft-gray font-light"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {needsTransfer && (
            <div className="space-y-3">
              <Label className="text-soft-gray font-light">
                ¿Te quedás a la fiesta electrónica?
              </Label>
              <RadioGroup name="return_time" defaultValue="tarde">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="tarde"
                    id="return-late"
                    className="border-2 border-ocean-blue/30 text-ocean-blue"
                  />
                  <Label
                    htmlFor="return-late"
                    className="text-soft-gray font-light"
                  >
                    Si, me quedo hasta las 4:30
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="temprano"
                    id="return-early"
                    className="border-2 border-ocean-blue/30 text-ocean-blue"
                  />
                  <Label
                    htmlFor="return-early"
                    className="text-soft-gray font-light"
                  >
                    No, me vuelvo a las 00:00
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-soft-gray font-light">
              Comentario
            </Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Algo que quieras agregar..."
              className="border-2 border-ocean-blue/30 focus-visible:ring-ocean-blue focus-visible:border-ocean-blue font-light rounded-xl"
            />
          </div>

          {message && !isSubmitted && (
            <div className="p-3 border-2 border-red-200 bg-red-50 rounded-xl">
              <p className="text-red-700 text-sm font-light">{message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-ocean-blue hover:bg-sky-blue text-white font-light tracking-wide rounded-full cursor-pointer"
          >
            {isPending ? "Enviando..." : "Confirmar Asistencia"}
          </Button>
        </form>
      </div>
    </section>
  );
}
