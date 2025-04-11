import { trpc } from "@/server/trpc";
import {
  useInvalidateInfiniteTodos,
  useInvalidateTodos,
} from "../_queries/use-todos";

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
