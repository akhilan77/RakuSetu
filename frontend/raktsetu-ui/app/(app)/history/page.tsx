import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Donation History
        </h1>
        <p className="text-muted-foreground">
          View your past contributions and download certificates.
        </p>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Completed Donations</CardTitle>
          <CardDescription>
            Records of your verified life-saving contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This module displays past donation dates, recipient tracking, and
            verifies status badges.
          </p>
          <p className="text-sm text-muted-foreground">
            For each verified donation, a link will trigger the generation of a
            custom PDF certificate complete with a public verification QR code
            URL.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
