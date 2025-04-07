import { trpc } from "@/server/trpc";

export const useTodoTags = (keyword?: string) => {
  return trpc.todo.getTodoTags.useQuery({
    keyword,
  });
};
