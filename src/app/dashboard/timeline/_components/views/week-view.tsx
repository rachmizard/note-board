"use client";

import { cn } from "@/shared/lib/utils";
import React, { useEffect, useState, useCallback } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  addMinutes,
  startOfDay,
  isToday,
} from "date-fns";
import { Clock } from "lucide-react";
import { Event, dummyEvents } from "../../page";

interface WeekViewProps {
  currentDate: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // Generate week days
  useEffect(() => {
    const days: Date[] = [];
    let currentDay = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday

    for (let i = 0; i < 7; i++) {
      days.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }

    setWeekDays(days);
  }, [currentDate]);

  // Generate time slots for the day (30-minute intervals)
  useEffect(() => {
    const slots: Date[] = [];
    let currentSlot = startOfDay(new Date());

    for (let i = 0; i < 48; i++) {
      slots.push(currentSlot);
      currentSlot = addMinutes(currentSlot, 30);
    }

    setTimeSlots(slots);
  }, []);

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
    return format(currentTime, "HH:mm");
  }, [currentTime]);

  // Position events in their correct time slots
  const getEventPosition = useCallback((event: Event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Calculate minutes since midnight for the start time
    const startDay = startOfDay(eventStart);
    const startMinutesSinceMidnight =
      (eventStart.getTime() - startDay.getTime()) / (1000 * 60);

    // Calculate total duration in minutes
    const durationInMinutes =
      (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);

    // Convert to percentages for positioning
    const top = (startMinutesSinceMidnight / (24 * 60)) * 100;
    const height = (durationInMinutes / (24 * 60)) * 100;

    return { top, height };
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* All Day Events Section */}
      <div className="flex border-b">
        <div className="w-16 shrink-0 p-2 text-sm text-muted-foreground text-right">
          All Day
        </div>
        <div className="grid grid-cols-7 flex-1 divide-x">
          {weekDays.map((day, index) => {
            const dayAllDayEvents = dummyEvents.filter(
              (event) => event.allDay && isSameDay(new Date(event.start), day),
            );

            return (
              <div key={index} className="p-2 min-h-[60px]">
                <div className="flex flex-col gap-1">
                  {dayAllDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs p-1 rounded truncate",
                        event.color ||
                          "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
                      )}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header with days */}
      <div className="flex border-b sticky top-0 bg-background z-20">
        <div className="w-16" /> {/* Time gutter */}
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 p-2 text-center border-l",
              isToday(day) && "bg-neutral-100 dark:bg-neutral-900",
            )}
          >
            <div
              className={cn(
                "text-sm font-medium",
                isToday(day) && "text-red-500",
              )}
            >
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-sm",
                isToday(day)
                  ? "text-red-500 font-bold"
                  : "text-muted-foreground",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {/* Events layer - positioned absolutely */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex h-full">
              <div className="w-16 shrink-0"></div>
              <div className="grid grid-cols-7 flex-1 h-full">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = dummyEvents.filter(
                    (event) =>
                      !event.allDay && isSameDay(new Date(event.start), day),
                  );

                  return (
                    <div key={dayIndex} className="relative h-full">
                      {dayEvents.map((event) => {
                        const { top, height } = getEventPosition(event);

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "rounded-md p-2 z-10 mx-1 absolute pointer-events-auto",
                              event.color ||
                                "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
                            )}
                            style={{
                              top: `${top}%`,
                              height: `${height}%`,
                              minHeight: "25px",
                              width: "calc(100% - 8px)",
                            }}
                          >
                            <div className="text-sm font-medium truncate">
                              {event.title}
                            </div>
                            <div className="text-xs truncate">
                              {format(new Date(event.start), "HH:mm")} -{" "}
                              {format(new Date(event.end), "HH:mm")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time slots */}
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className={cn(
                "flex h-[60px] border-t",
                index === 0 && "border-t-0",
              )}
            >
              {/* Time label */}
              <div className="w-16 shrink-0 pr-2 text-right text-sm text-muted-foreground sticky left-0 bg-background z-10">
                {index % 2 === 0 && format(time, "HH:mm")}
              </div>

              {/* Day columns */}
              <div className="grid grid-cols-7 flex-1 divide-x">
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="relative h-full">
                    {/* This is just a placeholder for the grid cell */}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Current time indicator */}
          {weekDays.some((day) => isToday(day)) && (
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
        </div>
      </div>
    </div>
  );
};
