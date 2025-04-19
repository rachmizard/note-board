import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";
import { buttonHover, transition } from "@/app/dashboard/timeline/animations";

import { Button } from "@/shared/components/ui/button";

const MotionButton = motion.create(Button);

export function TodayButton() {
  const { setSelectedDate } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <MotionButton
      variant="outline"
      className="flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50 transition-colors"
      onClick={handleClick}
      variants={buttonHover}
      whileHover="hover"
      whileTap="tap"
      transition={transition}
    >
      <Calendar className="h-4 w-4 text-primary" />
      <span className="font-medium">Today</span>
    </MotionButton>
  );
}
