import { DefaultSession } from "next-auth"

// This file extends the NextAuth.js types to include our custom session data.
//
// TypeScript needs to know about the extra fields we added (like "role")
// so it can provide proper autocomplete and type checking.

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}
