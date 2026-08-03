import type { NextAuthConfig } from "next-auth";

/**
 * Lightweight auth config — edge-compatible (no Node.js-only APIs).
 * Used by middleware.ts which runs in the Edge Runtime.
 * Full NextAuth instance (with providers) lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers are added in auth.ts — not needed in the edge middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");

      if (isOnLoginPage) {
        // If already logged in, redirect away from login
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // All other routes require authentication
      return isLoggedIn;
    },
  },
};
