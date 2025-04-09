'use client';

import { cn } from "@/shared/lib/utils";
import React, { useEffect, useState, useCallback } from "react";
import { format, addMinutes, startOfDay, isSameDay, getHours, getMinutes, isToday } from "date-fns";
import { Clock } from "lucide-react";
import { Event, dummyEvents } from "../../page";

interface DayViewProps {
  currentDate: Date;
}

export const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);

  // Generate time slots for the day (30-minute intervals)
  useEffect(() => {
    const slots: Date[] = [];
    let currentSlot = startOfDay(currentDate);
    
    for (let i = 0; i < 48; i++) {
      slots.push(currentSlot);
      currentSlot = addMinutes(currentSlot, 30);
    }
    
    setTimeSlots(slots);
  }, [currentDate]);

  // Update current time every second for smoother time indicator movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate current time position for time indicator
  const getCurrentTimePosition = useCallback(() => {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const millisSinceMidnight = now.getTime() - startOfToday.getTime();
    const minutesSinceMidnight = millisSinceMidnight / (1000 * 60);
    return (minutesSinceMidnight / (24 * 60)) * 100; // Convert to percentage
  }, []);

  // Format current time for display
  const formatCurrentTime = useCallback(() => {
    return format(currentTime, 'HH:mm');
  }, [currentTime]);

  // Filter events for the current selected date
  const allDayEvents = dummyEvents.filter(event => 
    event.allDay && isSameDay(new Date(event.start), currentDate)
  );

  const regularEvents = dummyEvents.filter(event => 
    !event.allDay && isSameDay(new Date(event.start), currentDate)
  );

  // Position events in their correct time slots
  const getEventPosition = useCallback((event: Event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    // Calculate minutes since midnight for the start time
    const startDay = startOfDay(eventStart);
    const startMinutesSinceMidnight = (eventStart.getTime() - startDay.getTime()) / (1000 * 60);
    
    // Calculate total duration in minutes
    const durationInMinutes = ((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60));
    
    // Convert to percentages for positioning
    const top = (startMinutesSinceMidnight / (24 * 60)) * 100;
    const height = (durationInMinutes / (24 * 60)) * 100;
    
    return { top, height };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* All Day Events Section */}
      {allDayEvents.length > 0 && (
        <div className="flex border-b">
          <div className="w-16 shrink-0 p-2 text-sm text-muted-foreground text-right">
            All Day
          </div>
          <div className="flex-1 p-2 min-h-[60px]">
            <div className="flex flex-col gap-1">
              {allDayEvents.map(event => (
                <div
                  key={event.id}
                  className={cn(
                    "text-xs p-1 rounded",
                    event.color || "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  )}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Time slots */}
          {timeSlots.map((time, index) => (
            <div 
              key={index}
              className={cn(
                "flex h-[60px] border-t",
                index === 0 && "border-t-0"
              )}
            >
              {/* Time label */}
              <div className="w-16 shrink-0 pr-2 text-right text-sm text-muted-foreground sticky left-0 bg-background z-10">
                {index % 2 === 0 && format(time, 'HH:mm')}
              </div>

              {/* Event space */}
              <div className="flex-1 relative grid grid-cols-1">
                {/* Empty slot for content */}
              </div>
            </div>
          ))}

          {/* Current time indicator */}
          {isToday(currentDate) && (
            <div 
              className="absolute left-0 right-0 z-20 flex items-center"
              style={{ top: `${getCurrentTimePosition()}%` }}
            >
              <div className="w-16 flex justify-end items-center pr-1">
                <div className="flex items-center justify-center bg-red-500 text-white text-[10px] rounded-md px-1 py-0.5 font-medium">
                  <Clock className="h-3 w-3 mr-0.5" />
                  {formatCurrentTime()}
                </div>
              </div>
              <div className="flex-1 border-t-2 border-red-500" />
            </div>
          )}

          {/* Events positioned absolutely */}
          {regularEvents.map((event) => {
            const { top, height } = getEventPosition(event);
            
            return (
              <div
                key={event.id}
                className={cn(
                  "absolute rounded-md p-2 z-10",
                  event.color || "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                )}
                style={{
                  top: `${top}%`,
                  height: `${height}%`,
                  left: "calc(4rem + 4px)", // 4rem (64px) for time gutter + 4px padding
                  right: "4px",
                  minHeight: '25px'
                }}
              >
                <div className="text-sm font-medium truncate">{event.title}</div>
                <div className="text-xs truncate">
                  {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};