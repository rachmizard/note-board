import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
