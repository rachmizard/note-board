import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface TodoItemSkeletonProps {
  index?: number; // Optional index to determine expanded state
}

export const TodoItemSkeleton: React.FC<TodoItemSkeletonProps> = ({
  index = 0,
}) => {
  // Deterministic expansion based on index (every third item)
  const isExpanded = index % 3 === 0;

  return (
    <div className="border-b py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          {/* Checkbox skeleton */}
          <Skeleton className="p-1 rounded-md mr-3 mt-1 h-5 w-5" />

          <div className="flex-1">
            <div className="flex items-start">
              {/* Title skeleton */}
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="ml-2 h-4 w-4" />
            </div>

            {/* Badge skeleton */}
            <Skeleton className="mt-1 h-5 w-16" />
            <Skeleton className="mt-1 ml-2 h-5 w-16" />
          </div>
        </div>

        {/* Action buttons skeleton - desktop */}
        <div className="hidden md:flex space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>

        {/* Mobile action menu skeleton */}
        <div className="block md:hidden">
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Expanded item content skeleton - deterministically show for some items */}
      {isExpanded && (
        <div className="px-4 pb-2 mt-3 grid gap-3 text-sm">
          {/* Due date section */}
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-[150px]" />
          </div>

          {/* Tags section */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-12 rounded-full" />
              ))}
            </div>
          </div>

          {/* Notes section */}
          <div className="flex items-start">
            <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
            <div>
              <Skeleton className="h-4 w-[100px] mb-1" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%] mt-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
