"use client";

import type React from "react";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitRsvp } from "@/lib/actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RsvpFormProps {
  inviteId?: string;
  validInvite?: { id: string; label: string } | null;
}

export default function RsvpForm({ validInvite }: RsvpFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isMinor, setIsMinor] = useState(false);
  const [dietaryRestriction, setDietaryRestriction] = useState("");
  const [allergyText, setAllergyText] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [needsTransfer, setNeedsTransfer] = useState(false);

  // Wedding date and deadline calculation
  const WEDDING_DATE = "2026-03-14T18:00:00";
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
          <h2 className="text-3xl md:text-4xl font-delius text-primary mb-4">
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
          <h2 className="text-3xl font-delius text-primary mb-4">
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
        <h2 className="text-3xl md:text-4xl font-delius text-primary mb-4">
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

          {/* {needsTransfer && (
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
          )} */}

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
                className={`text-sm font-medium ${daysLeft > 15 ? "text-black" : "text-red-500"
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

      <div className="absolute opacity-25 left-1/2 top-0 right-auto w-60 h-60 -ml-30 -mt-38 md:ml-auto md:mt-0 md:right-0 md:-mr-40 md:top-90 md:w-80 md:h-80">
        <svg version="1.1" viewBox="0 0 500 500" fill="currentColor"
          className="text-primary"
          style={{
            width: "100%",
            height: "100%",
          }}>
          <path d="M204.1,157.1c-.8-.2-1.4,0-1.6.9-3.7,13.2-9.6,25.3-17.8,36.3-.6.7-.6,1.3.1,1.9.7.6,1.3.5,1.9-.1,11.8-13.3,18.4-37.3,18.4-37.4.2-.8,0-1.4-.9-1.6Z" />
          <path d="M191.4,172.6c-.8-.2-1.4,0-1.6.9-2.2,7.9-5.8,15.2-10.7,21.8-.6.7-.5,1.3.1,1.8s1.3.5,1.8-.1c5.2-6.9,8.9-14.5,11.2-22.8.2-.8,0-1.4-.9-1.6Z" />
          <path d="M98.7,284.2c-4.1,5.1-7.5,10.6-10.1,16.6-2.6,5.4-4.7,11.1-6.3,16.9-.2.8.1,1.4,1,1.6s1.4-.1,1.6-1c1.5-5.7,3.6-11.2,6.1-16.4,2.5-5.8,5.7-11.1,9.6-15.9.6-.7.5-1.3-.1-1.8-.6-.6-1.3-.5-1.8.1Z" />
          <path d="M494.3,247c.5-1.7,0-2.7-1.7-3.3l-223.3-70.5h-.2c-1.7-.6-2.8,0-3.3,1.7l-9.1,29.1-32.6-73.1c-.7-1.6-1.9-2-3.5-1.3L7.2,225.6h0c-1.6.7-2,1.9-1.3,3.5l54.8,117.6c.7,1.6,1.9,2,3.5,1.3l172.1-78.5-9.2,29.2c-.5,1.7,0,2.7,1.7,3.3l221.7,68.6c1.7.5,2.8,0,3.3-1.7l40.5-121.8h0,0ZM402.7,289c13.5,17.3,23.6,30.3,43.6,74.8l-210.2-65.1c9.1-4,17.3-7.9,24.7-11.3,23.4-11,40.3-18.8,64.8-23.9,5.1,7.1,9.6,13.1,12.7,17.1,0,0,.2,0,.2.2.6,2.4,1.1,4.7,2.1,7.4,2.8,7.2,6.2,14.2,10.2,20.9h0c.9,1.4,2.1,1.8,3.6.9,8.2-5.3,15.5-11.6,22.2-18.6,8.1-1.3,16.2-3,24.2-4.9l2,2.5ZM375.9,284.7c-.7.8-1.6,1.5-2.3,2.3-.1.1-.3.2-.4.4-5.9,6.1-12.2,11.7-19.2,16.6-3.3-5.6-6-11.5-8.4-17.6-4.8-13.5-4.1-22.3-1.2-26.9.8-1.3,1.8-2.3,3.2-3,1.1-.6,2.3-.7,3.5-.5,3.5.8,5.9,2.9,7,6.4,1.9,3.9,2.7,8,2.4,12.3-.2,1.3.3,2.3,1.5,2.8,1.2.5,2.3.3,3.1-.7.7-.8,8.9-9.9,14.7-7.8.9.3,1.7.7,2.3,1.4,1.1,1.1,1,2.9,0,5.1-1.6,3.5-3.8,6.6-6.4,9.4ZM382.4,285c1.8-2.4,3.5-4.9,4.7-7.7,2.1-3.8,1.7-7.3-1.1-10.6-1.2-1.2-2.7-2.1-4.3-2.7-6.3-1.2-11.7.5-16.1,5.2-.5-3.1-1.3-6-2.6-8.9-1.9-5.3-5.6-8.4-11.1-9.5-2.3-.3-4.5,0-6.6,1-2.2,1.1-4,2.8-5.3,4.9-1.9,3.1-3.1,7.6-2.9,13.4-18-24.2-53.5-75.4-63.8-90.1l212.7,67.1c-15.2,9.5-31.3,17.1-48.4,22.7-17.9,6.8-36.3,11.8-55.2,15.2ZM13.5,233c14.6,3.5,59.2,13.9,91,20.9-14.2,19.8-21.4,36.7-31.2,60-3.1,7.4-6.7,15.7-10.6,24.6L13.5,233ZM166.7,233.1c-.3-2.9-.7-5.8-1.6-8.6-1-4.2-3.7-6.6-8-7.1-1.8-.1-3.4.2-5,.9-5.5,3.3-8.3,8.2-8.5,14.5-2.4-1.9-5.1-3.6-7.9-4.9-5-2.7-9.9-2.6-14.7.3-1.9,1.3-3.4,3-4.2,5.2-.9,2.3-1.1,4.7-.6,7.2.7,3.6,2.8,7.7,6.7,11.9-29.7-6.1-90.5-20.4-108.1-24.5l203.3-91.4c-4.9,17.1-11.7,33.4-20.6,48.9-8.7,16.9-19.1,32.6-30.7,47.6ZM121.3,239.7c-.3-1.5-.2-2.9.3-4.3.5-1.2,1.2-2.1,2.3-2.8,3.2-1.8,6.4-1.7,9.5,0,4.1,1.6,7.4,4.1,10.1,7.5.7,1.2,1.8,1.5,3.1,1.1,1.3-.4,1.9-1.3,1.8-2.7,0-1.6,0-13.2,5.6-15.4.8-.4,1.7-.5,2.7-.5,1.5.1,2.7,1.5,3.5,3.7,1.1,3.6,1.7,7.4,1.6,11.2,0,1.1-.2,2.1-.2,3.2,0,.2,0,.4,0,.6-.3,8.4-1.2,16.8-3.1,25.1-6.2-2-12.3-4.5-18.1-7.5-12.7-6.8-18.1-13.8-19.1-19.2ZM78.1,315.9c10-23.7,17.2-40.7,31.9-60.8,8.6,1.8,15.9,3.4,21,4.3,0,0,0,0,0,0,2,1.4,4.2,2.8,6.7,4.1,6.9,3.5,14.1,6.4,21.5,8.7h0s0,0,0,0c1.7.5,2.8,0,3.3-1.7,2.4-9.4,3.6-18.9,3.9-28.6,5.1-6.3,9.8-13,14.4-19.7l3.4.6c21.8,3.9,38.1,6.9,82.9,26.6l-200,91.3c4.1-9.1,7.6-17.4,10.7-24.8ZM185.5,217.8l-.9-.2c6.3-9.6,12.2-19.4,17.5-29.7,8.7-15.2,15.5-31.3,20.4-48l46.6,104.5c-44.9-19.7-61.5-22.8-83.6-26.7ZM275.1,251.7c1.6-.7,2.1-1.8,1.3-3.4l-16.5-37,8.9-28.4c8.5,12.3,34.5,49.7,53.4,76-23.9,5.3-40.7,13-63.7,23.8-7.3,3.4-15.5,7.2-24.5,11.2l8.6-27.4,32.4-14.8ZM450.9,361c-20-44.5-30.3-57.7-44-75.3l-.5-.7c11.2-2.9,22.2-6.3,33-10.4,16.8-5.5,32.6-12.9,47.6-22.1l-36,108.5Z" />
          <polygon points="350.8 309 350.8 309 350.8 309 350.8 309" />
          <path d="M461.8,253.1c-.5-.7-1.1-.9-1.8-.4-11.7,7.4-24.3,12.4-37.8,15.1-.9,0-1.3.6-1.2,1.5.1.9.6,1.3,1.5,1.1,17.8-2.1,38.8-15.5,38.9-15.5.8-.5.9-1.1.4-1.8Z" />
          <path d="M441.8,256.2c-.5-.7-1.1-.9-1.8-.4-7,4.4-14.5,7.4-22.6,9.1-.9.1-1.2.6-1.1,1.4.1.8.6,1.2,1.4,1.1,8.5-1.7,16.4-4.8,23.7-9.5.7-.5.9-1.1.4-1.8Z" />
          <path d="M279,283.1c-5.6,2.3-11,5.1-16.1,8.4-.7.5-.8,1.1-.3,1.8s1.1.8,1.8.3c5-3.2,10.2-5.9,15.6-8.1,5.7-2.6,11.7-4.4,17.9-5.4.9-.1,1.3-.6,1.2-1.4-.1-.9-.6-1.2-1.5-1.1-6.5,1-12.7,2.9-18.7,5.6Z" />
        </svg>
      </div>
    </section>
  );
}
