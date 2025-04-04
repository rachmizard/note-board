import { VersionSwitcher } from "@/app/dashboard/components/version-switcher";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  Sidebar,
} from "@/shared/components/ui/sidebar";
import * as React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  LogOut,
  Notebook,
} from "lucide-react";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Todo List",
      url: "/todo",
      icon: CheckSquare,
    },
    {
      title: "Pomodoro",
      url: "/pomodoro",
      icon: Timer,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Notebook className="w-6 h-6" />
          <h1 className="font-semibold text-lg">Note Board</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2">
                  {item.icon && <item.icon size={20} />}
                  {item.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto border-t p-4">
        <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
