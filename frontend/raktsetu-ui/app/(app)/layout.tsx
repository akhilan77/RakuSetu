"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, AlertOctagon, History, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "SOS Request", href: "/request", icon: AlertOctagon, isSos: true },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link
            href="/home"
            className="flex items-center gap-2 font-bold text-lg text-primary"
          >
            <Heart className="h-6 w-6 fill-primary" />
            <span>RaktSetu</span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  item.isSos
                    ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm mt-4"
                    : isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-5 w-5", item.isSos ? "animate-pulse" : "")}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile Summary */}
        <div className="p-4 border-t border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                Akhil Donor
              </p>
              <p className="text-xs text-muted-foreground truncate">
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top Header for Mobile */}
        <header className="flex md:hidden h-14 items-center justify-between px-4 border-b border-border bg-card sticky top-0 z-40">
          <Link
            href="/home"
            className="flex items-center gap-1.5 font-bold text-primary"
          >
            <Heart className="h-5 w-5 fill-primary" />
            <span>RaktSetu</span>
          </Link>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            AD
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-card items-center justify-around px-2 z-50 shadow-lg">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isSos) {
            // Render Oversized Centered SOS button on Mobile
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border-4 border-background hover:bg-primary/95 transition-all duration-200 z-50 hover:scale-105 active:scale-95"
              >
                <Icon className="h-6 w-6 animate-pulse" />
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
