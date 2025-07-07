"use server";

import { getDatabase, getDatabaseAdmin } from "./database";
import { revalidatePath } from "next/cache";

export async function submitRsvp(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const dietary = formData.get("dietary") as string;
    const transfer = formData.get("transfer") as string;
    const returnTime = formData.get("return_time") as string;
    const linkId = formData.get("link_id") as string;
    const isMinor = formData.get("is_minor") === "on";
    const comment = formData.get("comment") as string;

    if (!name) {
      return {
        success: false,
        message: "El nombre es requerido",
      };
    }

    // WhatsApp is required only for adults
    if (!isMinor && !whatsapp) {
      return {
        success: false,
        message: "El WhatsApp es requerido para adultos",
      };
    }

    // Use public database client for RSVP submissions (respects RLS policies)
    const database = getDatabase();
    
    if (!database) {
      return {
        success: false,
        message: "Error de configuración de la base de datos.",
      };
    }
    const { error } = await database
      .from("rsvp_responses")
      .insert({
        name: name.trim(),
        whatsapp: whatsapp?.trim() || null,
        dietary_requirements: dietary?.trim() || null,
        needs_transfer: transfer === "yes",
        return_time: transfer === "yes" ? returnTime : null,
        link_id: linkId || null,
        is_minor: isMinor,
        comment: comment?.trim() || null,
      })
      .select();

    if (error) {
      console.error("Database error:", error);
      return {
        success: false,
        message:
          "Error al guardar la confirmación. Por favor intentá de nuevo.",
      };
    }

    revalidatePath("/admin");

    return {
      success: true,
      message: "Recibido! Te esperamos!",
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      message: "Error inesperado. Por favor intentá de nuevo.",
    };
  }
}

export async function deleteRsvp(id: number) {
  try {
    // Use admin database client for delete operations (bypasses RLS)
    const database = getDatabaseAdmin();

    if (!database) {
      return {
        success: false,
        message: "Error de configuración de la base de datos.",
      };
    }

    const { error } = await database
      .from("rsvp_responses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database delete error:", error);
      return {
        success: false,
        message: "Error al eliminar la confirmación.",
      };
    }

    revalidatePath("/admin");

    return {
      success: true,
      message: "Confirmación eliminada exitosamente.",
    };
  } catch (error) {
    console.error("Delete action error:", error);
    return {
      success: false,
      message: "Error inesperado al eliminar.",
    };
  }
}
