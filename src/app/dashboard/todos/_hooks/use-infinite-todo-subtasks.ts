import { trpc } from "@/server/trpc";
import { useState } from "react";

export type UseTodoSubTasksOptions = {
  todoId: number;
  initialPage?: number;
  limit?: number;
  enabled?: boolean;
};

export const useTodoSubTasks = ({
  todoId,
  initialPage = 1,
  limit = 10,
  enabled = true,
}: UseTodoSubTasksOptions) => {
  const [page, setPage] = useState(initialPage);

  const query = trpc.todo.getSubTasks.useQuery(
    {
      todoId,
      page,
      limit,
    },
    {
      enabled,
    }
  );

  // Helper functions for pagination
  const nextPage = () => {
    if (query.data && page < Math.ceil(query.data.total / limit)) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (
      query.data &&
      pageNumber >= 1 &&
      pageNumber <= Math.ceil(query.data.total / limit)
    ) {
      setPage(pageNumber);
    }
  };

  // Calculate pagination info
  const totalPages = query.data ? Math.ceil(query.data.total / limit) : 0;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    ...query,
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    items: query.data?.data || [],
    totalItems: query.data?.total || 0,
  };
};
