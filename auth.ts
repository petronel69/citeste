import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import Resend from "next-auth/providers/resend"
import CredentialsProvider from "next-auth/providers/credentials";

import postgres from 'postgres';
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  theme: {
    colorScheme: "light"
  },
  providers: [
    Resend({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      name: "Email",
    }),
    Resend({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      name: "Demo login",
      async sendVerificationRequest({ identifier: email, url, token, provider, request }) {
        const { host } = new URL(url)
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Demo sign in to ${host}`,
            html: `\n\n${url}\n\n`,
            text: `\n\n${url}\n\n`,
          }),
        })
      }
    })
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }),
  callbacks: {
    authorized: async ({ auth, request }) => {
      return !!auth
    },
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
  // debug: true
})
