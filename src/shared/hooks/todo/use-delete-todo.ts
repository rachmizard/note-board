import { trpc } from "@/server/trpc";
import { useInvalidateInfiniteTodos } from "./use-todos";
import { useInvalidateTodos } from "./use-todos";

export const useDeleteTodo = () => {
  const invalidateTodos = useInvalidateTodos();
  const invalidateInfiniteTodos = useInvalidateInfiniteTodos();

  return trpc.todo.deleteTodo.useMutation({
    onSuccess: () => {
      invalidateTodos();
      invalidateInfiniteTodos();
    },
  });
};
