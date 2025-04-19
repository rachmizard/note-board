import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card } from "@/shared/components/ui/card";
import { TodoItemSkeleton } from "./todo-item-skeleton";

export const TodoListSkeleton = () => {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:max-w-8xl">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4 lg:gap-8">
        <div className="w-full lg:max-w-[60%]">
          {/* Task Input Area Skeleton */}
          <div className="mb-4 sm:mb-6 border-b pb-4">
            <Skeleton className="w-full h-10" />
          </div>

          {/* Filter Buttons Skeleton */}
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-4 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-full" />
            ))}
          </div>

          {/* Todo List Skeleton */}
          <div>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TodoItemSkeleton key={index} />
              ))}
          </div>
        </div>

        <div className="w-full mt-6 lg:mt-0 lg:max-w-[40%]">
          {/* Todo Stats Skeleton */}
          <Card className="p-3 sm:p-4">
            <Skeleton className="h-6 w-[120px] mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-8 mx-auto mb-2" />
                  <Skeleton className="h-5 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </Card>

          {/* Completion History Skeleton */}
          <Card className="p-3 sm:p-4 mt-4 sm:mt-6">
            <Skeleton className="h-6 w-[150px] mb-3" />
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="border-b pb-2 dark:border-gray-700"
                  >
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
