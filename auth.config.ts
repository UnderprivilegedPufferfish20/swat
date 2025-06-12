import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma/prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request additional scopes for more user information
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }: { url: any, baseUrl: any }) {
      // Redirect to dashboard after successful sign in
      if (url.startsWith("/dashboard")) return url
      return `${baseUrl}/dashboard`
    },
    async session({ session, user }: { session: any, user: any }) {
      // Add user id to session
      session.user.id = user.id
      return session
    },
    async signIn({ user, account, profile }: { user: any, account: any, profile: any }) {
      // This callback runs every time a user signs in
      // We can use this to update user info from the latest profile data
      if (account?.provider === "google" && profile) {
        try {
          await prisma.user.upsert({
            where: { email: profile.email },
            update: {
              name: profile.name,
              image: profile.picture,
              emailVerified: profile.email_verified ? new Date() : null,
            },
            create: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              emailVerified: profile.email_verified ? new Date() : null,
            },
          })
        } catch (error) {
          console.error("Error updating user profile:", error)
          // Don't prevent sign in if profile update fails
        }
      }
      return true
    }
  },
  events: {
    async createUser({ user }: { user: any }) {
      // This runs when a new user signs up
      console.log("New user created:", user.id, user.email)
      
      // You can add any additional logic here for new users
      // For example, sending a welcome email, creating default user preferences, etc.
      
      // Example: Log the new user creation
      try {
        // Add any additional user setup logic here
        console.log(`Welcome new user: ${user.name} (${user.email})`)
      } catch (error) {
        console.error("Error in createUser event:", error)
      }
    },
    async signIn({ user, account, profile }: { user: any, account: any, profile?: any }) {
      // This runs every time a user signs in (including existing users)
      console.log(`User signed in: ${user.email}`)
      
      // You can add analytics tracking, login logging, etc. here
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}