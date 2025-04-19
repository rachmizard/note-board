import { trpc } from "@/server/trpc";

export type UseTodoSubTasksOptions = {
  todoId: number;
  limit?: number;
  enabled?: boolean;
};

export const useTodoSubTasks = ({
  todoId,
  limit = 10,
  enabled = true,
}: UseTodoSubTasksOptions) => {
  return trpc.todo.getCursorTodoSubTasks.useInfiniteQuery(
    {
      todoId,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: (firstPage) => firstPage.previousCursor,
      enabled,
    }
  );
};
