import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card className="border-border/40 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your phone number to sign in with OTP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <Button className="w-full font-semibold">Send OTP</Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-xs text-muted-foreground text-center">
          {"Don't have an account?"}
          <a
            href="/register"
            className="text-primary hover:underline font-semibold"
          >
            Register as a donor
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
