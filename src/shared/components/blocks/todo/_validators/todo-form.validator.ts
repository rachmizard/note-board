import { TodoPriorityEnum } from "@/server/database/drizzle/todo.schema";
import { z } from "zod";

export const todoFormValidator = z.object({
  title: z.string().min(1, { message: "What's your todo?" }),
  dueDate: z.date().optional(),
  priority: z.nativeEnum(TodoPriorityEnum),
});

export type TodoFormValues = z.infer<typeof todoFormValidator>;
