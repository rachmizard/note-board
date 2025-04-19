import { trpc } from "@/server/trpc";
import { useInvalidateInfiniteTodos } from "./use-todos";
import { useInvalidateTodos } from "./use-todos";

export const useCreateTodo = () => {
  const invalidateTodos = useInvalidateTodos();
  const invalidateInfiniteTodos = useInvalidateInfiniteTodos();

  return trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      invalidateTodos();
      invalidateInfiniteTodos();
    },
  });
};
