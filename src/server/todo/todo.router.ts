import { publicProcedure, router } from "../trpc-init";
import { createTodo, getTodos } from "./todo.service";
import { createTodoValidator, getTodosValidator } from "./todo.validator";

export const todoRouter = router({
  createTodo: publicProcedure
    .input(createTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await createTodo(input, ctx.db);
    }),
  getTodos: publicProcedure
    .input(getTodosValidator)
    .query(async ({ input, ctx }) => {
      return await getTodos(input, ctx.db);
    }),
});
