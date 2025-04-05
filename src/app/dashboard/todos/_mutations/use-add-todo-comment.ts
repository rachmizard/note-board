import { trpc } from "@/server/trpc";

export const useAddTodoComment = () => {
  const utils = trpc.useUtils();
  return trpc.todo.addTodoComment.useMutation({
    onSuccess: () => {
      utils.todo.getTodoComments.invalidate();
      utils.todo.getTodo.invalidate();
      utils.todo.getTodos.invalidate();
    },
  });
};
