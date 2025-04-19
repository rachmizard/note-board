import { useState } from "react";
import { useCalendar } from "@/app/dashboard/timeline/contexts/calendar-context";

export function useDisclosure({
  defaultIsOpen = false,
}: { defaultIsOpen?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((currentValue) => !currentValue);

  return { onOpen, onClose, isOpen, onToggle };
}

export const useFilteredEvents = () => {
  const { events, selectedDate, selectedUserId } = useCalendar();

  return events.filter((event) => {
    const itemStartDate = new Date(event.startDate);
    const itemEndDate = new Date(event.endDate);

    const monthStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    );
    const monthEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0,
    );

    const isInSelectedMonth =
      itemStartDate <= monthEnd && itemEndDate >= monthStart;
    const isUserMatch =
      selectedUserId === "all" || event.user.id === selectedUserId;
    return isInSelectedMonth && isUserMatch;
  });
};
