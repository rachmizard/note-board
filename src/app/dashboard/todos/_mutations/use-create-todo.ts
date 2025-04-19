import { trpc } from "@/server/trpc";
import {
  useInvalidateInfiniteTodos,
  useInvalidateTodos,
} from "../_queries/use-todos";

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
