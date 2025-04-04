"use client";

import { VersionSwitcher } from "@/app/dashboard/components/version-switcher";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  Sidebar,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
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
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

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

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const CollapseButton = () => {
    return (
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>
    );
  };

  return (
    <SidebarProvider>
      <TooltipProvider>
        <Sidebar
          variant="floating"
          collapsible="icon"
          className={`relative transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-[4rem]" : "w-[16rem]"
          }`}
        >
          <CollapseButton />
          <SidebarHeader className="flex w-full justify-start items-center  border-b">
            <div className="flex gap-2 justify-start w-full">
              <img src="./logo.png" className="w-6 h-6 shrink-0" />
              {!isCollapsed && <p>Noteboard</p>}
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center" : "justify-start"
                          }  gap-2`}
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span className={isCollapsed ? "hidden" : "block"}>
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    <TooltipContent side="right">
                      <span>{item.title}</span>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <div className="mt-auto border-t p-4">
            <div
              className={`flex items-center ${
                isCollapsed ? "flex-col" : "justify-between"
              } gap-2`}
            >
              <div
                className={`flex items-center ${
                  isCollapsed ? "flex-col" : ""
                } gap-2`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                )}
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <span>Logout</span>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </Sidebar>
      </TooltipProvider>
    </SidebarProvider>
  );
}
