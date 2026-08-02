"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../../lib/api";
import {
  Users,
  Activity,
  Heart,
  Globe,
  Calendar,
  AlertTriangle,
  RotateCw,
  GitPullRequest,
  CheckCircle,
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
import {
  KpiCard,
  AnalyticsCard,
  ChartContainer,
  EmptyState,
  LoadingState,
} from "../../../components/analytics";

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

interface MonthlyTrendItem {
  month: string;
  donationCount: number;
  uniqueDonors: number;
}

interface DemandSummary {
  totalRequests: number;
  activeRequests: number;
  fulfilledRequests: number;
  cancelledRequests: number;
}

interface DemandBloodGroupItem {
  bloodGroup: string;
  requests: number;
  percentage: number;
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
  const [activeTab, setActiveTab] = useState<"overview" | "demand">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Donor and general stats
  const [summary, setSummary] = useState<DonorSummary | null>(null);
  const [bloodGroups, setBloodGroups] = useState<BloodGroupItem[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityItem[]>([]);
  const [geography, setGeography] = useState<GeographyItem[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendItem[]>([]);

  // Demand stats
  const [demandSummary, setDemandSummary] = useState<DemandSummary | null>(
    null,
  );
  const [bloodGroupDemand, setBloodGroupDemand] = useState<
    DemandBloodGroupItem[]
  >([]);

  const [isDevData, setIsDevData] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        summaryRes,
        bgRes,
        eligRes,
        geoRes,
        trendRes,
        demandSumRes,
        demandBgRes,
      ] = await Promise.all([
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
        apiClient<ApiResponse<MonthlyTrendItem[]>>(
          "/api/v1/analytics/donors/monthly",
        ),
        apiClient<ApiResponse<DemandSummary>>(
          "/api/v1/analytics/demand/summary",
        ),
        apiClient<ApiResponse<DemandBloodGroupItem[]>>(
          "/api/v1/analytics/demand/blood-groups",
        ),
      ]);

      setSummary(summaryRes.data);
      setBloodGroups(bgRes.data);
      setEligibility(eligRes.data);
      setGeography(geoRes.data);
      setMonthlyTrends(trendRes.data);
      setDemandSummary(demandSumRes.data);
      setBloodGroupDemand(demandBgRes.data);

      setIsDevData(summaryRes.meta.isDevData || demandSumRes.meta.isDevData);
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
    return <LoadingState />;
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

  const hasDonationTrends = monthlyTrends.some((t) => t.donationCount > 0);
  const hasBloodGroups = bloodGroups.some((g) => g.count > 0);
  const hasDemandGroup = bloodGroupDemand.some((d) => d.requests > 0);

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
            onClick={() => setActiveTab("demand")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "demand"
                ? "bg-white dark:bg-slate-800 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`}
          >
            Demand Trends
          </button>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Metrics row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard
              title="Total Donors"
              value={summary?.totalDonors}
              icon={<Users className="h-6 w-6" />}
              colorClass="bg-red-500/10 text-red-500"
            />
            <KpiCard
              title="Total Requests"
              value={demandSummary?.totalRequests}
              icon={<GitPullRequest className="h-6 w-6" />}
              colorClass="bg-blue-500/10 text-blue-500"
            />
            <KpiCard
              title="Active Requests"
              value={demandSummary?.activeRequests}
              icon={<Activity className="h-6 w-6" />}
              colorClass="bg-amber-500/10 text-amber-500"
            />
            <KpiCard
              title="Fulfilled Requests"
              value={demandSummary?.fulfilledRequests}
              icon={<CheckCircle className="h-6 w-6" />}
              colorClass="bg-emerald-500/10 text-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood group Pie chart */}
            <AnalyticsCard
              title="Blood Group Distribution"
              icon={<Users className="h-5 w-5 text-slate-400" />}
            >
              {hasBloodGroups ? (
                <ChartContainer heightClass="h-72">
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
                </ChartContainer>
              ) : (
                <EmptyState message="No donor profiles available to analyze." />
              )}
            </AnalyticsCard>

            {/* Eligibility status Bar chart */}
            <AnalyticsCard
              title="Donor Eligibility Status"
              icon={<Heart className="h-5 w-5 text-slate-400" />}
            >
              {summary && summary.totalDonors > 0 ? (
                <ChartContainer heightClass="h-72">
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
                </ChartContainer>
              ) : (
                <EmptyState message="No donor profiles available to calculate eligibility." />
              )}
            </AnalyticsCard>
          </div>

          {/* Line Chart row */}
          <AnalyticsCard
            title="Monthly Donation Trends (Last 12 Months)"
            icon={<Calendar className="h-5 w-5 text-slate-400" />}
          >
            {hasDonationTrends ? (
              <ChartContainer>
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
              </ChartContainer>
            ) : (
              <EmptyState message="No donation history records found for the past year." />
            )}
          </AnalyticsCard>

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

      {/* Demand Tab Content */}
      {activeTab === "demand" && (
        <div className="space-y-6">
          {/* KPI Metrics row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard
              title="Total Requests"
              value={demandSummary?.totalRequests}
              icon={<GitPullRequest className="h-6 w-6" />}
              colorClass="bg-blue-500/10 text-blue-500"
            />
            <KpiCard
              title="Active Requests"
              value={demandSummary?.activeRequests}
              icon={<Activity className="h-6 w-6" />}
              colorClass="bg-amber-500/10 text-amber-500"
            />
            <KpiCard
              title="Fulfilled Requests"
              value={demandSummary?.fulfilledRequests}
              icon={<CheckCircle className="h-6 w-6" />}
              colorClass="bg-emerald-500/10 text-emerald-500"
            />
            <KpiCard
              title="Cancelled Requests"
              value={demandSummary?.cancelledRequests}
              icon={<RotateCw className="h-6 w-6" />}
              colorClass="bg-slate-500/10 text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood group demand chart */}
            <AnalyticsCard
              title="Request Distribution by Blood Group"
              icon={<GitPullRequest className="h-5 w-5 text-slate-400" />}
            >
              {hasDemandGroup ? (
                <ChartContainer heightClass="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bloodGroupDemand}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="bloodGroup"
                        stroke="#94a3b8"
                        fontSize={12}
                      />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Bar
                        dataKey="requests"
                        name="Requests Count"
                        radius={[8, 8, 0, 0]}
                      >
                        {bloodGroupDemand.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <EmptyState message="No requests recorded yet to view demand patterns." />
              )}
            </AnalyticsCard>

            {/* Demand Summary Card list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold tracking-tight">
                Demand Pipeline Stats
              </h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">Total Pipeline</span>
                  <span className="font-bold">
                    {demandSummary?.totalRequests}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">
                    Active Requests (Matched/Searching)
                  </span>
                  <span className="font-bold text-amber-500">
                    {demandSummary?.activeRequests}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">
                    Completed Fulfilled Requests
                  </span>
                  <span className="font-bold text-emerald-500">
                    {demandSummary?.fulfilledRequests}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-slate-500">
                    Cancelled / Terminated Requests
                  </span>
                  <span className="font-bold text-slate-400">
                    {demandSummary?.cancelledRequests}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
