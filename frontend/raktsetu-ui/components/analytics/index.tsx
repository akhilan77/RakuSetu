import React from "react";
import { AlertCircle } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  colorClass?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  colorClass = "bg-red-500/10 text-red-500",
}: KpiCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
      <div className={`p-3 rounded-xl ${colorClass}`}>{icon}</div>
      <div>
        <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
          {title}
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {value !== undefined ? value : "0"}
        </div>
      </div>
    </div>
  );
}

interface AnalyticsCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function AnalyticsCard({ title, icon, children }: AnalyticsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

interface ChartContainerProps {
  heightClass?: string;
  children: React.ReactNode;
}

export function ChartContainer({
  heightClass = "h-80",
  children,
}: ChartContainerProps) {
  return <div className={`w-full ${heightClass}`}>{children}</div>;
}

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No data available at this time.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
      <AlertCircle className="h-8 w-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"></div>
        <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"
          ></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl"></div>
      </div>
    </div>
  );
}
