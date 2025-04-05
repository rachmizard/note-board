import { trpc } from "@/server/trpc";

export const useAddTodoComment = () => {
  const utils = trpc.useUtils();
  return trpc.todo.addTodoComment.useMutation({
    onSuccess: () => {
      utils.todo.getTodos.invalidate();
    },
  });
};
