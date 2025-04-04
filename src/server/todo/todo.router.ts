import { publicProcedure, router } from "../trpc-init";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./todo.service";
import {
  createTodoValidator,
  deleteTodoValidator,
  getTodosValidator,
  updateTodoValidator,
} from "./todo.validator";

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
  deleteTodo: publicProcedure
    .input(deleteTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await deleteTodo(input, ctx.db);
    }),
  updateTodo: publicProcedure
    .input(updateTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await updateTodo(input, ctx.db);
    }),
});
