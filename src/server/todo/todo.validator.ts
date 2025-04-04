import {
  TodoPriorityEnum,
  TodoStatusEnum,
} from "@/server/database/drizzle/todo.schema";
import { z } from "zod";

export type CreateTodoRequest = z.infer<typeof createTodoValidator>;

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
