"use client";

import { CalendarEvent } from "../types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

interface EventDetailsProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

export function EventDetails({ event, children }: EventDetailsProps) {
  const { title, start, end, resource } = event;

  const startTime = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const duration = Math.round((end.getTime() - start.getTime()) / (60 * 1000));

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="p-2 max-w-xs bg-white text-black">
        <h4 className="font-semibold text-md">{title}</h4>
        <div className="mt-1 text-sm">
          <p>
            {startTime} - {endTime} ({duration} minutes)
          </p>
          {resource && (
            <p className="flex items-center gap-1 mt-1">
              <span className="capitalize">{resource.type}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="capitalize">{resource.status}</span>
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

