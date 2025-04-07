import { trpc } from "@/server/trpc";
import { produce } from "immer";

export const useUpdateTodo = () => {
  const trpcUtils = trpc.useUtils();
  return trpc.todo.updateTodo.useMutation({
    onMutate: async (updatedTodo) => {
      await trpcUtils.todo.getTodos.cancel();
      const previousTodos = trpcUtils.todo.getTodos.getData({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      trpcUtils.todo.getTodos.setData(
        {
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        (prev) => {
          if (!prev) return prev;

          // Use immer's produce to create an immutable update
          return produce(prev, (draft) => {
            // Find and update the todo in the cache
            const todoIndex = draft.data.findIndex(
              (todo) => todo.id === updatedTodo.id
            );

            if (todoIndex !== -1) {
              // Update only the fields that are provided in the updatedTodo
              if (updatedTodo.title) {
                draft.data[todoIndex].title = updatedTodo.title;
              }
              if (updatedTodo.description !== undefined) {
                draft.data[todoIndex].description = updatedTodo.description;
              }
              if (updatedTodo.dueDate) {
                draft.data[todoIndex].dueDate = updatedTodo.dueDate;
              }
              if (updatedTodo.priority) {
                draft.data[todoIndex].priority = updatedTodo.priority;
              }
              if (updatedTodo.status) {
                draft.data[todoIndex].status = updatedTodo.status;
                // If status is completed, update the completedAt field
                if (updatedTodo.status === "completed") {
                  draft.data[todoIndex].completedAt = new Date();
                }
              }

              // Always update the updatedAt timestamp
              draft.data[todoIndex].updatedAt = new Date();
            }
          });
        }
      );

      return { previousTodos };
    },
    onError: (error, updatedTodo, context) => {
      // Revert to the previous state if there's an error
      trpcUtils.todo.getTodos.setData(
        {
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        context?.previousTodos
      );
    },
    onSuccess: () => {
      trpcUtils.todo.getTodos.invalidate();
    },
  });
};
