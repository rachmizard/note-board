import { trpc } from "@/server/trpc";
import { produce } from "immer";

export const useRemoveTodoTag = () => {
  const utils = trpc.useUtils();
  return trpc.todo.removeTodoTag.useMutation({
    onMutate: async (removeTodoTag) => {
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
              (todo) => todo.id === removeTodoTag.todoId
            );
            if (todo && todo.tags) {
              todo.tags = todo.tags.filter(
                (tag) => tag.id !== removeTodoTag.tagId
              );
            }
            return draft;
          });
        }
      );

      return { previousTodos };
    },
    onSuccess: () => {
      utils.todo.getTodos.invalidate();
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
