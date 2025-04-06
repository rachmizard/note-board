import {
  TodoPriorityEnum,
  TodoStatusEnum,
} from "@/server/database/drizzle/todo.schema";
import { z } from "zod";

export type CreateTodoRequest = z.infer<typeof createTodoValidator>;
export type GetTodosRequest = z.infer<typeof getTodosValidator>;
export type DeleteTodoRequest = z.infer<typeof deleteTodoValidator>;
export type UpdateTodoRequest = z.infer<typeof updateTodoValidator>;
export type GetTodoRequest = z.infer<typeof getTodoValidator>;
export type AddTodoTagRequest = z.infer<typeof addTodoTagValidator>;
export type RemoveTodoTagRequest = z.infer<typeof removeTodoTagValidator>;

export type GetTodoCommentsRequest = z.infer<typeof getTodoCommentsValidator>;
export type AddTodoCommentRequest = z.infer<typeof addTodoCommentValidator>;
export type RemoveTodoCommentRequest = z.infer<
  typeof removeTodoCommentValidator
>;
export type GetTodoSubTasksRequest = z.infer<typeof getTodoSubTasksValidator>;

export type AddTodoSubTaskRequest = z.infer<typeof addTodoSubTaskValidator>;
export type UpdateTodoSubTaskRequest = z.infer<
  typeof updateTodoSubTaskValidator
>;
export type RemoveTodoSubTaskRequest = z.infer<
  typeof removeTodoSubTaskValidator
>;

export const createTodoValidator = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z
    .nativeEnum(TodoPriorityEnum)
    .optional()
    .default(TodoPriorityEnum.MEDIUM),
  status: z
    .nativeEnum(TodoStatusEnum)
    .optional()
    .default(TodoStatusEnum.BACKLOG),
});

export const getTodosValidator = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.string().optional().default("desc"),
  status: z.nativeEnum(TodoStatusEnum).optional(),
  priority: z.nativeEnum(TodoPriorityEnum).nullish(),
});

export const deleteTodoValidator = z.object({
  id: z.number(),
});

export const updateTodoValidator = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.nativeEnum(TodoPriorityEnum).optional(),
  status: z.nativeEnum(TodoStatusEnum).optional(),
});

export const getTodoValidator = z.object({
  id: z.number(),
});

export const addTodoTagValidator = z.object({
  todoId: z.number(),
  name: z.string().min(1, { message: "What's your tag?" }),
});

export const removeTodoTagValidator = z.object({
  tagId: z.number(),
  todoId: z.number(),
});

export const getTodoCommentsValidator = z.object({
  todoId: z.number(),
});

export const addTodoCommentValidator = z.object({
  todoId: z.number(),
  comment: z.string().min(1, { message: "What's your comment?" }),
});

export const removeTodoCommentValidator = z.object({
  commentId: z.number(),
  todoId: z.number(),
});

export const getTodoSubTasksValidator = z.object({
  todoId: z.number().int().positive(),
  limit: z.number().int().min(1).max(50).default(10).optional(),
  cursor: z.number().int().positive().nullish(),
});

export const addTodoSubTaskValidator = z.object({
  todoId: z.number().int().positive(),
  title: z.string().min(1, { message: "What's your subtask?" }),
});

export const updateTodoSubTaskValidator = z.object({
  id: z.number().int().positive(),
  todoId: z.number().int().positive(),
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export const removeTodoSubTaskValidator = z.object({
  id: z.number().int().positive(),
  todoId: z.number().int().positive(),
});
