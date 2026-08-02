import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Find Donors
        </h1>
        <p className="text-muted-foreground">
          Search available compatible donors within a coordinate radius.
        </p>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Donor Compatibility Search</CardTitle>
          <CardDescription>
            Enter parameters to query compatible donors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This module will integrate with Google Maps Geocoding and the
            PostGIS backend endpoint (`/donors/search`). It will perform
            compatible blood group expansion and list matches fuzzed to 1km
            grids to protect donor privacy.
          </p>
          <div className="h-40 w-full rounded-md bg-muted flex items-center justify-center border border-border border-dashed">
            <span className="text-muted-foreground text-sm font-medium">
              Google Map View Placeholder
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
