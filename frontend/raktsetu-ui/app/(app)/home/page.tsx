import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to RaktSetu real-time donor interface.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h4 className="text-sm font-medium">Eligible Donors</h4>
            <span className="text-2xl">🩸</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              Active in Vellore pilot
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h4 className="text-sm font-medium">Live Requests</h4>
            <span className="text-2xl">🚨</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h4 className="text-sm font-medium">Fulfillment Rate</h4>
            <span className="text-2xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Average match in 15 mins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h4 className="text-sm font-medium">Saved Lives</h4>
            <span className="text-2xl">💖</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,892</div>
            <p className="text-xs text-muted-foreground">
              Total verified donations
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Welcome to RaktSetu</CardTitle>
          <CardDescription>
            Real-time blood donation matching engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This dashboard will soon display your eligibility countdown ring,
          availability toggles, nearby emergency notifications, and verification
          metrics.
        </CardContent>
      </Card>
    </div>
  );
}
