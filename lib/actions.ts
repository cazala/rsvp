"use server"

import { getSupabase } from "./supabase"
import { revalidatePath } from "next/cache"
import { getSupabaseAdmin } from "./supabase-admin"

export async function submitRsvp(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const whatsapp = formData.get("whatsapp") as string
    const dietary = formData.get("dietary") as string
    const transfer = formData.get("transfer") as string
    const isMinor = formData.get("is_minor") === "on"
    const comment = formData.get("comment") as string

    if (!name) {
      return {
        success: false,
        message: "El nombre es requerido",
      }
    }

    // Email is required only for adults
    if (!isMinor && !email) {
      return {
        success: false,
        message: "El email es requerido para adultos",
      }
    }

    // Prefer the service-role key (server only, never exposed)
    const supabase = getSupabaseAdmin()

    // Create a new supabase client for server-side operations
    const { data, error } = await supabase
      .from("rsvp_responses")
      .insert({
        name: name.trim(),
        email: email?.trim().toLowerCase() || null,
        whatsapp: whatsapp?.trim() || null,
        dietary_requirements: dietary?.trim() || null,
        needs_transfer: transfer === "yes",
        is_minor: isMinor,
        comment: comment?.trim() || null,
      })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        message: "Error al guardar la confirmación. Por favor intentá de nuevo.",
      }
    }

    revalidatePath("/admin")

    return {
      success: true,
      message: "Tu confirmación ha sido recibida. ¡Esperamos celebrar con vos!",
    }
  } catch (error) {
    console.error("Server action error:", error)
    return {
      success: false,
      message: "Error inesperado. Por favor intentá de nuevo.",
    }
  }
}

export async function deleteRsvp(id: number) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase not configured. Running in demo mode.")
      return {
        success: true,
        message: "Modo demo: Confirmación eliminada.",
      }
    }

    const supabase = getSupabase()

    const { error } = await supabase.from("rsvp_responses").delete().eq("id", id)

    if (error) {
      console.error("Supabase delete error:", error)
      return {
        success: false,
        message: "Error al eliminar la confirmación.",
      }
    }

    revalidatePath("/admin")

    return {
      success: true,
      message: "Confirmación eliminada exitosamente.",
    }
  } catch (error) {
    console.error("Delete action error:", error)
    return {
      success: false,
      message: "Error inesperado al eliminar.",
    }
  }
}
