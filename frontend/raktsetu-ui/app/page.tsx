import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Hospital,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div className="max-w-xl space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
            <Heart className="h-10 w-10 fill-primary animate-pulse" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            RaktSetu
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A real-time, PostGIS-powered emergency blood donation matching and
            coordination system.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Auth Card */}
          <Link
            href="/login"
            className="flex flex-col items-center justify-center p-6 bg-card hover:bg-muted/50 border border-border rounded-lg shadow-sm hover:shadow transition-all duration-200 group text-center"
          >
            <ShieldCheck className="h-8 w-8 text-primary group-hover:scale-105 transition-transform" />
            <h3 className="mt-3 font-bold text-foreground">
              Authentication Flow
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              OTP Login & Onboarding Wizard
            </p>
          </Link>

          {/* App Dashboard */}
          <Link
            href="/home"
            className="flex flex-col items-center justify-center p-6 bg-card hover:bg-muted/50 border border-border rounded-lg shadow-sm hover:shadow transition-all duration-200 group text-center"
          >
            <LayoutDashboard className="h-8 w-8 text-primary group-hover:scale-105 transition-transform" />
            <h3 className="mt-3 font-bold text-foreground">
              Donor Application
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              App Shell, SOS & Radius Search
            </p>
          </Link>

          {/* Hospital Portal */}
          <Link
            href="/hospital"
            className="flex flex-col items-center justify-center p-6 bg-card hover:bg-muted/50 border border-border rounded-lg shadow-sm hover:shadow transition-all duration-200 group text-center"
          >
            <Hospital className="h-8 w-8 text-primary group-hover:scale-105 transition-transform" />
            <h3 className="mt-3 font-bold text-foreground">Hospital Portal</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Verification Queue & Inventory
            </p>
          </Link>

          {/* Admin Dashboard */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center p-6 bg-card hover:bg-muted/50 border border-border rounded-lg shadow-sm hover:shadow transition-all duration-200 group text-center"
          >
            <Settings className="h-8 w-8 text-primary group-hover:scale-105 transition-transform" />
            <h3 className="mt-3 font-bold text-foreground">Admin Console</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              User Management & Audit Logs
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
