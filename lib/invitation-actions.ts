"use server";

import { getDatabaseAdmin } from "./database";
import { revalidatePath } from "next/cache";

// Generate a secure 8-character ID for invitation links
function generateInvitationId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function createInvitationLink(label: string) {
  try {
    if (!label.trim()) {
      return {
        success: false,
        message: "La etiqueta es requerida",
      };
    }

    const database = getDatabaseAdmin();
    if (!database) {
      return {
        success: false,
        message: "Error de configuración de la base de datos",
      };
    }
    
    let attempts = 0;
    const maxAttempts = 5;

    // Generate unique ID with collision checking
    while (attempts < maxAttempts) {
      const id = generateInvitationId();
      
      // Check if ID already exists
      const { data: existing } = await database
        .from("invitation_links")
        .select("id")
        .eq("id", id)
        .single();

      if (!existing) {
        // ID is unique, create the link
        const { error } = await database
          .from("invitation_links")
          .insert({
            id,
            label: label.trim(),
            created_by: "admin", // Could be enhanced to track actual admin user
          });

        if (error) {
          console.error("Error creating invitation link:", error);
          return {
            success: false,
            message: "Error al crear el enlace de invitación",
          };
        }

        revalidatePath("/admin");
        return {
          success: true,
          message: "Enlace de invitación creado exitosamente",
          linkId: id,
        };
      }

      attempts++;
    }

    return {
      success: false,
      message: "Error generando ID único. Intenta nuevamente.",
    };
  } catch (error) {
    console.error("Error in createInvitationLink:", error);
    return {
      success: false,
      message: "Error interno del servidor",
    };
  }
}

export async function getInvitationLinks() {
  try {
    const database = getDatabaseAdmin();
    if (!database) {
      console.error("Database client not available");
      return [];
    }
    
    // Temporary: Use simple query to debug Neon provider
    const { data, error } = await database
      .from("invitation_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invitation links:", error);
      return [];
    }

    // Temporary: Add fake rsvp_count for compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any[]) || []).map((link: any) => ({
      ...link,
      rsvp_count: [{ count: 0 }] // Fake count for now
    }));
  } catch (error) {
    console.error("Error in getInvitationLinks:", error);
    return [];
  }
}

export async function updateInvitationLink(id: string, label: string) {
  try {
    if (!label.trim()) {
      return {
        success: false,
        message: "La etiqueta es requerida",
      };
    }

    const database = getDatabaseAdmin();
    if (!database) {
      return {
        success: false,
        message: "Error de configuración de la base de datos",
      };
    }
    
    const { error } = await database
      .from("invitation_links")
      .update({ label: label.trim() })
      .eq("id", id);

    if (error) {
      console.error("Error updating invitation link:", error);
      return {
        success: false,
        message: "Error al actualizar el enlace",
      };
    }

    revalidatePath("/admin");
    return {
      success: true,
      message: "Enlace actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error in updateInvitationLink:", error);
    return {
      success: false,
      message: "Error interno del servidor",
    };
  }
}

export async function deleteInvitationLink(id: string) {
  try {
    const database = getDatabaseAdmin();
    if (!database) {
      return {
        success: false,
        message: "Error de configuración de la base de datos",
      };
    }
    
    // Check if link has associated RSVPs
    const { data: rsvps } = await database
      .from("rsvp_responses")
      .select("id")
      .eq("link_id", id)
      .limit(1);

    if (rsvps && (rsvps as unknown[]).length > 0) {
      return {
        success: false,
        message: "No se puede eliminar un enlace con confirmaciones asociadas",
      };
    }

    const { error } = await database
      .from("invitation_links")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting invitation link:", error);
      return {
        success: false,
        message: "Error al eliminar el enlace",
      };
    }

    revalidatePath("/admin");
    return {
      success: true,
      message: "Enlace eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error in deleteInvitationLink:", error);
    return {
      success: false,
      message: "Error interno del servidor",
    };
  }
}

export async function validateInvitationLink(id: string) {
  try {
    if (!id) return { valid: false };

    const database = getDatabaseAdmin();
    if (!database) return { valid: false };
    
    const { data, error } = await database
      .from("invitation_links")
      .select("id, label")
      .eq("id", id)
      .single();

    if (error || !data) {
      return { valid: false };
    }

    return { 
      valid: true, 
      link: data as { id: string; label: string }
    };
  } catch (error) {
    console.error("Error in validateInvitationLink:", error);
    return { valid: false };
  }
}

