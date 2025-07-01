import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Only run this middleware for admin routes, excluding the login page
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.includes("/admin/login")) {
    console.log("Middleware: Checking admin access for", request.nextUrl.pathname)

    const sessionCookie = request.cookies.get("admin_session")?.value

    // If there's no session cookie, redirect to login
    if (!sessionCookie) {
      console.log("Middleware: No session cookie found, redirecting to login")
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log("Middleware: Session cookie found, allowing access")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
