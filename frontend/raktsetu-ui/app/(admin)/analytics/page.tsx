"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface DonorSummary {
  totalDonors: number;
}

interface BloodGroupDistribution {
  bloodGroup: string;
  count: number;
  percentage: number;
}

interface EligibilitySummary {
  status: string;
  count: number;
  percentage: number;
}

interface GeographicDistribution {
  city: string;
  district: string;
  state: string;
  count: number;
}

interface RetentionStats {
  firstTimeDonors: number;
  repeatDonors: number;
  averageDonations: number;
  retentionRate: number;
}

interface MonthlyTrend {
  month: string;
  donationCount: number;
  uniqueDonors: number;
}

export default function AnalyticsDashboard() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [isDevData, setIsDevData] = useState(false);

  // Analytics datasets
  const [summary, setSummary] = useState<DonorSummary | null>(null);
  const [bloodGroups, setBloodGroups] = useState<BloodGroupDistribution[]>([]);
  const [eligibility, setEligibility] = useState<EligibilitySummary[]>([]);
  const [geography, setGeography] = useState<GeographicDistribution[]>([]);
  const [retention, setRetention] = useState<RetentionStats | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError("");

      const token = (session?.user as { accessToken?: string })?.accessToken;

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const [
          summaryRes,
          bloodGroupRes,
          eligibilityRes,
          geographyRes,
          retentionRes,
          monthlyRes,
        ] = await Promise.all([
          fetch(`${backendUrl}/api/v1/analytics/donors/summary`, { headers }),
          fetch(`${backendUrl}/api/v1/analytics/donors/blood-groups`, {
            headers,
          }),
          fetch(`${backendUrl}/api/v1/analytics/donors/eligibility`, {
            headers,
          }),
          fetch(`${backendUrl}/api/v1/analytics/donors/geography`, { headers }),
          fetch(`${backendUrl}/api/v1/analytics/donors/retention`, { headers }),
          fetch(`${backendUrl}/api/v1/analytics/donors/monthly`, { headers }),
        ]);

        const summaryJson = await summaryRes.json();
        const bloodGroupJson = await bloodGroupRes.json();
        const eligibilityJson = await eligibilityRes.json();
        const geographyJson = await geographyRes.json();
        const retentionJson = await retentionRes.json();
        const monthlyJson = await monthlyRes.json();

        if (summaryJson.meta?.isDevData) {
          setIsDevData(true);
        }

        setSummary(summaryJson.data || { totalDonors: 0 });
        setBloodGroups(bloodGroupJson.data || []);
        setEligibility(eligibilityJson.data || []);
        setGeography(geographyJson.data || []);
        setRetention(retentionJson.data || null);
        setMonthlyTrends(monthlyJson.data || []);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Failed to connect to analytics service.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [session, backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading donor analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-center">
        <p className="font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs underline font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Donor Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Ecosystem donor demographics, distribution, and retention metrics
          </p>
        </div>
        {isDevData && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold self-start sm:self-auto">
            <span>⚠️</span> Based on current development dataset
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Total Donors
          </p>
          <p className="text-3xl font-extrabold text-foreground">
            {summary?.totalDonors ?? 0}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Eligible Donors
          </p>
          <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">
            {eligibility.find((e) => e.status === "Eligible")?.count ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">
            {eligibility.find((e) => e.status === "Eligible")?.percentage ?? 0}%
            of total
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Retention Rate
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {retention?.retentionRate ?? 0}%
          </p>
          <p className="text-xs text-muted-foreground">
            {retention?.repeatDonors ?? 0} repeat donors
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border/50 bg-card shadow-sm space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Avg Donations / Donor
          </p>
          <p className="text-3xl font-extrabold text-foreground">
            {retention?.averageDonations ?? 0}
          </p>
        </div>
      </div>

      {/* Main Grid: Blood Groups & Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Group Distribution */}
        <div className="p-6 rounded-xl border border-border/50 bg-card shadow-sm space-y-4">
          <h2 className="text-base font-bold text-foreground">
            Blood Group Distribution
          </h2>
          <div className="space-y-3">
            {bloodGroups.map((bg) => (
              <div key={bg.bloodGroup} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground font-semibold">
                    {bg.bloodGroup.replace("_POS", "+").replace("_NEG", "-")}
                  </span>
                  <span className="text-muted-foreground">
                    {bg.count} ({bg.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(bg.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Split */}
        <div className="p-6 rounded-xl border border-border/50 bg-card shadow-sm space-y-4">
          <h2 className="text-base font-bold text-foreground">
            Eligibility Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {eligibility.map((item) => (
              <div
                key={item.status}
                className="p-4 rounded-lg bg-muted/30 border border-border/40 space-y-2 text-center"
              >
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    item.status === "Eligible" ? "bg-green-500" : "bg-amber-500"
                  }`}
                />
                <p className="text-xs font-medium text-muted-foreground">
                  {item.status}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {item.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.percentage}%
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/40">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Donor Retention Overview
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-muted/20">
                <span className="text-muted-foreground">
                  First-Time Donors:
                </span>
                <span className="font-semibold">
                  {retention?.firstTimeDonors ?? 0}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/20">
                <span className="text-muted-foreground">Repeat Donors:</span>
                <span className="font-semibold">
                  {retention?.repeatDonors ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Donation Trends */}
      <div className="p-6 rounded-xl border border-border/50 bg-card shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Monthly Donation Trends (Last 12 Months)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {monthlyTrends.map((trend) => (
            <div
              key={trend.month}
              className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-1"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                {trend.month}
              </p>
              <p className="text-lg font-extrabold text-foreground">
                {trend.donationCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  donations
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                {trend.uniqueDonors} unique donors
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Distribution Table */}
      <div className="p-6 rounded-xl border border-border/50 bg-card shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Geographic Distribution
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3 text-right">Donors Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {geography.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No geographic data available
                  </td>
                </tr>
              ) : (
                geography.map((geo, index) => (
                  <tr key={index} className="hover:bg-muted/20">
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {geo.city}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {geo.district}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {geo.state}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground">
                      {geo.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
