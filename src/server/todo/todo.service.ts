import { Database } from "@/server/database";
import { Todo, todoSchema } from "@/server/database/drizzle/todo.schema";
import { PaginationResponse } from "@/server/types/response";
import { desc, sql } from "drizzle-orm";
import type { CreateTodoRequest, GetTodosRequest } from "./todo.validator";

export const createTodo = async (
  request: CreateTodoRequest,
  db: Database
): Promise<Todo> => {
  const [todo] = await db.insert(todoSchema).values(request).returning();
  return todo;
};

export const qb = async (
  request: CreateTodoRequest,
  db: Database
): Promise<Todo> => {
  const [todo] = await db.insert(todoSchema).values(request).returning();
  return todo;
};

/**
 * Get todos with pagination
 *
 * @param db Database instance
 * @param options Pagination options
 * @returns Paginated todos
 */
export const getTodos = async (
  request: GetTodosRequest,
  db: Database
): Promise<PaginationResponse<Todo>> => {
  const { page = 1, limit = 10 } = request;
  const offset = (page - 1) * limit;

  // Execute the main query with pagination
  const todos = await db
    .select()
    .from(todoSchema)
    .orderBy(desc(todoSchema.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [{ count }] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(todoSchema);

  return {
    data: todos,
    total: Number(count),
    page,
    limit,
  };
};
