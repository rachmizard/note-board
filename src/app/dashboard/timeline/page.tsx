"use client";

import { CalendarView } from "./_components/calendar-view";

// Shared dummy events data for all views
export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  allDay?: boolean;
}

export const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Product Design/Marketing",
    start: new Date(2025, 3, 8, 10, 0),
    end: new Date(2025, 3, 8, 11, 30),
    color: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
  },
  {
    id: "2",
    title: "SaaS Coding Session",
    start: new Date(2025, 3, 8, 14, 0),
    end: new Date(2025, 3, 8, 16, 0),
    color: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  },
  {
    id: "3",
    title: "Team Meeting",
    start: new Date(2025, 3, 9, 13, 0),
    end: new Date(2025, 3, 9, 14, 0),
    color:
      "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100",
  },
  {
    id: "4",
    title: "FORMULA 1 JAPANESE GRAND PRIX",
    start: new Date(2025, 3, 5),
    end: new Date(2025, 3, 5),
    color: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
    allDay: true,
  },
  {
    id: "5",
    title: "Idul Fitri Joint Holiday",
    start: new Date(2025, 3, 4),
    end: new Date(2025, 3, 4),
    color: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    allDay: true,
  },
  {
    id: "6",
    title: "Project Deadline",
    start: new Date(2025, 3, 11, 9, 0),
    end: new Date(2025, 3, 11, 10, 0),
    color:
      "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  },
  {
    id: "7",
    title: "All Day Event Example",
    start: new Date(2025, 3, 8),
    end: new Date(2025, 3, 8),
    color: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    allDay: true,
  },
  {
    id: "8",
    title: "Palm Sunday",
    start: new Date(2025, 3, 13),
    end: new Date(2025, 3, 13),
    color: "bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-100",
  },
  {
    id: "9",
    title: "Good Friday",
    start: new Date(2025, 3, 18),
    end: new Date(2025, 3, 18),
    color: "bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-100",
  },
  {
    id: "10",
    title: "Easter Sunday",
    start: new Date(2025, 3, 20),
    end: new Date(2025, 3, 20),
    color: "bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-100",
  },
  {
    id: "11",
    title: "Earth Day",
    start: new Date(2025, 3, 22),
    end: new Date(2025, 3, 22),
    color: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  },
  {
    id: "12",
    title:
      "UX/UI Design Conference - Annual industry event for design professionals",
    start: new Date(2025, 3, 14),
    end: new Date(2025, 3, 20), // Extended to span a full week
    color:
      "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100",
    allDay: true,
  },

  {
    id: "13",
    title: "Team Meeting",
    start: new Date(2025, 3, 10, 13, 45),
    end: new Date(2025, 3, 10, 14, 20),
    color:
      "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100",
  },
  ,
];

export default function TimelinePage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <CalendarView />
    </div>
  );
}

