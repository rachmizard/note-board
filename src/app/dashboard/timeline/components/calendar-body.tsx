"use client";

import React from "react";
import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import { motion } from "framer-motion";
import { fadeIn, transition } from "@/app/dashboard/timeline/animations";
import { AgendaEvents } from "@/app/dashboard/timeline/components/agenda-view/agenda-events";
import { CalendarMonthView } from "@/app/dashboard/timeline/components/month-view/calendar-month-view";
import { CalendarWeekView } from "@/app/dashboard/timeline/components/week-and-day-view/calendar-week-view";
import { CalendarDayView } from "@/app/dashboard/timeline/components/week-and-day-view/calendar-day-view";
import { CalendarYearView } from "@/app/dashboard/timeline/components/year-view/calendar-year-view";
import { isSameDay, parseISO } from "date-fns";
import { useFilteredEvents } from "@/app/dashboard/timeline/hooks";

export function CalendarBody() {
  const { view, isAgendaMode } = useCalendar();

  const singleDayEvents = useFilteredEvents().filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = useFilteredEvents().filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  return isAgendaMode ? (
    <motion.div
      key="agenda"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={transition}
    >
      <AgendaEvents />
    </motion.div>
  ) : (
    <motion.div
      key={view}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={transition}
    >
      {view === "month" && (
        <CalendarMonthView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
      {view === "week" && (
        <CalendarWeekView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
      {view === "day" && (
        <CalendarDayView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
      {view === "year" && (
        <CalendarYearView
          singleDayEvents={singleDayEvents}
          multiDayEvents={multiDayEvents}
        />
      )}
    </motion.div>
  );
}
