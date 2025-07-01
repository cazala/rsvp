"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyAdminPassword } from "@/lib/auth-actions"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await verifyAdminPassword(password)

      if (result.success) {
        // Add a small delay to ensure cookie is set
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Use window.location instead of router for more reliable redirect
        window.location.href = "/admin"
      } else {
        setError(result.message || "Contraseña incorrecta")
      }
    } catch (err) {
      setError("Error al verificar la contraseña")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f7f5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-handwritten text-[#9b8579]">Panel de Administración</CardTitle>
          <CardDescription>Ingresá la contraseña para acceder</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresá la contraseña"
                  required
                  className="border-[#d4c1b7] focus-visible:ring-[#9b8579]"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#9b8579] hover:bg-[#8a7668]" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
