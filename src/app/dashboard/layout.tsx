"use client";
import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("User not signed in");
      redirect("/");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
