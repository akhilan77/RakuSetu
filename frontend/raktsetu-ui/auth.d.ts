import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      phone?: string;
      roles?: string[];
    } & DefaultSession["user"];
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
    } & DefaultSession["user"];
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
