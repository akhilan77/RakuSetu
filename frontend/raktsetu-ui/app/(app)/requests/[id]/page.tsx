import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function RequestTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Track SOS Request
        </h1>
        <p className="text-muted-foreground">
          Monitoring active donor matching process.
        </p>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Dispatch Progress Timeline</CardTitle>
          <CardDescription>Live updates from matching engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Currently tracking request ID:{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
              {params?.id || "loading-uuid"}
            </code>
          </p>
          <p className="text-sm text-muted-foreground">
            This tracking view will feature a vertical timeline component
            plotting the wave notifications (e.g., Wave 1 notified, Wave 2
            escalations, acceptances, donor arrival confirmation, and donation
            logging).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
