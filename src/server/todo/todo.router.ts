import { protectedProcedure, router } from "../trpc-init";
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
  getTodoSubTasks,
  addTodoSubTask,
  updateTodoSubTask,
  removeTodoSubTask,
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
  getTodoSubTasksValidator,
  addTodoSubTaskValidator,
  updateTodoSubTaskValidator,
  removeTodoSubTaskValidator,
} from "./todo.validator";

export const todoRouter = router({
  createTodo: protectedProcedure
    .input(createTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await createTodo(input, ctx);
    }),
  getTodos: protectedProcedure
    .input(getTodosValidator)
    .query(async ({ input, ctx }) => {
      return await getTodos(input, ctx);
    }),
  deleteTodo: protectedProcedure
    .input(deleteTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await deleteTodo(input, ctx.db);
    }),
  updateTodo: protectedProcedure
    .input(updateTodoValidator)
    .mutation(async ({ input, ctx }) => {
      return await updateTodo(input, ctx.db);
    }),
  getTodo: protectedProcedure
    .input(getTodoValidator)
    .query(async ({ input, ctx }) => {
      return await getTodo(input, ctx.db);
    }),
  addTodoTag: protectedProcedure
    .input(addTodoTagValidator)
    .mutation(async ({ input, ctx }) => {
      return await addTodoTag(input, ctx.db);
    }),
  removeTodoTag: protectedProcedure
    .input(removeTodoTagValidator)
    .mutation(async ({ input, ctx }) => {
      return await removeTodoTag(input, ctx.db);
    }),
  addTodoComment: protectedProcedure
    .input(addTodoCommentValidator)
    .mutation(async ({ input, ctx }) => {
      return await addTodoComment(input, ctx);
    }),
  removeTodoComment: protectedProcedure
    .input(removeTodoCommentValidator)
    .mutation(async ({ input, ctx }) => {
      return await removeTodoComment(input, ctx.db);
    }),
  getTodoComments: protectedProcedure
    .input(getTodoCommentsValidator)
    .query(async ({ input, ctx }) => {
      return await getTodoComments(input, ctx.db);
    }),
  getSubTasks: protectedProcedure
    .input(getTodoSubTasksValidator)
    .query(async ({ input, ctx }) => {
      return await getTodoSubTasks(input, ctx);
    }),
  addSubTask: protectedProcedure
    .input(addTodoSubTaskValidator)
    .mutation(async ({ ctx, input }) => {
      return await addTodoSubTask(input, ctx);
    }),
  updateSubTask: protectedProcedure
    .input(updateTodoSubTaskValidator)
    .mutation(async ({ ctx, input }) => {
      return await updateTodoSubTask(input, ctx);
    }),
  removeSubTask: protectedProcedure
    .input(removeTodoSubTaskValidator)
    .mutation(async ({ ctx, input }) => {
      return await removeTodoSubTask(input, ctx);
    }),
});
