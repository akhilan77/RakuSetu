// Global module augmentations for next-auth v5 (Auth.js).
// This file MUST NOT have top-level imports — they would turn it into
// a regular module and break the ambient declare module augmentations.

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      phone?: string;
      roles?: string[];
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    roles?: string[];
    phone?: string;
  }
}

declare module "@auth/core/types" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      phone?: string;
      roles?: string[];
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    roles?: string[];
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
    phone?: string;
    roles?: string[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
    phone?: string;
    roles?: string[];
  }
}
