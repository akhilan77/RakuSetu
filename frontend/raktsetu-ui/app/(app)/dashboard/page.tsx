"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Heart,
  Activity,
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Award,
} from "lucide-react";
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
}

interface OverviewData {
  donors: {
    totalDonors: number;
  };
  requests: {
    totalRequests: number;
    activeRequests: number;
    fulfilledRequests: number;
    cancelledRequests: number;
  };
}

export default function DashboardPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

  useEffect(() => {
    async function loadDashboardData() {
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
        const getFetch = (url: string) =>
          fetch(url, { headers }).then(
            (res) => (res.ok ? res.json() : null),
            () => null,
          );

        const [pData, oData] = await Promise.all([
          getFetch(`${backendUrl}/api/v1/donors/me`),
          getFetch(`${backendUrl}/api/v1/analytics/overview`),
        ]);

        if (pData?.data) setProfile(pData.data);
        if (oData?.data) setOverview(oData.data);
      } catch {
        // Ignore offline network errors
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [session, backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-background border border-primary/20 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {session?.user?.name || "Donor"}!
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
              ● Active
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            RaktSetu Real-Time Emergency Response & Blood Donation Dashboard
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95"
          >
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            <span>Create SOS Request</span>
          </Link>
          {!profile && (
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm shadow-sm hover:bg-muted transition-all"
            >
              <span>Register as Donor</span>
            </Link>
          )}
        </div>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Live Blood Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">
              {overview?.requests?.activeRequests ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active in real-time matching
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Network Donors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {overview?.donors?.totalDonors ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Verified donors registered
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Fulfilled Requests
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              {overview?.requests?.fulfilledRequests ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Emergency blood matches saved
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Donor Status
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">
              {profile ? profile.status : "Guest"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile
                ? `${profile.city}, ${profile.state}`
                : "Complete onboarding"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Section: Donor Profile Card & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile / Onboarding Card */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Your Donor Passport
                </CardTitle>
                <CardDescription>
                  Personal blood donation parameters & verification tier
                </CardDescription>
              </div>
              {profile && (
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                  {profile.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border border-border/40 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Blood Type
                  </span>
                  <span className="font-bold text-sm text-foreground">
                    {profile.bloodGroup
                      .replace("_POS", "+")
                      .replace("_NEG", "-")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Gender
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {profile.gender.toLowerCase()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Weight
                  </span>
                  <span className="font-semibold text-foreground">
                    {profile.weight} kg
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    City / District
                  </span>
                  <span className="font-semibold text-foreground">
                    {profile.city}, {profile.district}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Verification Tier
                  </span>
                  <span className="font-semibold text-primary">
                    {profile.verificationTier}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Availability
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {profile.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-3">
                <Heart className="h-8 w-8 text-primary mx-auto" />
                <div>
                  <h4 className="font-bold text-foreground">
                    Complete Your Donor Profile
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Register your blood group, weight, and location to receive
                    live emergency match alerts.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all"
                >
                  Complete Onboarding Now →
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Next Eligibility Check:
                Eligible Now
              </span>
              <Link
                href="/profile"
                className="text-primary font-semibold hover:underline"
              >
                Edit Profile →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation / Ecosystem Actions */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Quick Navigation
            </CardTitle>
            <CardDescription>Direct platform shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/search"
              className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-all text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Find Nearby Donors</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>

            <Link
              href="/history"
              className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-all text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Donation History</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-all text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>Ecosystem Analytics</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
