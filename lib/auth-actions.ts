"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { encrypt, decrypt } from "./crypto"

// Get the admin password from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "wedding2025"

// Session duration in seconds (24 hours)
const SESSION_DURATION = 24 * 60 * 60

export async function verifyAdminPassword(password: string) {
  try {
    console.log("Verifying admin password...")

    // Simple password check - NO DATABASE INVOLVED
    if (password !== ADMIN_PASSWORD) {
      console.log("Password mismatch")
      return {
        success: false,
        message: "Contraseña incorrecta",
      }
    }

    console.log("Password verified successfully")

    // Create a session token with expiration
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = now + SESSION_DURATION

    // Create a session object
    const session = {
      authenticated: true,
      expiresAt,
    }

    // Encrypt the session data
    const encryptedSession = await encrypt(JSON.stringify(session))
    console.log("Session encrypted, setting cookie...")

    // Set the session cookie
    cookies().set("admin_session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    })

    console.log("Cookie set successfully")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      success: false,
      message: "Error de autenticación",
    }
  }
}

export async function checkAdminSession() {
  try {
    console.log("Checking admin session...")

    // Get the session cookie
    const sessionCookie = cookies().get("admin_session")?.value

    if (!sessionCookie) {
      console.log("No session cookie found")
      return false
    }

    // Decrypt the session data
    const decryptedSession = await decrypt(sessionCookie)
    const session = JSON.parse(decryptedSession)

    // Check if session is valid and not expired
    const now = Math.floor(Date.now() / 1000)
    if (!session.authenticated || session.expiresAt < now) {
      console.log("Session expired or invalid")
      return false
    }

    console.log("Session valid")
    return true
  } catch (error) {
    console.error("Session verification error:", error)
    return false
  }
}

export async function logoutAdmin() {
  cookies().delete("admin_session")
  redirect("/admin/login")
}
