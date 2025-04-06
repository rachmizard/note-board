import { trpc } from "@/server/trpc";
import { produce } from "immer";

export const useAddTodoSubTask = () => {
  const trpcUtils = trpc.useUtils();

  return trpc.todo.addSubTask.useMutation({
    async onMutate(variables) {
      await trpcUtils.todo.getCursorTodoSubTasks.cancel({
        todoId: variables.todoId,
        limit: 10,
      });
      await trpcUtils.todo.getTodoSubTaskCount.cancel({
        todoId: variables.todoId,
        limit: 1,
      });

      const previousSubTasks =
        trpcUtils.todo.getCursorTodoSubTasks.getInfiniteData({
          todoId: variables.todoId,
          limit: 10,
        });
      const previousSubTaskCount = trpcUtils.todo.getTodoSubTaskCount.getData({
        todoId: variables.todoId,
        limit: 1,
      });

      trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
        {
          todoId: variables.todoId,
          limit: 10,
        },
        (old) => {
          if (!old) {
            return {
              pageParams: [],
              pages: [],
            };
          }
          return produce(old, (draft) => {
            const newSubTask = {
              id: Math.round(Date.now() / 1000),
              title: variables.title,
              todoId: variables.todoId,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            draft.pages[0].data.unshift(newSubTask);
          });
        }
      );

      trpcUtils.todo.getTodoSubTaskCount.setData(
        {
          todoId: variables.todoId,
          limit: 1,
        },
        (old) => {
          if (!old) return previousSubTaskCount;
          return produce(old, (draft) => {
            draft.total += 1;
          });
        }
      );

      return {
        previousSubTasks,
        previousSubTaskCount,
      };
    },
    onError(__, variables, context) {
      if (context) {
        trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
          { todoId: variables.todoId, limit: 10 },
          context.previousSubTasks
        );
        trpcUtils.todo.getTodoSubTaskCount.setData(
          { todoId: variables.todoId, limit: 1 },
          context.previousSubTaskCount
        );
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate all todo queries to refresh the data
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
        limit: 10,
      });
      trpcUtils.todo.getTodoSubTaskCount.invalidate({
        todoId: variables.todoId,
        limit: 1,
      });
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
        limit: 3,
      });
    },
  });
};

export const useUpdateTodoSubTask = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.updateSubTask.useMutation({
    async onMutate(variables) {
      await trpcUtils.todo.getCursorTodoSubTasks.cancel({
        todoId: variables.todoId,
        limit: 10,
      });

      const previousSubTasks =
        trpcUtils.todo.getCursorTodoSubTasks.getInfiniteData({
          todoId: variables.todoId,
          limit: 10,
        });

      trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
        { todoId: variables.todoId, limit: 10 },
        (old) => {
          if (!old) return previousSubTasks;

          return produce(old, (draft) => {
            const index = draft.pages[0].data.findIndex(
              (subTask) => subTask.id === variables.id
            );

            if (index !== -1) {
              draft.pages[0].data[index] = {
                ...draft.pages[0].data[index],
                ...variables,
              };
            }

            return draft;
          });
        }
      );

      return {
        previousSubTasks,
      };
    },
    onError(__, variables, context) {
      if (context) {
        trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
          { todoId: variables.todoId, limit: 10 },
          context.previousSubTasks
        );
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate all todo queries to refresh the data
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
        limit: 10,
      });
      trpcUtils.todo.getTodoSubTaskCount.invalidate({
        todoId: variables.todoId,
        limit: 1,
      });
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
        limit: 3,
      });
    },
  });
};

export const useRemoveTodoSubTask = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.removeSubTask.useMutation({
    async onMutate(variables) {
      await trpcUtils.todo.getCursorTodoSubTasks.cancel({
        todoId: variables.todoId,
        limit: 10,
      });
      await trpcUtils.todo.getTodoSubTaskCount.cancel({
        todoId: variables.todoId,
        limit: 1,
      });

      const previousSubTasks =
        trpcUtils.todo.getCursorTodoSubTasks.getInfiniteData({
          todoId: variables.todoId,
          limit: 10,
        });

      const previousSubTaskCount = trpcUtils.todo.getTodoSubTaskCount.getData({
        todoId: variables.todoId,
        limit: 1,
      });

      trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
        { todoId: variables.todoId, limit: 10 },
        (old) => {
          if (!old) return previousSubTasks;

          return produce(old, (draft) => {
            draft.pages[0].data = draft.pages[0].data.filter(
              (subTask) => subTask.id !== variables.id
            );
          });
        }
      );

      trpcUtils.todo.getTodoSubTaskCount.setData(
        { todoId: variables.todoId, limit: 1 },
        (old) => {
          if (!old) return previousSubTaskCount;
          return produce(old, (draft) => {
            draft.total -= 1;
          });
        }
      );

      return {
        previousSubTasks,
        previousSubTaskCount,
      };
    },
    onError(__, variables, context) {
      if (context) {
        trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
          { todoId: variables.todoId, limit: 10 },
          context.previousSubTasks
        );
        trpcUtils.todo.getTodoSubTaskCount.setData(
          { todoId: variables.todoId, limit: 1 },
          context.previousSubTaskCount
        );

        trpcUtils.todo.getCursorTodoSubTasks.setInfiniteData(
          { todoId: variables.todoId, limit: 3 },
          context.previousSubTasks
        );
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate all todo queries to refresh the data
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getTodoSubTaskCount.invalidate({
        todoId: variables.todoId,
      });
      trpcUtils.todo.getCursorTodoSubTasks.invalidate({
        todoId: variables.todoId,
        limit: 3,
      });
    },
  });
};
