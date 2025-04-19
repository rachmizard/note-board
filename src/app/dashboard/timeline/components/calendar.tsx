"use client";

import React, { useEffect, useState } from "react";
import { CalendarProvider } from "@/app/dashboard/timeline/contexts/calendar-context";
import { CalendarHeader } from "@/app/dashboard/timeline/components/header/calendar-header";
import { CalendarBody } from "@/app/dashboard/timeline/components/calendar-body";

import { EventUpdateHandler } from "@/app/dashboard/timeline/components/event-update-handler";
import { DragDropProvider } from "@/app/dashboard/timeline/contexts/drag-drop-context";
import { getEvents, getUsers } from "@/app/dashboard/timeline/requests";
import type { IEvent, IUser } from "@/app/dashboard/timeline/interfaces";

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
    return <div>Loading calendar data...</div>;
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
