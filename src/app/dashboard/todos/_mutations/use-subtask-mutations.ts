import { trpc } from "@/server/trpc";

export const useAddTodoSubTask = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.addSubTask.useMutation({
    onSuccess: (_, variables) => {
      // Invalidate all todo queries to refresh the data
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodoSubTaskCount.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodos.invalidate(); // Invalidate all todo queries to refresh any counts
    },
  });
};

export const useUpdateTodoSubTask = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.updateSubTask.useMutation({
    onSuccess: (_, variables) => {
      // Invalidate all todo queries to refresh the data
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodoSubTaskCount.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodos.invalidate(); // Invalidate all todo queries to refresh any counts
    },
  });
};

export const useRemoveTodoSubTask = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.removeSubTask.useMutation({
    onSuccess: (_, variables) => {
      // Invalidate all todo queries to refresh the data
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodoSubTaskCount.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodos.invalidate(); // Invalidate all todo queries to refresh any counts
    },
  });
};
