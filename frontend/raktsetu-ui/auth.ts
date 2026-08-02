import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import "./auth.d.ts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        const backendUrl =
          process.env.BACKEND_API_URL || "http://localhost:5000";

        try {
          const res = await fetch(`${backendUrl}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: credentials.phone,
              otp: credentials.otp,
            }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          // We expect data to have a token and user structure, e.g.:
          // { token: string, user: { id: string, name: string, phone: string, roles: string[] } }
          if (data && data.token && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              phone: data.user.phone,
              roles: data.user.roles,
              accessToken: data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      const u = user as any;
      const t = token as any;
      if (u) {
        t.accessToken = u.accessToken;
        t.id = u.id;
        t.phone = u.phone;
        t.roles = u.roles;
      }
      return t;
    },
    async session({ session, token }) {
      const s = session as any;
      const t = token as any;
      if (t) {
        s.accessToken = t.accessToken;
        if (s.user) {
          s.user.id = t.id;
          s.user.phone = t.phone;
          s.user.roles = t.roles;
        }
      }
      return s;
    },
  },
  pages: {
    signIn: "/login",
  },
});
