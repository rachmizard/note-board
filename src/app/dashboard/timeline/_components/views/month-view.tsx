'use client';

import { cn } from "@/shared/lib/utils";
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isToday, isWithinInterval } from "date-fns";
import { Event, dummyEvents } from "../../page";

interface MonthViewProps {
  currentDate: Date;
}

export const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  // Get all days in the month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start from Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days into weeks
  const weeks = [];
  let currentWeek = [];

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Function to check if an event spans across multiple days
  const isMultiDayEvent = (event: Event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    
    // Set time to midnight to compare only dates
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0;
  };
  
  // Function to get events for a specific day, including relevant multi-day events
  const getEventsForDay = (day: Date) => {
    // Single day events that start on this day
    const singleDayEvents = dummyEvents.filter(event => 
      !isMultiDayEvent(event) && isSameDay(new Date(event.start), day)
    );
    
    // Multi-day events where this day is within the range
    const multiDayEvents = dummyEvents.filter(event => {
      if (!isMultiDayEvent(event)) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      
      return isWithinInterval(day, { start: eventStart, end: eventEnd });
    });
    
    return { singleDayEvents, multiDayEvents };
  };
  
  // Get the position of a day in the multi-day event (start, middle, end)
  const getMultiDayPosition = (day: Date, event: Event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    
    const isStart = isSameDay(eventStart, day);
    const isEnd = isSameDay(eventEnd, day);
    
    return { isStart, isEnd };
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden h-full">
        {/* Week day headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="bg-background p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              const { singleDayEvents, multiDayEvents } = getEventsForDay(day);
              const allEvents = [...singleDayEvents, ...multiDayEvents];

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "bg-background p-2 min-h-[100px] relative flex flex-col",
                    !isSameMonth(day, currentDate) && "text-muted-foreground bg-neutral-50 dark:bg-neutral-950",
                    isToday(day) && "bg-neutral-100 dark:bg-neutral-900"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        "text-sm",
                        isToday(day) && "text-red-500 font-bold"
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Multi-day events */}
                  <div className="mt-1 space-y-1 flex-shrink-0">
                    {multiDayEvents.map((event, eventIndex) => {
                      const { isStart, isEnd } = getMultiDayPosition(day, event);
                      
                      return (
                        <div
                          key={`multi-${event.id}-${eventIndex}`}
                          className={cn(
                            "text-xs p-1 truncate flex-shrink-0",
                            event.color || "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
                            isStart ? "rounded-l-sm border-l" : "border-l-0 pl-0",
                            isEnd ? "rounded-r-sm border-r" : "border-r-0 pr-0",
                            "mx-[-8px]" // Extend beyond the cell padding
                          )}
                          title={event.title}
                        >
                          {isStart && event.title}
                        </div>
                      );
                    })}
                  </div>

                  {/* Single day events */}
                  <div className="mt-1 space-y-1 flex-1">
                    {singleDayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={`single-${event.id}-${eventIndex}`}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          event.color || "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                        )}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {singleDayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{singleDayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};