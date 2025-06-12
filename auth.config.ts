import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma/prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }: { url: any, baseUrl:any }) {
      // Redirect to dashboard after successful sign in
      if (url.startsWith("/dashboard")) return url
      return `${baseUrl}/dashboard`
    },
    async session({ session, user }: { session: any, user:any }) {
      // Add user id to session
      session.user.id = user.id
      return session
    }
  },
  events: {
    async createUser({ user }: { user:any }) {
      // This runs when a new user signs up
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          // Add any additional user data you want to store
          welcomeEmailSent: false 
        }
      })
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
}