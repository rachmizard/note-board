import { trpc } from "@/server/trpc";
import { produce } from "immer";

export const useAddTodoTag = () => {
  const utils = trpc.useUtils();
  return trpc.todo.addTodoTag.useMutation({
    onMutate: async (newTodoTag) => {
      await utils.todo.getTodos.cancel();
      const previousTodos = utils.todo.getTodos.getData();

      utils.todo.getTodos.setData(
        {
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        (prev) => {
          if (!prev) return prev;
          return produce(prev, (draft) => {
            const todo = draft.data.find(
              (todo) => todo.id === newTodoTag.todoId
            );
            if (todo && todo.tags) {
              todo.tags.push({
                id: Date.now() * Math.random(),
                name: newTodoTag.name,
                todoId: newTodoTag.todoId,
              });
            }
          });
        }
      );

      return { previousTodos };
    },
    onSuccess: () => {
      utils.todo.getTodos.invalidate();
      utils.todo.getTodoTags.invalidate();
    },
    onError: (_, __, context) => {
      utils.todo.getTodos.setData(
        {
          page: 1,
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        context?.previousTodos
      );
    },
  });
};
