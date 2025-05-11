import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import Resend from "next-auth/providers/resend"
import CredentialsProvider from "next-auth/providers/credentials";

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Resend({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      name: "Email"
    })
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }),
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  // debug: true
})
