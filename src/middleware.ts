import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Middleware runs before every request to your application.
//
// This middleware checks if the user is logged in. If not, it redirects
// them to the login page. This is similar to FileMaker's privilege sets
// preventing access to certain layouts.
//
// WHAT'S PROTECTED:
// - All pages except: login, api routes, static files

export default auth((request) => {
  const isLoggedIn = !!request.auth
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isPublicFile = request.nextUrl.pathname.startsWith("/_next") ||
                       request.nextUrl.pathname.includes(".")

  // Allow API routes and public files to pass through
  if (isApiRoute || isPublicFile) {
    return NextResponse.next()
  }

  // If not logged in and trying to access a protected page, redirect to login
  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/login", request.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in and trying to access login page, redirect to home
  if (isLoggedIn && isLoginPage) {
    const homeUrl = new URL("/", request.nextUrl.origin)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
})

// Configure which routes middleware runs on
export const config = {
  // Match all paths except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
