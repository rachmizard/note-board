import { Database } from "@/server/database";
import { Todo, todoSchema } from "@/server/database/drizzle/todo.schema";
import type { CreateTodoRequest } from "./todo.validator";

export const createTodo = async (
  request: CreateTodoRequest,
  db: Database
): Promise<Todo> => {
  const [todo] = await db.insert(todoSchema).values(request).returning();
  return todo;
};
