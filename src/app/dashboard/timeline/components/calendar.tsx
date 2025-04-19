"use client";

import React, { useEffect, useState } from "react";
import { CalendarProvider } from "@/app/dashboard/timeline/contexts/calendar-context";
import { CalendarHeader } from "@/app/dashboard/timeline/components/header/calendar-header";
import { CalendarBody } from "@/app/dashboard/timeline/components/calendar-body";
import { motion } from "framer-motion";

import { EventUpdateHandler } from "@/app/dashboard/timeline/components/event-update-handler";
import { DragDropProvider } from "@/app/dashboard/timeline/contexts/drag-drop-context";
import { getEvents, getUsers } from "@/app/dashboard/timeline/requests";
import type { IEvent, IUser } from "@/app/dashboard/timeline/interfaces";
import { cn } from "@/shared/lib/utils";

async function getCalendarData() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    events: await getEvents(),
    users: await getUsers(),
  };
}

export function Calendar() {
  const [data, setData] = useState<{ events: IEvent[]; users: IUser[] }>({
    events: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const calendarData = await getCalendarData();
        setData(calendarData);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] w-full p-4 fixed inset-0">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center">
            {/* Calendar icon with grid background */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-background border-2 border-primary/20 rounded-lg p-6 shadow-lg"
              >
                <div className="grid grid-cols-7 gap-1 w-[280px]">
                  {/* Days of week */}
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <motion.div
                      key={`day-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="text-center text-sm text-muted-foreground font-medium"
                    >
                      {day}
                    </motion.div>
                  ))}

                  {/* Calendar cells */}
                  {Array(35)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={`cell-${i}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          background:
                            i === 15
                              ? "rgba(var(--primary), 0.15)"
                              : "transparent",
                        }}
                        transition={{
                          delay: 0.4 + i * 0.02,
                          duration: 0.3,
                        }}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded-md text-sm",
                          i === 15 && "font-bold text-primary", // Highlight today
                          (i + 1) % 7 === 0 && "text-rose-500" // Sundays in red
                        )}
                      >
                        {(i % 31) + 1}
                      </motion.div>
                    ))}
                </div>

                {/* Animated dots that represent loading events */}
                <div className="absolute inset-0 pointer-events-none">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={`dot-${i}`}
                      className="absolute h-2 w-2 rounded-full bg-primary"
                      initial={{
                        x: Math.random() * 280,
                        y: Math.random() * 280,
                        opacity: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        repeatDelay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Text with animated dots */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-medium mb-2">
                Loading your calendar
              </h3>
              <div className="flex items-center justify-center gap-1">
                <span>Fetching events</span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                  }}
                >
                  .
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DragDropProvider>
      <CalendarProvider events={data.events} users={data.users} view="month">
        <div className="w-full border rounded-xl">
          <EventUpdateHandler />
          <CalendarHeader />
          <CalendarBody />
        </div>
      </CalendarProvider>
    </DragDropProvider>
  );
}
