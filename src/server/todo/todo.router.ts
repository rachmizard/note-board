import { publicProcedure, router } from "../trpc-init";
import {
  addTodoComment,
  addTodoTag,
  createTodo,
  deleteTodo,
  getTodo,
  getTodoComments,
  getTodos,
  removeTodoComment,
  removeTodoTag,
  updateTodo,
} from "./todo.service";
import {
  addTodoCommentValidator,
  addTodoTagValidator,
  createTodoValidator,
  deleteTodoValidator,
  getTodoCommentsValidator,
  getTodosValidator,
  getTodoValidator,
  removeTodoCommentValidator,
  removeTodoTagValidator,
  updateTodoValidator,
} from "./todo.validator";

export const todoRouter = router({
  createTodo: publicProcedure
    .input(createTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await createTodo(input, ctx);
    }),
  getTodos: publicProcedure
    .input(getTodosValidator)
    .query(async ({ input, ctx }) => {
      return await getTodos(input, ctx);
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
  addTodoComment: publicProcedure
    .input(addTodoCommentValidator)
    .mutation(async ({ input, ctx }) => {
      return await addTodoComment(input, ctx.db);
    }),
  removeTodoComment: publicProcedure
    .input(removeTodoCommentValidator)
    .mutation(async ({ input, ctx }) => {
      return await removeTodoComment(input, ctx.db);
    }),
  getTodoComments: publicProcedure
    .input(getTodoCommentsValidator)
    .query(async ({ input, ctx }) => {
      return await getTodoComments(input, ctx.db);
    }),
});
