import { trpc } from "@/server/trpc";

export const useCreateTodo = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      trpcUtils.todo.getTodos.invalidate();
    },
  });
};
