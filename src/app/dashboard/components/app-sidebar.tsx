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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
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
    <TooltipProvider delayDuration={200}>
      <Sidebar {...props} className="w-[60px]">
        <SidebarHeader className="p-4 border-b flex justify-center">
          <Tooltip>
            <TooltipTrigger>
              <Notebook className="w-6 h-6" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Note Board</p>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex justify-center">
                        <item.icon size={20} />
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <div className="mt-auto border-t p-4 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-red-500 hover:text-red-600 transition-colors">
                <LogOut size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Sidebar>
    </TooltipProvider>
  );
}
