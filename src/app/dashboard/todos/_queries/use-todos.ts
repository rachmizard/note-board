import type {
  GetInfiniteTodosRequest,
  GetTodosRequest,
} from "@/server/todo/todo.validator";
import { trpc } from "@/server/trpc";

export const useTodos = (request: GetTodosRequest) => {
  return trpc.todo.getTodos.useQuery(request);
};

export const useInvalidateTodos = () => {
  const trpcUtils = trpc.useUtils();
  return () => {
    trpcUtils.todo.getTodos.invalidate();
    trpcUtils.todo.getTodosCount.invalidate();
  };
};

export const useInfiniteTodos = (request: GetInfiniteTodosRequest) => {
  return trpc.todo.getInfiniteTodos.useInfiniteQuery(request, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
  });
};

export const useInvalidateInfiniteTodos = () => {
  const trpcUtils = trpc.useUtils();
  return () => {
    trpcUtils.todo.getInfiniteTodos.invalidate();
    trpcUtils.todo.getTodosCount.invalidate();
  };
};
