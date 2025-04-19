import { formatTime } from "@/app/dashboard/timeline/helpers";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";

import { ReactNode } from "react";
import { IEvent } from "@/app/dashboard/timeline/interfaces";
import { dayCellVariants } from "@/app/dashboard/timeline/components/month-view/day-cell";
import { EventBullet } from "@/app/dashboard/timeline/components/month-view/event-bullet";
import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import { format } from "date-fns";

interface EventListDialogProps {
  date: Date;
  events: IEvent[];
  maxVisibleEvents?: number;
  children?: ReactNode;
}

export function EventListDialog({
  date,
  events,
  maxVisibleEvents = 3,
  children,
}: EventListDialogProps) {
  const cellEvents = events;
  const hiddenEventsCount = Math.max(cellEvents.length - maxVisibleEvents, 0);
  const { badgeVariant, use24HourFormat } = useCalendar();

  const defaultTrigger = (
    <span className="cursor-pointer">
      <span className="sm:hidden">+{hiddenEventsCount}</span>
      <span className="hidden sm:inline py-0.5 px-2 my-1 rounded-xl border">
        {hiddenEventsCount}
        <span className="mx-1">more...</span>
      </span>
    </span>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <EventBullet color={cellEvents[0]?.color} className="" />
              <p className="text-sm font-medium">
                Events on {format(date, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-2">
          {cellEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                "flex items-center gap-2 p-2 border rounded-md hover:bg-muted",
                {
                  [dayCellVariants({ color: event.color })]:
                    badgeVariant === "colored",
                },
              )}
            >
              <EventBullet color={event.color} className="" />
              <div className="flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p
                  className={cn("text-xs", {
                    "text-muted": badgeVariant === "colored",
                    "text-muted-foreground": badgeVariant === "dot",
                  })}
                >
                  {formatTime(event.startDate, use24HourFormat)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
