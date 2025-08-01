"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyAdminPassword } from "@/lib/auth-actions";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await verifyAdminPassword(password);

      if (result.success) {
        // Add a small delay to ensure cookie is set
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use window.location instead of router for more reliable redirect
        window.location.href = "/admin";
      } else {
        setError(result.message || "Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error al verificar la contraseña");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-handwritten text-primary">
            Panel de Administración
          </CardTitle>
          <CardDescription className="text-soft-gray">
            Ingresá la contraseña para acceder
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-soft-gray">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresá la contraseña"
                  required
                  className="border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary font-light rounded-xl"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-light tracking-wide rounded-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
