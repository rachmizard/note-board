import { trpc } from "@/server/trpc";
import { useInvalidateTodos } from "../_queries/use-todos";

export const useDeleteTodo = () => {
  const invalidateTodos = useInvalidateTodos();
  return trpc.deleteTodo.useMutation({
    onSuccess: () => {
      invalidateTodos();
    },
  });
};
