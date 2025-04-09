import { SparklesText } from "@/components/magicui/sparkles-text";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Button } from "@/shared/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/logo.svg"
            alt="NoteBoard Logo"
            className="size-20"
            width={80}
            height={80}
          />
          <SparklesText
            className="text-4xl font-bold tracking-tight"
            text="NoteBoard"
          />

          <TypingAnimation
            duration={50}
            className="text-muted-foreground text-md font-medium"
          >
            Your ideas, organized beautifully.
          </TypingAnimation>
        </div>

        {/* Sign In Button */}
        {!user && (
          <SignInButton
            mode="modal"
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          >
            <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Button>
          </SignInButton>
        )}

        {!!user && (
          <p className="text-muted-foreground">
            Welcome {user.firstName ?? user.username} {user.lastName ?? ""}
          </p>
        )}

        {!!user && (
          <Link href="/dashboard" passHref>
            <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Go to NoteBoard
            </Button>
          </Link>
        )}
      </div>

      {/* Footer */}
      <p className="fixed bottom-4 text-sm text-muted-foreground">
        Made by sixmav&apos;s team with ❤️
      </p>
    </div>
  );
}
