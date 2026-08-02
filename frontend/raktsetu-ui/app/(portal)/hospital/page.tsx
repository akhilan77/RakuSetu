import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function HospitalPortalPage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hospital Portal
          </h1>
          <p className="text-muted-foreground">
            Manage your hospital blood request verification queue and stock
            inventory.
          </p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded bg-success/15 text-success font-semibold border border-success/35">
          Staff Portal
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Request Verification Queue</CardTitle>
            <CardDescription>
              Approve patient cases to display verified badges to local donors.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This module displays requests awaiting hospital staff validation.
            Staff members can link requests to e-RaktKosh inventory or approve
            manually.
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Blood Bank Inventory</CardTitle>
            <CardDescription>
              Manage active stock levels for 8 blood groups.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Provides a control panel to adjust stock counts. Live stock checks
            prevent disturbing donors when stock is readily available.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
