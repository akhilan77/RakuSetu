import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Console
          </h1>
          <p className="text-muted-foreground">
            Monitor platform performance, manage user roles, and flag audit
            trails.
          </p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded bg-destructive/15 text-destructive font-semibold border border-destructive/35">
          System Admin
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>User & Block Controls</CardTitle>
            <CardDescription>
              Search and manage status flags of users and coordinates.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Enables admins to update roles or block abusive/fraudulent request
            profiles.
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>System Performance Metrics</CardTitle>
            <CardDescription>
              Track average response rates, matching windows, and user
              onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Aggregated graphs displaying platform growth and matching timelines.
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Audit & Notification Logs</CardTitle>
            <CardDescription>
              Inspect system-wide activities and SMS gateway failures.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Read-only interface querying `AuditLog` and `NotificationLog` tables
            for system debugging.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
