import { trpc } from "@/server/trpc";

export const useRemoveTodoComment = () => {
  const utils = trpc.useUtils();
  return trpc.todo.removeTodoComment.useMutation({
    onSuccess: () => {
      utils.todo.getTodoComments.invalidate();
      utils.todo.getTodo.invalidate();
      utils.todo.getTodos.invalidate();
    },
  });
};
