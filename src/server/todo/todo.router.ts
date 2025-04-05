import { publicProcedure, router } from "../trpc-init";
import {
  addTodoTag,
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  removeTodoTag,
  updateTodo,
} from "./todo.service";
import {
  addTodoTagValidator,
  createTodoValidator,
  deleteTodoValidator,
  getTodosValidator,
  getTodoValidator,
  removeTodoTagValidator,
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
  getTodo: publicProcedure
    .input(getTodoValidator)
    .query(async ({ input, ctx }) => {
      return await getTodo(input, ctx.db);
    }),
  addTodoTag: publicProcedure
    .input(addTodoTagValidator)
    .mutation(async ({ input, ctx }) => {
      return await addTodoTag(input, ctx.db);
    }),
  removeTodoTag: publicProcedure
    .input(removeTodoTagValidator)
    .mutation(async ({ input, ctx }) => {
      return await removeTodoTag(input, ctx.db);
    }),
});
