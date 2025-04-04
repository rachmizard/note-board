import { useState, useCallback } from "react";
import { View } from "react-big-calendar";

type CalendarView = View;

export const useCalendarSettings = (defaultView: CalendarView = "day") => {
  const [view, setView] = useState<CalendarView>(defaultView);
  const [date, setDate] = useState<Date>(new Date());

  // Calculate the date range based on the current view and date
  const getDateRange = useCallback(() => {
    const start = new Date(date);
    const end = new Date(date);

    if (view === "day") {
      // For day view, use the same day
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (view === "week") {
      // For week view, go from Sunday to Saturday
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + (6 - day));
      end.setHours(23, 59, 59, 999);
    } else if (view === "month") {
      // For month view, include the entire month
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of the month
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }, [date, view]);

  // Navigate to the previous time period
  const onNavigatePrev = useCallback(() => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setDate(newDate);
  }, [date, view]);

  // Navigate to the next time period
  const onNavigateNext = useCallback(() => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDate(newDate);
  }, [date, view]);

  // Navigate to today
  const onNavigateToday = useCallback(() => {
    setDate(new Date());
  }, []);

  return {
    view,
    setView,
    date,
    setDate,
    getDateRange,
    onNavigatePrev,
    onNavigateNext,
    onNavigateToday,
  };
};

