import { trpc } from "@/server/trpc";

export const useViewTodo = (todoId: number) => {
  return trpc.todo.getTodo.useQuery({
    id: todoId,
  });
};
