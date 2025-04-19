import { useMemo } from "react";
import { formatDate } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import { buttonHover, transition } from "@/app/dashboard/timeline/animations";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "@/app/dashboard/timeline/helpers";

import type { IEvent } from "@/app/dashboard/timeline/interfaces";
import type { TCalendarView } from "@/app/dashboard/timeline/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

const MotionButton = motion.create(Button);
const MotionBadge = motion.create(Badge);

export function DateNavigator({ view, events }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();

  const month = formatDate(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view]
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <div className="rounded-lg bg-background/50 backdrop-blur-sm border border-border/30 overflow-hidden p-2">
      <div className="flex items-center gap-2">
        <motion.span
          className="text-xl font-medium tracking-tight"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={transition}
        >
          {month} <span className="text-muted-foreground">{year}</span>
        </motion.span>
        <AnimatePresence mode="wait">
          <MotionBadge
            key={eventCount}
            variant="secondary"
            className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={transition}
          >
            {eventCount} events
          </MotionBadge>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div className="flex items-center bg-muted/50 rounded-full p-0.5">
          <MotionButton
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={handlePrevious}
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </MotionButton>

          <MotionButton
            variant="ghost"
            size="sm"
            className="text-xs font-medium px-2 h-7 rounded-full mx-0.5"
            onClick={goToToday}
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            Today
          </MotionButton>

          <MotionButton
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={handleNext}
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </MotionButton>
        </div>

        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition}
        >
          {rangeText(view, selectedDate)}
        </motion.p>
      </div>
    </div>
  );
}
