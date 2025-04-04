import type { Database } from "@/server/database";
import { type Todo, todoSchema } from "@/server/database/drizzle/todo.schema";
import type { PaginationResponse } from "@/server/types/response";
import { desc, eq, sql } from "drizzle-orm";
import type {
  CreateTodoRequest,
  DeleteTodoRequest,
  GetTodosRequest,
  UpdateTodoRequest,
} from "./todo.validator";
import { TRPCError } from "@trpc/server";

const qb = async (request: CreateTodoRequest, db: Database): Promise<Todo> => {
  const [todo] = await db.insert(todoSchema).values(request).returning();
  return todo;
};

const createTodo = async (
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
const getTodos = async (
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

const deleteTodo = async (
  request: DeleteTodoRequest,
  db: Database
): Promise<void> => {
  await db.delete(todoSchema).where(eq(todoSchema.id, Number(request.id)));
};

const updateTodo = async (
  request: UpdateTodoRequest,
  db: Database
): Promise<void> => {
  const findTodo = await db
    .select()
    .from(todoSchema)
    .where(eq(todoSchema.id, Number(request.id)));

  if (!findTodo) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Todo not found",
    });
  }

  await db
    .update(todoSchema)
    .set(request)
    .where(eq(todoSchema.id, Number(request.id)));
};

export { createTodo, deleteTodo, getTodos, qb, updateTodo };
