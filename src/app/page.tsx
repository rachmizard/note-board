import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/shared/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
          <img src="./logo.svg" alt="NoteBoard Logo" className="size-20" />
          <h1 className="text-4xl font-bold tracking-tight">NoteBoard</h1>
          <p className="text-muted-foreground">
            Your ideas, organized beautifully.
          </p>
        </div>

        {/* Sign In Button */}
        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
          <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Get Started
          </Button>
        </SignInButton>
      </div>

      {/* Footer */}
      <p className="fixed bottom-4 text-sm text-muted-foreground">
        Built with Next.js and Clerk
      </p>
    </div>
  );
}
