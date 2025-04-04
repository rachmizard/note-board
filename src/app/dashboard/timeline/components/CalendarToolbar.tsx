"use client";

import { ToolbarProps } from "react-big-calendar";
import { useTheme } from "next-themes";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export function CalendarToolbar<TEvent>({
  date,
  onNavigate,
  onView,
  view,
}: ToolbarProps<TEvent>) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Format the date display based on the current view
  const formatDate = () => {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      day: view === "day" ? "numeric" : undefined,
    });

    return dateFormatter.format(date);
  };

  return (
    <div
      className={`flex justify-between items-center mb-4 py-2 ${isDark ? "text-white" : ""}`}
    >
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("TODAY")}
          className="text-xs h-8 w-8"
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("PREV")}
          className="text-xs h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("NEXT")}
          className="text-xs h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span
          className={`text-lg font-medium ml-2 ${isDark ? "text-white" : "text-gray-800"}`}
        >
          {formatDate()}
        </span>
      </div>

      <div className="flex space-x-1">
        <Button
          variant={view === "day" ? "default" : "ghost"}
          size="sm"
          onClick={() => onView("day")}
          className="text-xs"
        >
          Day
        </Button>
        <Button
          variant={view === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => onView("week")}
          className="text-xs"
        >
          Week
        </Button>
        <Button
          variant={view === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => onView("month")}
          className="text-xs"
        >
          Month
        </Button>
      </div>
    </div>
  );
}

