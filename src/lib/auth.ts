import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "./db"

// This file configures NextAuth.js for authentication.
//
// HOW IT WORKS:
// 1. User submits email and password on the login form
// 2. The "authorize" function below checks the credentials
// 3. If valid, NextAuth creates a session (like FileMaker's login)
// 4. The session is stored in a cookie, so the user stays logged in
//
// CREDENTIALS PROVIDER:
// This uses email/password authentication. You can add other providers
// later (Google, Microsoft, etc.) by adding them to the providers array.

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Use Prisma to store sessions and accounts in the database
  adapter: PrismaAdapter(db),

  // Trust the host header from the request (needed for Railway/Vercel deployment)
  // This allows NextAuth to work behind proxies and load balancers
  trustHost: true,

  // Use JWT strategy (stores session in browser cookie, not database)
  // This is simpler and works well for most applications
  session: {
    strategy: "jwt",
  },

  // Configure what appears on the login page
  pages: {
    signIn: "/login",  // Custom login page (we'll create this)
  },

  // Authentication providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // This function runs when a user tries to log in
      async authorize(credentials) {
        // Check that email and password were provided
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Find the user in the database
        const user = await db.user.findUnique({
          where: { email },
          include: { role: true },
        })

        // If no user found, or no password set, reject
        if (!user || !user.passwordHash) {
          return null
        }

        // Check if the user account is active
        if (!user.isActive) {
          return null
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.passwordHash)

        if (!passwordMatch) {
          return null
        }

        // Update last login time
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        // Return user data (this becomes the session)
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role?.name,
        }
      },
    }),
  ],

  // Callbacks let us customise the session data
  callbacks: {
    // Add custom data to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },

    // Add custom data to the session (available in components)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
})
