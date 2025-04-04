import { trpc } from "@/server/trpc";

export const useCreateTodo = () => {
  return trpc.createTodo.useMutation();
};
