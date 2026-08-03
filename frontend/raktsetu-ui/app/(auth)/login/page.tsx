"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── tiny tab state ──────────────────────────────────────────────────────────
type Tab = "otp" | "password";
type OtpStep = "phone" | "code";

// ─── helpers ─────────────────────────────────────────────────────────────────
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── sub-components ──────────────────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-600 dark:text-green-400">
      {message}
    </div>
  );
}

// ─── OTP Tab ─────────────────────────────────────────────────────────────────
function OtpTab() {
  const router = useRouter();
  const [step, setStep] = useState<OtpStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:3000";

  const handleSendOtp = () => {
    setError("");
    setSuccess("");
    const full = phone.startsWith("+") ? phone : `+91${phone}`;

    startTransition(async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/auth/request-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: full }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body?.message ?? "Failed to send OTP. Please try again.");
          return;
        }
        setSuccess("OTP sent! Check your phone.");
        setStep("code");
      } catch {
        setError("Network error. Is the backend running?");
      }
    });
  };

  const handleVerifyOtp = () => {
    setError("");
    const full = phone.startsWith("+") ? phone : `+91${phone}`;

    startTransition(async () => {
      const result = await signIn("otp", {
        phone: full,
        otp,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid OTP. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}
      {success && !error && <SuccessBanner message={success} />}

      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none text-foreground"
              htmlFor="otp-phone"
            >
              Phone Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground text-sm font-medium select-none">
                +91
              </span>
              <input
                id="otp-phone"
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-12 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              />
            </div>
          </div>
          <button
            onClick={handleSendOtp}
            disabled={isPending || phone.length < 10}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending…" : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-medium leading-none text-foreground"
                htmlFor="otp-code"
              >
                Enter OTP
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setSuccess("");
                  setError("");
                }}
                className="text-xs text-primary hover:underline"
              >
                Change number
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Sent to +91 {phone}</p>
            <input
              id="otp-code"
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm tracking-[0.5em] placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={isPending || otp.length < 6}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying…" : "Verify & Sign In"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setStep("phone");
              handleSendOtp();
            }}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
}

// ─── Password Tab ─────────────────────────────────────────────────────────────
function PasswordTab() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    setError("");
    startTransition(async () => {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid phone/email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none text-foreground"
          htmlFor="pwd-identifier"
        >
          Phone or Email
        </label>
        <input
          id="pwd-identifier"
          type="text"
          placeholder="+919876543210 or admin@example.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none text-foreground"
          htmlFor="pwd-password"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="pwd-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 pr-10 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs select-none"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={isPending || !identifier || password.length < 8}
        className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>("otp");

  return (
    <div className="border border-border/40 shadow-lg rounded-xl bg-card text-card-foreground">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your RaktSetu account
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          {(["otp", "password"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-md py-2 text-sm font-medium transition-all",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === "otp" ? "📱 OTP Login" : "🔑 Password"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-5">
        {activeTab === "otp" ? <OtpTab /> : <PasswordTab />}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-muted-foreground">
          {"Don't have an account? "}
          <a
            href="/register"
            className="text-primary hover:underline font-semibold"
          >
            Register as a donor
          </a>
        </p>
      </div>
    </div>
  );
}
