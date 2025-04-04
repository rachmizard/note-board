import {
  TodoPriorityEnum,
  TodoStatusEnum,
} from "@/server/database/drizzle/todo.schema";
import { z } from "zod";

export type CreateTodoRequest = z.infer<typeof createTodoValidator>;
export type GetTodosRequest = z.infer<typeof getTodosValidator>;
export type DeleteTodoRequest = z.infer<typeof deleteTodoValidator>;
export type UpdateTodoRequest = z.infer<typeof updateTodoValidator>;

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
