"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/shared/components/ui/tooltip";
import * as React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  LogOut,
  ChevronLeft,
  Calendar, // Add this import
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
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
    {
      title: "Timeline",
      url: "/timeline",
      icon: Calendar,
    },
  ],
};

// Mobile Sidebar Trigger component using Sheet
export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-sm p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
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
            <SheetTitle className="text-left">Noteboard</SheetTitle>
          </div>
          <SheetDescription className="text-left">
            Your productivity dashboard
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-1 px-2">
            {data.navMain.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                {item.badgeComponent && (
                  <div className="ml-auto">{item.badgeComponent}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
        {user && (
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

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
          className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
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
          className={`${sidebarFixedStyles} transition-all duration-300 ease-in-out shadow-md hidden md:block`}
          style={{
            width: isCollapsed ? "4rem" : "16rem",
            minWidth: isCollapsed ? "4rem" : "16rem",
          }}
        >
          <CollapseButton />
          <SidebarHeader className="flex w-full justify-start items-center  border-b">
            <div className="flex gap-2 justify-start w-full">
              <img src="./logo.png" className="w-6 h-6 shrink-0" />
              {!isCollapsed && <p>Noteboard</p>}
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
                        </a>
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
              className={`flex items-center ${isCollapsed ? "flex-col" : "justify-between"} gap-2`}
            >
              <div
                className={`flex items-center ${
                  isCollapsed ? "flex-col" : ""
                } gap-2`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                {!isCollapsed && (
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
