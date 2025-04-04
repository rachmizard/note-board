import { trpc } from "@/server/trpc";

export const useViewTodo = (todoId: number) => {
  return trpc.getTodo.useQuery({
    id: todoId,
  });
};
