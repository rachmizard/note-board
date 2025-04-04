import { TodoPriorityEnum } from "@/server/database";
import { z } from "zod";

export const createTodoFormValidator = z.object({
  title: z.string().min(1),
  dueDate: z.date().optional(),
  priority: z.nativeEnum(TodoPriorityEnum),
});

export type CreateTodoFormValues = z.infer<typeof createTodoFormValidator>;
