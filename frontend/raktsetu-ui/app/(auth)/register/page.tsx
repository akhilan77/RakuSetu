"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4; // 4 is success screen

export default function RegisterPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  // Registration result
  const [registrationResult, setRegistrationResult] = useState<{
    donorId: string;
    eligibility: string;
    donorNumberInCity: number;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    dob: "",
    gender: "MALE",
    weight: 60,
    bloodGroup: "O_POS",
    city: "Vellore",
    district: "Vellore",
    state: "Tamil Nadu",
    latitude: 12.9272,
    longitude: 79.1304,
    locationConsent: true,
    notificationConsent: true,
  });

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dob || !formData.weight) {
      setError("Please fill out all required personal details.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.district || !formData.state) {
      setError("Please fill out all location fields.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6)),
          }));
        },
        () => {
          setError("Could not auto-detect location. Used default coordinates.");
        },
      );
    }
  };

  const handleSubmit = () => {
    setError("");
    startTransition(async () => {
      try {
        const token = (session?.user as { accessToken?: string })?.accessToken;

        const res = await fetch(`${backendUrl}/api/v1/donors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            ...formData,
            weight: Number(formData.weight),
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
          }),
        });

        const resData = await res.json();

        if (!res.ok) {
          if (res.status === 409) {
            setError(
              "You have already registered a donor profile with this account.",
            );
          } else {
            setError(resData?.message || "Failed to register donor profile.");
          }
          return;
        }

        setRegistrationResult(resData.data);
        setStep(4);
      } catch {
        setError("Network error. Could not connect to backend server.");
      }
    });
  };

  return (
    <div className="border border-border/40 shadow-lg rounded-xl bg-card text-card-foreground max-w-lg mx-auto overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 space-y-1 text-center border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight">
          Donor Registration
        </h1>
        <p className="text-sm text-muted-foreground">
          Join RaktSetu real-time blood donation network
        </p>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s
                    ? "w-8 bg-primary"
                    : step > s
                      ? "w-4 bg-primary/50"
                      : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="p-6">
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">
              Step 1: Personal Details
            </h2>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Aarav Sharma"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="weight"
                >
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  min="30"
                  max="200"
                  required
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: Number(e.target.value) })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="bloodGroup"
                >
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="A_POS">A+</option>
                  <option value="A_NEG">A-</option>
                  <option value="B_POS">B+</option>
                  <option value="B_NEG">B-</option>
                  <option value="AB_POS">AB+</option>
                  <option value="AB_NEG">AB-</option>
                  <option value="O_POS">O+</option>
                  <option value="O_NEG">O-</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 mt-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Continue to Location
            </button>
          </form>
        )}

        {/* STEP 2: Location Details */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Step 2: Location
              </h2>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-xs text-primary hover:underline font-medium"
              >
                📍 Auto-detect GPS
              </button>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="city"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="district"
                >
                  District
                </label>
                <input
                  id="district"
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="state"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
              <div>
                <span className="text-muted-foreground">Latitude:</span>{" "}
                {formData.latitude}
              </div>
              <div>
                <span className="text-muted-foreground">Longitude:</span>{" "}
                {formData.longitude}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-10 rounded-md border border-input bg-background text-sm font-semibold hover:bg-muted"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
              >
                Continue to Consents
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Consents */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-base font-semibold text-foreground">
              Step 3: Permissions & Consent
            </h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card cursor-pointer hover:bg-muted/20">
                <input
                  type="checkbox"
                  checked={formData.locationConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locationConsent: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-input text-primary"
                />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-foreground block">
                    Share Precise Location
                  </span>
                  <span className="text-muted-foreground block">
                    Allows RaktSetu emergency matching engine to alert you when
                    blood is needed near your location.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card cursor-pointer hover:bg-muted/20">
                <input
                  type="checkbox"
                  checked={formData.notificationConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationConsent: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 rounded border-input text-primary"
                />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-foreground block">
                    Receive Urgent Alerts
                  </span>
                  <span className="text-muted-foreground block">
                    Receive push notifications & SMS alerts when compatible
                    requests match your blood type.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 h-10 rounded-md border border-input bg-background text-sm font-semibold hover:bg-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-2/3 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Submitting Profile..." : "Complete Registration"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Screen */}
        {step === 4 && registrationResult && (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Welcome to RaktSetu!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your donor profile has been successfully registered.
            </p>

            <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border/60 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Eligibility Status:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {registrationResult.eligibility}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City Rank:</span>
                <span className="font-semibold text-foreground">
                  Donor #{registrationResult.donorNumberInCity} in{" "}
                  {formData.city}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 text-center border-t border-border/40 pt-4">
        <p className="text-xs text-muted-foreground">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
