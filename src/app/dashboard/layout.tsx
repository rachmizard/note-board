import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
