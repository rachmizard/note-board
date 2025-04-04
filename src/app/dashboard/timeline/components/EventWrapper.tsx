"use client";

import { EventWrapperProps } from "react-big-calendar";
import { CalendarEvent } from "../types";
import { EventDetails } from "./EventDetails";

export function EventWrapper({
  event,
  children,
}: EventWrapperProps<CalendarEvent>) {
  const { resource } = event;

  // Determine the background color based on the event type
  const getBackgroundColor = () => {
    if (resource?.type === "todo") {
      return resource.status === "completed" ? "bg-gray-200" : "bg-gray-100";
    }

    if (resource?.type === "pomodoro") {
      return resource.status === "completed" ? "bg-red-200" : "bg-red-100";
    }

    return "bg-blue-100";
  };

  // Determine the border color based on the event type
  const getBorderColor = () => {
    if (resource?.type === "todo") {
      return resource.status === "completed"
        ? "border-gray-400"
        : "border-gray-300";
    }

    if (resource?.type === "pomodoro") {
      return resource.status === "completed"
        ? "border-red-400"
        : "border-red-300";
    }

    return "border-blue-300";
  };

  // Add custom styling to the event
  const customStyles = `${getBackgroundColor()} ${getBorderColor()} border-l-4 rounded-sm`;

  return (
    <EventDetails event={event}>
      <div className={customStyles}>{children}</div>
    </EventDetails>
  );
}

