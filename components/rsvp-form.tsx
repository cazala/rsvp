"use client";

import type React from "react";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [dietaryRestriction, setDietaryRestriction] = useState("");
  const [allergyText, setAllergyText] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Wedding date and deadline calculation
  const WEDDING_DATE = "2025-11-08T16:00:00";
  const CUTOFF_DAYS = 30;

  useEffect(() => {
    const calculateDaysLeft = () => {
      const weddingDate = new Date(WEDDING_DATE);
      const cutoffDate = new Date(weddingDate);
      cutoffDate.setDate(cutoffDate.getDate() - CUTOFF_DAYS);

      const now = new Date();
      const timeDiff = cutoffDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      setDaysLeft(daysRemaining);
      setIsExpired(daysRemaining <= 0);
    };

    calculateDaysLeft();
    // Update daily
    const interval = setInterval(calculateDaysLeft, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't show form if no valid invitation is provided
  if (!validInvite) {
    return null;
  }

  // Show expired message if past deadline
  if (isExpired) {
    return (
      <section id="rsvp" className="py-16 relative">
        <div className="text-center mb-8">
          <p className="text-sm text-primary font-light tracking-[0.2em] uppercase mb-2">
            RSVP
          </p>
          <h2 className="text-3xl md:text-4xl font-handwritten text-primary mb-4">
            Confirmación
          </h2>
        </div>

        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-red-200 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-handwritten text-red-600 mb-4">
            Lo siento
          </h2>
          <p className="text-soft-gray font-light mb-4">
            Esta invitación ya expiró. El período para confirmar asistencia
            finalizó el 9 de octubre de 2025.
          </p>
          <p className="text-sm text-soft-gray font-light">
            Si tenés dudas, contactanos por WhatsApp.
          </p>
        </div>
      </section>
    );
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
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-primary rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-handwritten text-primary mb-4">
            ¡Gracias!
          </h2>
          <p className="text-soft-gray font-light mb-6">{message}</p>
          {/* <Button
            onClick={() => {
              setIsSubmitted(false);
              setMessage("");
              setIsMinor(false);
            }}
            className="bg-primary hover:bg-primary-hover text-white font-light tracking-wide rounded-full cursor-pointer"
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
        <p className="text-sm text-primary font-light tracking-[0.2em] uppercase mb-2">
          RSVP
        </p>
        <h2 className="text-3xl md:text-4xl font-handwritten text-primary mb-4">
          Confirmación
        </h2>
        <p className="text-soft-gray font-light">
          Por favor, confirmá tu asistencia
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-primary rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-soft-gray font-light">
              Nombre Completo
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Tu nombre completo"
              className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_minor"
              name="is_minor"
              checked={isMinor}
              onCheckedChange={(checked) => setIsMinor(checked as boolean)}
              className="border-2 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="is_minor"
              className="text-sm font-light text-soft-gray"
            >
              Soy menor de edad
            </Label>
          </div>

          {/* Hidden input for invitation link */}
          <input type="hidden" name="link_id" value={validInvite?.id || ""} />

          {!isMinor && (
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
                className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dietary" className="text-soft-gray font-light">
              Restricciones Alimentarias
            </Label>
            <Select
              value={dietaryRestriction}
              onValueChange={setDietaryRestriction}
            >
              <SelectTrigger className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin Restricciones</SelectItem>
                <SelectItem value="Vegetariano">Vegetariano</SelectItem>
                <SelectItem value="Vegano">Vegano</SelectItem>
                <SelectItem value="Celiaco">Celíaco</SelectItem>
                <SelectItem value="Alergico">Alérgico (Especificar)</SelectItem>
              </SelectContent>
            </Select>

            {/* Hidden input for form submission */}
            <input
              type="hidden"
              name="dietary"
              value={
                dietaryRestriction === "Alergico" && allergyText
                  ? `Alergico: ${allergyText}`
                  : dietaryRestriction === "none"
                  ? ""
                  : dietaryRestriction
              }
            />

            {/* Conditional allergy specification input */}
            {dietaryRestriction === "Alergico" && (
              <div className="space-y-2 mt-2">
                <Input
                  id="allergy-text"
                  value={allergyText}
                  onChange={(e) => setAllergyText(e.target.value)}
                  placeholder="Alergias"
                  className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-soft-gray font-light">
              ¿Querés usar el servicio de combis?
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
                  className="border-2 border-primary/30 text-primary"
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
                  className="border-2 border-primary/30 text-primary"
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
                    className="border-2 border-primary/30 text-primary"
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
                    className="border-2 border-primary/30 text-primary"
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
              className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
            />
          </div>

          {message && !isSubmitted && (
            <div className="p-3 border-2 border-red-200 bg-red-50 rounded-xl">
              <p className="text-red-700 text-sm font-light">{message}</p>
            </div>
          )}
          {/* Days left warning */}
          {daysLeft !== null && daysLeft > 0 && (
            <div className="mt-4 text-center">
              <p
                className={`text-sm font-medium ${
                  daysLeft > 15 ? "text-black" : "text-red-500"
                }`}
              >
                Te {daysLeft === 1 ? "queda" : "quedan"}{" "}
                <span
                  style={{ color: daysLeft > 15 ? "#fa05de" : "#ff0000" }}
                  className="font-bold"
                >
                  {daysLeft}
                </span>{" "}
                {daysLeft === 1 ? "día" : "días"} para confirmar
              </p>
            </div>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary-hover text-white font-light tracking-wide rounded-full cursor-pointer"
          >
            {isPending ? "Enviando..." : "Confirmar Asistencia"}
          </Button>
        </form>
      </div>
    </section>
  );
}
