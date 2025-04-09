"use client";

import { Button } from "@/shared/components/ui/button";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { DayView } from "./views/day-view";
import { MonthView } from "./views/month-view";
import { WeekView } from "./views/week-view";
import { YearView } from "./views/year-view";

type ViewType = "day" | "week" | "month" | "year";

interface CalendarViewProps {
  initialView?: ViewType;
  initialDate?: Date;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  initialView = "day",
  initialDate = new Date(),
}) => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const getDisplayDate = () => {
    switch (currentView) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week":
        return format(currentDate, "MMMM yyyy");
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "year":
        return format(currentDate, "yyyy");
    }
  };

  const navigatePrevious = () => {
    switch (currentView) {
      case "day":
        setCurrentDate((prev) => subDays(prev, 1));
        break;
      case "week":
        setCurrentDate((prev) => subWeeks(prev, 1));
        break;
      case "month":
        setCurrentDate((prev) => subMonths(prev, 1));
        break;
      case "year":
        setCurrentDate((prev) => subYears(prev, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (currentView) {
      case "day":
        setCurrentDate((prev) => addDays(prev, 1));
        break;
      case "week":
        setCurrentDate((prev) => addWeeks(prev, 1));
        break;
      case "month":
        setCurrentDate((prev) => addMonths(prev, 1));
        break;
      case "year":
        setCurrentDate((prev) => addYears(prev, 1));
        break;
    }
  };

  // Handle date selection from year view
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    setCurrentView("day");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-2 border-b">
        {/* Current Date Display */}
        <div className="text-lg font-semibold">{getDisplayDate()}</div>

        {/* View Switcher */}
        <div className="flex items-center rounded-md bg-muted p-1">
          <Button
            variant={currentView === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("day")}
            className="px-3"
          >
            Day
          </Button>
          <Button
            variant={currentView === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("week")}
            className="px-3"
          >
            Week
          </Button>
          <Button
            variant={currentView === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("month")}
            className="px-3"
          >
            Month
          </Button>
          <Button
            variant={currentView === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("year")}
            className="px-3"
          >
            Year
          </Button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === "day" && <DayView currentDate={currentDate} />}
        {currentView === "week" && <WeekView currentDate={currentDate} />}
        {currentView === "month" && <MonthView currentDate={currentDate} />}
        {currentView === "year" && (
          <YearView currentDate={currentDate} onDateSelect={handleDateSelect} />
        )}
      </div>
    </div>
  );
};

