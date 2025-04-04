import { publicProcedure, router } from "../trpc-init";
import { createTodo } from "./todo.service";
import { createTodoValidator } from "./todo.validator";

export const todoRouter = router({
  createTodo: publicProcedure
    .input(createTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await createTodo(input, ctx.db);
    }),
});
