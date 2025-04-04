import type { GetTodosRequest } from "@/server/todo/todo.validator";
import { trpc } from "@/server/trpc";

export const useTodos = (request: GetTodosRequest) => {
  return trpc.getTodos.useQuery(request);
};

export const useInvalidateTodos = () => {
  const trpcUtils = trpc.useUtils();
  return trpcUtils.getTodos.invalidate;
};
