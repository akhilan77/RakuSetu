import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function RequestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-primary">
          Emergency Request
        </h1>
        <p className="text-muted-foreground">
          Request emergency blood units and trigger wave-dispatch notifications.
        </p>
      </div>

      <Card className="border-destructive/30 shadow-md">
        <CardHeader>
          <CardTitle>Create SOS Dispatch</CardTitle>
          <CardDescription>
            Initiate a wave-based notification sequence for local donors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This screen will provide a simple three-step form: Select required
            blood group, select units needed, and pick a hospital or enter
            custom coordinates.
          </p>
          <p className="text-sm text-muted-foreground">
            Upon submitting, the system triggers the backend wave-dispatch
            queue. It ranks donors based on compatibility, distance, and
            reliability before launching Wave 1 push and SMS alerts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
