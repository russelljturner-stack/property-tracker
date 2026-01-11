import { handlers } from "@/lib/auth"

// This file creates the API routes for NextAuth.js.
//
// The [...nextauth] folder name is special - it catches all routes under /api/auth/*
// NextAuth.js uses these routes for:
// - /api/auth/signin - Shows the login form
// - /api/auth/signout - Logs the user out
// - /api/auth/session - Gets the current session
// - /api/auth/callback/* - Handles OAuth callbacks (for Google, Microsoft, etc.)

export const { GET, POST } = handlers
