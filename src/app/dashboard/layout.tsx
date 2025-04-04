import { AppSidebar } from "@/app/dashboard/components/app-sidebar";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col min-h-screen min-w-[95vw]">
        <header className="flex h-12 items-center px-4 justify-end border-b w-full">
          <ModeToggle />
        </header>
        <main className="flex-1 p-2">{children}</main>
      </div>
    </SidebarProvider>
  );
}
