import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const TodoItemSkeleton: React.FC = () => {
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
    </div>
  );
};
