import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Protect all routes except auth routes, static assets, and next internals
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
