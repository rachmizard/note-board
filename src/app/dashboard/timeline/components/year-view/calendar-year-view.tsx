import { motion } from "framer-motion";
import { getYear, isSameDay, isSameMonth } from "date-fns";
import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import {
  staggerContainer,
  transition,
} from "@/app/dashboard/timeline/animations";
import { getCalendarCells } from "@/app/dashboard/timeline/helpers";
import { cn } from "@/shared/lib/utils";
import { IEvent } from "@/app/dashboard/timeline/interfaces";
import { EventBullet } from "@/app/dashboard/timeline/components/month-view/event-bullet";
import { EventListDialog } from "@/app/dashboard/timeline/components/dialogs/events-list-dialog";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarYearView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const currentYear = getYear(selectedDate);
  const allEvents = [...multiDayEvents, ...singleDayEvents];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="grid grid-cols-1 gap-4 md:grid-cols-4 p-5"
    >
      {MONTHS.map((month, monthIndex) => {
        const monthDate = new Date(currentYear, monthIndex, 1);
        const cells = getCalendarCells(monthDate);

        return (
          <motion.div
            key={month}
            className="flex flex-col border rounded-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: monthIndex * 0.05, ...transition }}
          >
            <div
              className="bg-primary/5 p-2 text-center font-medium cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() =>
                setSelectedDate(new Date(currentYear, monthIndex, 1))
              }
            >
              {month}
            </div>

            <div className="grid grid-cols-7 text-center text-xs py-1">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0 p-1">
              {cells.map((cell) => {
                const isCurrentMonth = isSameMonth(cell.date, monthDate);
                const isToday = isSameDay(cell.date, new Date());
                const dayEvents = allEvents.filter((event) =>
                  isSameDay(new Date(event.startDate), cell.date),
                );
                const hasEvents = dayEvents.length > 0;

                return (
                  <motion.div
                    key={cell.date.toISOString()}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center text-xs relative",
                      !isCurrentMonth && "text-muted-foreground/50",
                      isToday && "font-bold",
                      !hasEvents && "cursor-default", // Remove cursor-pointer when no events
                    )}
                    whileHover={hasEvents ? { scale: 1.1 } : undefined} // Only animate hover if there are events
                    transition={transition}
                  >
                    {hasEvents ? (
                      <EventListDialog date={cell.date} events={dayEvents}>
                        <div className="cursor-pointer">
                          <span
                            className={cn(
                              "size-6 flex items-center justify-center",
                              isToday &&
                                "rounded-full bg-primary text-primary-foreground",
                            )}
                          >
                            {cell.day}
                          </span>
                          <div className="flex  justify-center items-center gap-0.5 mt-0.5">
                            {dayEvents.length <= 3 ? (
                              dayEvents
                                .slice(0, 3)
                                .map((event) => (
                                  <EventBullet
                                    key={event.id}
                                    color={event.color}
                                    className="size-1.5"
                                  />
                                ))
                            ) : (
                              <>
                                <EventBullet
                                  color={dayEvents[0].color}
                                  className="size-1.5"
                                />
                                <span className="text-[8px] text-muted-foreground">
                                  +{dayEvents.length}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </EventListDialog>
                    ) : (
                      <>
                        <span
                          className={cn(
                            "size-6 flex items-center justify-center",
                            isToday &&
                              "rounded-full bg-primary text-primary-foreground",
                          )}
                        >
                          {cell.day}
                        </span>
                        {/* No event bullets when there are no events */}
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
