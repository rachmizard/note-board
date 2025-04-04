"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useTheme } from "next-themes";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { TodoCreateModal } from "./TodoCreateModal";
import { CalendarToolbar } from "./CalendarToolbar";
import { useTimelineData } from "../hooks/useTimelineData";
import { useCalendarSettings } from "../hooks/useCalendarSettings";
import { CalendarEvent, TodoBlock } from "../types";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Create a DnD version of the Calendar
const DnDCalendar = withDragAndDrop(Calendar);

// Custom event component
const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { title, resource } = event;

  // Determine background color based on event type and theme
  const getClassName = () => {
    if (resource?.type === "todo") {
      if (isDark) {
        return resource.status === "completed"
          ? "bg-gray-700 border-gray-500"
          : "bg-gray-800 border-gray-600";
      } else {
        return resource.status === "completed"
          ? "bg-gray-200 border-gray-400"
          : "bg-gray-100 border-gray-300";
      }
    }

    if (resource?.type === "pomodoro") {
      if (isDark) {
        return resource.status === "completed"
          ? "bg-red-900 border-red-700"
          : "bg-red-800 border-red-700";
      } else {
        return resource.status === "completed"
          ? "bg-red-200 border-red-400"
          : "bg-red-100 border-red-300";
      }
    }

    return isDark
      ? "bg-blue-900 border-blue-700"
      : "bg-blue-100 border-blue-300";
  };

  // Determine text color based on theme
  const getTextColor = () => {
    return isDark ? "text-gray-100" : "text-gray-800";
  };

  return (
    <div className={`${getClassName()} border-l-4 rounded-sm h-full p-1`}>
      <div className={`text-sm font-medium ${getTextColor()}`}>{title}</div>
    </div>
  );
};

export function TimelineCalendar() {
  const { view, setView, date, setDate } = useCalendarSettings("day");
  const { getDateRange } = useCalendarSettings(view);
  const { start, end } = getDateRange();

  const { events, loading, error, createTodo, updateBlock } = useTimelineData(
    start,
    end,
  );
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  // Handle slot selection (clicking on an empty time slot)
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  }, []);

  // Handle event selection (clicking on an existing event)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    // For now, just log the event. Later could open an edit modal
    console.log("Selected event:", event);
  }, []);

  // Handle creating a new todo
  const handleCreateTodo = useCallback(
    async (title: string, dueDate: Date) => {
      await createTodo(title, dueDate);
    },
    [createTodo],
  );

  // Handle event drag and drop
  const handleEventDrop = useCallback(
    ({ event, start, end }: any) => {
      if (!event.resource?.original) return;

      const original = event.resource.original;
      const updated = { ...original };

      if (original.type === "todo") {
        // Update the due date for todos
        (updated as TodoBlock).properties.due_date = start.toISOString();
      } else if (original.type === "pomodoro") {
        // Update the created_at/timestamp for pomodoros
        updated.created_at = start.toISOString();
      }

      updateBlock(updated);
    },
    [updateBlock],
  );

  // Handle event resize
  const handleEventResize = useCallback(
    ({ event, start, end }: any) => {
      if (
        !event.resource?.original ||
        event.resource.original.type !== "pomodoro"
      )
        return;

      const original = event.resource.original;
      const updated = { ...original };

      // Calculate the new duration in minutes
      const durationMs = end.getTime() - start.getTime();
      const durationMin = Math.round(durationMs / (60 * 1000));

      // Update the pomodoro duration
      updated.properties.duration = durationMin;

      updateBlock(updated);
    },
    [updateBlock],
  );

  // Custom components for the calendar
  const components = useMemo(
    () => ({
      toolbar: CalendarToolbar,
      event: EventComponent,
    }),
    [],
  );

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">
          Error loading timeline data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {loading && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${isDark ? "bg-gray-900/80" : "bg-white/80"} z-10`}
        >
          <div className={`text-lg ${isDark ? "text-white" : "text-black"}`}>
            Loading calendar...
          </div>
        </div>
      )}

      <div className="flex-grow">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 120px)" }}
          view={view}
          date={date}
          onView={setView as any}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          components={components}
          dayLayoutAlgorithm="no-overlap"
          popup
          className="apple-calendar-theme"
        />
      </div>

      {selectedSlot && (
        <TodoCreateModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          slotInfo={selectedSlot}
          onCreateTodo={handleCreateTodo}
        />
      )}
    </div>
  );
}

