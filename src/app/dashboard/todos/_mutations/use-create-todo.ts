import type { TodoWithTags } from "@/server/database/drizzle/todo.schema";
import { trpc } from "@/server/trpc";
import { produce } from "immer";

export const useCreateTodo = () => {
  const trpcUtils = trpc.useUtils();

  return trpc.todo.createTodo.useMutation({
    onMutate: async (newTodo) => {
      await trpcUtils.todo.getTodos.cancel();
      const previousTodos = trpcUtils.todo.getTodos.getData();

      // Use immer to safely update the cache with proper typing
      trpcUtils.todo.getTodos.setData(
        {
          page: 1,
          limit: 100, // Fetch a reasonable number of todos
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        (prev) => {
          if (!prev) {
            // If no previous data exists, create a new structure
            return {
              data: [
                // Create a temporary optimistic todo with required fields
                {
                  id: Date.now() + Math.random(), // Temporary ID that will be replaced by the server
                  title: newTodo.title,
                  description: newTodo.description || null,
                  dueDate: newTodo.dueDate || null,
                  priority: newTodo.priority,
                  status: newTodo.status,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  tags: [],
                  completedAt: null,
                } as TodoWithTags,
              ],
              total: 1,
              page: 1,
              limit: 10,
            };
          }

          // Use immer's produce to create an immutable update
          return produce(prev, (draft) => {
            // Add the new todo at the beginning of the list
            draft.data.unshift({
              id: -1, // Temporary ID
              title: newTodo.title,
              description: newTodo.description || null,
              dueDate: newTodo.dueDate || null,
              priority: newTodo.priority,
              status: newTodo.status,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as TodoWithTags);

            // Update the total count
            draft.total += 1;
          });
        }
      );

      return { previousTodos };
    },
    onError: (error, newTodo, context) => {
      trpcUtils.todo.getTodos.setData(
        { page: 1, limit: 100 },
        context?.previousTodos
      );
    },
    onSuccess: () => {
      trpcUtils.todo.getTodos.invalidate();
    },
  });
};
