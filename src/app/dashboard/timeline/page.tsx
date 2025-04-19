"use client";

import { Suspense } from "react";
import { Calendar } from "@/app/dashboard/timeline/components/calendar";
import { CalendarSkeleton } from "./components/skeletons/calendar-skeleton";

export default function TimelinePage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar />
      </Suspense>
    </div>
  );
}
