"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Calendar,
  CheckSquare,
  ChevronLeft,
  LayoutDashboard,
  RefreshCw,
  Loader2Icon,
  Timer,
} from "lucide-react";
import Image from "next/image";
import { TodoSidebarMenuBadge } from "./todo-sidebar-menu-badge";
import Link from "next/link";
import { Suspense, useState } from "react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "To-Do",
      url: "/dashboard/todos",
      icon: CheckSquare,
      badgeComponent: (
        <Suspense fallback={<Loader2Icon className="w-4 h-4 animate-spin" />}>
          <TodoSidebarMenuBadge />
        </Suspense>
      ),
    },
    {
      title: "Pomodoro",
      url: "/dashboard/pomodoro",
      icon: Timer,
    },
    {
      title: "Timeline",
      url: "/dashboard/timeline",
      icon: Calendar,
    },
  ],
};

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { user } = useUser();
  const isCollapsed = state === "collapsed";
  const [isFixed, setIsFixed] = useState(true);

  const CollapseButton = () => {
    return (
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors z-10"
      >
        <ChevronLeft
          className={`w-4 h-4 transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>
    );
  };

  // Custom styles for fixed/sticky behavior
  const sidebarFixedStyles = isFixed
    ? "sticky top-0 h-screen"
    : "relative h-full";

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <TooltipProvider>
        <Sidebar
          variant="floating"
          collapsible="icon"
          side="left"
          className={`${sidebarFixedStyles} transition-all duration-300 ease-in-out shadow-md`}
          style={{
            width: isCollapsed ? "4rem" : "16rem",
            minWidth: isCollapsed ? "4rem" : "16rem",
          }}
        >
          <CollapseButton />
          <SidebarHeader className="flex w-full justify-start items-center border-b p-3">
            <div
              className={`flex gap-2 ${
                !isCollapsed ? "justify-start" : "justify-center"
              } w-full`}
            >
              <div className="w-6 h-6 relative shrink-0">
                <Image
                  src="/logo.png"
                  alt="Noteboard"
                  fill
                  priority
                  loading={undefined}
                  quality={100}
                />
              </div>
              {!isCollapsed && (
                <>
                  <p className="font-bold">Noteboard</p>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => setIsFixed(!isFixed)}
                      title={
                        isFixed ? "Make sidebar relative" : "Make sidebar fixed"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        {isFixed ? (
                          <>
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="18" x2="20" y2="18"></line>
                          </>
                        ) : (
                          <>
                            <rect
                              x="4"
                              y="4"
                              width="16"
                              height="16"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                          </>
                        )}
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={() => {
                        window.location.reload();
                      }}
                      title="Refresh page"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3 flex-grow overflow-y-auto">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger className="w-full" asChild>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center ${
                            isCollapsed ? "justify-center" : "justify-start"
                          } gap-2`}
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span className={isCollapsed ? "hidden" : "block"}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>

                    {isCollapsed && (
                      <TooltipContent side="right">
                        <span>{item.title}</span>
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {item.badgeComponent && !isCollapsed && (
                    <SidebarMenuBadge>{item.badgeComponent}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4 mt-auto">
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
                {!isCollapsed && user && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                )}
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </SidebarFooter>
        </Sidebar>
      </TooltipProvider>
    </SidebarProvider>
  );
}
