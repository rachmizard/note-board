import { trpc } from "@/server/trpc";

export const useAddTodoComment = () => {
  const utils = trpc.useUtils();
  return trpc.todo.addTodoComment.useMutation({
    onSuccess: (__, variables) => {
      utils.todo.getTodos.invalidate();
      utils.todo.getCursorTodoSubTasks.invalidate();
      utils.todo.getInfiniteTodos.invalidate();
      utils.todo.getTodoComments.invalidate({
        todoId: variables.todoId,
      });
      utils.todo.getTodo.invalidate({
        id: variables.todoId,
      });
    },
  });
};
