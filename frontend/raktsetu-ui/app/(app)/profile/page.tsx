"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, ShieldCheck, MapPin, Bell, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface DonorProfile {
  id: string;
  bloodGroup: string;
  gender: string;
  status: string;
  verificationTier: string;
  city: string;
  district: string;
  state: string;
  weight: number;
  dob?: string;
  user?: {
    name: string;
    phone: string;
    email?: string;
  };
}

export default function ProfilePage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Consent toggles state
  const [locationConsent, setLocationConsent] = useState(true);
  const [notificationConsent, setNotificationConsent] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

  useEffect(() => {
    async function loadProfile() {
      if (typeof window === "undefined") return;
      setLoading(true);
      const token = (session?.user as { accessToken?: string })?.accessToken;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      try {
        const res = await fetch(`${backendUrl}/api/v1/donors/me`, { headers });
        if (res.ok) {
          const resData = await res.json();
          setProfile(resData.data);
        }
      } catch {
        // Safe fallback
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [session, backendUrl]);

  const userRoles: string[] = (session?.user as { roles?: string[] })
    ?.roles || ["DONOR"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your identity card, assigned RBAC roles, and privacy consents.
        </p>
      </div>

      {/* 1. Identity Card Component */}
      <Card className="border-border/50 shadow-md bg-gradient-to-r from-primary/10 via-card to-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center font-extrabold text-xl border-2 border-primary/30 shadow-inner">
                {session?.user?.name
                  ? session.user.name.substring(0, 2).toUpperCase()
                  : "RS"}
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  {session?.user?.name || "RaktSetu User"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {(session?.user as { phone?: string })?.phone ||
                    session?.user?.email ||
                    "+91 Registered User"}
                </CardDescription>
              </div>
            </div>

            {profile && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-xs font-bold self-start sm:self-auto">
                <span>🩸 Blood Group:</span>
                <span className="text-sm font-black">
                  {profile.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-background/60 border border-border/40 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">
                Verification Badge
              </span>
              <span className="font-bold text-primary flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {profile?.verificationTier || "TIER_0"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">
                Donor Status
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {profile?.status || "Available"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">
                Location
              </span>
              <span className="font-semibold text-foreground">
                {profile
                  ? `${profile.city}, ${profile.state}`
                  : "Not registered"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">
                Weight Parameter
              </span>
              <span className="font-semibold text-foreground">
                {profile ? `${profile.weight} kg` : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Assigned RBAC Roles Card */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Assigned Platform Roles (RBAC)
          </CardTitle>
          <CardDescription>
            Multi-role credentials assigned to your user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role) => (
              <div
                key={role}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-semibold text-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Consent Toggles Card */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Privacy & Consent Toggles
          </CardTitle>
          <CardDescription>
            Configure real-time tracking & emergency alert permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-start justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/20 cursor-pointer transition-colors">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Real-Time Location Sharing</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Allows nearby emergency matching engine to locate compatible
                donors within specified range.
              </p>
            </div>
            <input
              type="checkbox"
              checked={locationConsent}
              onChange={(e) => setLocationConsent(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-input text-primary focus:ring-primary"
            />
          </label>

          <label className="flex items-start justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/20 cursor-pointer transition-colors">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Bell className="h-4 w-4 text-primary" />
                <span>Emergency SMS & Push Notifications</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Receive instant alerts when urgent blood matching requests are
                created in your district.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationConsent}
              onChange={(e) => setNotificationConsent(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-input text-primary focus:ring-primary"
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
