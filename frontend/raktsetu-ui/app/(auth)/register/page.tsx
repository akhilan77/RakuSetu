import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <Card className="border-border/40 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Register as a Donor
        </CardTitle>
        <CardDescription className="text-center">
          Join our ecosystem to save lives in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-foreground"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none text-foreground"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground text-sm font-medium">
              +91
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="98765 43210"
              className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none text-foreground"
              htmlFor="bloodGroup"
            >
              Blood Group
            </label>
            <select
              id="bloodGroup"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select</option>
              <option value="A_POS">A+</option>
              <option value="A_NEG">A-</option>
              <option value="B_POS">B+</option>
              <option value="B_NEG">B-</option>
              <option value="O_POS">O+</option>
              <option value="O_NEG">O-</option>
              <option value="AB_POS">AB+</option>
              <option value="AB_NEG">AB-</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none text-foreground"
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
        <Button className="w-full font-semibold">Start Onboarding</Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-xs text-muted-foreground text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            Login
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
