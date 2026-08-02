"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../../lib/api";
import {
  Users,
  Activity,
  Heart,
  Globe,
  TrendingUp,
  Calendar,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

interface DonorSummary {
  totalDonors: number;
}

interface BloodGroupItem {
  bloodGroup: string;
  count: number;
  percentage: number;
}

interface EligibilityItem {
  status: string;
  count: number;
  percentage: number;
}

interface GeographyItem {
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

interface MonthlyTrendItem {
  month: string;
  donationCount: number;
  uniqueDonors: number;
}

interface MetaInfo {
  generatedAt: string;
  isDevData: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: MetaInfo;
}

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6b7280",
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "donors">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DonorSummary | null>(null);
  const [bloodGroups, setBloodGroups] = useState<BloodGroupItem[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityItem[]>([]);
  const [geography, setGeography] = useState<GeographyItem[]>([]);
  const [retention, setRetention] = useState<RetentionStats | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendItem[]>([]);
  const [isDevData, setIsDevData] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, bgRes, eligRes, geoRes, retRes, trendRes] =
        await Promise.all([
          apiClient<ApiResponse<DonorSummary>>(
            "/api/v1/analytics/donors/summary",
          ),
          apiClient<ApiResponse<BloodGroupItem[]>>(
            "/api/v1/analytics/donors/blood-groups",
          ),
          apiClient<ApiResponse<EligibilityItem[]>>(
            "/api/v1/analytics/donors/eligibility",
          ),
          apiClient<ApiResponse<GeographyItem[]>>(
            "/api/v1/analytics/donors/geography",
          ),
          apiClient<ApiResponse<RetentionStats>>(
            "/api/v1/analytics/donors/retention",
          ),
          apiClient<ApiResponse<MonthlyTrendItem[]>>(
            "/api/v1/analytics/donors/monthly",
          ),
        ]);

      setSummary(summaryRes.data);
      setBloodGroups(bgRes.data);
      setEligibility(eligRes.data);
      setGeography(geoRes.data);
      setRetention(retRes.data);
      setMonthlyTrends(trendRes.data);
      setIsDevData(summaryRes.meta.isDevData);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to fetch healthcare analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        void fetchAnalytics();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-slate-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-200 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 animate-pulse rounded-xl"></div>
          <div className="h-80 bg-slate-200 animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6" />
          <span className="font-semibold">{error}</span>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          <RotateCw className="h-4 w-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Dev Data Alert Banner */}
      {isDevData && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl p-4 flex items-center space-x-3 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-semibold">Development Mode:</span> Showing
            simulated/sandbox metrics. Based on current development dataset.
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Healthcare Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time donor pool stats, regional coverage, and retention
            performance.
          </p>
        </div>
        <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-900/50 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "overview"
                ? "bg-white dark:bg-slate-800 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("donors")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "donors"
                ? "bg-white dark:bg-slate-800 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            Donor Attributes
          </button>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Metrics row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Total Donors
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {summary?.totalDonors}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Repeat Donors
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {retention?.repeatDonors}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Avg Donations / Donor
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {retention?.averageDonations}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Retention Rate
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {retention?.retentionRate}%
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart row */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-bold tracking-tight">
                Monthly Donation Trends (Last 12 Months)
              </h2>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="donationCount"
                    name="Donations"
                    stroke="#ef4444"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueDonors"
                    name="Unique Donors"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geography aggregation row */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center space-x-2">
              <Globe className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-bold tracking-tight">
                Geographic Coverage distribution
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800/60">
                  <tr>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">District</th>
                    <th className="px-6 py-4">State</th>
                    <th className="px-6 py-4 text-right">Donors Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {geography.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-slate-400"
                      >
                        No geographic data available. Add geocoded profiles.
                      </td>
                    </tr>
                  ) : (
                    geography.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition"
                      >
                        <td className="px-6 py-4 font-semibold">{item.city}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {item.district}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {item.state}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-red-500">
                          {item.count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Donors Attributes Tab Content */}
      {activeTab === "donors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blood group Pie chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
            <h2 className="text-lg font-bold tracking-tight">
              Blood Group Mix Distribution
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodGroups}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="bloodGroup"
                  >
                    {bloodGroups.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Eligibility status Bar chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
            <h2 className="text-lg font-bold tracking-tight">
              Donor Eligibility Analytics
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eligibility}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Donors Count"
                    radius={[8, 8, 0, 0]}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
