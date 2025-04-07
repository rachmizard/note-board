import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const TodoItemSkeleton: React.FC = () => {
  return (
    <div className="border-1 rounded-sm px-2 py-2.5">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          {/* Checkbox skeleton */}
          <Skeleton className="p-1 rounded-sm mr-3 mt-1 h-5 w-5" />

          <div className="flex-1">
            <div className="flex items-center">
              {/* Title skeleton */}
              <Skeleton className="h-5 w-[100px] sm:w-[200px] md:w-[300px] lg:w-[400px]" />
              {/* Expand button skeleton */}
              <Skeleton className="ml-2 h-4 w-4" />
            </div>

            {/* Badges skeleton */}
            <div className="flex flex-wrap gap-1 mt-1">
              {/* Today badge skeleton */}
              <Skeleton className="h-5 w-16 rounded-full" />
              {/* Sub-task count badge skeleton */}
              <Skeleton className="h-5 w-16 rounded-full" />
              {/* Tag badge skeleton */}
              <Skeleton className="h-5 w-16 rounded-full" />
              {/* Time badge skeleton */}
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Action buttons skeleton - desktop */}
        <div className="hidden md:flex space-x-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>

        {/* Mobile action menu skeleton */}
        <div className="block md:hidden">
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};
