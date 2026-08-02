import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your donor credentials, availability, and privacy settings.
        </p>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Donor Eligibility & Settings</CardTitle>
          <CardDescription>
            Configure notifications, snoozes, and check verification badges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This module controls your availability switch (Available,
            Unavailable, Snoozed). It also outlines DPDP privacy options,
            permitting the export or deletion of personal identifiers.
          </p>
          <p className="text-sm text-muted-foreground">
            Here you can upload credentials to elevate your profile from Tier 0
            to a verified Tier 1 donor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
