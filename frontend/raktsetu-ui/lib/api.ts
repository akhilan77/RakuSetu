import { auth } from "../auth";
import { getSession } from "next-auth/react";
import "../auth.d.ts";

const isServer = typeof window === "undefined";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Dynamically retrieves the active accessToken from the session,
 * whether execution is on the Server or Client.
 */
async function getAccessToken(): Promise<string | undefined> {
  if (isServer) {
    try {
      const session = (await auth()) as any;
      return session?.accessToken;
    } catch (error) {
      console.error("Failed to get server session:", error);
      return undefined;
    }
  } else {
    try {
      const session = (await getSession()) as any;
      return session?.accessToken;
    } catch (error) {
      console.error("Failed to get client session:", error);
      return undefined;
    }
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Custom fetch client that handles headers, query params, and Auth token injections.
 */
export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(cleanPath, `${BASE_URL}/`);

  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      url.searchParams.append(key, val);
    });
  }

  const token = await getAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorBody = "";
    try {
      errorBody = await response.text();
    } catch {
      // Ignore
    }
    throw new Error(
      `API error ${response.status}: ${errorBody || response.statusText}`,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
