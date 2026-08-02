export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {/* Heart/Drop Icon indicator */}
            <span className="text-2xl font-bold">🩸</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            RaktSetu
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Real-Time Blood Donation Ecosystem
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
